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
 * GET /api/cron/sync-ghl-products
 * Vercel Cron Job that runs every minute to sync GHL products to Sanity
 *
 * This endpoint:
 * - Fetches all products from GHL
 * - Compares with existing products in Sanity
 * - Creates/updates products that are new or changed
 * - Runs every minute via Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request (Vercel sets this header)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const startTime = Date.now();
    console.log('[CRON] Starting GHL product sync...', new Date().toISOString());

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_ACCESS_TOKEN || !GHL_API_BASE || !GHL_LOCATION_ID) {
      throw new Error('Missing GHL environment variables');
    }

    // Fetch all products from GHL
    const response = await fetch(`${GHL_API_BASE}/products/?locationId=${GHL_LOCATION_ID}&limit=100`, {
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
    const ghlProducts = data.products || [];

    console.log(`[CRON] Found ${ghlProducts.length} products in GHL`);

    // Get existing products from Sanity
    const existingProducts = await sanityClient.fetch(
      `*[_type == "ghlProduct"] { _id, ghlProductId, updatedAt }`
    );

    const existingProductMap = new Map(
      existingProducts.map((p: any) => [p.ghlProductId, p])
    );

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Process each GHL product
    for (const ghlProduct of ghlProducts) {
      const productId = ghlProduct._id || ghlProduct.id;

      if (!productId) {
        console.warn('[CRON] Skipping product without ID');
        skipped++;
        continue;
      }

      try {
        // Fetch full product details including prices
        const productResponse = await fetch(`${GHL_API_BASE}/products/${productId}?locationId=${GHL_LOCATION_ID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          }
        });

        if (!productResponse.ok) {
          console.error(`[CRON] Failed to fetch product ${productId}`);
          skipped++;
          continue;
        }

        const productData = await productResponse.json();
        const fullProduct = productData.product || productData;

        // Fetch prices
        let productPrice = 0;
        let productVariants: any[] = [];

        try {
          const pricesResponse = await fetch(`${GHL_API_BASE}/products/${productId}/price?locationId=${GHL_LOCATION_ID}`, {
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
            const priceArray = Array.isArray(prices) ? prices : (prices ? [prices] : []);

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
              productPrice = Math.min(...priceArray.map((p: any) => parseFloat(p.amount || 0)));
              productVariants = priceArray.map((p: any) => ({
                name: p.name || 'Variant',
                price: parseFloat(p.amount || 0),
                priceId: p._id || p.id,
                sku: p.sku || null,
                inventoryQuantity: null,
                available: true
              }));
            }
          }
        } catch (priceError) {
          console.error(`[CRON] Error fetching prices for ${productId}:`, priceError);
        }

        // Parse images
        let images = [];
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

        // Prepare Sanity document
        const sanityProduct = {
          _type: 'ghlProduct',
          ghlProductId: fullProduct._id || fullProduct.id,
          name: fullProduct.name || fullProduct.title,
          slug: {
            _type: 'slug',
            current: fullProduct.handle || fullProduct.slug || fullProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          },
          description: fullProduct.description || fullProduct.productDescription || fullProduct.bodyHtml || '',
          price: productPrice,
          salePrice: null,
          images: images,
          category: fullProduct.productType || fullProduct.category || 'wellness',
          productCollection: fullProduct.productCollection || fullProduct.collection || fullProduct.productType || null,
          features: fullProduct.features || fullProduct.tags || [],
          variants: productVariants,
          ghlVariants: fullProduct.variants || [],
          inStock: (fullProduct.available !== false || fullProduct.availableInStore !== false) && fullProduct.status !== 'archived',
          stockCount: fullProduct.availableQuantity || fullProduct.inventoryQuantity || null,
          allowOutOfStockPurchase: fullProduct.allowOutOfStockPurchase || false,
          seoTitle: fullProduct.seoTitle || fullProduct.seo?.title || fullProduct.metaTitle || fullProduct.name,
          seoDescription: fullProduct.seoDescription || fullProduct.seo?.description || fullProduct.metaDescription || fullProduct.description?.substring(0, 160),
          specifications: fullProduct.specifications || fullProduct.metafields || [],
          badge: fullProduct.badge || fullProduct.tags?.[0] || (fullProduct.featured ? 'Featured' : null),
          taxable: fullProduct.isTaxesEnabled !== false,
          publishedAt: fullProduct.publishedAt || fullProduct.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: (fullProduct.available !== false || fullProduct.availableInStore !== false) && fullProduct.status !== 'archived'
        };

        const existing = existingProductMap.get(productId);

        if (existing) {
          // Update existing product
          await sanityClient.patch(existing._id).set(sanityProduct).commit();
          updated++;
        } else {
          // Create new product
          await sanityClient.create(sanityProduct);
          created++;
        }

      } catch (productError) {
        console.error(`[CRON] Error processing product ${productId}:`, productError);
        skipped++;
      }
    }

    const duration = Date.now() - startTime;

    const summary = {
      success: true,
      totalProducts: ghlProducts.length,
      created,
      updated,
      skipped,
      durationMs: duration,
      timestamp: new Date().toISOString()
    };

    console.log('[CRON] Sync complete:', summary);

    return NextResponse.json(summary);

  } catch (error) {
    console.error('[CRON] Sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Product sync failed',
        details: error instanceof Error ? error.message : 'Unknown',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
