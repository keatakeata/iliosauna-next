# GoHighLevel → Stripe Product Sync Setup Guide

## 🔍 Current Status

**What I Found:**
- ✅ 3 products in GoHighLevel
- ✅ 2 products in Stripe (manually created)
- ❌ No Stripe IDs in GHL products
- ❌ No prices in Stripe products

**This means:** GHL → Stripe sync is not enabled yet.

---

## 🎯 Goal

Enable automatic sync so that when you:
1. Create a product in GHL
2. Add pricing/variants in GHL
3. Update product details in GHL

**Result:** Changes automatically sync to Stripe, which then updates your website via webhook (1-3 seconds).

---

## 📋 Setup Steps

### Step 1: Enable Stripe Integration in GHL

#### Option A: Via Payments Integration (Most Common)

1. **In GoHighLevel**, go to:
   ```
   Settings → Integrations → Payments
   ```

2. **Connect Stripe:**
   - Click "Connect" or "Add Integration" for Stripe
   - You'll be redirected to Stripe to authorize the connection
   - Use these credentials when prompted:
     - Stripe account email: [your Stripe email]
     - Authorization: Allow GoHighLevel to access your Stripe account

3. **After connecting**, look for these options:
   - ✅ **"Sync products to Stripe"** (enable this)
   - ✅ **"Sync prices automatically"** (enable this if available)
   - ✅ **"Use Stripe for product checkout"** (optional, for later)

#### Option B: Via Funnels & Websites Settings

1. Go to:
   ```
   Funnels & Websites → Settings → Payments
   ```

2. Enable Stripe integration
3. Look for product sync options

#### Option C: Via Store Settings (If you have GHL Store)

1. Go to:
   ```
   Sites → Stores → Settings → Payment Gateway
   ```

2. Select Stripe
3. Enable product synchronization

---

### Step 2: Manually Link Existing Products (One-Time Setup)

Since you already have products in both GHL and Stripe, you need to link them:

#### In GHL Product Editor:

1. **Go to:** Products → [Select a product]
2. **Look for fields like:**
   - "Stripe Product ID"
   - "External Product ID"
   - "Payment Gateway Product ID"
3. **Add the Stripe Product ID:**
   - For "Ilio Cedar Sauna Bucket & Ladle Set": `prod_TMP4wNLUwYXDBm`
   - For "Ilio Sauna": `prod_TMP4hlKGVpcroG`

If these fields don't exist, the products will be duplicated in Stripe when sync is enabled (which is okay - you can delete the manual ones later).

---

### Step 3: Add Prices to Products in GHL

This is **critical** - prices must be set in GHL for the sync to work:

1. **Go to:** Products → [Select product]
2. **Add pricing:**
   - If you have variants: Create a price for each variant combination
   - If simple product: Add a base price

**Example for "Ilio Cedar Sauna Bucket & Ladle Set":**

Since this product has **36 variant combinations** (3 wood finishes × 2 sizes × 3 bundle types × 2 handle types), you need to:

**Option A: Use Price Matrix (Recommended)**
- GHL should have a pricing matrix for variants
- Set base price: $195.00
- Add price adjustments for variants (e.g., +$50 for Large, +$100 for Walnut)

**Option B: Set Individual Prices**
- Go to each variant combination
- Set specific prices (e.g., "Dark Walnut / Standard (5L) / Bucket Only / Rope Handle" = $300)

---

### Step 4: Test the Sync

#### Test 1: Create New Product

1. In GHL, create a test product:
   - Name: "Test Product - Delete Me"
   - Price: $50.00
   - Add image
   - Mark as "Available in store"

2. Save the product

3. **Check Stripe** (within 1-2 minutes):
   - Go to Stripe Dashboard → Products
   - Look for "Test Product - Delete Me"
   - Verify it has a price attached

4. **Check your website** (within 3 seconds after Stripe sync):
   - Product should appear automatically

#### Test 2: Update Price

