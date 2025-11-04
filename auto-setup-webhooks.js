// Automatically set up GHL webhooks programmatically
require('dotenv').config({ path: '.env.local' });

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_API_BASE = process.env.GHL_API_BASE;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const WEBHOOK_URL = 'https://iliosauna.com'; // Use production URL

async function makeRequest(url, options) {
  const https = require('https');
  const urlParsed = new URL(url);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: urlParsed.hostname,
      path: urlParsed.pathname + urlParsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            text: data
          });
        } catch (e) {
          resolve({
            ok: false,
            status: res.statusCode,
            data: null,
            text: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function createWebhook(eventType, method = 'POST') {
  const webhookConfig = {
    locationId: GHL_LOCATION_ID,
    url: `${WEBHOOK_URL}/api/ghl/products`,
    eventType: eventType,
    method: method,
    headers: {
      'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`Creating webhook for ${eventType}...`);

  try {
    const response = await makeRequest(`${GHL_API_BASE}/webhooks/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: webhookConfig
    });

    if (!response.ok) {
      console.error(`❌ Failed to create ${eventType} webhook:`, response.text);
      return false;
    }

    console.log(`✅ Created webhook for: ${eventType}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${eventType} webhook:`, error.message);
    return false;
  }
}

async function listWebhooks() {
  try {
    const response = await makeRequest(
      `${GHL_API_BASE}/webhooks/?locationId=${GHL_LOCATION_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28'
        }
      }
    );

    if (!response.ok) {
      console.error('Could not list webhooks');
      return [];
    }

    return response.data?.webhooks || [];
  } catch (error) {
    console.error('Error listing webhooks:', error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Automatic GHL Webhook Setup\n');
  console.log('Webhook URL:', `${WEBHOOK_URL}/api/ghl/products`);
  console.log('Location ID:', GHL_LOCATION_ID);
  console.log('');

  // List existing webhooks
  console.log('Checking existing webhooks...');
  const existing = await listWebhooks();
  console.log(`Found ${existing.length} existing webhooks\n`);

  // Show existing webhooks
  if (existing.length > 0) {
    console.log('Existing webhooks:');
    existing.forEach(wh => {
      console.log(`  - ${wh.eventType || wh.event} → ${wh.url}`);
    });
    console.log('');
  }

  // Create product webhooks
  const events = [
    { type: 'ProductCreate', method: 'POST' },
    { type: 'ProductUpdate', method: 'POST' },
    { type: 'ProductDelete', method: 'POST' }
  ];

  console.log('Creating webhooks...\n');

  let successCount = 0;
  for (const event of events) {
    const success = await createWebhook(event.type, event.method);
    if (success) successCount++;
  }

  console.log('');
  console.log('═'.repeat(60));

  if (successCount === events.length) {
    console.log('✅ SUCCESS! All webhooks created!');
    console.log('');
    console.log('Your website will now automatically sync products from GHL!');
    console.log('');
    console.log('What this means:');
    console.log('  ✓ Create a product in GHL → Appears on website instantly');
    console.log('  ✓ Update a product in GHL → Updates on website instantly');
    console.log('  ✓ Delete a product in GHL → Removed from website instantly');
    console.log('  ✓ Only products with "Include in Online Store" ✓ will sync');
  } else {
    console.log(`⚠️  ${successCount}/${events.length} webhooks created`);
    console.log('');
    console.log('Some webhooks may already exist or there was an error.');
    console.log('Check the logs above for details.');
  }

  console.log('═'.repeat(60));
}

main().catch(console.error);
