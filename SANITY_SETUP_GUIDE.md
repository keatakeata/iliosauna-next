# Sanity Studio Setup Guide

## Quick Start

### 1. Install Sanity CLI globally
```bash
npm install -g @sanity/cli
```

### 2. Initialize Sanity Studio in a new folder
```bash
# Create a new folder for your Sanity Studio (separate from Next.js)
mkdir iliosauna-studio
cd iliosauna-studio

# Initialize Sanity
sanity init

# When prompted:
# - Choose "Create new project"
# - Use your existing project ID: bxybmggj
# - Dataset: production
# - Template: Clean project with no predefined schemas
```

### 3. Add Your Schemas

Copy the following schema files to your Sanity Studio:

1. Copy `sanity/schemas/saunaProduct.ts` to `iliosauna-studio/schemas/saunaProduct.ts`
2. Copy `sanity/schemas/testimonial.ts` to `iliosauna-studio/schemas/testimonial.ts`

### 4. Update schema index file

Edit `iliosauna-studio/schemas/index.ts`:
```typescript
import saunaProduct from './saunaProduct'
import testimonial from './testimonial'

export const schemaTypes = [saunaProduct, testimonial]
```

### 5. Start Sanity Studio
```bash
# In your iliosauna-studio folder
sanity dev

# This will open Sanity Studio at http://localhost:3333
```

## Adding Content

### In Sanity Studio:

1. **Add Sauna Products:**
   - Click "Sauna Products" in the left menu
   - Click "Create new" button
   - Fill in:
     - Product Name (e.g., "Ilio Lux 2-Person Infrared Sauna")
     - Click "Generate" next to Slug
     - Upload hero image
     - Add gallery images
     - Set price
     - Add description
     - Fill specifications
     - Add features (click "Add item" for each feature)
     - Check "In Stock"
     - Check "Featured" for main products

2. **Add Testimonials:**
   - Click "Testimonials" in the left menu
   - Add customer reviews
   - Link to products if desired

## Testing in Next.js

1. Go to http://localhost:3001/products to see your products
2. The products will automatically appear once you publish them in Sanity Studio

## Publishing Content

In Sanity Studio, after creating content:
1. Click the "Publish" button on each document
2. Content will be immediately available via the API

## Troubleshooting

### No products showing?
- Make sure you've published the content in Sanity Studio
- Check that your project ID is correct in `.env.local`
- Verify the dataset name is "production"

### CORS issues?
- Go to https://www.sanity.io/manage/project/bxybmggj/api
- Add your localhost URLs to CORS origins:
  - http://localhost:3000
  - http://localhost:3001

## Next Steps

1. Create more content types (blog posts, FAQs, etc.)
2. Add image transformations for optimization
3. Implement preview mode for draft content
4. Set up webhooks for automatic revalidation