1. In GHL, edit an existing product
2. Change price from $195 to $199
3. Save

4. **Check Stripe** (1-2 minutes)
5. **Check your website** (3 seconds after Stripe updates)

---

### Step 5: Bulk Sync Existing Products (If Needed)

If GHL doesn't automatically sync existing products:

1. **In GHL:**
   - Go to each product
   - Make a small edit (add a space to description)
   - Save
   - This triggers the sync

2. **Or look for bulk sync:**
   - Some GHL accounts have "Sync all products to Stripe" button
   - Usually in Settings → Integrations → Payments

---

## 🚨 Common Issues & Solutions

### Issue 1: "Stripe not appearing in Integrations"

**Solution:**
- Check your GHL plan - Stripe integration requires certain plan levels
- Contact GHL support to enable payments features

### Issue 2: "Products sync but no prices"

**Solution:**
- Verify each product has a price set in GHL
- For variant products, ensure price matrix is configured
- Check that variant combinations all have prices

### Issue 3: "Duplicate products in Stripe"

**Solution:**
- Delete manually created products in Stripe
- Let GHL create fresh ones
- Or manually add Stripe product IDs to GHL products (Step 2 above)

### Issue 4: "Sync takes too long (>5 minutes)"

**Solution:**
- This is normal for first-time sync
- Subsequent updates are faster (1-2 minutes)
- Your website webhook will still update instantly once Stripe receives the data

---

## 🔧 Alternative: Manual Workflow (Temporary)

If GHL → Stripe sync isn't available or doesn't work:

### Workflow:
1. Create product in GHL
2. Create matching product in Stripe manually
3. Add prices in Stripe for each variant
4. Add Stripe product ID to product metadata in Stripe:
   ```json
   {
     "ghlProductId": "690975a8a93f25750e68b266",
     "slug": "ilio-cedar-sauna-bucket-ladle-set"
   }
   ```
5. Your website webhook will pick it up automatically

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Stripe connected in GHL Integrations
- [ ] Product sync enabled
- [ ] Existing products linked (Stripe IDs added to GHL)
- [ ] All products have prices in GHL
- [ ] Test product created in GHL → appeared in Stripe
- [ ] Test price change in GHL → updated in Stripe
- [ ] Webhook configured (from previous STRIPE_SYNC_SETUP.md)
- [ ] Product appears on website after Stripe sync

---

## 📞 Need Help?

**GHL Support:**
- In GoHighLevel: Support icon (bottom right)
- Ask: "How do I enable Stripe product synchronization?"

**Check GHL Documentation:**
- https://help.gohighlevel.com
- Search: "Stripe product sync" or "Stripe integration"

**Check Your GHL Plan:**
- Some features require specific plan levels
- Payments/Products features may need Business or Agency plan

---

## 🎯 Expected Results After Setup

**When you change a price in GHL:**
```
1. GHL saves change (instant)
2. GHL syncs to Stripe (1-2 minutes)
3. Stripe webhook fires (instant)
4. Website updates (1-3 seconds)
```

**Total time from GHL edit → Website update:**
**~1-2 minutes** (mostly waiting for GHL → Stripe sync)

This is much faster than hourly cron sync, and fully automatic!

---

## 📝 Current Products Mapping

| GHL Product | GHL ID | Stripe Product | Stripe ID | Status |
|-------------|--------|----------------|-----------|--------|
| Ilio Cedar Sauna Bucket & Ladle Set | 690975a8a93f25750e68b266 | Ilio Cedar Sauna Bucket & Ladle Set | prod_TMP4wNLUwYXDBm | ⚠️ No prices |
| Ilio Sauna | 686dc63a1c814ac7b1ffcd59 | Ilio Sauna | prod_TMP4hlKGVpcroG | ⚠️ No prices |
| Ilio Himalayan Salt Sauna Lamp | 6909c8a123816619134e89bb | [Not in Stripe yet] | - | ❌ Not synced |

**Next Action:** Set prices in GHL for all products, then enable sync.
