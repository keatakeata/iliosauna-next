# 🚀 Iliosauna Production Deployment Guide

## Current Status
- ✅ Next.js app running locally
- ✅ Clerk authentication configured
- ✅ Supabase database connected
- ✅ Mixpanel analytics integrated
- ✅ GHL CRM integration ready
- ⏳ Ready for Vercel deployment

## 📋 Pre-Deployment Checklist

### 1. Clean Up Files
- [ ] Remove test pages (/test-analytics)
- [ ] Remove unused dependencies
- [ ] Clean up console.logs
- [ ] Optimize images

### 2. Environment Variables Needed
```env
# PRODUCTION VALUES - Add these to Vercel

# Clerk Auth (already have)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database (already have)
NEXT_PUBLIC_SUPABASE_URL=https://tptazvskawowdimgmmkt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Mixpanel Analytics (already have)
NEXT_PUBLIC_MIXPANEL_TOKEN=81a70e969056e31b905499ba402c763b
MIXPANEL_API_SECRET=a696770516e7aa6d4a874472bb4cfc5b
NEXT_PUBLIC_MIXPANEL_ENV=production  # Change from development

# Sanity CMS (already have)
NEXT_PUBLIC_SANITY_PROJECT_ID=bxybmggj
NEXT_PUBLIC_SANITY_DATASET=production

# GHL Integration (already have)
GHL_CLIENT_ID=68a4702c75c1f2caa0aadcde-meikc8zx
GHL_CLIENT_SECRET=007591a0-aec3-441e-b194-083a0644bb3d
GHL_LOCATION_ID=GCSgKFx6fTLWG5qmWqeN

# Update for production
NEXT_PUBLIC_URL=https://iliosauna.com  # Your domain
```

## 🎯 Deployment Steps

### Step 1: Prepare Git Repository
```bash
# Initialize git if not already
git init

# Add .gitignore
git add .
git commit -m "Initial production-ready commit"

# Create GitHub repository
# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/iliosauna-next.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: iliosauna-next
   - Build Command: `npm run build`
   - Install Command: `npm install`

### Step 3: Add Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable from the list above
3. Make sure to change `NEXT_PUBLIC_MIXPANEL_ENV` to `production`

### Step 4: Configure Custom Domain
1. Go to Project Settings → Domains
2. Add `iliosauna.com` and `www.iliosauna.com`
3. Update DNS records at your domain registrar:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

### Step 5: Update Clerk Production Settings
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Add production URLs:
   - Frontend API: https://iliosauna.com
   - Allowed Redirect URLs: https://iliosauna.com/*
3. Get production keys and update in Vercel

### Step 6: Configure Supabase for Production
1. Go to Supabase → Settings → API
2. Add your domain to allowed URLs
3. Enable Row Level Security on all tables
4. Review and tighten security rules

## 📁 Project Structure (Cleaned)

```
iliosauna-next/
├── src/
│   ├── app/                 # Next.js app routes
│   │   ├── (auth)/          # Auth pages
│   │   ├── api/             # API routes
│   │   └── [pages]/         # Main pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts     # Database
│   │   ├── analytics.ts    # Mixpanel
│   │   └── luxury-tracking.ts # Custom tracking
│   └── styles/              # CSS files
├── public/                  # Static assets
├── docs/                    # Documentation (NEW)
│   ├── DEPLOYMENT.md
│   ├── DATABASE_SCHEMA.md
│   ├── TRACKING_EVENTS.md
│   └── API_REFERENCE.md
├── .env.local              # Local environment
├── .env.production         # Production environment
└── package.json

DELETE These Old Files:
- /test-analytics page
- Old HTML files in root
- Duplicate documentation
- Backup folders
```

## 🔍 Post-Deployment Verification

### Immediate Tests:
- [ ] Homepage loads
- [ ] Sign in/up works
- [ ] Analytics tracking (check Mixpanel)
- [ ] Database connections (check Supabase)
- [ ] Contact form submission
- [ ] Cart functionality

### Monitor First 24 Hours:
- [ ] Page load speeds
- [ ] Error tracking
- [ ] User sign-ups
- [ ] Analytics data flow
- [ ] SSL certificate active

## 🛠️ Production Optimizations

### Performance:
```javascript
// Add to next.config.js
module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Security Headers:
```javascript
// Add to next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options', 
    value: 'nosniff'
  }
]
```

## 📊 Analytics & Monitoring Setup

### 1. Vercel Analytics (Free):
- Enable in Vercel dashboard
- Tracks Core Web Vitals

### 2. Mixpanel Dashboards to Create:
- Daily Active Users
- Conversion Funnel
- Lead Scoring Report
- Product Interest Heat Map

### 3. Supabase Monitoring:
- Enable slow query logging
- Set up database backups
- Monitor storage usage

## 🔄 Continuous Deployment

After initial deployment:
```bash
# Future updates
git add .
git commit -m "Update: [description]"
git push origin main
# Vercel auto-deploys from main branch
```

## 🚨 Emergency Rollback

If something breaks:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find last working deployment
4. Click "..." → "Promote to Production"

## 📞 Support Contacts

- **Vercel Support**: support@vercel.com
- **Clerk Support**: support@clerk.dev
- **Supabase Support**: support@supabase.io
- **Domain Registrar**: [Your registrar support]

## 🎉 Launch Checklist

### Pre-Launch (1 hour before):
- [ ] Test all forms
- [ ] Check mobile responsive
- [ ] Verify analytics tracking
- [ ] Test checkout flow
- [ ] Check email notifications

### Launch:
- [ ] Update DNS records
- [ ] Announce on social media
- [ ] Monitor error logs
- [ ] Watch analytics real-time
- [ ] Test from different devices

### Post-Launch (First Week):
- [ ] Daily analytics review
- [ ] Check for 404 errors
- [ ] Monitor page speeds
- [ ] Review user feedback
- [ ] Optimize based on data

## 💾 Backup Strategy

1. **Code**: GitHub (automatic)
2. **Database**: Supabase daily backups
3. **Content**: Sanity version history
4. **Analytics**: Mixpanel data export monthly

---

## Ready to Deploy? 

Start with Step 1: Prepare Git Repository

Domain: iliosauna.com
Estimated Time: 30-60 minutes
Status: READY FOR PRODUCTION