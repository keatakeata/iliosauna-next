// Automatically set up GHL webhooks for product sync
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_API_BASE = process.env.GHL_API_BASE;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iliosauna.com';

async function createWebhook(event, method = 'POST') {
  const webhookConfig = {
    locationId: GHL_LOCATION_ID,
    url: `${WEBHOOK_URL}/api/ghl/products`,
    event: event,
    method: method,
    headers: {
      'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`
    }
  };

  try {
    const response = await fetch(`${GHL_API_BASE}/webhooks/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(webhookConfig)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to create ${event} webhook:`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Created webhook for: ${event}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${event} webhook:`, error.message);
    return false;
  }
}

async function listExistingWebhooks() {
  try {
    const response = await fetch(`${GHL_API_BASE}/webhooks/?locationId=${GHL_LOCATION_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    if (!response.ok) {
      console.error('Could not list webhooks');
      return [];
    }

    const data = await response.json();
    return data.webhooks || [];
  } catch (error) {
    console.error('Error listing webhooks:', error.message);
    return [];
  }
}

async function main() {
  console.log('🔧 Setting up GHL Product Webhooks...\n');
  console.log('Webhook URL:', `${WEBHOOK_URL}/api/ghl/products\n`);

  // Check existing webhooks
  console.log('Checking existing webhooks...');
  const existing = await listExistingWebhooks();
  console.log(`Found ${existing.length} existing webhooks\n`);

  // Create webhooks for product events
  const events = [
    'ProductCreate',
    'ProductUpdate',
    'ProductDelete'
  ];

  console.log('Creating webhooks...\n');

  for (const event of events) {
    await createWebhook(event);
  }

  console.log('\n✅ Webhook setup complete!');
  console.log('\n📝 What this means:');
  console.log('   - When you create a product in GHL → Automatically appears on website');
  console.log('   - When you update a product in GHL → Automatically updates on website');
  console.log('   - When you delete a product in GHL → Automatically removed from website');
  console.log('\n⚠️  Note: If webhook creation failed, you may need to set them up manually in GHL.');
}

main();
