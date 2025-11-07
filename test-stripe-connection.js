// Quick test script to verify Stripe connection
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

async function testStripeConnection() {
  console.log('🔍 Testing Stripe connection...\n');

  try {
    // Test 1: List products
    console.log('📦 Fetching products from Stripe...');
    const products = await stripe.products.list({ limit: 5 });
    console.log(`✅ Found ${products.data.length} products in Stripe\n`);

    if (products.data.length > 0) {
      console.log('Sample products:');
      products.data.forEach(product => {
        console.log(`  - ${product.name} (${product.id}) - Active: ${product.active}`);
      });
      console.log('');
    }

    // Test 2: Check if any products are from GHL
    const ghlProducts = products.data.filter(p =>
      p.metadata?.source === 'ghl' ||
      p.metadata?.ghlProductId ||
      p.description?.includes('GHL') ||
      p.description?.includes('GoHighLevel')
    );

    if (ghlProducts.length > 0) {
      console.log(`✅ Found ${ghlProducts.length} products that appear to be from GHL\n`);
    } else {
      console.log('⚠️  No GHL products detected yet. This is normal if GHL → Stripe sync is not configured.\n');
    }

    // Test 3: List recent prices
    console.log('💰 Fetching recent prices...');
    const prices = await stripe.prices.list({ limit: 5 });
    console.log(`✅ Found ${prices.data.length} prices in Stripe\n`);

    if (prices.data.length > 0) {
      console.log('Sample prices:');
      prices.data.forEach(price => {
        const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
        console.log(`  - ${price.nickname || 'Unnamed'}: $${amount} ${price.currency.toUpperCase()} (${price.id})`);
      });
      console.log('');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Stripe connection successful!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Next steps:');
    console.log('1. Ensure GHL is syncing products to Stripe');
    console.log('2. Create webhook in Stripe Dashboard');
    console.log('3. Deploy to production');
    console.log('4. Configure webhook to point to your domain\n');

  } catch (error) {
    console.error('❌ Stripe connection failed:');
    console.error(error.message);

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Check your STRIPE_SECRET_KEY in .env.local');
    }
  }
}

testStripeConnection();
