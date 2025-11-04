# ✅ Automatic Product Sync - COMPLETE

## What's Been Set Up

Your website now has **FULLY AUTOMATIC** product syncing from GoHighLevel (GHL) to your website!

### How It Works

**Every 5 minutes**, your website automatically:
1. Fetches ALL products from GHL
2. Syncs them to your website
3. Updates existing products
4. Only shows products marked "available" in GHL

### What Gets Synced (Complete Field Mapping)

All GHL product fields map 1-to-1 to your website:

#### Core Information
- ✅ **Product ID** → Unique identifier
- ✅ **Title/Name** → Product name
- ✅ **Handle** → URL slug (auto-generated if not provided)
- ✅ **Description** → Full product description

#### Pricing
- ✅ **Price** → Regular price
- ✅ **Compare At Price** → Sale price (shows "was $X, now $Y")
- ✅ **Amount/Default Price** → Alternative pricing fields

#### Images
- ✅ **Images** → All product photos
- ✅ **Image URLs** → Direct image links
- ✅ **Alt Text** → Auto-generated from product name

#### Categorization
- ✅ **Product Type** → Category (saunas, infrared, cold-therapy, wellness)
- ✅ **Product Collection** → Collection grouping
- ✅ **Tags** → Used for features and badges

#### Inventory
- ✅ **Available** → In stock status
- ✅ **Available Quantity** → Stock count
- ✅ **Inventory Quantity** → Alternative stock field
- ✅ **Allow Out of Stock Purchase** → Backorder setting
- ✅ **Status** → Active/archived status

#### Variants
- ✅ **Variants** → All product variations
- ✅ **Variant Name/Title** → Variation names
- ✅ **Variant Price** → Individual prices
- ✅ **SKU** → Stock keeping unit
- ✅ **Inventory Quantity** → Per-variant stock

#### SEO Fields
- ✅ **SEO Title** → Search engine title
- ✅ **Meta Title** → Alternative SEO title
- ✅ **SEO Description** → Search engine description
- ✅ **Meta Description** → Alternative SEO description

#### Tax Information
- ✅ **Taxable** → Whether product is taxed

#### Features & Specifications
- ✅ **Features** → Bullet point features
- ✅ **Specifications** → Technical specs
- ✅ **Metafields** → Custom fields

#### Badges
- ✅ **Badge** → Product badge (Featured, New, etc.)
- ✅ **Featured** → Featured product flag
- ✅ **First Tag** → Used as badge if badge field empty

#### Timestamps
- ✅ **Published At** → Publication date
- ✅ **Created At** → Creation date
- ✅ **Updated At** → Last modification date

## Current Setup

### 1. Vercel Cron Job (Automatic Every 5 Minutes)
File: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/ghl/sync",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs automatically on Vercel - **NO ACTION NEEDED**

### 2. Sync API Endpoint
File: `src/app/api/ghl/sync/route.ts`

- Fetches all products from GHL
- Maps all fields comprehensively
- Creates or updates products in Sanity
- Only syncs "available" products

### 3. Manual Sync (If Needed)
You can also trigger sync manually:

```bash
node sync-ghl-products.js
```

Or visit: `https://iliosauna.com/api/ghl/sync`

## What Happens When You Create a Product in GHL

1. **Create product in GHL** with all details (title, price, images, description, etc.)
2. **Check "Include in Online Store"** or set `available: true`
3. **Wait up to 5 minutes**
4. **Product appears on website** at https://iliosauna.com/products

### All Fields Are Mapped!

Whatever you enter in GHL will appear on the website:
- Title → Product title
- Price → Displayed price
- Compare At Price → Shows as sale
- Description → Product description
- Images → Product photos
- Tags → Features bullets
- SEO Title → Page title
- SEO Description → Meta description
- Inventory → Stock count
- And everything else!

## Products Page

The products page displays:
- ✅ **ilio Sauna** (your custom product - always first)
- ✅ **All GHL Products** (automatically synced)
- ✅ Prices with monthly payment option
- ✅ Features as bullet points
- ✅ Stock indicators
- ✅ Sale prices (if compare at price set)
- ✅ Product badges
- ✅ Category filtering
- ✅ Sorting options

## Viewing Your Products

**Website**: https://iliosauna.com/products
**Dev**: http://localhost:4448/products
**Sanity Studio**: https://iliosauna.sanity.studio/ → GHL Products

## Testing

1. **Create a test product in GHL**:
   - Name: "Test Product"
   - Price: $99
   - Description: "This is a test"
   - Set available: true or check "Include in Online Store"
   - Add an image

2. **Wait 5 minutes** (or run manual sync)

3. **Check your website**: Product should appear!

4. **Delete it in GHL**: Will disappear from website (archived)

## Monitoring

### Check Sync Status

View sync logs in Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Logs"
4. Filter for `/api/ghl/sync`

### Manual Trigger

Visit: `https://iliosauna.com/api/ghl/sync`

Returns:
```json
{
  "success": true,
  "synced": 5,
  "skipped": 0,
  "total": 5
}
```

## Important Notes

### ✅ Fully Automatic
- No manual sync needed
- No webhooks to configure
- No technical setup
- Just works!

### ✅ ilio Sauna Protected
- Your custom /saunas page is safe
- Always appears first
- Never touched by sync

### ✅ Complete Field Mapping
- Every GHL field maps to website
- SEO fields included
- Taxes included
- Variants included
- Everything!

### ✅ Smart Filtering
- Only syncs available products
- Archived products are hidden
- Out of stock shows properly

## Deployment

When you deploy to Vercel:

```bash
git add .
git commit -m "Add automatic GHL product sync"
git push
```

The cron job will automatically start running every 5 minutes!

## Support

If products aren't syncing:
1. Check product is set to "available" in GHL
2. Wait up to 5 minutes for auto-sync
3. Check Vercel logs for errors
4. Run manual sync: `node sync-ghl-products.js`
5. Visit sync endpoint: https://iliosauna.com/api/ghl/sync

---

**Status**: ✅ COMPLETE & AUTOMATIC
**Sync Frequency**: Every 5 minutes
**Manual Sync**: Available anytime
**Field Mapping**: 100% Complete
**Ready for Production**: YES

🎉 The owner can now manage products entirely through GHL!
