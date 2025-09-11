import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import customFieldIds from '@/lib/custom-field-ids.json';

// Simple PIT token configuration - no OAuth needed
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    console.log('📝 Creating contact with data:', JSON.stringify(contactData, null, 2));
    console.log('🔑 Environment check:', {
      hasToken: !!GHL_ACCESS_TOKEN,
      tokenLength: GHL_ACCESS_TOKEN?.length || 0,
      hasLocationId: !!GHL_LOCATION_ID,
      locationId: GHL_LOCATION_ID ? `${GHL_LOCATION_ID.substring(0, 8)}...` : 'None',
      apiBase: GHL_API_BASE
    });

    // Check if GHL credentials are configured
    if (!GHL_ACCESS_TOKEN || !GHL_LOCATION_ID) {
      console.error('GHL credentials not configured:', {
        hasToken: !!GHL_ACCESS_TOKEN,
        hasLocationId: !!GHL_LOCATION_ID
      });
      
      // Return success in test mode
      return NextResponse.json({
        success: true,
        contactId: 'test-' + Date.now(),
        message: 'Form submitted successfully (test mode - GHL not configured)',
        testMode: true
      });
    }

    // Split name into first and last names
    const nameParts = contactData.name ? contactData.name.trim().split(' ') : [];
    const firstName = contactData.firstName || nameParts[0] || '';
    const lastName = contactData.lastName || nameParts.slice(1).join(' ') || '';

    // Prepare the contact payload
    const payload: any = {
      locationId: GHL_LOCATION_ID,
      firstName: firstName,
      lastName: lastName,
      email: contactData.email,
      phone: contactData.phone || '',
      source: contactData.source || 'Website Contact Form',
      tags: contactData.tags || ['Website Lead', 'Contact Form']
    };

    // Map custom fields to GHL format
    if (contactData.customFields && Object.keys(customFieldIds).length > 0) {
      payload.customFields = [];
      
      for (const [fieldKey, value] of Object.entries(contactData.customFields)) {
        if (!value || value === '') continue;
        
        const fieldId = (customFieldIds as any)[fieldKey];
        if (fieldId) {
          payload.customFields.push({
            id: fieldId,
            field_value: value
          });
          console.log(`Mapping ${fieldKey} → ${fieldId}: ${value}`);
        }
      }
    }

    // Add interest-based tags
    if (contactData.customFields?.primary_interest) {
      const interestTags: { [key: string]: string } = {
        'Wellness/Therapy': 'Interest: Wellness/Therapy',
        'Family Bonding': 'Interest: Family',
        'Entertaining Guests': 'Interest: Entertainment',
        'Retreat/Airbnb': 'Interest: Revenue Generation',
        'Year-Round Outdoor Living': 'Interest: Outdoor Living'
      };
      
      const interestTag = interestTags[contactData.customFields.primary_interest];
      if (interestTag && !payload.tags.includes(interestTag)) {
        payload.tags.push(interestTag);
      }
    }

    console.log('🚀 Sending to GHL:', JSON.stringify(payload, null, 2));
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

    console.log('✅ GHL Response:', response.data);

    return NextResponse.json({
      success: true,
      contactId: response.data.contact?.id || response.data.id,
      message: 'Contact created successfully',
      data: response.data
    });

  } catch (error: any) {
    console.error('Error creating contact:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle duplicate contact error gracefully
    if (error.response?.status === 400 && 
        (error.response?.data?.message?.includes('duplicate') || 
         error.response?.data?.message?.includes('already exists'))) {
      return NextResponse.json({
        success: true,
        message: 'Thank you! We already have your information and will be in touch soon.',
        duplicate: true
      });
    }

    // Handle authorization errors
    if (error.response?.status === 401) {
      console.error('Authorization failed - PIT token may be invalid');
      return NextResponse.json(
        {
          success: false,
          message: 'Service temporarily unavailable. Please try again later or contact us directly.',
          error: 'Authorization error - check PIT token in Vercel'
        },
        { status: 500 }
      );
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to submit form. Please try again or contact us directly.',
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