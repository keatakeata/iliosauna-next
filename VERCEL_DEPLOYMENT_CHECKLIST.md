# Vercel Deployment Checklist 🚀

## ✅ Code Successfully Pushed to GitHub
Commit: `6207adb` - Major Production Release: Complete Site Overhaul with GHL Integration

## 📋 Required Vercel Environment Variables

### 1. GoHighLevel (GHL) - CRITICAL
```
GHL_ACCESS_TOKEN=pit-38be6539-4649-4fa4-b724-27b6c5876150
GHL_LOCATION_ID=GCSgKFx6fTLWG5qmWqeN
GHL_API_BASE=https://services.leadconnectorhq.com
```

### 2. Sanity CMS
```
NEXT_PUBLIC_SANITY_PROJECT_ID=bxybmggj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_AUTH_TOKEN=[Get from Sanity dashboard if needed]
```

### 3. Mixpanel Analytics
```
NEXT_PUBLIC_MIXPANEL_TOKEN=81a70e969056e31b905499ba402c763b
MIXPANEL_API_SECRET=a696770516e7aa6d4a874472bb4cfc5b
MIXPANEL_PROJECT_ID=3411339
NEXT_PUBLIC_MIXPANEL_ENV=production
```

### 4. Clerk (Optional - Currently Disabled)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BsZW5kaWQtbW9jY2FzaW4tNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_QGy5FIDNJA94m5zdmtZ3TdV9Kdb4CoELQ7SUfPpMo7
NEXT_PUBLIC_CLERK_ENABLED=false
```

## 🔧 Vercel Settings to Verify

1. **Node Version**: 20.x or latest LTS
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Install Command**: `npm install`
5. **Root Directory**: `/` (default)

## 🌐 Routes to Test After Deployment

- `/` - Homepage
- `/saunas` - Saunas catalog
- `/our-story` - About page
- `/journal` - Blog listing
- `/journal/[slug]` - Individual blog posts
- `/contact` - Contact form (GHL integration)
- `/studio` - Sanity CMS Studio

## ✨ New Features Working in Production

1. **GHL Integration**
   - Contact form creates leads in GHL
   - 14 custom fields mapped
   - Intelligent tagging based on interests
   - Permanent PIT token (never expires)

2. **Sanity CMS**
   - Studio accessible at `/studio`
   - Content management for all pages
   - Blog post creation and editing

3. **Share Buttons**
   - Instant color change on hover (no animation)
   - Dark brown (#3D2914) default
   - Brand colors on hover

4. **MCP Configuration**
   - GHL API configured in `.mcp.json`
   - Ready for advanced integrations

## 🔍 Post-Deployment Verification

1. Check Vercel deployment logs for any errors
2. Test contact form submission
3. Verify all pages load correctly
4. Check Sanity Studio access
5. Confirm analytics tracking
6. Test mobile responsiveness

## 📞 Support Contacts

- **GHL Support**: support@gohighlevel.com
- **Sanity Support**: https://www.sanity.io/contact
- **Vercel Support**: https://vercel.com/support

## 🎉 Deployment Status

Vercel will automatically deploy when it detects the push to the main branch.
Check your Vercel dashboard at: https://vercel.com/dashboard

The deployment typically takes 2-5 minutes. You'll receive an email when it's complete!