# GHL Workflow Setup Guide - PREVIEW ENVIRONMENT

## ✅ What's Already Done

I've completed the following setup for your preview environment:

1. ✅ **Added Stripe API keys** to Vercel preview environment
2. ✅ **Added Sanity auth token** to Vercel preview environment
3. ✅ **Created Stripe webhook** endpoint (ID: `we_1SPlZ5BzPb7pPFW7ErJWnoCa`)
4. ✅ **Added webhook secret** to Vercel preview environment
5. ✅ **Fixed cron schedule** to run daily (Hobby plan compatible)
6. ✅ **Pushed all code** to `develop/stripe-integration` branch

---

## 🎯 What You Need to Do: Set Up GHL Workflow

Your preview URL is:
```
https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app
```

### Step 1: Create GHL Workflow

1. Go to **GHL → Automations → Workflows**
2. Click **"Create Workflow"**
3. Name it: **"Auto-Sync Products to Stripe (Preview)"**

### Step 2: Add Triggers

Add TWO triggers to the workflow:

**Trigger 1:**
- Type: **"Product"** → **"Product Created"**

**Trigger 2:**
- Type: **"Product"** → **"Product Updated"**

### Step 3: Add Webhook Action

1. Click **"Add Action"**
2. Search for: **"Webhook"** or **"Custom Webhook"**
3. Configure the webhook:

**Webhook URL:**
```
https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app/api/webhooks/ghl-product-sync
```

**Method:** `POST`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body Template:**
```json
{
  "productId": "{{product.id}}",
  "event": "{{trigger.event}}",
  "locationId": "{{location.id}}"
}
```

### Step 4: Save and Activate

1. Click **"Save"** on the workflow
2. **Toggle the workflow ON** (green switch)

---

## 🧪 Testing the Workflow

Once you've set up the GHL workflow, test it:

### Test 1: Create a New Product

1. In GHL, create a new test product:
   - Name: "Test Product"
   - Add 2-3 price variants
   - Add an image
   - Click **"Save"**

2. **Wait 5 seconds**

3. **Check Stripe Dashboard:**
   - Go to https://dashboard.stripe.com/products
   - You should see "Test Product" with all prices

4. **Check Preview Website:**
   - Go to: https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app/products
   - You should see the new product

### Test 2: Update a Price

1. In GHL, edit an existing product
2. Change a price from $100 to $150
3. Click **"Save"**
4. **Wait 5 seconds**
5. Check both Stripe and website - price should be updated

---

## 📊 How It Works

```
YOU: Edit product in GHL → Click "Save"
  ↓ (instant)
GHL Workflow: Triggers webhook to your preview site
  ↓ (1-2 seconds)
Preview Site Middleware: Syncs product + ALL prices to Stripe
  ↓ (instant)
Stripe: Updates product + prices
  ↓ (instant - webhook)
Stripe Webhook: Notifies preview site
  ↓ (instant)
Preview Site: Updates Sanity CMS
  ↓
DONE: Product live on preview website (3-5 seconds total)
```

---

## 🚨 Troubleshooting

### Workflow Not Triggering

**Check:**
- Workflow is activated (green toggle in GHL)
- Webhook URL is exactly: `https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app/api/webhooks/ghl-product-sync`
- No typos in the URL

**Test Manually:**
You can test the webhook manually by running this command:

```bash
curl -X POST https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app/api/webhooks/ghl-product-sync \
  -H "Content-Type: application/json" \
  -d '{"productId": "690975a8a93f25750e68b266"}'
```

### Prices Not Syncing

1. Check GHL workflow execution history (in GHL workflows dashboard)
2. Look for any error messages
3. Verify all environment variables are set in Vercel

### Website Not Updating

1. Check Stripe webhook delivery attempts:
   - Go to https://dashboard.stripe.com/webhooks
   - Click on your webhook endpoint
   - Check "Recent events" tab

2. Look for failed deliveries and error messages

---

## 🎉 When Preview Works: Deploy to Production

Once you've tested everything on preview and it works:

1. **Merge to main branch:**
   ```bash
   git checkout main
   git merge develop/stripe-integration
   git push origin main
   ```

2. **Add environment variables to Production:**
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - SANITY_AUTH_TOKEN

3. **Create new Stripe webhook for production:**
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Add STRIPE_WEBHOOK_SECRET to production environment

4. **Update GHL workflow:**
   - Change webhook URL to production: `https://yourdomain.com/api/webhooks/ghl-product-sync`

---

## 📝 Environment Variables Summary

All these have been added to your Vercel **Preview** environment:

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe API authentication |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side key |
| `STRIPE_WEBHOOK_SECRET` | Verify Stripe webhook signatures |
| `SANITY_AUTH_TOKEN` | Update Sanity CMS |
| `GHL_ACCESS_TOKEN` | (Already existed) Fetch products from GHL |
| `GHL_API_BASE` | (Already existed) GHL API base URL |
| `GHL_LOCATION_ID` | (Already existed) Your GHL location |

---

## 🔗 Useful Links

- **Preview Site:** https://iliosauna-next-jsmp9dqrd-keithlemay85-3936s-projects.vercel.app
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks
- **Vercel Dashboard:** https://vercel.com/keithlemay85-3936s-projects/iliosauna-next

---

## ⏱️ Expected Performance

| Action | Time to Stripe | Time to Website | Total |
|--------|----------------|-----------------|-------|
| Create product | 1-2 seconds | 1-2 seconds | **3-5 seconds** |
| Update price | 1-2 seconds | 1-2 seconds | **3-5 seconds** |
| Update product | 1-2 seconds | 1-2 seconds | **3-5 seconds** |

---

**Questions?** Let me know if you run into any issues! 🚀
