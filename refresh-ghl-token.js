const axios = require('axios');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const GHL_REFRESH_TOKEN = process.env.GHL_REFRESH_TOKEN;
const GHL_CLIENT_ID = process.env.GHL_CLIENT_ID;
const GHL_CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';

async function refreshGHLToken() {
  console.log('Refreshing GHL Access Token...\n');
  console.log('Client ID:', GHL_CLIENT_ID);
  console.log('Refresh Token (first 20 chars):', GHL_REFRESH_TOKEN?.substring(0, 20) + '...\n');

  try {
    const response = await axios({
      method: 'post',
      url: `${GHL_API_BASE}/oauth/token`,
      data: `client_id=${GHL_CLIENT_ID}&client_secret=${GHL_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${encodeURIComponent(GHL_REFRESH_TOKEN)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    const newAccessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;
    const tokenExpiresAt = Date.now() + (expiresIn * 1000);

    console.log('✅ Token refreshed successfully!');
    console.log('New Access Token (first 50 chars):', newAccessToken.substring(0, 50) + '...');
    console.log('Expires in:', expiresIn, 'seconds');
    console.log('Expiry timestamp:', new Date(tokenExpiresAt).toISOString());

    // Update .env.local file
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update the access token
    envContent = envContent.replace(
      /GHL_ACCESS_TOKEN=.*/,
      `GHL_ACCESS_TOKEN=${newAccessToken}`
    );
    
    // Update or add the expiry timestamp
    if (envContent.includes('GHL_TOKEN_EXPIRES_AT=')) {
      envContent = envContent.replace(
        /GHL_TOKEN_EXPIRES_AT=.*/,
        `GHL_TOKEN_EXPIRES_AT=${tokenExpiresAt}`
      );
    } else {
      envContent += `\nGHL_TOKEN_EXPIRES_AT=${tokenExpiresAt}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Updated .env.local with new access token!');

    // Update .env.production file
    const prodEnvPath = path.join(__dirname, '.env.production');
    if (fs.existsSync(prodEnvPath)) {
      let prodEnvContent = fs.readFileSync(prodEnvPath, 'utf8');
      prodEnvContent = prodEnvContent.replace(
        /GHL_ACCESS_TOKEN=.*/,
        `GHL_ACCESS_TOKEN=${newAccessToken}`
      );
      if (prodEnvContent.includes('GHL_TOKEN_EXPIRES_AT=')) {
        prodEnvContent = prodEnvContent.replace(
          /GHL_TOKEN_EXPIRES_AT=.*/,
          `GHL_TOKEN_EXPIRES_AT=${tokenExpiresAt}`
        );
      } else {
        prodEnvContent += `\nGHL_TOKEN_EXPIRES_AT=${tokenExpiresAt}`;
      }
      fs.writeFileSync(prodEnvPath, prodEnvContent);
      console.log('✅ Updated .env.production with new access token!');
    }

    // Update VERCEL_ENV_SETUP.md
    const setupPath = path.join(__dirname, 'VERCEL_ENV_SETUP.md');
    if (fs.existsSync(setupPath)) {
      let setupContent = fs.readFileSync(setupPath, 'utf8');
      setupContent = setupContent.replace(
        /GHL_ACCESS_TOKEN=.*/,
        `GHL_ACCESS_TOKEN=${newAccessToken}`
      );
      if (setupContent.includes('GHL_TOKEN_EXPIRES_AT=')) {
        setupContent = setupContent.replace(
          /GHL_TOKEN_EXPIRES_AT=.*/,
          `GHL_TOKEN_EXPIRES_AT=${tokenExpiresAt}`
        );
      }
      fs.writeFileSync(setupPath, setupContent);
      console.log('✅ Updated VERCEL_ENV_SETUP.md with new access token!');
    }

    console.log('\n🎉 Token refresh complete! The contact form should now work properly.');
    console.log('\n⚠️  IMPORTANT: You need to update the GHL_ACCESS_TOKEN in your Vercel dashboard with this new token:');
    console.log('\n' + newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    console.error('❌ ERROR refreshing token:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the refresh
refreshGHLToken()
  .then(() => {
    console.log('\n✅ Token refresh completed successfully!');
    process.exit(0);
  })
  .catch(() => {
    console.log('\n❌ Token refresh failed.');
    process.exit(1);
  });