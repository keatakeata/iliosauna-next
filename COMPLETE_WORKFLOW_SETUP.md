# Complete Automated Workflow Setup

## 🎯 Your Desired Workflow

```
YOU: Create/edit product in GHL → Click "Save"
   ↓ (instant)
GHL Workflow: Triggers webhook
   ↓ (1-2 seconds)
MIDDLEWARE: Syncs product + prices to Stripe
   ↓ (instant)
STRIPE: Updates product + prices
   ↓ (instant - webhook)
WEBSITE: Updates automatically
   ↓
DONE: Product live on website with correct prices
```

**Total time: 3-5 seconds from save to live**

---

## 🚀 Setup Steps

### Step 1: Deploy Your Website

Your website needs to be publicly accessible for webhooks to work.

```bash
git add .
git commit -m "Add automated GHL → Stripe → Website sync"
git push
```

Vercel will auto-deploy. Note your production URL (e.g., `https://yourdomain.com`)

---

### Step 2: Set Up GHL Workflow (CRITICAL)

This is what replaces the missing "Sync to Stripe" button.

#### A. Create Workflow in GHL

1. Go to **Automations → Workflows** in GHL
2. Click **"Create Workflow"**
3. Name it: **"Auto-Sync Products to Stripe"**

#### B. Add Trigger

1. Click **"Add Trigger"**
2. Select: **"Product"** → **"Product Created"**
3. Also add another trigger: **"Product"** → **"Product Updated"**

#### C. Add Webhook Action

1. Click **"Add Action"**
2. Search for: **"Webhook"** or **"Custom Webhook"**
3. Configure:

**Webhook URL:**
```
https://yourdomain.com/api/webhooks/ghl-product-sync
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

4. **Save** the workflow
5. **Activate** the workflow (toggle on)

---

### Step 3: Set Up Stripe Webhook

This handles Stripe → Website updates.

#### A. In Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Navigate to **Developers → Webhooks**
3. Click **"+ Add endpoint"**

#### B. Configure Endpoint

**Endpoint URL:**
```
https://yourdomain.com/api/webhooks/stripe
```

**Events to send:**
- ✅ `product.created`
- ✅ `product.updated`
- ✅ `product.deleted`
- ✅ `price.created`
- ✅ `price.updated`
- ✅ `price.deleted`

#### C. Get Webhook Secret

1. Click on your new endpoint
2. Under "Signing secret", click **"Reveal"**
3. Copy the secret (starts with `whsec_`)

---

### Step 4: Add Environment Variables to Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings → Environment Variables**
3. Add:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

4. **Redeploy** your site

---

### Step 5: Test the Complete Flow

#### Test 1: Create New Product

1. In GHL, create a new product:
   - Name: "Test Product"
   - Add prices for variants
   - Add images
   - Click **"Save"**

2. **Check logs:**
   - Vercel logs should show: `[GHL WEBHOOK] Syncing product`
   - Then: `[STRIPE WEBHOOK] Received event: product.created`

3. **Check website:**
   - Product should appear within 5 seconds

#### Test 2: Update Price

1. In GHL, edit existing product
2. Change a price from $100 to $150
3. Click **"Save"**

4. **Verify:**
   - Check Stripe dashboard - price should update
   - Check website - should show $150 within 5 seconds

---

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    YOU EDIT PRODUCT IN GHL                   │
│                     (Save button clicked)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   GHL WORKFLOW TRIGGERS                      │
│              (Product Created/Updated event)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│            WEBHOOK: /api/webhooks/ghl-product-sync          │
│                    (Your Middleware)                         │
│                                                              │
│  1. Fetches product from GHL                                │
│  2. Fetches all prices from GHL                             │
│  3. Creates/updates product in Stripe                       │
│  4. Creates/updates all prices in Stripe                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  STRIPE PRODUCT + PRICES                     │
│                    (All data synced)                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              STRIPE WEBHOOK TRIGGERS                         │
│           (price.updated or product.updated)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              WEBHOOK: /api/webhooks/stripe                   │
│                  (Updates your website)                      │
│                                                              │
│  1. Receives Stripe event                                   │
│  2. Fetches updated product + prices from Stripe            │
│  3. Updates Sanity CMS                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  WEBSITE UPDATED                             │
│             (Product live with correct prices)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue: GHL workflow not triggering

**Check:**
- Workflow is activated (green toggle)
- Webhook URL is correct (https, not http)
- Your site is deployed (not localhost)

**Test manually:**
```bash
curl -X POST https://yourdomain.com/api/webhooks/ghl-product-sync \
  -H "Content-Type: application/json" \
  -d '{"productId": "690975a8a93f25750e68b266"}'
```

### Issue: Prices not syncing

**Check Vercel logs:**
```
[GHL WEBHOOK] Fetched X prices
[GHL WEBHOOK] Created price: ...
```

If you see errors, check that:
- `GHL_ACCESS_TOKEN` is set in Vercel
- `STRIPE_SECRET_KEY` is set in Vercel

### Issue: Website not updating

**Check Stripe webhook:**
- Go to Stripe Dashboard → Developers → Webhooks → [Your endpoint]
- Check "Recent events" tab
- Look for failed deliveries

**Check Vercel logs:**
```
[STRIPE WEBHOOK] Received event: price.updated
[STRIPE WEBHOOK] Updated product in Sanity
```

---

## ✅ Verification Checklist

Before going live:

- [ ] Website deployed to production
- [ ] GHL workflow created and activated
- [ ] GHL webhook pointing to your domain
- [ ] Stripe webhook configured with all events
- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel
- [ ] Test product created successfully
- [ ] Test price update works
- [ ] Logs show successful sync

---

## 🎯 Expected Results

**After setup:**

| Action in GHL | Time to Stripe | Time to Website | Total |
|---------------|----------------|-----------------|-------|
| Create product | 1-2 seconds | 1-2 seconds | **3-5 seconds** |
| Update price | 1-2 seconds | 1-2 seconds | **3-5 seconds** |
| Update product | 1-2 seconds | 1-2 seconds | **3-5 seconds** |

---

## 💡 Why This Works

**The Problem:**
- GHL's native Stripe integration syncs products but NOT prices
- This is why you saw the "Sync to Stripe" button disappear

**The Solution:**
- GHL Workflow triggers our middleware webhook
- Middleware pulls complete product data (including prices) from GHL
- Middleware pushes everything to Stripe
- Stripe webhook notifies website
- Website updates instantly

**Result:**
- Fully automated
- No manual sync needed
- 3-5 second update time
- Works for create, update, and price changes

---

## 📞 Support

If you run into issues:

1. Check Vercel logs (most common issues show here)
2. Check GHL workflow execution history
3. Check Stripe webhook delivery attempts
4. Verify all environment variables are set

Your workflow is now bulletproof! 🎉
