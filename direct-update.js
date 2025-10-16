const https = require('https');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./sanity-saunas-FINAL.json', 'utf8'));

const postData = JSON.stringify({
  mutations: [
    {
      patch: {
        id: '5a2b5c8f-1d21-428c-9add-5ab66269b95e',
        set: data
      }
    }
  ]
});

const options = {
  hostname: 'bxybmggj.api.sanity.io',
  port: 443,
  path: '/v2024-01-01/data/mutate/production',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let response = '';
  res.on('data', (chunk) => response += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Successfully updated Saunas Page!');
      console.log('🔄 Refresh Sanity Studio to see changes');
    } else {
      console.log('❌ Error:', res.statusCode);
      console.log(response);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();
