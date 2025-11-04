// Sync products from GHL to Sanity
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

async function fetchGHLProducts() {
  const accessToken = process.env.GHL_ACCESS_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const apiBase = process.env.GHL_API_BASE;

  console.log('Fetching products from GHL...');
  console.log('Location ID:', locationId);

  try {
    const response = await fetch(`${apiBase}/products/?locationId=${locationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GHL API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.products?.length || 0} products in GHL`);
    return data.products || [];
  } catch (error) {
    console.error('❌ Error fetching from GHL:', error.message);
    throw error;
  }
}

async function syncProductToSanity(ghlProduct) {
  try {
    // Check if product already exists
    const existing = await sanityClient.fetch(
      `*[_type == "ghlProduct" && ghlProductId == $ghlProductId][0]`,
      { ghlProductId: ghlProduct._id }
    );

    // Transform GHL product to Sanity format
    const sanityProduct = {
      _type: 'ghlProduct',
      ghlProductId: ghlProduct._id,
      name: ghlProduct.name,
      slug: {
        _type: 'slug',
        current: ghlProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      description: ghlProduct.description || ghlProduct.productDescription || '',
      price: parseFloat(ghlProduct.price || ghlProduct.amount || 0),
      salePrice: ghlProduct.compareAtPrice ? parseFloat(ghlProduct.compareAtPrice) : null,
      images: (() => {
        let imgs = [];
        if (ghlProduct.image) {
          if (typeof ghlProduct.image === 'string') {
            imgs = [{ url: ghlProduct.image, alt: ghlProduct.name }];
          } else if (Array.isArray(ghlProduct.image)) {
            imgs = ghlProduct.image.map(img => ({
              url: typeof img === 'string' ? img : img.url || img.imageUrl,
              alt: ghlProduct.name
            }));
          } else if (ghlProduct.image.url) {
            imgs = [{ url: ghlProduct.image.url, alt: ghlProduct.name }];
          }
        }
        if (imgs.length === 0 && ghlProduct.medias && Array.isArray(ghlProduct.medias)) {
          imgs = ghlProduct.medias.map(img => ({
            url: typeof img === 'string' ? img : img.url || img.imageUrl,
            alt: ghlProduct.name
          }));
        }
        return imgs.filter(img => img.url);
      })(),
      category: ghlProduct.productType || 'wellness',
      features: [],
      variants: ghlProduct.variants || [],
      inStock: ghlProduct.available !== false,
      stockCount: ghlProduct.availableQuantity || null,
      allowOutOfStockPurchase: ghlProduct.allowOutOfStockPurchase || false,
      badge: ghlProduct.statementDescriptor || null,
      productCollection: ghlProduct.productType || null,
      specifications: [],
      publishedAt: ghlProduct.createdAt || new Date().toISOString(),
      isActive: true
    };

    if (existing) {
      // Update existing product
      await sanityClient
        .patch(existing._id)
        .set(sanityProduct)
        .commit();
      console.log(`✅ Updated: ${ghlProduct.name}`);
    } else {
      // Create new product
      await sanityClient.create(sanityProduct);
      console.log(`✅ Created: ${ghlProduct.name}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing ${ghlProduct.name}:`, error.message);
  }
}

async function main() {
  try {
    console.log('🔄 Starting GHL → Sanity product sync...\n');

    const ghlProducts = await fetchGHLProducts();

    if (ghlProducts.length === 0) {
      console.log('⚠️  No products found in GHL');
      return;
    }

    console.log(`\n📦 Syncing ${ghlProducts.length} products to Sanity...\n`);

    for (const product of ghlProducts) {
      await syncProductToSanity(product);
    }

    console.log('\n✅ Sync complete!');
    console.log('🌐 View products at: http://localhost:4448/products');
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

main();
