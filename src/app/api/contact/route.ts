import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import customFieldIds from '@/lib/custom-field-ids.json';

// GHL OAuth configuration
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_REFRESH_TOKEN = process.env.GHL_REFRESH_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';
const GHL_CLIENT_ID = process.env.GHL_CLIENT_ID;
const GHL_CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;

// Token management
let accessToken = GHL_ACCESS_TOKEN;
let tokenExpiresAt = parseInt(process.env.GHL_TOKEN_EXPIRES_AT || '0');

async function refreshAccessToken() {
  if (!GHL_REFRESH_TOKEN) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${GHL_API_BASE}/oauth/token`,
      data: `client_id=${GHL_CLIENT_ID}&client_secret=${GHL_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${encodeURIComponent(GHL_REFRESH_TOKEN)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
    
    console.log('Token refreshed successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

async function getValidAccessToken() {
  // Check if token needs refresh (5 minutes before expiry)
  if (Date.now() >= tokenExpiresAt - (5 * 60 * 1000)) {
    console.log('Token expired or expiring soon, refreshing...');
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Failed to refresh token, using existing token');
      return accessToken;
    }
  }
  return accessToken;
}

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    console.log('Creating contact:', JSON.stringify(contactData, null, 2));

    // Check if GHL credentials are configured
    if (!GHL_ACCESS_TOKEN || GHL_ACCESS_TOKEN === 'your-ghl-access-token-here') {
      console.log('GHL credentials not configured - running in test mode');
      
      // Return success in test mode
      return NextResponse.json({
        success: true,
        contactId: 'test-' + Date.now(),
        message: 'Form submitted successfully (test mode - GHL credentials not configured)',
        testMode: true
      });
    }

    // Get valid access token
    const token = await getValidAccessToken();
    
    // Prepare the contact payload
    const payload: any = {
      locationId: GHL_LOCATION_ID,
      firstName: contactData.firstName || contactData.name?.split(' ')[0] || '',
      lastName: contactData.lastName || contactData.name?.split(' ').slice(1).join(' ') || '',
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

    console.log('Sending to GHL:', JSON.stringify(payload, null, 2));

    // Make API call to create contact
    const response = await axios.post(
      `${GHL_API_BASE}/contacts/`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      }
    );

    return NextResponse.json({
      success: true,
      contactId: response.data.contact?.id || response.data.id,
      message: 'Contact created successfully'
    });

  } catch (error: any) {
    console.error('Error creating contact:', error.response?.data || error.message);
    
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
      console.error('Authorization failed - token may be expired or invalid');
      return NextResponse.json(
        {
          success: false,
          message: 'Service temporarily unavailable. Please try again later or contact us directly.',
          error: 'Authorization error'
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