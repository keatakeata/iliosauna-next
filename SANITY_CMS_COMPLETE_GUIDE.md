# Complete Sanity CMS Setup & Usage Guide

## Overview
Your website now has a complete Content Management System (CMS) that allows you to edit all content without touching any code. This includes:
- All page content (Homepage, Our Story, Saunas, Contact, Journal)
- Blog posts and articles
- Product information
- Testimonials
- Site settings

## Initial Setup (One-Time)

### Option 1: Standalone Sanity Studio (Recommended)

1. **Create a new folder for Sanity Studio**
```bash
mkdir ilio-studio
cd ilio-studio
```

2. **Initialize Sanity**
```bash
npm create sanity@latest -- --project bxybmggj --dataset production
```

When prompted:
- Choose "Yes" to use the existing project
- Select "Clean project" template

3. **Copy Schema Files**
Copy all files from `Garry Website Next/sanity/schemas/` to `ilio-studio/schemas/`

4. **Update Schema Index**
Replace the content of `ilio-studio/schemas/index.ts` with the one from the main project

5. **Copy Configuration**
Copy `sanity.config.ts` from the main project to `ilio-studio/sanity.config.ts`

6. **Start Sanity Studio**
```bash
npm run dev
```

Your CMS will be available at `http://localhost:3333`

### Option 2: Embedded Studio (Advanced)

Add this route to your Next.js app at `src/app/studio/[[...index]]/page.tsx`:

```tsx
'use client'
import {NextStudio} from 'next-sanity/studio'
import config from '../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Access at: `http://localhost:3001/studio`

## How to Use Sanity Studio

### Logging In
1. Go to your Studio URL
2. Log in with your Sanity account
3. You'll see the content dashboard

### Managing Page Content

#### Homepage
1. Click "Pages" → "Homepage"
2. Edit sections:
   - **Hero Section**: Title, subtitle, button text, slideshow images
   - **About Section**: Title, paragraphs, video
   - **Premium Details**: Features with images
   - **Testimonials**: Toggle display
   - **Call to Action**: Bottom CTA content

#### Our Story Page
1. Click "Pages" → "Our Story"
2. Edit:
   - Hero section with background image
   - Story content with rich text editor
   - Company values
   - Team members
   - Call to action

#### Saunas Page
1. Click "Pages" → "Saunas Page"
2. Edit:
   - Hero slideshow
   - Introduction text
   - Product display settings
   - Benefits section
   - Process steps

#### Contact Page
1. Click "Pages" → "Contact"
2. Edit:
   - Contact information
   - Business hours
   - Form settings
   - Social media links
   - Map settings

### Managing Blog Posts

#### Creating a New Blog Post
1. Click "Blog Posts" → "+" button
2. Fill in:
   - Title
   - Slug (URL path)
   - Author (must create author first)
   - Publish date
   - Excerpt (preview text)
   - Main image
   - Categories and tags
   - Body content (rich text editor)
   - SEO settings

3. Click "Publish" to make it live

#### Rich Text Editor Features
- **Headings**: H2, H3 for sections
- **Formatting**: Bold, italic, links
- **Lists**: Bullet points, numbered lists
- **Images**: Embed images in content
- **Quotes**: Blockquotes for testimonials

### Managing Products
1. Click "Sauna Products"
2. Add/Edit products with:
   - Name and slug
   - Images (hero + gallery)
   - Price and specifications
   - Features list
   - Stock status
   - Featured flag

### Managing Testimonials
1. Click "Testimonials"
2. Add customer reviews with:
   - Customer name
   - Rating
   - Review text
   - Product association
   - Photo (optional)

### Site Settings
1. Click "Site Settings"
2. Configure:
   - Site name and description
   - Logo and favicon
   - Header settings (cart, auth toggles)
   - Footer content
   - Social media links
   - Analytics IDs
   - Default SEO

## Publishing Content

### Making Changes Live
1. Edit any content
2. Click "Publish" button
3. Changes appear on website immediately

### Saving Drafts
- Click "Save" to save draft without publishing
- Drafts are only visible in Studio
- Publish when ready

## Best Practices

### Images
- **Optimal Sizes**:
  - Hero images: 1920x1080 minimum
  - Product images: 1200x800
  - Thumbnails: 400x300
- **Formats**: Use JPEG for photos, PNG for graphics
- **File size**: Keep under 2MB per image

### SEO
- Always fill in meta titles and descriptions
- Use descriptive alt text for images
- Keep URLs (slugs) short and descriptive

### Content Writing
- Use clear, concise headings
- Break up long text with subheadings
- Include relevant keywords naturally
- Add internal links between related content

## Troubleshooting

### Content Not Showing on Website
1. Make sure you clicked "Publish" (not just "Save")
2. Clear browser cache
3. Check that the deployment is complete

### Can't Upload Images
- Check file size (max 20MB)
- Ensure correct format (JPEG, PNG, GIF, SVG)
- Try a different browser

### Studio Won't Load
1. Check internet connection
2. Clear browser cache
3. Try incognito/private mode
4. Contact support if persists

## Support

### Getting Help
- Sanity Documentation: https://www.sanity.io/docs
- Report issues to your developer
- For urgent issues, use the backup content editing method

### Backup Access
If Sanity Studio is unavailable, content can be edited directly through:
1. Sanity's web interface at https://www.sanity.io/manage
2. Contact your developer for emergency updates

## Advanced Features

### Scheduling Posts
1. Set "Published at" to future date
2. Post will appear automatically at that time

### Content Versioning
- Sanity keeps history of all changes
- Access version history via "History" tab
- Restore previous versions if needed

### Multi-language Support
Can be added later for:
- Duplicate content in multiple languages
- Language switcher on website
- Localized URLs

## Quick Reference

### Common Tasks
- **Change hero text**: Pages → Homepage → Hero Section
- **Add blog post**: Blog Posts → + → Fill details → Publish
- **Update contact info**: Site Settings → Contact Information
- **Add testimonial**: Testimonials → + → Fill details → Publish
- **Toggle cart**: Site Settings → Header Settings → Show Cart

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save draft
- `Ctrl/Cmd + Alt + P`: Publish
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo

### Content Types Reference
- **Pages**: Homepage, Our Story, Saunas, Contact, Journal
- **Products**: Sauna products with full details
- **Blog**: Posts, authors, categories
- **Testimonials**: Customer reviews
- **Settings**: Site-wide configuration