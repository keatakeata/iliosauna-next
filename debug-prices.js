require('dotenv').config({ path: '.env.local' });

const https = require('https');

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_API_BASE = process.env.GHL_API_BASE;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlParsed = new URL(url);
    const req = https.request({
      hostname: urlParsed.hostname,
      path: urlParsed.pathname + urlParsed.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // Get the product ID
  const productsList = await makeRequest(`${GHL_API_BASE}/products/?locationId=${GHL_LOCATION_ID}`);
  const productId = productsList.data.products[0]._id;

  console.log('Trying different API endpoints to find pricing...\n');

  const endpoints = [
    { name: 'Product Variants', url: `${GHL_API_BASE}/products/${productId}/variants?locationId=${GHL_LOCATION_ID}` },
    { name: 'Product Prices', url: `${GHL_API_BASE}/products/${productId}/prices?locationId=${GHL_LOCATION_ID}` },
    { name: 'All Prices', url: `${GHL_API_BASE}/prices?locationId=${GHL_LOCATION_ID}&limit=100` }
  ];

  for (const { name, url } of endpoints) {
    console.log(`\n=== ${name} ===`);
    console.log(`URL: ${url}`);
    try {
      const response = await makeRequest(url);
      if (response.status === 200 || response.status === 201) {
        console.log('Status: SUCCESS ✅');
        console.log(JSON.stringify(response.data, null, 2));
      } else {
        console.log(`Status: ${response.status} ❌`);
        console.log(response.data || response.raw);
      }
    } catch (err) {
      console.log('Error:', err.message);
    }
  }
}

main().catch(console.error);
