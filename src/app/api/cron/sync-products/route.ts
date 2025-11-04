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
 * GET /api/cron/sync-products
 * Automated cron job to sync products from GHL to Sanity
 *
 * Can be triggered by:
 * 1. Vercel Cron (vercel.json configuration)
 * 2. External cron service (cron-job.org, EasyCron, etc.)
 * 3. Manual trigger for testing
 *
 * Security: Verify CRON_SECRET to prevent unauthorized access
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    console.log('[CRON] Starting automated product sync:', new Date().toISOString());

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

    console.log(`[CRON] Found ${products.length} products in GHL`);

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const ghlProduct of products) {
      try {
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
            console.warn(`[CRON] Could not fetch full product details for ${ghlProduct._id}: ${productResponse.status}`);
          }
        } catch (productError) {
          console.error(`[CRON] Error fetching full product details for ${ghlProduct._id}:`, productError);
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
            console.warn(`[CRON] Could not fetch prices for product ${ghlProduct._id}: ${pricesResponse.status}`);
          }
        } catch (priceError) {
          console.error(`[CRON] Error fetching prices for product ${ghlProduct._id}:`, priceError);
        }

        // Check if exists
        const existing = await sanityClient.fetch(
          `*[_type == "ghlProduct" && ghlProductId == $id][0]`,
          { id: ghlProduct._id }
        );

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
        else if (fullProduct.images && Array.isArray(fullProduct.images)) {
          images = fullProduct.images.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url || img.imageUrl || img.src,
            alt: fullProduct.name
          }));
        }
        else if (fullProduct.media && Array.isArray(fullProduct.media)) {
          images = fullProduct.media
            .filter((m: any) => m.type === 'image' || m.mediaType === 'image')
            .map((img: any) => ({
              url: img.url || img.imageUrl || img.src,
              alt: fullProduct.name
            }));
        }
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

        // Comprehensive field mapping from GHL
        const productData = {
          _type: 'ghlProduct',
          ghlProductId: fullProduct._id || fullProduct.id,
          name: fullProduct.name || fullProduct.title,
          slug: {
            _type: 'slug',
            current: fullProduct.handle || fullProduct.slug || fullProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          },
          description: fullProduct.description || fullProduct.productDescription || fullProduct.bodyHtml || '',
          price: productPrice,
          salePrice: productSalePrice,
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

        if (existing) {
          await sanityClient.patch(existing._id).set(productData).commit();
          console.log(`[CRON] Updated: ${fullProduct.name}`);
        } else {
          await sanityClient.create(productData);
          console.log(`[CRON] Created: ${fullProduct.name}`);
        }

        synced++;
      } catch (productError) {
        console.error(`[CRON] Error syncing product ${ghlProduct._id}:`, productError);
        errors++;
      }
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      synced,
      skipped,
      errors,
      total: products.length
    };

    console.log('[CRON] Sync completed:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('[CRON] Sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
