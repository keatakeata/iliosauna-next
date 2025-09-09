# GHL Token Refresh Guide

## ⚠️ Current Status
The GHL access token has expired and the refresh token is invalid. You need to generate new OAuth credentials.

## How to Get New GHL Credentials

### Step 1: Access GHL Marketplace
1. Log into your GHL agency account
2. Navigate to Settings → Integrations → Apps
3. Find your OAuth app (Client ID: `68a4702c75c1f2caa0aadcde-meikc8zx`)

### Step 2: Generate New Access Token
1. Go to your sub-account (ID: `GCSgKFx6fTLWG5qmWqeN`)
2. Navigate to Settings → Integrations
3. Find your OAuth app and click "Connect" or "Reauthorize"
4. Complete the OAuth flow to get new tokens

### Step 3: Update Environment Variables
Once you have new tokens, update these files:

1. **`.env.local`** (for local development)
2. **`.env.production`** (for production reference)
3. **Vercel Dashboard** (for live deployment)

## Required Credentials
```env
GHL_ACCESS_TOKEN=<new-access-token>
GHL_REFRESH_TOKEN=<new-refresh-token>
GHL_LOCATION_ID=GCSgKFx6fTLWG5qmWqeN
GHL_CLIENT_ID=68a4702c75c1f2caa0aadcde-meikc8zx
GHL_CLIENT_SECRET=007591a0-aec3-441e-b194-083a0644bb3d
GHL_API_BASE=https://services.leadconnectorhq.com
GHL_TOKEN_EXPIRES_AT=<timestamp>
```

## Alternative: Use Private Integration Token
If OAuth continues to have issues, you can use a Private Integration Token instead:

1. Go to your sub-account settings
2. Navigate to Settings → Business Profile → API Keys
3. Create a new Private Integration Token
4. Update the access token in your environment variables

## Testing the Connection
After updating credentials, run:
```bash
node test-ghl-connection.js
```

## Automatic Token Refresh
The system is configured to automatically refresh tokens before they expire. The refresh logic is in:
- `src/app/api/contact/route.ts` (lines 17-56)

## Current Integration Features
✅ Contact creation on form submission
✅ Custom field mapping (14 fields)
✅ Automatic tagging based on interests
✅ Multi-step form with progressive disclosure
✅ Test mode fallback when credentials are missing

## Form Locations
- **Live Form**: `/contact`
- **API Endpoint**: `/api/contact`
- **Form Component**: `src/components/GHLContactForm.tsx`

## Troubleshooting
1. **401 Unauthorized**: Token expired - needs refresh
2. **Invalid refresh token**: Need to reauthorize the OAuth app
3. **400 Duplicate contact**: Working correctly - contact already exists

## Support
- GHL API Docs: https://highlevel.stoplight.io/
- GHL Support: support@gohighlevel.com