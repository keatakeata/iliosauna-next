const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

async function testSimpleGHLConnection() {
  console.log('Testing GHL API with simple request...\n');
  console.log('Location ID:', GHL_LOCATION_ID);
  console.log('Token length:', GHL_ACCESS_TOKEN?.length);
  console.log('Token preview:', GHL_ACCESS_TOKEN?.substring(0, 50) + '...');
  
  // Try different API endpoints to see which works
  const endpoints = [
    {
      name: 'Get Location Info',
      url: `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}`,
      method: 'GET'
    },
    {
      name: 'Get Contacts',
      url: `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&limit=1`,
      method: 'GET'
    },
    {
      name: 'Get Custom Fields',
      url: `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}/customFields`,
      method: 'GET'
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTrying: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    
    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'Version': '2021-07-28'
        }
      });
      
      console.log(`✅ SUCCESS! ${endpoint.name} worked`);
      console.log('Response status:', response.status);
      if (endpoint.name === 'Get Custom Fields' && response.data?.customFields) {
        console.log('\nFound custom fields:');
        response.data.customFields.slice(0, 5).forEach(field => {
          console.log(`- ${field.name}: ${field.id}`);
        });
      }
      return true;
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log('Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
  
  return false;
}

testSimpleGHLConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ At least one endpoint worked! Token is valid.');
    } else {
      console.log('\n❌ All endpoints failed. Token may be invalid or needs different permissions.');
      console.log('\nPlease verify:');
      console.log('1. This is a Private Integration Token from your sub-account');
      console.log('2. The token has the necessary permissions (contacts, locations)');
      console.log('3. The token was copied completely without any spaces');
    }
    process.exit(success ? 0 : 1);
  });