require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function removeIlioSauna() {
  try {
    console.log('\n=== Removing "Ilio Sauna" from Products ===\n');

    // Find the Ilio Sauna product
    const ilioSauna = await sanityClient.fetch(`*[_type == "ghlProduct" && name == "Ilio Sauna"][0] {
      _id,
      name,
      ghlProductId
    }`);

    if (!ilioSauna) {
      console.log('❌ "Ilio Sauna" not found in Sanity\n');
      return;
    }

    console.log(`Found: "${ilioSauna.name}"`);
    console.log(`Sanity ID: ${ilioSauna._id}`);
    console.log(`GHL ID: ${ilioSauna.ghlProductId}\n`);

    console.log('Deleting from Sanity...');
    await sanityClient.delete(ilioSauna._id);

    console.log('\n✅ Successfully deleted "Ilio Sauna" from products');
    console.log('It will no longer appear on /products page');
    console.log('The dedicated /saunas page will still work\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

removeIlioSauna();
