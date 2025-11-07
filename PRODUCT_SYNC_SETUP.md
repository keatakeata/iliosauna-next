# Automatic Product Price Sync Setup

Your website now has **two automatic sync methods** to keep product prices updated from GoHighLevel:

---

## 🕐 Method 1: Scheduled Hourly Sync (Active)

**Updates products automatically every hour**

### How It Works
- Vercel Cron Job runs every hour at the top of the hour (1:00, 2:00, 3:00, etc.)
- Fetches all products from GHL
- Updates prices, images, variants, and all product data in Sanity
- Runs in the background without any action needed

### When Price Changes Take Effect
**Maximum delay: 1 hour** from when you update a price in GHL

Example:
- You change a price at 2:15 PM
- Next sync runs at 3:00 PM
- Price is live on website by 3:00 PM

### Configuration
Already configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-products",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Security Setup (Required for Production)
Add to your Vercel environment variables:

```bash
CRON_SECRET=your-random-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

---

## ⚡ Method 2: Instant Webhook Sync (Optional)

**Updates products instantly when you change them in GHL**

### How It Works
- GHL sends a webhook notification when products are updated
- Your website receives the notification immediately
- Only that specific product is synced (faster than full sync)

### When Price Changes Take Effect
**Instant** - within seconds of updating in GHL

### Setup Steps

#### 1. Deploy Your Website to Production
The webhook URL needs to be publicly accessible.

Your webhook URL will be:
```
https://yourdomain.com/api/webhooks/ghl-product
```

#### 2. Add Webhook Secret to Environment Variables
In Vercel dashboard:
```bash
WEBHOOK_SECRET=your-random-webhook-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

#### 3. Configure in GoHighLevel

**Option A: Via GHL Workflows (Recommended)**
1. Go to **Automations > Workflows**
2. Create new workflow
3. Add trigger: "Product Updated" or "Product Created"
4. Add action: "Send Webhook"
5. Configure webhook:
   - **URL:** `https://yourdomain.com/api/webhooks/ghl-product`
   - **Method:** POST
   - **Headers:**
     ```
     Authorization: Bearer your-webhook-secret-here
     Content-Type: application/json
     ```
   - **Body:** Use product data from trigger

**Option B: Via GHL API Settings** (if available)
1. Go to **Settings > Integrations > Webhooks**
2. Click "Add Webhook"
3. Configure:
   - **URL:** `https://yourdomain.com/api/webhooks/ghl-product`
   - **Events:** Select "Product Created", "Product Updated", "Product Deleted"
   - **Secret:** Your webhook secret

---

## 🔧 Manual Sync (For Testing)

You can also trigger a sync manually:

### Via API
```bash
curl -X GET https://yourdomain.com/api/cron/sync-products \
  -H "Authorization: Bearer your-cron-secret"
```

### Via Browser (Local Development)
```
http://localhost:4448/api/cron/sync-products
```

---

## 📊 Current Setup Status

✅ **Active:** Hourly automatic sync (every hour)
⏸️ **Pending:** Instant webhook sync (requires GHL configuration)

### What's Working Now
- Products sync automatically every hour
- All price changes appear within 1 hour
- No manual action required

### To Enable Instant Sync
1. Deploy to production (Vercel)
2. Add WEBHOOK_SECRET to environment variables
3. Configure webhook in GoHighLevel as shown above

---

## 🚨 Troubleshooting

### Prices Not Updating?

**Check sync logs:**
```bash
# View Vercel logs
vercel logs

# Or check Vercel dashboard > Deployments > Functions
```

**Look for:**
- `[CRON] Starting automated product sync`
- `[CRON] Updated: Product Name`
- `[CRON] Sync completed`

**Common Issues:**
1. **GHL API credentials expired** - Check GHL_ACCESS_TOKEN
2. **Sanity token expired** - Check SANITY_AUTH_TOKEN
3. **Cron not running** - Check Vercel dashboard > Cron Jobs

### Webhook Not Working?

**Test webhook endpoint:**
```bash
curl -X POST https://yourdomain.com/api/webhooks/ghl-product \
  -H "Authorization: Bearer your-webhook-secret" \
  -H "Content-Type: application/json" \
  -d '{"productId": "test123", "type": "product.updated"}'
```

**Look for:**
- `[WEBHOOK] Received GHL product webhook`
- `[WEBHOOK] Updated product`

---

## 🎯 Recommendation

**For Most Users:**
Use the **hourly sync** (already active). It's simple, reliable, and 1-hour delay is acceptable for most e-commerce sites.

**For High-Volume Sites:**
Add the **webhook sync** for instant updates when you need prices to change immediately (flash sales, real-time inventory, etc.).

Both methods can run simultaneously - webhooks provide instant updates, while hourly sync acts as a backup to catch any missed webhook events.

---

## 📝 Environment Variables Summary

Required for production:

```bash
# Existing (already configured)
GHL_ACCESS_TOKEN=your-ghl-token
GHL_API_BASE=https://services.leadconnectorhq.com
GHL_LOCATION_ID=your-location-id
SANITY_AUTH_TOKEN=your-sanity-token
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# New (add these)
CRON_SECRET=generate-random-secret
WEBHOOK_SECRET=generate-different-random-secret
```
