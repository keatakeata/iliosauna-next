# Automatic Product Sync Setup Guide

## Goal
When you create a product in GoHighLevel (GHL) and check "Include in Online Store", it should **automatically appear on the website** within seconds - no manual work required!

## How It Works

1. You create a product in GHL with "Include in Online Store" ✓
2. GHL sends a webhook to your website
3. Your website automatically creates the product in Sanity
4. Product appears on iliosauna.com/products instantly

## Setup Instructions

### Step 1: Get Your Webhook URL

**For Production (Live Website):**
```
https://iliosauna.com/api/ghl/products
```

**For Development/Testing:**
```
http://localhost:4448/api/ghl/products
```

### Step 2: Set Up Webhooks in GHL

1. **Log into your GoHighLevel account**

2. **Navigate to Settings**
   - Click on **Settings** in the left sidebar
   - Go to **Integrations** → **Webhooks**
   - (Or it might be under **Business Settings** → **Integrations** → **Webhooks**)

3. **Create Webhook for Product Created**
   - Click **"Create Webhook"** or **"Add Webhook"**
   - Fill in the details:
     - **Name**: `ilio Sauna - Product Create`
     - **Event Type**: Select **"Product Created"** or **"product.created"**
     - **Webhook URL**: `https://iliosauna.com/api/ghl/products`
     - **Method**: **POST**
     - **Headers**: Add a custom header:
       - Header Name: `Authorization`
       - Header Value: `Bearer pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5`
   - Click **Save**

4. **Create Webhook for Product Updated**
   - Click **"Create Webhook"** again
   - Fill in:
     - **Name**: `ilio Sauna - Product Update`
     - **Event Type**: Select **"Product Updated"** or **"product.updated"**
     - **Webhook URL**: `https://iliosauna.com/api/ghl/products`
     - **Method**: **POST**
     - **Headers**:
       - Header Name: `Authorization`
       - Header Value: `Bearer pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5`
   - Click **Save**

5. **Create Webhook for Product Deleted**
   - Click **"Create Webhook"** again
   - Fill in:
     - **Name**: `ilio Sauna - Product Delete`
     - **Event Type**: Select **"Product Deleted"** or **"product.deleted"**
     - **Webhook URL**: `https://iliosauna.com/api/ghl/products`
     - **Method**: **DELETE** (or POST if DELETE isn't available)
     - **Headers**:
       - Header Name: `Authorization`
       - Header Value: `Bearer pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5`
   - Click **Save**

### Step 3: Test the Integration

1. **Create a Test Product in GHL:**
   - Go to **Payments** → **Products** in GHL
   - Click **"Create Product"**
   - Fill in product details:
     - Name: "Test Product"
     - Price: $99
     - Description: "This is a test"
     - **✓ Check "Include in Online Store"** (IMPORTANT!)
   - Upload an image
   - Click **Save**

2. **Check Your Website:**
   - Go to https://iliosauna.com/products
   - The test product should appear within 5-10 seconds!
   - If it doesn't appear, check the webhook logs in GHL

3. **Delete the Test Product:**
   - Delete the test product in GHL
   - It should disappear from the website

## Important Notes

### "Include in Online Store" Checkbox
- **IMPORTANT**: Products will ONLY sync to the website if "Include in Online Store" is checked in GHL
- Unchecked products will be ignored

### Product Updates
- Any changes to products in GHL (price, description, images) will automatically update on the website
- Changes appear within seconds

### Product Images
- Make sure to upload product images in GHL
- Multiple images are supported

### Categories
- Use GHL's product type field to set categories:
  - `saunas` - For saunas
  - `infrared` - For infrared products
  - `cold-therapy` - For cold plunge products
  - `wellness` - For general wellness products

## Troubleshooting

### Products Not Appearing?

1. **Check Webhook Status in GHL:**
   - Go to Settings → Integrations → Webhooks
   - Look for error messages or failed deliveries
   - Check the webhook logs

2. **Verify "Include in Online Store" is Checked:**
   - Edit the product in GHL
   - Make sure the checkbox is ✓ checked

3. **Check Webhook URL:**
   - Make sure you're using `https://iliosauna.com/api/ghl/products`
   - NOT `http://` (use HTTPS!)

4. **Verify Authorization Header:**
   - Make sure the header is exactly:
     ```
     Authorization: Bearer pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5
     ```

5. **Test Manually:**
   - Run the sync script: `node sync-ghl-products.js`
   - This will fetch all products from GHL and sync them

### View Webhook Logs

In GHL:
- Go to Settings → Integrations → Webhooks
- Click on your webhook
- View delivery logs
- Look for successful (200) or failed (4xx, 5xx) responses

### Check Server Logs

For production:
- Check Vercel deployment logs
- Look for "GHL Webhook received" messages

For development:
- Check your terminal where `npm run dev` is running
- Look for webhook payloads being logged

## Advanced: Manual Sync

If you need to manually sync products (for example, to sync existing products):

```bash
node sync-ghl-products.js
```

This will fetch ALL products from GHL and sync them to Sanity.

## Summary

Once webhooks are set up:

✅ **Automatic** - No manual work needed
✅ **Instant** - Products appear within seconds
✅ **Two-way** - Updates and deletions sync automatically
✅ **Smart** - Only syncs products with "Include in Online Store" checked
✅ **Protected** - ilio Sauna custom product page is preserved

---

**Need Help?**
- Check GHL webhook logs
- Check Vercel logs
- Run manual sync: `node sync-ghl-products.js`
- Check product has "Include in Online Store" ✓
