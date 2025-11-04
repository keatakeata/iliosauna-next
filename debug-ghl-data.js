// Debug script to see actual GHL product data
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

const url = `https://services.leadconnectorhq.com/products/?locationId=${GHL_LOCATION_ID}`;

const options = {
  headers: {
    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
    'Version': '2021-07-28'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('=== FIRST PRODUCT FROM GHL ===');
    console.log(JSON.stringify(json.products[0], null, 2));
    console.log('\n=== PRICE FIELD ===');
    console.log('price:', json.products[0].price);
    console.log('amount:', json.products[0].amount);
  });
}).on('error', err => console.error(err));
