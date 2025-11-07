require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function freshSyncAllProducts() {
  try {
    console.log('\n=== Step 1: Delete ALL products from Sanity ===\n');

    const allProducts = await sanityClient.fetch(`*[_type == "ghlProduct"] { _id, name }`);
    console.log(`Found ${allProducts.length} products to delete`);

    for (const product of allProducts) {
      console.log(`Deleting: ${product.name}`);
      await sanityClient.delete(product._id);
    }

    console.log('\n✅ All products deleted from Sanity\n');

    console.log('=== Step 2: Trigger fresh sync from GHL ===\n');

    // Trigger the sync endpoint
    const syncResponse = await fetch('http://localhost:4448/api/cron/sync-products');
    const syncResult = await syncResponse.json();

    console.log('Sync Result:', syncResult);
    console.log('\n✅ Fresh sync complete!');
    console.log(`\nSummary:`);
    console.log(`  - Products synced: ${syncResult.synced || 0}`);
    console.log(`  - Errors: ${syncResult.errors || 0}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

freshSyncAllProducts();
