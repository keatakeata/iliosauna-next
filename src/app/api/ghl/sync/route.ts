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

      // Fetch full product details (includes all images)
      let fullProduct = ghlProduct;
      try {
        const productResponse = await fetch(`${GHL_API_BASE}/products/${ghlProduct._id}?locationId=${GHL_LOCATION_ID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          }
        });

        if (productResponse.ok) {
          const productData = await productResponse.json();
          fullProduct = productData.product || productData;
        } else {
          console.warn(`Could not fetch full product details for ${ghlProduct._id}: ${productResponse.status}`);
        }
      } catch (productError) {
        console.error(`Error fetching full product details for ${ghlProduct._id}:`, productError);
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
              priceId: priceArray[0]._id || priceArray[0].id,
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
              priceId: p._id || p.id,
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

      // Parse images - check multiple possible fields (use fullProduct for complete data)
      let images = [];

      // Try medias array first (GHL's full product endpoint)
      if (fullProduct.medias && Array.isArray(fullProduct.medias)) {
        images = fullProduct.medias
          .filter((m: any) => m.type === 'image')
          .map((img: any) => ({
            url: img.url,
            alt: img.title || fullProduct.name,
            priceIds: img.priceIds || [],
            isFeatured: img.isFeatured || false
          }));
      }
      // Try images array
      else if (fullProduct.images && Array.isArray(fullProduct.images)) {
        images = fullProduct.images.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || img.imageUrl || img.src,
          alt: fullProduct.name
        }));
      }
      // Try media array
      else if (fullProduct.media && Array.isArray(fullProduct.media)) {
        images = fullProduct.media
          .filter((m: any) => m.type === 'image' || m.mediaType === 'image')
          .map((img: any) => ({
            url: img.url || img.imageUrl || img.src,
            alt: fullProduct.name
          }));
      }
      // Fallback to single image field
      else if (fullProduct.image) {
        if (typeof fullProduct.image === 'string') {
          images = [{ url: fullProduct.image, alt: fullProduct.name }];
        } else if (Array.isArray(fullProduct.image)) {
          images = fullProduct.image.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url || img.imageUrl || img.src,
            alt: fullProduct.name
          }));
        } else if (fullProduct.image.url) {
          images = [{ url: fullProduct.image.url, alt: fullProduct.name }];
        }
      }

      console.log(`Product ${fullProduct.name}: Found ${images.length} images`);

      // Comprehensive field mapping from GHL (use fullProduct for complete data)
      const productData = {
        _type: 'ghlProduct',
        // Core identifiers
        ghlProductId: fullProduct._id || fullProduct.id,
        name: fullProduct.name || fullProduct.title,
        slug: {
          _type: 'slug',
          current: fullProduct.handle || fullProduct.slug || fullProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        },

        // Descriptions
        description: fullProduct.description || fullProduct.productDescription || fullProduct.bodyHtml || '',

        // Pricing (from prices API)
        price: productPrice,
        salePrice: productSalePrice,

        // Images
        images: images,

        // Categorization
        category: fullProduct.productType || fullProduct.category || 'wellness',
        productCollection: fullProduct.productCollection || fullProduct.collection || fullProduct.productType || null,

        // Features (parse from description or tags)
        features: fullProduct.features || fullProduct.tags || [],

        // Variants (from prices API)
        variants: productVariants,

        // GHL Variants (for dropdown selectors)
        ghlVariants: fullProduct.variants || [],

        // Inventory
        inStock: (fullProduct.available !== false || fullProduct.availableInStore !== false) && fullProduct.status !== 'archived',
        stockCount: fullProduct.availableQuantity || fullProduct.inventoryQuantity || null,
        allowOutOfStockPurchase: fullProduct.allowOutOfStockPurchase || false,

        // SEO fields
        seoTitle: fullProduct.seoTitle || fullProduct.seo?.title || fullProduct.metaTitle || fullProduct.name,
        seoDescription: fullProduct.seoDescription || fullProduct.seo?.description || fullProduct.metaDescription || fullProduct.description?.substring(0, 160),

        // Specifications
        specifications: fullProduct.specifications || fullProduct.metafields || [],

        // Badges
        badge: fullProduct.badge || fullProduct.tags?.[0] || (fullProduct.featured ? 'Featured' : null),

        // Taxes
        taxable: fullProduct.isTaxesEnabled !== false,

        // Timestamps
        publishedAt: fullProduct.publishedAt || fullProduct.createdAt || new Date().toISOString(),
        updatedAt: fullProduct.updatedAt || new Date().toISOString(),

        // Status
        isActive: (fullProduct.available !== false || fullProduct.availableInStore !== false) && fullProduct.status !== 'archived'
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
