// Automatically create Stripe webhook endpoint
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

async function setupStripeWebhook() {
  // Your preview URL - update this after deployment
  const WEBHOOK_URL = 'https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app/api/webhooks/stripe';

  console.log('🔗 Setting up Stripe webhook...\n');
  console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

  try {
    // Check if webhook already exists
    const existingWebhooks = await stripe.webhookEndpoints.list();
    const existing = existingWebhooks.data.find(wh => wh.url === WEBHOOK_URL);

    if (existing) {
      console.log('✅ Webhook already exists!');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Secret: ${existing.secret}\n`);
      console.log('📝 Add this to your Vercel environment variables:');
      console.log(`   STRIPE_WEBHOOK_SECRET=${existing.secret}\n`);
      return;
    }

    // Create new webhook
    const webhook = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: [
        'product.created',
        'product.updated',
        'product.deleted',
        'price.created',
        'price.updated',
        'price.deleted'
      ],
      description: 'Preview environment - Product and price sync webhook'
    });

    console.log('✅ Webhook created successfully!');
    console.log(`   ID: ${webhook.id}`);
    console.log(`   Secret: ${webhook.secret}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 IMPORTANT: Add this to Vercel:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`   STRIPE_WEBHOOK_SECRET=${webhook.secret}\n`);
    console.log('Run this command:');
    console.log(`   echo "${webhook.secret}" | npx vercel env add STRIPE_WEBHOOK_SECRET preview\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupStripeWebhook();
