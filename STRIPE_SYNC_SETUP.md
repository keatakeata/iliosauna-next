# Stripe Automatic Price Sync Setup ⚡

**RECOMMENDED APPROACH**: Using Stripe as the source of truth for product pricing.

This integration provides **instant price updates** when you change prices in GHL, since GHL syncs directly to Stripe, and Stripe webhooks update your website in real-time.

---

## 🎯 How It Works

```
GHL Product Created/Updated
         ↓
    Stripe Product Created/Updated (GHL native integration)
         ↓
    Stripe Webhook Triggered
         ↓
    Your Website Updated (INSTANT)
```

**Update time:** Within 1-3 seconds of changing price in GHL

---

## 📋 Setup Steps

### Step 1: Enable GHL → Stripe Integration

This is likely already set up if you're using Stripe for payments in GHL.

1. In GoHighLevel: **Settings > Integrations > Payments**
2. Connect your Stripe account
3. Enable "Sync products to Stripe" (if available)

When you create/update products in GHL, they automatically sync to Stripe.

---

### Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

---

### Step 3: Set Up Stripe Webhook

#### 3a. Add Endpoint in Stripe Dashboard

1. Go to **Developers > Webhooks**
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

4. Click **"Select events"** and choose these 6 events:
   - ✅ `product.created`
   - ✅ `product.updated`
   - ✅ `product.deleted`
   - ✅ `price.created`
   - ✅ `price.updated`
   - ✅ `price.deleted`

5. Click **"Add endpoint"**

#### 3b. Get Webhook Signing Secret

1. After creating the endpoint, click on it
2. Under "Signing secret", click **"Reveal"**
3. Copy the secret (starts with `whsec_`)

---

### Step 4: Add Environment Variables

Add these to your Vercel environment variables:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # From webhook endpoint

# Existing variables (keep these)
SANITY_AUTH_TOKEN=your-sanity-token
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

**To add in Vercel:**
1. Go to your project in Vercel dashboard
2. Settings > Environment Variables
3. Add each variable
4. Redeploy your site

---

### Step 5: Test the Integration

#### Test 1: Create a Test Product in GHL

1. Create a new product in GHL
2. Set a price (e.g., $99.00)
3. Wait 1-2 minutes for GHL → Stripe sync
4. Check if product appears on your website

#### Test 2: Update a Price

1. In GHL, edit an existing product price
2. Change from $100 to $150
3. Within 1-3 seconds, check your website
4. Price should be updated automatically

#### Test 3: Monitor Webhook Logs

In Vercel dashboard:
- Go to **Deployments > Functions > `/api/webhooks/stripe`**
- Check logs for:
  ```
  [STRIPE WEBHOOK] Received event: price.updated
  [STRIPE WEBHOOK] Syncing product: Product Name
  [STRIPE WEBHOOK] Updated product in Sanity
  ```

---

## 🔧 Local Development Testing

### Test Webhooks Locally with Stripe CLI

1. **Install Stripe CLI:**
   ```bash
   # Windows (with Scoop)
   scoop install stripe

   # Mac
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost:**
   ```bash
   stripe listen --forward-to localhost:4448/api/webhooks/stripe
   ```

   This will display a webhook signing secret starting with `whsec_`. Add it to your `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

4. **Trigger a test event:**
   ```bash
   stripe trigger product.updated
   stripe trigger price.updated
   ```

5. **Check your terminal** for webhook logs

---

## 📊 What Gets Synced

From Stripe to your website:

| Stripe Field | Website Field | Notes |
|-------------|---------------|-------|
| Product Name | Product Name | Direct sync |
| Product Description | Description | Direct sync |
| Product Images | Images | All images synced |
| Prices | Variants | Each Stripe price = 1 variant |
| Price Amount | Price | Converted from cents to dollars |
| Product Active | In Stock | Active = in stock |
| Product Metadata | Various fields | See metadata mapping below |

### Metadata Mapping

You can add these fields to Stripe product metadata for better control:

