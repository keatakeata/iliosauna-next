# GoHighLevel (GHL) Product Integration

## Overview

This integration allows products created in GoHighLevel (GHL) to automatically sync with the ilio Sauna website and appear on the products listing page at `/products`. The integration maintains the ilio Sauna custom product page while adding additional GHL products dynamically.

## Architecture

### Components

1. **Sanity Schema** (`sanity/schemas/ghlProduct.ts`)
   - Defines the structure for GHL products in Sanity CMS
   - Includes all necessary fields: pricing, images, variants, stock, specifications, etc.

2. **API Webhook Endpoint** (`src/app/api/ghl/products/route.ts`)
   - POST endpoint: Creates or updates products
   - DELETE endpoint: Soft-deletes products (sets `isActive: false`)
   - Secured with `GHL_WEBHOOK_SECRET` or `GHL_ACCESS_TOKEN`

3. **Products Page** (`src/app/products/page.tsx`)
   - Fetches GHL products from Sanity
   - Always displays ilio Sauna product first
   - Updates every 30 seconds for real-time changes
   - Fully filtered and sortable

4. **Product Card** (`src/components/ProductCard.tsx`)
   - Displays product information with brand colors (#BF5813)
   - Responsive design matching website theme
   - Stock indicators and badges
   - Links to ilio Sauna page for ilio products

## Setup Instructions

### 1. Environment Variables

Ensure these are set in your `.env.local` file:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=bxybmggj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_AUTH_TOKEN=your_sanity_token

# GHL Integration
GHL_WEBHOOK_SECRET=your_webhook_secret
GHL_ACCESS_TOKEN=pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5
```

### 2. Webhook URL

The webhook endpoint is available at:
- **Development**: `http://localhost:4448/api/ghl/products`
- **Production**: `https://iliosauna.com/api/ghl/products`

### 3. Configure GHL Webhooks

In your GoHighLevel account:

1. Navigate to **Settings > Integrations > Webhooks**
2. Create a new webhook for **Product Created/Updated**
3. Set the URL to your webhook endpoint (production URL)
4. Set the HTTP method to **POST**
5. Add authorization header:
   ```
   Authorization: Bearer YOUR_GHL_WEBHOOK_SECRET
   ```
6. Create another webhook for **Product Deleted**
7. Set the HTTP method to **DELETE**
8. Set the URL to: `https://iliosauna.com/api/ghl/products?id={product_id}`

### 4. GHL Product Payload Structure

When creating products in GHL, the webhook will send this data:

```typescript
{
  id: string;                    // GHL Product ID
  name: string;                  // Product name
  description?: string;          // Product description
  price: number;                 // Price in dollars
  salePrice?: number;            // Sale price (optional)
  images?: Array<{               // Product images
    url: string;
    alt?: string;
  }>;
  category?: string;             // Category: saunas, infrared, cold-therapy, wellness
  variants?: Array<{             // Product variants
    name: string;
    price: number;
    sku?: string;
  }>;
  inStock?: boolean;             // Stock status
  stockCount?: number;           // Available quantity
  allowOutOfStockPurchase?: boolean;  // Allow backorders
  productCollection?: string;    // Collection name
  specifications?: Array<{       // Technical specs
    label: string;
    value: string;
  }>;
}
```

## Product Categories

The system supports four categories:

- **saunas**: Traditional and modern saunas
- **infrared**: Infrared therapy products
- **cold-therapy**: Cold plunge and ice bath products
- **wellness**: General wellness and recovery products

## Product Badges

Products can have optional badges:

- **Featured**: Highlighted products (gradient: #BF5813 to #D87440)
- **New**: New arrivals (green gradient)
- **Best Seller**: Popular products (blue gradient)
- **Limited**: Limited availability (red gradient)

## Stock Management

- Products with `stockCount <= 3` show "Only X left" badge
- Out of stock products show "Out of Stock - Contact for Availability"
- `allowOutOfStockPurchase` controls whether out-of-stock items can be ordered

## Testing

### Create a Test Product

Run the included test script:

```bash
node test-ghl-product.js
```

This creates a sample "Premium Wellness Pod" product in Sanity.

### Manual Testing via API

**Create Product:**
```bash
curl -X POST http://localhost:4448/api/ghl/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{
    "id": "test-001",
    "name": "Test Product",
    "price": 999,
    "category": "wellness",
    "inStock": true
  }'
```

**Delete Product:**
```bash
curl -X DELETE "http://localhost:4448/api/ghl/products?id=test-001" \
  -H "Authorization: Bearer YOUR_SECRET"
```

## Key Features

### 1. Real-Time Updates
- Products page refreshes every 30 seconds
- Uses `useCdn: false` for immediate Sanity updates

### 2. ilio Sauna Protection
- Static ilio Sauna product always appears first
- Routes to custom `/saunas` page
- Never fetched from GHL, ensuring it persists

### 3. Error Handling
- If Sanity fetch fails, ilio Sauna product still shows
- Graceful error messages
- Console logging for debugging

### 4. Brand Consistency
- Uses ilio Sauna brand colors (#BF5813 primary)
- Matches existing product card styling
- Responsive design for mobile and desktop

### 5. Filtering & Sorting
- Category filtering (all, saunas, infrared, cold-therapy, wellness)
- Sort by: Featured, Price (Low-High), Price (High-Low), Newest
- ilio Sauna always first when sorting by "Featured"

## Files Modified/Created

### Created Files:
- `sanity/schemas/ghlProduct.ts` - Sanity schema
- `src/app/api/ghl/products/route.ts` - Webhook endpoint
- `test-ghl-product.js` - Test script
- `docs/GHL-INTEGRATION.md` - This documentation

### Modified Files:
- `sanity/schemas/index.ts` - Registered ghlProduct schema
- `src/app/products/page.tsx` - Updated to fetch from Sanity
- `src/components/ProductCard.tsx` - Already compatible (no changes needed)

## Maintenance

### View Products in Sanity
1. Go to https://iliosauna.sanity.studio/
2. Navigate to "GHL Products" section
3. View, edit, or manually create products

### Debugging
Check server logs for:
```
✓ Created product: <product_id>
✓ Updated product: <product_id>
✓ Deactivated product: <product_id>
```

### Revalidate Cache
Products page uses 30-second revalidation. To force update:
1. Restart dev server: `npm run dev`
2. Or clear Next.js cache: `rm -rf .next`

## Security

- Webhook endpoint requires authorization token
- Token verified on every request
- Only active products (`isActive: true`) are displayed
- Soft deletes prevent data loss

## Future Enhancements

Potential improvements:
- [ ] Add product search functionality
- [ ] Implement product reviews/ratings
- [ ] Add comparison tool
- [ ] Create dedicated product detail pages for GHL products
- [ ] Add analytics tracking for product views
- [ ] Implement inventory alerts
- [ ] Add bulk import/export functionality

## Support

For issues or questions:
1. Check server logs for errors
2. Verify environment variables are set
3. Test webhook endpoint with curl
4. Check Sanity Studio for product data
5. Review Next.js build logs

---

**Last Updated**: 2025-11-03
**Integration Version**: 1.0.0
**GHL Access Token**: pit-d65b37e9-b6fc-490c-ac02-f71165c9f4b5
