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
 * POST /api/webhooks/ghl-contacts
 * Webhook endpoint for GoHighLevel contact/customer updates
 *
 * This endpoint receives real-time notifications when:
 * - A contact is created in GHL (ContactCreate)
 * - A contact is updated in GHL (ContactUpdate)
 * - Contact tags are added/removed (ContactTagUpdate)
 * - Contact is deleted/archived (ContactDelete)
 *
 * Setup in GHL:
 * 1. Go to Settings > Integrations > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/ghl-contacts
 * 3. Select events: ContactCreate, ContactUpdate, ContactTagUpdate, ContactDelete
 * 4. Add webhook secret to .env as WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature/secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('authorization');

    if (webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      console.warn('[CONTACT WEBHOOK] Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('[CONTACT WEBHOOK] Received GHL contact webhook:', {
      type: payload.type,
      contactId: payload.contactId || payload.id,
      timestamp: new Date().toISOString()
    });

    const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
    const GHL_API_BASE = process.env.GHL_API_BASE;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    // Extract contact ID from webhook payload
    const contactId = payload.contactId || payload.id || payload._id || payload.data?.id;

    if (!contactId) {
      console.error('[CONTACT WEBHOOK] No contact ID in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload - missing contact ID' },
        { status: 400 }
      );
    }

    // Handle different webhook event types
    const eventType = payload.type || payload.event || payload.eventType;

    // If contact was deleted/archived, remove from Sanity
    if (eventType === 'contact.deleted' || eventType === 'ContactDelete' || eventType === 'contact.archived') {
      const existing = await sanityClient.fetch(
        `*[_type == "customer" && ghlContactId == $id][0]`,
        { id: contactId }
      );

      if (existing) {
        await sanityClient.delete(existing._id);
        console.log(`[CONTACT WEBHOOK] Deleted contact ${contactId} from Sanity`);
      }

      return NextResponse.json({
        success: true,
        action: 'deleted',
        contactId
      });
    }

    // Fetch full contact details from GHL
    console.log(`[CONTACT WEBHOOK] Fetching contact details for ${contactId}`);

    const contactResponse = await fetch(`${GHL_API_BASE}/contacts/${contactId}?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!contactResponse.ok) {
      throw new Error(`GHL API Error: ${contactResponse.status} - ${await contactResponse.text()}`);
    }

    const contactData = await contactResponse.json();
    const fullContact = contactData.contact || contactData;

    // Check if contact exists in Sanity
    const existing = await sanityClient.fetch(
      `*[_type == "customer" && ghlContactId == $id][0]`,
      { id: contactId }
    );

    // Prepare Sanity document
    const sanityCustomer = {
      _type: 'customer',
      ghlContactId: fullContact.id || fullContact._id,
      email: fullContact.email,
      firstName: fullContact.firstName,
      lastName: fullContact.lastName,
      fullName: `${fullContact.firstName || ''} ${fullContact.lastName || ''}`.trim() || fullContact.name,
      phone: fullContact.phone,
      tags: fullContact.tags || [],
      source: fullContact.source || 'ghl',
      address: fullContact.address ? {
        line1: fullContact.address.line1 || fullContact.address.address1,
        line2: fullContact.address.line2 || fullContact.address.address2,
        city: fullContact.address.city,
        state: fullContact.address.state || fullContact.address.province,
        postalCode: fullContact.address.postalCode || fullContact.address.zip,
        country: fullContact.address.country
      } : null,
      dateOfBirth: fullContact.dateOfBirth || null,
      companyName: fullContact.companyName || fullContact.company || null,
      website: fullContact.website || null,
      timezone: fullContact.timezone || null,
      customFields: fullContact.customFields || {},
      createdAt: fullContact.dateAdded || fullContact.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContacted: fullContact.lastContacted || null,
      isActive: fullContact.status !== 'archived'
    };

    let action = '';
    if (existing) {
      await sanityClient.patch(existing._id).set(sanityCustomer).commit();
      action = 'updated';
      console.log(`[CONTACT WEBHOOK] Updated contact: ${sanityCustomer.email}`);
    } else {
      await sanityClient.create(sanityCustomer);
      action = 'created';
      console.log(`[CONTACT WEBHOOK] Created contact: ${sanityCustomer.email}`);
    }

    return NextResponse.json({
      success: true,
      action,
      contactId,
      email: sanityCustomer.email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CONTACT WEBHOOK] Error processing webhook:', error);
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
    endpoint: '/api/webhooks/ghl-contacts',
    message: 'GHL Contact Webhook Endpoint',
    events: ['ContactCreate', 'ContactUpdate', 'ContactTagUpdate', 'ContactDelete']
  });
}
