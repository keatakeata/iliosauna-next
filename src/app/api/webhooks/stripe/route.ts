import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@sanity/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN!,
  useCdn: false
});

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook endpoint for real-time product and price updates
 *
 * Listens for:
 * - product.created: New product added in Stripe
 * - product.updated: Product details changed (name, description, images, metadata)
 * - product.deleted: Product removed from Stripe
 * - price.created: New price/variant added
 * - price.updated: Price amount changed
 * - price.deleted: Price/variant removed
 *
 * Setup in Stripe Dashboard:
 * 1. Go to Developers > Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhooks/stripe
 * 3. Select events: product.*, price.*
 * 4. Copy webhook signing secret to STRIPE_WEBHOOK_SECRET env var
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE WEBHOOK] Missing signature');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown'}` },
      { status: 400 }
    );
  }

  console.log(`[STRIPE WEBHOOK] Received event: ${event.type}`);

  try {
    switch (event.type) {
      // ==================== PRODUCT EVENTS ====================
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object as Stripe.Product;
        await syncProductToSanity(product);
        break;
      }

      case 'product.deleted': {
        const product = event.data.object as Stripe.Product;
        await deleteProductFromSanity(product.id);
        break;
      }

      // ==================== PRICE EVENTS ====================
      case 'price.created':
      case 'price.updated': {
        const price = event.data.object as Stripe.Price;
        // When a price changes, re-sync the entire product to update all variants
        if (price.product) {
          const productId = typeof price.product === 'string' ? price.product : price.product.id;
          const fullProduct = await stripe.products.retrieve(productId);
          await syncProductToSanity(fullProduct);
        }
        break;
      }

      case 'price.deleted': {
        const price = event.data.object as Stripe.Price;
        // Re-sync product to remove the deleted price variant
        if (price.product) {
          const productId = typeof price.product === 'string' ? price.product : price.product.id;
          const fullProduct = await stripe.products.retrieve(productId);
          await syncProductToSanity(fullProduct);
        }
        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[STRIPE WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown'
      },
      { status: 500 }
    );
  }
}

/**
 * Sync a Stripe product to Sanity
 */
async function syncProductToSanity(stripeProduct: Stripe.Product) {
  try {
    console.log(`[STRIPE WEBHOOK] Syncing product: ${stripeProduct.name} (${stripeProduct.id})`);

    // Fetch all prices for this product
    const prices = await stripe.prices.list({
      product: stripeProduct.id,
      active: true,
      limit: 100
    });

    // Convert Stripe prices to variant format
    let productPrice = 0;
    let productVariants: any[] = [];

    if (prices.data.length === 1) {
      const price = prices.data[0];
      productPrice = price.unit_amount ? price.unit_amount / 100 : 0;
      productVariants = [{
        name: price.nickname || 'Standard',
        price: productPrice,
        priceId: price.id,
        stripePriceId: price.id,
        sku: stripeProduct.metadata?.sku || null,
        inventoryQuantity: null,
        available: stripeProduct.active
      }];
    } else if (prices.data.length > 1) {
      // Multiple prices = variants
      productPrice = Math.min(...prices.data.map(p => p.unit_amount ? p.unit_amount / 100 : 0));

      productVariants = prices.data.map(price => ({
        name: price.nickname || `Variant - $${price.unit_amount ? price.unit_amount / 100 : 0}`,
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        priceId: price.id,
        stripePriceId: price.id,
        sku: price.metadata?.sku || null,
        inventoryQuantity: null,
        available: stripeProduct.active
      }));
    }

    // Parse images from Stripe
    const images = stripeProduct.images.map((url, index) => ({
      url,
      alt: stripeProduct.name,
      priceIds: [],
      isFeatured: index === 0
    }));

    // Check if product exists in Sanity (by Stripe product ID)
    const existing = await sanityClient.fetch(
      `*[_type == "ghlProduct" && stripeProductId == $id][0]`,
      { id: stripeProduct.id }
    );

    // Also check by GHL product ID if it exists in metadata
    let existingByGHL = null;
    if (stripeProduct.metadata?.ghlProductId) {
      existingByGHL = await sanityClient.fetch(
        `*[_type == "ghlProduct" && ghlProductId == $id][0]`,
        { id: stripeProduct.metadata.ghlProductId }
      );
    }

    const sanityProduct = {
      _type: 'ghlProduct',
      stripeProductId: stripeProduct.id,
      ghlProductId: stripeProduct.metadata?.ghlProductId || stripeProduct.id,
      name: stripeProduct.name,
      slug: {
        _type: 'slug',
        current: stripeProduct.metadata?.slug || stripeProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      description: stripeProduct.description || '',
      price: productPrice,
      salePrice: null,
      images: images,
      category: stripeProduct.metadata?.category || 'wellness',
      productCollection: stripeProduct.metadata?.collection || null,
      features: stripeProduct.metadata?.features ? JSON.parse(stripeProduct.metadata.features) : [],
      variants: productVariants,
      ghlVariants: stripeProduct.metadata?.ghlVariants ? JSON.parse(stripeProduct.metadata.ghlVariants) : [],
      inStock: stripeProduct.active,
      stockCount: stripeProduct.metadata?.stockCount ? parseInt(stripeProduct.metadata.stockCount) : null,
      allowOutOfStockPurchase: false,
      seoTitle: stripeProduct.metadata?.seoTitle || stripeProduct.name,
      seoDescription: stripeProduct.metadata?.seoDescription || stripeProduct.description?.substring(0, 160) || '',
      specifications: stripeProduct.metadata?.specifications ? JSON.parse(stripeProduct.metadata.specifications) : [],
      badge: stripeProduct.metadata?.badge || null,
      taxable: stripeProduct.tax_code !== null,
      publishedAt: new Date(stripeProduct.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: stripeProduct.active
    };

    const targetDoc = existing || existingByGHL;

    if (targetDoc) {
      await sanityClient.patch(targetDoc._id).set(sanityProduct).commit();
      console.log(`[STRIPE WEBHOOK] Updated product in Sanity: ${stripeProduct.name}`);
    } else {
      await sanityClient.create(sanityProduct);
      console.log(`[STRIPE WEBHOOK] Created product in Sanity: ${stripeProduct.name}`);
    }

  } catch (error) {
    console.error('[STRIPE WEBHOOK] Error syncing product to Sanity:', error);
    throw error;
  }
}

/**
 * Delete a product from Sanity
 */
async function deleteProductFromSanity(stripeProductId: string) {
  try {
    const existing = await sanityClient.fetch(
      `*[_type == "ghlProduct" && stripeProductId == $id][0]`,
      { id: stripeProductId }
    );

    if (existing) {
      await sanityClient.delete(existing._id);
      console.log(`[STRIPE WEBHOOK] Deleted product from Sanity: ${stripeProductId}`);
    } else {
      console.log(`[STRIPE WEBHOOK] Product not found in Sanity: ${stripeProductId}`);
    }
  } catch (error) {
    console.error('[STRIPE WEBHOOK] Error deleting product from Sanity:', error);
    throw error;
  }
}

// GET endpoint for webhook testing
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/stripe',
    message: 'Stripe Webhook Endpoint',
    events: [
      'product.created',
      'product.updated',
      'product.deleted',
      'price.created',
      'price.updated',
      'price.deleted'
    ]
  });
}
