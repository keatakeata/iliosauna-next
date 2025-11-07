// Manually sync GHL prices to Stripe
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
});

const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_API_BASE = process.env.GHL_API_BASE;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

async function syncGHLPricesToStripe() {
  console.log('🔄 Starting GHL → Stripe price sync...\n');

  try {
    // Fetch products from GHL
    const response = await fetch(`${GHL_API_BASE}/products/?locationId=${GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    const data = await response.json();
    const ghlProducts = data.products || [];

    console.log(`Found ${ghlProducts.length} products in GHL\n`);

    for (const ghlProduct of ghlProducts) {
      console.log(`\n📦 Processing: ${ghlProduct.name}`);
      console.log(`   GHL ID: ${ghlProduct._id}`);

      // Get full product details with prices
      const productDetailResponse = await fetch(`${GHL_API_BASE}/products/${ghlProduct._id}?locationId=${GHL_LOCATION_ID}`, {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28'
        }
      });

      const fullProduct = await productDetailResponse.json();

      // Get prices from GHL API
      const pricesResponse = await fetch(`${GHL_API_BASE}/products/${ghlProduct._id}/price?locationId=${GHL_LOCATION_ID}`, {
        headers: {
          'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
          'Version': '2021-07-28'
        }
      });

      const pricesData = await pricesResponse.json();
      const ghlPrices = pricesData.prices || pricesData.price || [];
      const priceArray = Array.isArray(ghlPrices) ? ghlPrices : (ghlPrices ? [ghlPrices] : []);

      console.log(`   Found ${priceArray.length} prices in GHL`);

      // Find matching Stripe product
      const stripeProducts = await stripe.products.search({
        query: `name:'${ghlProduct.name}'`
      });

      let stripeProduct = stripeProducts.data[0];

      if (!stripeProduct) {
        console.log(`   ⚠️  Product not found in Stripe, skipping...`);
        continue;
      }

      console.log(`   ✅ Found in Stripe: ${stripeProduct.id}`);

      // Create prices in Stripe
      let createdCount = 0;
      for (const ghlPrice of priceArray) {
        try {
          const priceAmount = Math.round(parseFloat(ghlPrice.amount || 0) * 100); // Convert to cents

          const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: priceAmount,
            currency: 'cad',
            nickname: ghlPrice.name || 'Standard',
            metadata: {
              ghlPriceId: ghlPrice._id || ghlPrice.id,
              ghlProductId: ghlProduct._id,
              source: 'ghl_manual_sync'
            }
          });

          console.log(`      ✅ Created price: ${ghlPrice.name} - $${(priceAmount / 100).toFixed(2)} CAD (${stripePrice.id})`);
          createdCount++;
        } catch (error) {
          console.error(`      ❌ Failed to create price ${ghlPrice.name}:`, error.message);
        }
      }

      console.log(`   📊 Created ${createdCount}/${priceArray.length} prices`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Sync complete!');
    console.log('\nNext steps:');
    console.log('1. Verify prices in Stripe Dashboard');
    console.log('2. Test webhook by changing a price in GHL');
    console.log('3. Check if website updates automatically\n');

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

syncGHLPricesToStripe();
