require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function cleanSanityProducts() {
  try {
    console.log('\n=== Fetching Real GHL Products ===\n');

    // Fetch real products from GHL
    const ghlResponse = await fetch(`${process.env.GHL_API_BASE}/products/?locationId=${process.env.GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    const ghlData = await ghlResponse.json();
    const ghlProducts = ghlData.products || [];
    const validGHLIds = new Set(ghlProducts.map(p => p._id));

    console.log(`Found ${ghlProducts.length} real GHL products:`);
    ghlProducts.forEach(p => console.log(`  - ${p.name} (${p._id})`));

    console.log('\n=== Checking Sanity Products ===\n');

    // Fetch all products from Sanity
    const sanityProducts = await sanityClient.fetch(`*[_type == "ghlProduct"] {
      _id,
      name,
      ghlProductId
    }`);

    console.log(`Found ${sanityProducts.length} products in Sanity\n`);

    // Find products to delete (not in GHL)
    const toDelete = sanityProducts.filter(sp => {
      const isValid = validGHLIds.has(sp.ghlProductId);
      if (!isValid) {
        console.log(`❌ WILL DELETE: ${sp.name} (GHL ID: ${sp.ghlProductId}) - Not found in GHL`);
      } else {
        console.log(`✅ KEEP: ${sp.name} (GHL ID: ${sp.ghlProductId})`);
      }
      return !isValid;
    });

    if (toDelete.length === 0) {
      console.log('\n✨ All products are valid! Nothing to delete.\n');
      return;
    }

    console.log(`\n🗑️  Deleting ${toDelete.length} invalid products...\n`);

    // Delete invalid products
    for (const product of toDelete) {
      await sanityClient.delete(product._id);
      console.log(`   Deleted: ${product.name}`);
    }

    console.log('\n✅ Cleanup complete!\n');
    console.log(`Summary:`);
    console.log(`  - Real GHL products: ${ghlProducts.length}`);
    console.log(`  - Deleted from Sanity: ${toDelete.length}`);
    console.log(`  - Remaining in Sanity: ${sanityProducts.length - toDelete.length}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

cleanSanityProducts();
