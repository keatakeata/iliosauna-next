const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'bxybmggj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function testConnection() {
  try {
    const result = await client.fetch('*[_type == "homepage"][0]');
    console.log('✅ Sanity connection works!');
    console.log('Homepage data:', result);
  } catch (error) {
    console.log('❌ Sanity connection failed:', error.message);
  }
}

testConnection();