import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN!,
  useCdn: false
});

/**
 * GET /api/ghl/sync
 * Manually trigger a sync of all products from GHL to Sanity
 */
export async function GET(request: NextRequest) {
  try {
    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Fetch products from GHL
    const response = await fetch(`${GHL_API_BASE}/products/?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GHL API Error: ${response.status}`);
    }

    const data = await response.json();
    const products = data.products || [];

    console.log(`Found ${products.length} products in GHL`);

    let synced = 0;
    let skipped = 0;

    for (const ghlProduct of products) {
      // Only sync products marked for online store
      if (ghlProduct.available === false && ghlProduct.availableInStore === false) {
        skipped++;
        continue;
      }

      // Fetch prices for this product
      let productPrice = 0;
      let productSalePrice = null;
      let productVariants: any[] = [];

      try {
        const pricesResponse = await fetch(`${GHL_API_BASE}/products/${ghlProduct._id}/price?locationId=${GHL_LOCATION_ID}`, {
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

          console.log(`Found ${Array.isArray(prices) ? prices.length : 1} prices for product: ${ghlProduct.name}`);

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
        } else {
          console.warn(`Could not fetch prices for product ${ghlProduct._id}: ${pricesResponse.status}`);
        }
      } catch (priceError) {
        console.error(`Error fetching prices for product ${ghlProduct._id}:`, priceError);
      }

      // Check if exists
      const existing = await sanityClient.fetch(
        `*[_type == "ghlProduct" && ghlProductId == $id][0]`,
        { id: ghlProduct._id }
      );

      // Parse images
      let images = [];
      if (ghlProduct.image) {
        if (typeof ghlProduct.image === 'string') {
          images = [{ url: ghlProduct.image, alt: ghlProduct.name }];
        } else if (Array.isArray(ghlProduct.image)) {
          images = ghlProduct.image.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url || img.imageUrl,
            alt: ghlProduct.name
          }));
        } else if (ghlProduct.image.url) {
          images = [{ url: ghlProduct.image.url, alt: ghlProduct.name }];
        }
      }

      // Comprehensive field mapping from GHL
      const productData = {
        _type: 'ghlProduct',
        // Core identifiers
        ghlProductId: ghlProduct._id || ghlProduct.id,
        name: ghlProduct.name || ghlProduct.title,
        slug: {
          _type: 'slug',
          current: ghlProduct.handle || ghlProduct.slug || ghlProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        },

        // Descriptions
        description: ghlProduct.description || ghlProduct.productDescription || ghlProduct.bodyHtml || '',

        // Pricing (from prices API)
        price: productPrice,
        salePrice: productSalePrice,

        // Images
        images: images,

        // Categorization
        category: ghlProduct.productType || ghlProduct.category || 'wellness',
        productCollection: ghlProduct.productCollection || ghlProduct.collection || ghlProduct.productType || null,

        // Features (parse from description or tags)
        features: ghlProduct.features || ghlProduct.tags || [],

        // Variants (from prices API)
        variants: productVariants,

        // Inventory
        inStock: (ghlProduct.available !== false || ghlProduct.availableInStore !== false) && ghlProduct.status !== 'archived',
        stockCount: ghlProduct.availableQuantity || ghlProduct.inventoryQuantity || null,
        allowOutOfStockPurchase: ghlProduct.allowOutOfStockPurchase || false,

        // SEO fields
        seoTitle: ghlProduct.seoTitle || ghlProduct.seo?.title || ghlProduct.metaTitle || ghlProduct.name,
        seoDescription: ghlProduct.seoDescription || ghlProduct.seo?.description || ghlProduct.metaDescription || ghlProduct.description?.substring(0, 160),

        // Specifications
        specifications: ghlProduct.specifications || ghlProduct.metafields || [],

        // Badges
        badge: ghlProduct.badge || ghlProduct.tags?.[0] || (ghlProduct.featured ? 'Featured' : null),

        // Taxes
        taxable: ghlProduct.isTaxesEnabled !== false,

        // Timestamps
        publishedAt: ghlProduct.publishedAt || ghlProduct.createdAt || new Date().toISOString(),
        updatedAt: ghlProduct.updatedAt || new Date().toISOString(),

        // Status
        isActive: (ghlProduct.available !== false || ghlProduct.availableInStore !== false) && ghlProduct.status !== 'archived'
      };

      if (existing) {
        await sanityClient.patch(existing._id).set(productData).commit();
      } else {
        await sanityClient.create(productData);
      }

      synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      total: products.length
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
