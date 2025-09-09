# Vercel Environment Variables Setup Guide

## Important: Setting Up Environment Variables in Vercel

When deploying to Vercel, you need to add all environment variables through the Vercel dashboard. 

### Steps to Add Environment Variables in Vercel:

1. **Go to your Vercel Project Dashboard**
   - Navigate to your project at https://vercel.com/dashboard
   - Select your project

2. **Access Environment Variables Settings**
   - Click on "Settings" tab
   - Navigate to "Environment Variables" in the left sidebar

3. **Add Each Variable**
   - Click "Add New"
   - Enter the variable name and value
   - Select which environments to apply to (Production, Preview, Development)
   - Click "Save"

### Required Environment Variables for Production:

#### GoHighLevel (GHL) API Configuration
```
# Private Integration Token - Never expires!
GHL_ACCESS_TOKEN=pit-38be6539-4649-4fa4-b724-27b6c5876150
GHL_LOCATION_ID=GCSgKFx6fTLWG5qmWqeN
GHL_API_BASE=https://services.leadconnectorhq.com
# OAuth tokens not needed with Private Integration Token
```

#### Sanity Configuration (Public)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=bxybmggj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_AUTH_TOKEN=[Add your Sanity auth token if needed]
```

#### Mixpanel Configuration
```
NEXT_PUBLIC_MIXPANEL_TOKEN=81a70e969056e31b905499ba402c763b
MIXPANEL_API_SECRET=a696770516e7aa6d4a874472bb4cfc5b
MIXPANEL_PROJECT_ID=3411339
NEXT_PUBLIC_MIXPANEL_ENV=production
```

#### Clerk Authentication (Optional - for future e-commerce)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BsZW5kaWQtbW9jY2FzaW4tNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_QGy5FIDNJA94m5zdmtZ3TdV9Kdb4CoELQ7SUfPpMo7
NEXT_PUBLIC_CLERK_ENABLED=false
```

### Security Notes:

1. **Never commit `.env.local` or `.env.production` files to Git**
   - These files should be in your `.gitignore`
   - They contain sensitive API keys

2. **Keep your GHL tokens secure**
   - Your API token provides full access to your GHL sub-account
   - Rotate tokens periodically for security

3. **OAuth Token Refresh**
   - The system will automatically refresh your GHL access token using the refresh token
   - This ensures continuous operation without manual intervention

### Testing the Integration:

1. **Local Testing**
   - Run `npm run dev` locally
   - Test form submission at `/contact`
   - Check console logs for successful API calls

2. **Production Testing**
   - After deploying to Vercel
   - Submit a test form on your live site
   - Check your GHL sub-account for new contact creation
   - Verify custom fields are populated correctly

### Troubleshooting:

If form submissions fail in production:
1. Check Vercel Function logs for errors
2. Verify all environment variables are set correctly
3. Ensure GHL tokens haven't expired
4. Check that custom field IDs match your GHL configuration

### GHL Sub-Account Details:
- **Sub-Account ID**: GCSgKFx6fTLWG5qmWqeN
- **API Endpoint**: https://services.leadconnectorhq.com
- **OAuth Client ID**: 68a4702c75c1f2caa0aadcde-meikc8zx

### Support:
For GHL API issues, refer to:
- GHL API Documentation: https://highlevel.stoplight.io/
- GHL Support: support@gohighlevel.com