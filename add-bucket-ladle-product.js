// Add Ilio Cedar Sauna Bucket & Ladle Set product
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function createBucketLadleProduct() {
  try {
    console.log('Creating Ilio Cedar Sauna Bucket & Ladle Set product...');

    const product = {
      _type: 'ghlProduct',
      ghlProductId: 'ghl-bucket-ladle-001',
      name: 'Ilio Cedar Sauna Bucket & Ladle Set',
      slug: {
        _type: 'slug',
        current: 'ilio-cedar-sauna-bucket-ladle-set'
      },
      description: 'Complete your sauna ritual with the Ilio Cedar Sauna Bucket & Ladle Set — a timeless accessory designed to elevate the heat experience. Handcrafted from durable Western Red Cedar, this set adds a touch of natural elegance while releasing the subtle aroma of cedar with every steam pour.\n\nEngineered to withstand high heat and humidity, the stainless-steel insert prevents leaks while the smooth ergonomic ladle offers the perfect pour — every time.',
      price: 149, // Please update with actual price
      salePrice: null,
      images: [
        {
          url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg', // Placeholder - update with actual product image URL from GHL
          alt: 'Ilio Cedar Sauna Bucket & Ladle Set'
        }
      ],
      category: 'saunas',
      features: [
        'Premium Western Red Cedar construction',
        'Stainless steel interior liner (rust-resistant)',
        'Ergonomic cedar ladle with hanging cord',
        '5L water capacity',
        'Designed to complement any Ilio Sauna model'
      ],
      variants: [],
      inStock: true,
      stockCount: 10, // Please update with actual stock count
      allowOutOfStockPurchase: false,
      badge: 'New',
      productCollection: 'Sauna Accessories',
      specifications: [
        { label: 'Material', value: 'Western Red Cedar' },
        { label: 'Capacity', value: '5 Liters' },
        { label: 'Liner', value: 'Stainless Steel (rust-resistant)' },
        { label: 'Includes', value: 'Bucket with liner, Cedar ladle with hanging cord' },
        { label: 'Compatibility', value: 'All Ilio Sauna models' }
      ],
      publishedAt: new Date().toISOString(),
      isActive: true
    };

    const result = await sanityClient.create(product);
    console.log('✅ Product created successfully!');
    console.log('Product ID:', result._id);
    console.log('Product Name:', result.name);
    console.log('\n🌐 View at: http://localhost:4448/products');
    console.log('\n⚠️  NOTE: Please update the following in Sanity Studio:');
    console.log('  - Actual product price from GHL');
    console.log('  - Product images from GHL');
    console.log('  - Accurate stock count');

  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    process.exit(1);
  }
}

createBucketLadleProduct();
