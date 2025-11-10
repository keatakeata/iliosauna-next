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
 * POST /api/webhooks/ghl-invoices
 * Webhook endpoint for GoHighLevel invoice/payment updates
 *
 * This endpoint receives real-time notifications when:
 * - An invoice is paid in full (InvoicePaid)
 * - An invoice is partially paid (InvoicePartiallyPaid)
 * - An invoice is voided/cancelled (InvoiceVoid)
 * - An invoice is created (InvoiceCreate)
 * - An invoice is updated (InvoiceUpdate)
 *
 * Setup in GHL:
 * 1. Go to Settings > Integrations > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/ghl-invoices
 * 3. Select events: InvoicePaid, InvoicePartiallyPaid, InvoiceVoid, InvoiceCreate, InvoiceUpdate
 * 4. Add webhook secret to .env as WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature/secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('authorization');

    if (webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      console.warn('[INVOICE WEBHOOK] Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('[INVOICE WEBHOOK] Received GHL invoice webhook:', {
      type: payload.type,
      invoiceId: payload.invoiceId || payload.id,
      timestamp: new Date().toISOString()
    });

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Extract invoice ID from webhook payload
    const invoiceId = payload.invoiceId || payload.id || payload._id || payload.data?.id;

    if (!invoiceId) {
      console.error('[INVOICE WEBHOOK] No invoice ID in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload - missing invoice ID' },
        { status: 400 }
      );
    }

    // Handle different webhook event types
    const eventType = payload.type || payload.event || payload.eventType;

    // Fetch full invoice details from GHL
    console.log(`[INVOICE WEBHOOK] Fetching invoice details for ${invoiceId}`);

    const invoiceResponse = await fetch(`${GHL_API_BASE}/invoices/${invoiceId}?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!invoiceResponse.ok) {
      throw new Error(`GHL API Error: ${invoiceResponse.status} - ${await invoiceResponse.text()}`);
    }

    const invoiceData = await invoiceResponse.json();
    const fullInvoice = invoiceData.invoice || invoiceData;

    // Parse invoice items
    const invoiceItems = (fullInvoice.items || []).map((item: any) => ({
      name: item.name || item.description,
      description: item.description,
      quantity: item.quantity || 1,
      price: parseFloat(item.price || item.amount || 0),
      total: parseFloat(item.total || (item.price * item.quantity) || 0)
    }));

    // Calculate totals
    const subtotal = parseFloat(fullInvoice.subtotal || fullInvoice.amount || 0);
    const tax = parseFloat(fullInvoice.tax || 0);
    const discount = parseFloat(fullInvoice.discount || 0);
    const total = parseFloat(fullInvoice.total || fullInvoice.totalAmount || (subtotal + tax - discount));
    const amountPaid = parseFloat(fullInvoice.amountPaid || 0);
    const amountDue = parseFloat(fullInvoice.amountDue || (total - amountPaid));

    // Determine payment status
    let paymentStatus = 'unpaid';
    if (amountPaid >= total) {
      paymentStatus = 'paid';
    } else if (amountPaid > 0) {
      paymentStatus = 'partial';
    }

    if (fullInvoice.status === 'void' || fullInvoice.status === 'cancelled' || eventType === 'InvoiceVoid') {
      paymentStatus = 'void';
    }

    // Check if invoice exists in Sanity
    const existing = await sanityClient.fetch(
      `*[_type == "invoice" && ghlInvoiceId == $id][0]`,
      { id: invoiceId }
    );

    // Prepare Sanity document
    const sanityInvoice = {
      _type: 'invoice',
      ghlInvoiceId: fullInvoice.id || fullInvoice._id,
      invoiceNumber: fullInvoice.invoiceNumber || fullInvoice.number || invoiceId,
      contactId: fullInvoice.contactId || fullInvoice.altId,
      orderId: fullInvoice.orderId || null,
      customerEmail: fullInvoice.email,
      customerName: fullInvoice.name || fullInvoice.contactName,
      status: fullInvoice.status || 'open',
      paymentStatus: paymentStatus,
      items: invoiceItems,
      subtotal: subtotal,
      tax: tax,
      discount: discount,
      total: total,
      amountPaid: amountPaid,
      amountDue: amountDue,
      currency: fullInvoice.currency || 'CAD',
      dueDate: fullInvoice.dueDate || null,
      paidAt: fullInvoice.paidAt || (paymentStatus === 'paid' ? new Date().toISOString() : null),
      voidedAt: fullInvoice.voidedAt || (paymentStatus === 'void' ? new Date().toISOString() : null),
      paymentMethod: fullInvoice.paymentMethod || null,
      transactionId: fullInvoice.transactionId || null,
      notes: fullInvoice.notes || '',
      createdAt: fullInvoice.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let action = '';
    if (existing) {
      await sanityClient.patch(existing._id).set(sanityInvoice).commit();
      action = 'updated';
      console.log(`[INVOICE WEBHOOK] Updated invoice: ${sanityInvoice.invoiceNumber}`);

      // If invoice is now paid, update related order status
      if (paymentStatus === 'paid' && sanityInvoice.orderId) {
        try {
          const relatedOrder = await sanityClient.fetch(
            `*[_type == "order" && ghlOrderId == $orderId][0]`,
            { orderId: sanityInvoice.orderId }
          );

          if (relatedOrder) {
            await sanityClient.patch(relatedOrder._id).set({
              paymentStatus: 'paid',
              updatedAt: new Date().toISOString()
            }).commit();
            console.log(`[INVOICE WEBHOOK] Updated order ${sanityInvoice.orderId} payment status to paid`);
          }
        } catch (orderUpdateError) {
          console.error('[INVOICE WEBHOOK] Error updating order payment status:', orderUpdateError);
        }
      }
    } else {
      await sanityClient.create(sanityInvoice);
      action = 'created';
      console.log(`[INVOICE WEBHOOK] Created invoice: ${sanityInvoice.invoiceNumber}`);
    }

    return NextResponse.json({
      success: true,
      action,
      invoiceId,
      invoiceNumber: sanityInvoice.invoiceNumber,
      paymentStatus: sanityInvoice.paymentStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[INVOICE WEBHOOK] Error processing webhook:', error);
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
    endpoint: '/api/webhooks/ghl-invoices',
    message: 'GHL Invoice Webhook Endpoint',
    events: ['InvoicePaid', 'InvoicePartiallyPaid', 'InvoiceVoid', 'InvoiceCreate', 'InvoiceUpdate']
  });
}
