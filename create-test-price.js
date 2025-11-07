// Create a test price in Stripe to test webhook
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

async function createTestPrice() {
  console.log('🔍 Creating test price for Ilio Cedar Sauna Bucket & Ladle Set...\n');

  try {
    const productId = 'prod_TMP4wNLUwYXDBm'; // Ilio Cedar Sauna Bucket & Ladle Set

    // Create price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: 19500, // $195.00 in cents
      currency: 'cad',
      nickname: 'Standard Price',
      metadata: {
        source: 'test',
        variant: 'Natural Cedar / Standard (5L) / Bucket Only / Rope Handle'
      }
    });

    console.log('✅ Price created successfully!');
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Amount: $${price.unit_amount / 100} ${price.currency.toUpperCase()}`);
    console.log(`   Product: ${price.product}\n`);

    console.log('Now check if webhook fires (if configured) or run manual sync.');

  } catch (error) {
    console.error('❌ Failed to create price:');
    console.error(error.message);
  }
}

createTestPrice();