| Metadata Key | Purpose | Example |
|-------------|---------|---------|
| `ghlProductId` | Link to GHL product | `690975a8a93f25750e68b266` |
| `slug` | Custom URL slug | `cedar-sauna-bucket` |
| `category` | Product category | `saunas`, `wellness` |
| `collection` | Product collection | `Premium Line` |
| `features` | JSON array of features | `["Cedar", "Handcrafted"]` |
| `ghlVariants` | JSON of variant options | See GHL variants structure |
| `seoTitle` | SEO page title | `Premium Cedar Bucket` |
| `seoDescription` | SEO meta description | `Handcrafted cedar...` |
| `badge` | Product badge | `Featured`, `New` |
| `stockCount` | Inventory count | `10` |

---

## 🚨 Troubleshooting

### Webhooks Not Firing?

1. **Check Webhook Status in Stripe:**
   - Go to Developers > Webhooks
   - Click on your endpoint
   - Check "Recent events" tab
   - Look for failed events

2. **Common Issues:**
   - ❌ Webhook URL not publicly accessible (local dev?)
   - ❌ Wrong webhook secret in environment variables
   - ❌ Endpoint returns errors (check Vercel logs)

3. **Test Webhook Manually:**
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/stripe \
     -H "stripe-signature: test" \
     -H "Content-Type: application/json" \
     -d '{"type":"product.updated","data":{"object":{"id":"prod_test"}}}'
   ```

### Prices Not Updating?

1. **Verify GHL → Stripe sync is working:**
   - Check Stripe dashboard
   - Look for product in Products section
   - Verify price matches GHL

2. **Check Sanity Studio:**
   - Go to Sanity Studio
   - Find the product
   - Check if `stripeProductId` field is populated
   - Check if `stripePriceId` is in variants

3. **Manual Resync:**
   If you need to force a sync, trigger webhook manually:
   ```bash
   # Use Stripe CLI
   stripe trigger product.updated --override product:id=prod_YOUR_PRODUCT_ID
   ```

### Webhook Signature Verification Failed?

- **Cause:** Wrong webhook secret
- **Fix:**
  1. Go to Stripe Dashboard > Developers > Webhooks
  2. Click your endpoint
  3. Reveal signing secret again
  4. Update `STRIPE_WEBHOOK_SECRET` in Vercel
  5. Redeploy

---

## 🎯 Best Practices

### 1. Use Stripe as Single Source of Truth

- ✅ Edit prices in GHL (syncs to Stripe automatically)
- ✅ Or edit directly in Stripe dashboard
- ❌ Don't edit prices in Sanity Studio manually

### 2. Add Metadata for Better Control

When creating products in GHL, add this info so it syncs to Stripe:
- Product description (becomes Stripe description)
- Product images (become Stripe images)
- Variants (become Stripe prices)

### 3. Monitor Webhook Health

Set up Stripe webhook monitoring:
- Go to Developers > Webhooks > [Your endpoint]
- Enable "Webhook incident alerts"
- Add your email

### 4. Test Before Production

Always test price changes in Stripe test mode first:
1. Use test API keys (`sk_test_`, `whsec_test_`)
2. Create test products
3. Verify webhooks work correctly
4. Then switch to production keys

---

## 💰 Cost

- **Stripe API:** Free
- **Webhooks:** Free
- **GHL → Stripe sync:** Included with GHL

No additional costs for this integration!

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Stripe account connected to GHL
- [ ] Products in GHL sync to Stripe
- [ ] Webhook endpoint added in Stripe dashboard
- [ ] All 6 events selected (product.*, price.*)
- [ ] `STRIPE_SECRET_KEY` added to Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel
- [ ] Site redeployed after adding env vars
- [ ] Test product created in GHL appears on website
- [ ] Test price change updates within 3 seconds
- [ ] Webhook logs show successful processing

---

## 📚 Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [GoHighLevel Stripe Integration](https://help.gohighlevel.com/support/solutions/articles/155000003180)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## 🆘 Need Help?

If you run into issues:

1. Check Vercel function logs
2. Check Stripe webhook delivery attempts
3. Verify environment variables are set correctly
4. Test webhook with Stripe CLI locally

The webhook endpoint includes detailed logging for debugging:
- `[STRIPE WEBHOOK] Received event: {type}`
- `[STRIPE WEBHOOK] Syncing product: {name}`
- `[STRIPE WEBHOOK] Updated product in Sanity`
