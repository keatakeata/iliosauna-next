import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN!,
  useCdn: false
});

// Interface for GHL Product webhook payload
interface GHLProductPayload {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  images?: { url: string; alt?: string }[];
  category?: string;
  variants?: Array<{
    name: string;
    price: number;
    sku?: string;
  }>;
  inStock?: boolean;
  stockCount?: number;
  allowOutOfStockPurchase?: boolean;
  productCollection?: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
}

/**
 * POST /api/ghl/products
 * Webhook endpoint to create/update products from GoHighLevel
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from GHL (using token authentication)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.GHL_WEBHOOK_SECRET || process.env.GHL_ACCESS_TOKEN;

    if (!authHeader || !authHeader.includes(expectedToken!)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload: any = await request.json();

    // Log the webhook payload for debugging
    console.log('GHL Webhook received:', JSON.stringify(payload, null, 2));

    // GHL sends the product data differently depending on the event
    const product = payload.product || payload;

    // Check if "Include in Online Store" is enabled
    // GHL uses 'available' field or similar for online store visibility
    if (product.available === false || product.includeInOnlineStore === false) {
      console.log('Product not set to include in online store, skipping:', product.name);
      return NextResponse.json({
        success: true,
        message: 'Product not included in online store'
      });
    }

    // Generate slug from product name
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if product already exists in Sanity
    const existingProduct = await sanityClient.fetch(
      `*[_type == "ghlProduct" && ghlProductId == $ghlProductId][0]`,
      { ghlProductId: product._id || product.id }
    );

    // Fetch prices for this product from GHL
    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    let productPrice = 0;
    let productSalePrice = null;
    let productVariants: any[] = [];

    try {
      const pricesResponse = await fetch(`${GHL_API_BASE}/products/${product._id || product.id}/price?locationId=${GHL_LOCATION_ID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        }
      });

      if (pricesResponse.ok) {
        const pricesData = await pricesResponse.json();
        const prices = pricesData.prices || pricesData.price || (Array.isArray(pricesData) ? pricesData : []);

        console.log(`Webhook: Found ${Array.isArray(prices) ? prices.length : 1} prices for product: ${product.name}`);

        // If it's a single price object (not array), convert to array
        const priceArray = Array.isArray(prices) ? prices : (prices ? [prices] : []);

        // If there's only one price, use it as the main product price
        if (priceArray.length === 1) {
          productPrice = parseFloat(priceArray[0].amount || 0);
          productVariants = [{
            name: priceArray[0].name || 'Standard',
            price: parseFloat(priceArray[0].amount || 0),
            sku: priceArray[0].sku || null,
            inventoryQuantity: null,
            available: true
          }];
        } else if (priceArray.length > 1) {
          // Multiple prices = variants
          // Use the lowest price as the base price
          productPrice = Math.min(...priceArray.map((p: any) => parseFloat(p.amount || 0)));

          // Map all prices to variants
          productVariants = priceArray.map((p: any) => ({
            name: p.name || 'Variant',
            price: parseFloat(p.amount || 0),
            sku: p.sku || null,
            inventoryQuantity: null,
            available: true
          }));
        }
      }
    } catch (priceError) {
      console.error(`Webhook: Error fetching prices for product ${product._id || product.id}:`, priceError);
    }

    // Parse images from GHL format
    let images = [];
    if (product.image) {
      if (typeof product.image === 'string') {
        images = [{ url: product.image, alt: product.name }];
      } else if (Array.isArray(product.image)) {
        images = product.image.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || img.imageUrl,
          alt: product.name
        }));
      } else if (product.image.url) {
        images = [{ url: product.image.url, alt: product.name }];
      }
    }

    const productData = {
      _type: 'ghlProduct',
      ghlProductId: product._id || product.id,
      name: product.name,
      slug: {
        _type: 'slug',
        current: slug
      },
      description: product.description || product.productDescription || '',
      price: productPrice,
      salePrice: productSalePrice,
      images: images,
      category: product.productType || product.category || 'wellness',
      features: [],
      variants: productVariants,
      inStock: product.available !== false,
      stockCount: product.availableQuantity || product.stockCount || null,
      allowOutOfStockPurchase: product.allowOutOfStockPurchase || false,
      productCollection: product.productType || product.productCollection,
      specifications: product.specifications || [],
      publishedAt: product.createdAt || new Date().toISOString(),
      isActive: true
    };

    let result;
    if (existingProduct) {
      // Update existing product
      result = await sanityClient
        .patch(existingProduct._id)
        .set(productData)
        .commit();

      console.log('Updated product:', result._id);
    } else {
      // Create new product
      result = await sanityClient.create(productData);
      console.log('Created product:', result._id);
    }

    return NextResponse.json({
      success: true,
      productId: result._id,
      message: existingProduct ? 'Product updated' : 'Product created'
    });

  } catch (error) {
    console.error('Error processing GHL product webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ghl/products?id={ghlProductId}
 * Webhook endpoint to delete/deactivate products from GoHighLevel
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify the request is from GHL
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.GHL_WEBHOOK_SECRET || process.env.GHL_ACCESS_TOKEN;

    if (!authHeader || !authHeader.includes(expectedToken!)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ghlProductId = searchParams.get('id');

    if (!ghlProductId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the product
    const product = await sanityClient.fetch(
      `*[_type == "ghlProduct" && ghlProductId == $ghlProductId][0]`,
      { ghlProductId }
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await sanityClient
      .patch(product._id)
      .set({ isActive: false })
      .commit();

    console.log('Deactivated product:', product._id);

    return NextResponse.json({
      success: true,
      message: 'Product deactivated'
    });

  } catch (error) {
    console.error('Error deleting GHL product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
