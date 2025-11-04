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
 * POST /api/webhooks/ghl-product
 * Webhook endpoint for GoHighLevel product updates
 *
 * This endpoint receives real-time notifications when:
 * - A product is created in GHL
 * - A product is updated in GHL (including price changes)
 * - A product is deleted/archived in GHL
 *
 * Setup in GHL:
 * 1. Go to Settings > Integrations > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/ghl-product
 * 3. Select events: Product Created, Product Updated, Product Deleted
 * 4. Add webhook secret to .env as WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature/secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('authorization');

    if (webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      console.warn('[WEBHOOK] Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('[WEBHOOK] Received GHL product webhook:', {
      type: payload.type,
      productId: payload.productId || payload.id,
      timestamp: new Date().toISOString()
    });

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Extract product ID from webhook payload
    const productId = payload.productId || payload.id || payload._id || payload.data?.id;

    if (!productId) {
      console.error('[WEBHOOK] No product ID in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload - missing product ID' },
        { status: 400 }
      );
    }

    // Handle different webhook event types
    const eventType = payload.type || payload.event || payload.eventType;

    // If product was deleted/archived, remove from Sanity
    if (eventType === 'product.deleted' || eventType === 'product.archived') {
      const existing = await sanityClient.fetch(
        `*[_type == "ghlProduct" && ghlProductId == $id][0]`,
        { id: productId }
      );

      if (existing) {
        await sanityClient.delete(existing._id);
        console.log(`[WEBHOOK] Deleted product ${productId} from Sanity`);
      }

      return NextResponse.json({
        success: true,
        action: 'deleted',
        productId
      });
    }

    // For created/updated events, fetch full product data from GHL
    console.log(`[WEBHOOK] Fetching product details for ${productId}`);

    // Fetch full product details
    const productResponse = await fetch(`${GHL_API_BASE}/products/${productId}?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!productResponse.ok) {
      throw new Error(`GHL API Error: ${productResponse.status}`);
    }

    const productData = await productResponse.json();
    const fullProduct = productData.product || productData;

    // Fetch prices
    let productPrice = 0;
    let productSalePrice = null;
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

        console.log(`[WEBHOOK] Fetched ${priceArray.length} price variants`);
      }
    } catch (priceError) {
      console.error(`[WEBHOOK] Error fetching prices:`, priceError);
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

    // Check if product exists in Sanity
    const existing = await sanityClient.fetch(
      `*[_type == "ghlProduct" && ghlProductId == $id][0]`,
      { id: productId }
    );

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

    let action = '';
    if (existing) {
      await sanityClient.patch(existing._id).set(sanityProduct).commit();
      action = 'updated';
      console.log(`[WEBHOOK] Updated product: ${fullProduct.name}`);
    } else {
      await sanityClient.create(sanityProduct);
      action = 'created';
      console.log(`[WEBHOOK] Created product: ${fullProduct.name}`);
    }

    return NextResponse.json({
      success: true,
      action,
      productId,
      productName: fullProduct.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook verification (some webhook services require this)
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get('challenge');

  if (challenge) {
    // Respond to webhook verification challenge
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/ghl-product',
    message: 'GHL Product Webhook Endpoint'
  });
}
