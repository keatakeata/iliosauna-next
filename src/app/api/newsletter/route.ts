import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Simple PIT token configuration - no OAuth needed
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('📧 Newsletter signup for:', email);
    console.log('🔑 Environment check:', {
      hasToken: !!GHL_ACCESS_TOKEN,
      tokenLength: GHL_ACCESS_TOKEN?.length || 0,
      hasLocationId: !!GHL_LOCATION_ID,
      locationId: GHL_LOCATION_ID ? `${GHL_LOCATION_ID.substring(0, 8)}...` : 'None',
      apiBase: GHL_API_BASE
    });

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if GHL credentials are configured
    if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
      console.error('GHL credentials not configured for newsletter:', {
        hasToken: !!GHL_ACCESS_TOKEN,
        hasLocationId: !!GHL_LOCATION_ID
      });

      // Return success in test mode
      return NextResponse.json({
        success: true,
        contactId: 'newsletter-test-' + Date.now(),
        message: 'Newsletter signup successful (test mode - GHL not configured)',
        testMode: true
      });
    }

    // Prepare the contact payload for newsletter subscription
    const payload = {
      locationId: GHL_LOCATION_ID,
      email: email,
      source: 'Website Newsletter Signup',
      tags: ['Website Lead', 'Newsletter Subscription'] // Clean, simple tags
    };

    // FIRST: Check if contact already exists before trying to create
    console.log('🔍 Checking for existing contact before creating newsletter subscription...');
    try {
      const existingContactsResponse = await axios.get(
        `${GHL_API_BASE}/contacts/?locationId=${GHL_LOCATION_ID}&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          timeout: 10000
        }
      );

      const contacts = existingContactsResponse.data.contacts || [];
      const existingContact = contacts.find((contact: any) =>
        contact.email?.toLowerCase() === email.toLowerCase()
      );

      if (existingContact) {
        console.log('📧 Found existing contact, adding newsletter subscription tag:', existingContact.id);

        // Merge tags: keep existing tags and add newsletter subscription
        const existingTags = existingContact.tags || [];
        const newTags = payload.tags || [];
        const mergedTags = [...new Set([...existingTags, ...newTags])]; // Remove duplicates

        // Update the existing contact with newsletter subscription tag
        const updatePayload = {
          tags: mergedTags
        };

        console.log('🔄 Updating existing contact with newsletter subscription:', JSON.stringify(updatePayload, null, 2));

        // Update the existing contact
        const updateResponse = await axios.put(
          `${GHL_API_BASE}/contacts/${existingContact.id}`,
          updatePayload,
          {
            headers: {
              'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            timeout: 10000
          }
        );

        console.log('✅ Contact updated with newsletter subscription successfully:', updateResponse.data);

        return NextResponse.json({
          success: true,
          contactId: existingContact.id,
          message: 'Successfully subscribed to newsletter!',
          updated: true,
          data: updateResponse.data
        });
      }
    } catch (searchError: any) {
      console.error('Error searching for existing contact:', searchError.message);
      // Continue with creating new contact if search fails
    }

    console.log('🚀 No existing contact found, creating new newsletter subscription...');
    console.log('🚀 Sending newsletter subscription to GHL:', JSON.stringify(payload, null, 2));
    console.log('🌐 API URL:', `${GHL_API_BASE}/contacts/`);

    // Make API call to create contact - using PIT token directly
    const response = await axios.post(
      `${GHL_API_BASE}/contacts/`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('✅ GHL Newsletter Response:', response.data);

    return NextResponse.json({
      success: true,
      contactId: response.data.contact?.id || response.data.id,
      message: 'Successfully subscribed to newsletter!',
      data: response.data
    });

  } catch (error: any) {
    console.error('Error creating newsletter subscription:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle duplicate contact error gracefully
    if (error.response?.status === 400 &&
        (error.response?.data?.message?.includes('duplicate') ||
         error.response?.data?.message?.includes('already exists'))) {

      // For existing contacts, we should add the newsletter tag
      // This is handled by GHL automation typically
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter. Thank you!',
        duplicate: true
      });
    }

    // Handle authorization errors
    if (error.response?.status === 401) {
      console.error('Authorization failed - PIT token may be invalid');
      return NextResponse.json(
        {
          success: false,
          message: 'Service temporarily unavailable. Please try again later.',
          error: 'Authorization error'
        },
        { status: 500 }
      );
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe. Please try again or contact us directly.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Service error'
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}