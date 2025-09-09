const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'bxybmggj',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function resetHomepage() {
  try {
    // Delete existing homepage documents
    const existingDocs = await client.fetch('*[_type == "homepage"]');
    console.log(`Found ${existingDocs.length} existing homepage documents`);
    
    for (const doc of existingDocs) {
      await client.delete(doc._id);
      console.log(`Deleted document: ${doc._id}`);
    }

    // Create new homepage document with pre-populated content
    const newHomepage = await client.create({
      _type: 'homepage',
      heroSection: {
        title: 'Contemporary Luxury Saunas',
        subtitle: 'Scandinavian craftsmanship',
        buttonText: 'View Models'
      },
      aboutSection: {
        title: 'Make it stand out',
        paragraph1: 'At Ilio, we believe wellness should be accessible, beautiful, and transformative. Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.',
        paragraph2: 'Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted with advanced heating systems for an experience that lasts.',
        videoUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0b776b0fbe591e36c.mp4'
      }
    });

    console.log('Created new homepage document:', newHomepage._id);
    console.log('Homepage reset complete! Check your Sanity Studio.');
    
  } catch (error) {
    console.error('Error resetting homepage:', error);
  }
}

resetHomepage();