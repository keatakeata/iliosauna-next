import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

/**
 * POST /api/webhooks/ghl-product-sync
 *
 * GHL Webhook that triggers when a product is created/updated
 * This middleware ensures prices are synced to Stripe (since GHL doesn't do it automatically)
 *
 * Setup in GHL:
 * 1. Go to Settings → Workflows
 * 2. Create new workflow
 * 3. Trigger: "Product Created" or "Product Updated"
 * 4. Action: "Webhook" → https://yourdomain.com/api/webhooks/ghl-product-sync
 * 5. Method: POST
 * 6. Body: Include product data from trigger
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('[GHL WEBHOOK] Received product sync request');

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Extract product ID from webhook payload
    const productId = payload.productId || payload.id || payload._id || payload.product?.id;

    if (!productId) {
      console.error('[GHL WEBHOOK] No product ID in payload');
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    console.log(`[GHL WEBHOOK] Syncing product: ${productId}`);

    // 1. Fetch full product details from GHL
    const productResponse = await fetch(`${GHL_API_BASE}/products/${productId}?locationId=${GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    if (!productResponse.ok) {
      throw new Error(`GHL API error: ${productResponse.status}`);
    }

    const productData = await productResponse.json();
    const ghlProduct = productData.product || productData;

    console.log(`[GHL WEBHOOK] Fetched product: ${ghlProduct.name}`);

    // 2. Fetch prices from GHL
    const pricesResponse = await fetch(`${GHL_API_BASE}/products/${productId}/price?locationId=${GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    const pricesData = await pricesResponse.json();
    const ghlPrices = pricesData.prices || pricesData.price || [];
    const priceArray = Array.isArray(ghlPrices) ? ghlPrices : (ghlPrices ? [ghlPrices] : []);

    console.log(`[GHL WEBHOOK] Fetched ${priceArray.length} prices`);

    // 3. Find or create product in Stripe
    let stripeProduct;

    // Try to find existing product by name
    const searchResults = await stripe.products.search({
      query: `name:'${ghlProduct.name}'`,
      limit: 1
    });

    if (searchResults.data.length > 0) {
      stripeProduct = searchResults.data[0];
      console.log(`[GHL WEBHOOK] Found existing Stripe product: ${stripeProduct.id}`);

      // Update product in Stripe
      stripeProduct = await stripe.products.update(stripeProduct.id, {
        name: ghlProduct.name,
        description: ghlProduct.description || undefined,
        images: ghlProduct.medias ? ghlProduct.medias.filter((m: any) => m.type === 'image').map((m: any) => m.url) : undefined,
        active: ghlProduct.availableInStore !== false,
        metadata: {
          ghlProductId: ghlProduct._id,
          lastSynced: new Date().toISOString()
        }
      });
      console.log(`[GHL WEBHOOK] Updated Stripe product`);
    } else {
      // Create new product
      stripeProduct = await stripe.products.create({
        name: ghlProduct.name,
        description: ghlProduct.description || undefined,
        images: ghlProduct.medias ? ghlProduct.medias.filter((m: any) => m.type === 'image').map((m: any) => m.url) : undefined,
        active: ghlProduct.availableInStore !== false,
        metadata: {
          ghlProductId: ghlProduct._id,
          lastSynced: new Date().toISOString()
        }
      });
      console.log(`[GHL WEBHOOK] Created new Stripe product: ${stripeProduct.id}`);
    }

    // 4. Get existing Stripe prices for this product
    const existingPrices = await stripe.prices.list({
      product: stripeProduct.id,
      limit: 100
    });

    // Create a map of existing prices by GHL price ID
    const existingPriceMap = new Map();
    existingPrices.data.forEach(price => {
      const ghlPriceId = price.metadata?.ghlPriceId;
      if (ghlPriceId) {
        existingPriceMap.set(ghlPriceId, price);
      }
    });

    // 5. Sync prices from GHL to Stripe
    let createdCount = 0;
    let updatedCount = 0;

    for (const ghlPrice of priceArray) {
      const ghlPriceId = ghlPrice._id || ghlPrice.id;
      const priceAmount = Math.round(parseFloat(ghlPrice.amount || 0) * 100);

      const existingPrice = existingPriceMap.get(ghlPriceId);

      if (existingPrice) {
        // Price exists - check if amount changed
        if (existingPrice.unit_amount !== priceAmount) {
          // Stripe prices are immutable, so we need to:
          // 1. Archive the old price
          // 2. Create a new price with updated amount
          await stripe.prices.update(existingPrice.id, { active: false });

          await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: priceAmount,
            currency: 'cad',
            nickname: ghlPrice.name || 'Standard',
            metadata: {
              ghlPriceId,
              ghlProductId: ghlProduct._id,
              source: 'ghl_webhook'
            }
          });

          console.log(`[GHL WEBHOOK] Updated price: ${ghlPrice.name} - $${(priceAmount / 100).toFixed(2)}`);
          updatedCount++;
        }
      } else {
        // New price - create it
        await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: priceAmount,
          currency: 'cad',
          nickname: ghlPrice.name || 'Standard',
          metadata: {
            ghlPriceId,
            ghlProductId: ghlProduct._id,
            source: 'ghl_webhook'
          }
        });

        console.log(`[GHL WEBHOOK] Created price: ${ghlPrice.name} - $${(priceAmount / 100).toFixed(2)}`);
        createdCount++;
      }
    }

    console.log(`[GHL WEBHOOK] Sync complete - Created: ${createdCount}, Updated: ${updatedCount}`);

    // 6. Stripe webhook will automatically update the website
    // (No need to call website API here - Stripe webhook handles it)

    return NextResponse.json({
      success: true,
      stripeProductId: stripeProduct.id,
      pricesCreated: createdCount,
      pricesUpdated: updatedCount,
      totalPrices: priceArray.length
    });

  } catch (error) {
    console.error('[GHL WEBHOOK] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/ghl-product-sync',
    message: 'GHL Product Sync Webhook',
    setup: 'Configure in GHL Workflows to trigger on product create/update'
  });
}
