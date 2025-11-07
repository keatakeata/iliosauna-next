require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function cleanAllProducts() {
  try {
    console.log('\n=== Fetching ALL products from Sanity ===\n');

    // Fetch all products from Sanity
    const allProducts = await sanityClient.fetch(`*[_type == "ghlProduct"] {
      _id,
      name,
      ghlProductId,
      isActive
    }`);

    console.log(`Found ${allProducts.length} total products in Sanity:\n`);
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Sanity ID: ${p._id}`);
      console.log(`   GHL ID: ${p.ghlProductId}`);
      console.log(`   Active: ${p.isActive}`);
      console.log('');
    });

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
    ghlProducts.forEach(p => console.log(`  ✅ ${p.name} (${p._id})`));

    console.log('\n=== Comparing Products ===\n');

    // Find products to delete (not in GHL)
    const toDelete = allProducts.filter(sp => {
      const isValid = validGHLIds.has(sp.ghlProductId);
      if (!isValid) {
        console.log(`❌ WILL DELETE: "${sp.name}" (GHL ID: ${sp.ghlProductId}) - Not in GHL`);
      } else {
        console.log(`✅ KEEP: "${sp.name}" (GHL ID: ${sp.ghlProductId})`);
      }
      return !isValid;
    });

    if (toDelete.length === 0) {
      console.log('\n✨ All products are valid! Nothing to delete.\n');
      return;
    }

    console.log(`\n🗑️  Deleting ${toDelete.length} invalid product(s)...\n`);

    // Delete invalid products
    for (const product of toDelete) {
      console.log(`   Deleting: "${product.name}" (${product._id})`);
      await sanityClient.delete(product._id);
      console.log(`   ✅ Deleted successfully`);
    }

    console.log('\n✅ Cleanup complete!\n');
    console.log(`Summary:`);
    console.log(`  - Real GHL products: ${ghlProducts.length}`);
    console.log(`  - Products in Sanity before: ${allProducts.length}`);
    console.log(`  - Deleted from Sanity: ${toDelete.length}`);
    console.log(`  - Remaining in Sanity: ${allProducts.length - toDelete.length}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
  }
}

cleanAllProducts();
