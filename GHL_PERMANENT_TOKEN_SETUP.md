# GHL Permanent API Token Setup Guide

## Using Private Integration Token (Never Expires)

Instead of OAuth tokens that expire, use a **Private Integration Token** which never expires and doesn't need refresh logic.

## Step-by-Step Setup

### 1. Generate Private Integration Token in GHL

1. **Log into your GHL Sub-Account** (ID: `GCSgKFx6fTLWG5qmWqeN`)
2. Navigate to **Settings** → **Business Profile**
3. Click on **API Keys** tab
4. Click **"Generate API Key"** or **"Create New Token"**
5. Give it a name like "Website Contact Form"
6. Copy the generated token (starts with `pit-` or similar format)

### 2. Update Your Environment Variables

Replace the OAuth tokens with your permanent token:

```env
# Single permanent token - no refresh needed!
GHL_ACCESS_TOKEN=<your-private-integration-token>
GHL_LOCATION_ID=GCSgKFx6fTLWG5qmWqeN
GHL_API_BASE=https://services.leadconnectorhq.com

# You can remove these OAuth-related variables:
# GHL_REFRESH_TOKEN (not needed)
# GHL_CLIENT_ID (not needed)
# GHL_CLIENT_SECRET (not needed)
# GHL_TOKEN_EXPIRES_AT (not needed)
```

### 3. Simplified API Route

Since we don't need token refresh, the API route becomes much simpler:

```typescript
// No refresh logic needed - just use the token directly!
const GHL_ACCESS_TOKEN = process.env.GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';

// Use it directly in API calls
const response = await axios.post(
  `${GHL_API_BASE}/contacts/`,
  payload,
  {
    headers: {
      'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }
  }
);
```

## Advantages of Private Integration Token

✅ **Never expires** - Set it once and forget it
✅ **No refresh logic needed** - Simpler code
✅ **More reliable** - No token expiry errors
✅ **Easier deployment** - Just one token to manage
✅ **Better for production** - No downtime from expired tokens

## Security Best Practices

1. **Keep it secret** - Never commit the token to Git
2. **Use environment variables** - Store in `.env.local` and Vercel dashboard
3. **Limit scope** - Only grant necessary permissions when creating the token
4. **Rotate periodically** - Even though it doesn't expire, rotate every 6-12 months for security

## Update Locations

After getting your Private Integration Token, update it in:

1. **`.env.local`** - For local development
2. **Vercel Dashboard** → Settings → Environment Variables - For production
3. Remove the OAuth-related variables (refresh token, client ID, client secret)

## Testing Your Permanent Token

Run this command after updating:
```bash
node test-ghl-connection.js
```

If successful, you'll see:
```
✅ SUCCESS! Contact created with ID: [contact-id]
GHL Integration is working correctly!
```

## That's It!

With a Private Integration Token, your GHL connection will work permanently without any maintenance or token refresh needed. 🎉