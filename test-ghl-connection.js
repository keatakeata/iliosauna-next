const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';

async function testGHLConnection() {
  console.log('Testing GHL API Connection...\n');
  console.log('Location ID:', GHL_LOCATION_ID);
  console.log('API Base:', GHL_API_BASE);
  console.log('Token (first 20 chars):', GHL_ACCESS_TOKEN?.substring(0, 20) + '...\n');

  try {
    // Test creating a contact
    const testContact = {
      locationId: GHL_LOCATION_ID,
      firstName: 'Test',
      lastName: 'Contact',
      email: `test${Date.now()}@example.com`,
      phone: '+16045550000',
      source: 'API Test',
      tags: ['Test Contact', 'API Verification'],
      customFields: [
        {
          id: 'G9gDQXto19i8jq6ogJXy', // purchase_timeline
          field_value: 'Within 3 months'
        },
        {
          id: 'CYOJXkBqWBPiJa8fZKBG', // primary_interest
          field_value: 'Family Bonding'
        }
      ]
    };

    console.log('Sending test contact to GHL...\n');
    
    const response = await axios.post(
      `${GHL_API_BASE}/contacts/`,
      testContact,
      {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      }
    );

    console.log('✅ SUCCESS! Contact created with ID:', response.data.contact?.id || response.data.id);
    console.log('\nGHL Integration is working correctly!');
    console.log('You can now submit forms on the website and they will create contacts in GHL.');
    
    return response.data;
  } catch (error) {
    console.error('❌ ERROR connecting to GHL:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message || error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n⚠️  Authentication failed - the access token may be expired or invalid.');
        console.error('The system will attempt to refresh the token automatically when using the website form.');
      } else if (error.response.status === 400 && error.response.data?.message?.includes('duplicate')) {
        console.log('\n✅ Connection successful! (Contact already exists - this is normal)');
        return { success: true, duplicate: true };
      }
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the test
testGHLConnection()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(() => {
    console.log('\n❌ Test failed. Please check your credentials.');
    process.exit(1);
  });