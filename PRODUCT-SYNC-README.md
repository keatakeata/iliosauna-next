# GHL Product Sync - Quick Start

## ✅ What's Done

Your website is now ready to automatically sync products from GoHighLevel (GHL)!

## 🎯 To Enable Automatic Sync

Follow this guide: **[docs/AUTOMATIC-PRODUCT-SYNC-SETUP.md](docs/AUTOMATIC-PRODUCT-SYNC-SETUP.md)**

**Quick Summary:**
1. Go to GHL Settings → Integrations → Webhooks
2. Create 3 webhooks pointing to: `https://iliosauna.com/api/ghl/products`
3. Set authorization header: `Bearer pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5`
4. Done! Products with "Include in Online Store" ✓ will auto-sync

## 🔄 Manual Sync (Anytime)

To manually sync all products from GHL:

```bash
node sync-ghl-products.js
```

## 📦 What's Included

- **Automatic Product Sync**: Products created in GHL appear on website instantly
- **Include in Online Store Filter**: Only products with this checkbox sync
- **ilio Sauna Protection**: Your custom /saunas page is preserved and always shows first
- **Brand Consistency**: All products match your website colors (#BF5813)
- **Real-time Updates**: Product changes in GHL update website automatically
- **Soft Deletes**: Deleted products in GHL are hidden (not destroyed)

## 📁 Important Files

- `src/app/api/ghl/products/route.ts` - Webhook endpoint
- `src/app/products/page.tsx` - Products listing page
- `sanity/schemas/ghlProduct.ts` - Product schema
- `sync-ghl-products.js` - Manual sync script
- `docs/AUTOMATIC-PRODUCT-SYNC-SETUP.md` - Full setup guide
- `docs/GHL-INTEGRATION.md` - Technical documentation

## 🧪 Test It

1. Create a test product in GHL
2. Check "Include in Online Store" ✓
3. Visit http://localhost:4448/products (or https://iliosauna.com/products)
4. Product should appear instantly!

---

**Need help?** Check the full documentation in `docs/AUTOMATIC-PRODUCT-SYNC-SETUP.md`
