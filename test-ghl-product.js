// Test script to create a sample GHL product in Sanity
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function createTestProduct() {
  try {
    console.log('Creating test GHL product...');

    const testProduct = {
      _type: 'ghlProduct',
      ghlProductId: 'test-ghl-001',
      name: 'Premium Wellness Pod',
      slug: {
        _type: 'slug',
        current: 'premium-wellness-pod'
      },
      description: 'Experience ultimate relaxation with our premium wellness pod featuring advanced therapeutic technologies.',
      price: 12999,
      salePrice: 10999,
      images: [
        {
          url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
          alt: 'Premium Wellness Pod'
        }
      ],
      category: 'wellness',
      features: [
        'Full spectrum infrared heating',
        'Chromotherapy lighting system',
        'Built-in audio system with Bluetooth',
        'App-controlled temperature & settings',
        'Medical-grade materials',
        'Energy efficient design'
      ],
      variants: [],
      inStock: true,
      stockCount: 5,
      allowOutOfStockPurchase: false,
      badge: 'New',
      productCollection: 'Wellness Series',
      specifications: [
        { label: 'Dimensions', value: '7ft x 4ft x 6ft' },
        { label: 'Weight', value: '450 lbs' },
        { label: 'Power', value: '240V, 30A' },
        { label: 'Warranty', value: '5 years limited' }
      ],
      publishedAt: new Date().toISOString(),
      isActive: true
    };

    const result = await sanityClient.create(testProduct);
    console.log('✅ Test product created successfully!');
    console.log('Product ID:', result._id);
    console.log('Product Name:', result.name);
    console.log('\nYou can now view this product at http://localhost:4448/products');

  } catch (error) {
    console.error('❌ Error creating test product:', error.message);
    process.exit(1);
  }
}

createTestProduct();
