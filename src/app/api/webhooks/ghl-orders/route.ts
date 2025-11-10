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
 * POST /api/webhooks/ghl-orders
 * Webhook endpoint for GoHighLevel order updates
 *
 * This endpoint receives real-time notifications when:
 * - An order is created in GHL (OrderCreate)
 * - An order status is updated in GHL (OrderStatusUpdate)
 * - An order is fulfilled, shipped, cancelled, etc.
 *
 * Setup in GHL:
 * 1. Go to Settings > Integrations > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/ghl-orders
 * 3. Select events: OrderCreate, OrderStatusUpdate
 * 4. Add webhook secret to .env as WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature/secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('authorization');

    if (webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      console.warn('[ORDER WEBHOOK] Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('[ORDER WEBHOOK] Received GHL order webhook:', {
      type: payload.type,
      orderId: payload.orderId || payload.id,
      timestamp: new Date().toISOString()
    });

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Extract order ID from webhook payload
    const orderId = payload.orderId || payload.id || payload._id || payload.data?.id;

    if (!orderId) {
      console.error('[ORDER WEBHOOK] No order ID in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload - missing order ID' },
        { status: 400 }
      );
    }

    // Handle different webhook event types
    const eventType = payload.type || payload.event || payload.eventType;

    // Fetch full order details from GHL
    console.log(`[ORDER WEBHOOK] Fetching order details for ${orderId}`);

    const orderResponse = await fetch(`${GHL_API_BASE}/orders/${orderId}?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!orderResponse.ok) {
      throw new Error(`GHL API Error: ${orderResponse.status} - ${await orderResponse.text()}`);
    }

    const orderData = await orderResponse.json();
    const fullOrder = orderData.order || orderData;

    // Parse order items
    const orderItems = (fullOrder.items || []).map((item: any) => ({
      productId: item.productId,
      productName: item.name || item.productName,
      variantId: item.variantId || item.priceId,
      quantity: item.quantity || 1,
      price: parseFloat(item.price || 0),
      total: parseFloat(item.total || item.price || 0)
    }));

    // Calculate totals
    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const tax = parseFloat(fullOrder.tax || 0);
    const shipping = parseFloat(fullOrder.shipping || fullOrder.shippingCost || 0);
    const discount = parseFloat(fullOrder.discount || 0);
    const total = parseFloat(fullOrder.total || fullOrder.totalAmount || (subtotal + tax + shipping - discount));

    // Check if order exists in Sanity
    const existing = await sanityClient.fetch(
      `*[_type == "order" && ghlOrderId == $id][0]`,
      { id: orderId }
    );

    // Prepare Sanity document
    const sanityOrder = {
      _type: 'order',
      ghlOrderId: fullOrder._id || fullOrder.id,
      orderNumber: fullOrder.orderNumber || fullOrder.number || orderId,
      contactId: fullOrder.contactId || fullOrder.customerId,
      customerEmail: fullOrder.email || fullOrder.customerEmail,
      customerName: fullOrder.customerName || fullOrder.name,
      status: fullOrder.status || 'pending',
      fulfillmentStatus: fullOrder.fulfillmentStatus || 'unfulfilled',
      paymentStatus: fullOrder.paymentStatus || 'unpaid',
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      discount: discount,
      total: total,
      currency: fullOrder.currency || 'CAD',
      shippingAddress: fullOrder.shippingAddress ? {
        line1: fullOrder.shippingAddress.line1 || fullOrder.shippingAddress.address1,
        line2: fullOrder.shippingAddress.line2 || fullOrder.shippingAddress.address2,
        city: fullOrder.shippingAddress.city,
        state: fullOrder.shippingAddress.state || fullOrder.shippingAddress.province,
        postalCode: fullOrder.shippingAddress.postalCode || fullOrder.shippingAddress.zip,
        country: fullOrder.shippingAddress.country
      } : null,
      billingAddress: fullOrder.billingAddress ? {
        line1: fullOrder.billingAddress.line1 || fullOrder.billingAddress.address1,
        line2: fullOrder.billingAddress.line2 || fullOrder.billingAddress.address2,
        city: fullOrder.billingAddress.city,
        state: fullOrder.billingAddress.state || fullOrder.billingAddress.province,
        postalCode: fullOrder.billingAddress.postalCode || fullOrder.billingAddress.zip,
        country: fullOrder.billingAddress.country
      } : null,
      notes: fullOrder.notes || fullOrder.customerNotes || '',
      trackingNumber: fullOrder.trackingNumber || null,
      trackingUrl: fullOrder.trackingUrl || null,
      createdAt: fullOrder.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fulfilledAt: fullOrder.fulfilledAt || null,
      cancelledAt: fullOrder.cancelledAt || null
    };

    let action = '';
    if (existing) {
      await sanityClient.patch(existing._id).set(sanityOrder).commit();
      action = 'updated';
      console.log(`[ORDER WEBHOOK] Updated order: ${fullOrder.orderNumber || orderId}`);
    } else {
      await sanityClient.create(sanityOrder);
      action = 'created';
      console.log(`[ORDER WEBHOOK] Created order: ${fullOrder.orderNumber || orderId}`);
    }

    return NextResponse.json({
      success: true,
      action,
      orderId,
      orderNumber: fullOrder.orderNumber || orderId,
      status: fullOrder.status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ORDER WEBHOOK] Error processing webhook:', error);
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

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get('challenge');

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/ghl-orders',
    message: 'GHL Order Webhook Endpoint',
    events: ['OrderCreate', 'OrderStatusUpdate']
  });
}
