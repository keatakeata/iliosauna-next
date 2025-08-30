# How to Create and Manage Blog Posts

## Quick Start - Creating Your First Blog Post

### Step 1: Set Up Sanity Studio

1. **Create a new folder for Sanity Studio** (if not done already):
```bash
mkdir ilio-studio
cd ilio-studio
```

2. **Initialize Sanity**:
```bash
npm create sanity@latest -- --project bxybmggj --dataset production
```

3. **Copy schema files** from the main project:
   - Copy everything from `Garry Website Next/sanity/schemas/` to `ilio-studio/schemas/`
   - Copy `sanity.config.ts` from the main project

4. **Start Sanity Studio**:
```bash
npm run dev
```

5. **Access Studio** at `http://localhost:3333`

### Step 2: Create an Author Profile

Before creating blog posts, you need at least one author:

1. In Sanity Studio, click **"Authors"** in the left menu
2. Click the **"+"** button to create a new author
3. Fill in:
   - **Name**: Your name or pen name
   - **Slug**: Click "Generate" button (creates URL-friendly version)
   - **Bio**: Short author biography
   - **Image**: Upload author photo (optional but recommended)
4. Click **"Publish"**

### Step 3: Create Categories (Optional)

Categories help organize your blog posts:

1. Click **"Categories"** in the left menu
2. Click **"+"** to create a new category
3. Fill in:
   - **Title**: e.g., "Wellness", "Design", "Lifestyle"
   - **Slug**: Click "Generate"
   - **Description**: Brief category description
4. Click **"Publish"**

### Step 4: Create Your Blog Post

1. Click **"Blog Posts"** in the left menu
2. Click **"+"** to create a new post
3. Fill in the required fields:

#### Basic Information
- **Title**: Your blog post title
- **Slug**: Click "Generate" (this becomes the URL: /blog/your-slug)
- **Author**: Select from dropdown (must create author first)
- **Published at**: Set publication date/time

#### Content
- **Excerpt**: Brief summary (shows in blog listing)
- **Main Image**: Hero image for the post
  - Click "Upload" or "Select"
  - Add alt text for accessibility
- **Body**: Main content using the rich text editor

#### Organization
- **Categories**: Select relevant categories
- **Tags**: Add keywords (press Enter after each)
- **Featured Post**: Check to show in featured section

#### SEO (Optional but Recommended)
- **Meta Title**: Title for search engines
- **Meta Description**: Description for search results
- **Keywords**: SEO keywords

4. Click **"Publish"** to make it live

## Rich Text Editor Features

The body editor supports:

### Text Formatting
- **Headings**: H1, H2, H3, H4
- **Styles**: Bold, italic, underline, strike-through
- **Lists**: Bullet points and numbered lists
- **Links**: Highlight text and click link button
- **Code**: Inline code snippets

### Block Elements
- **Images**: Click image icon to insert
- **Code Blocks**: For longer code samples
- **Quotes**: Blockquotes for testimonials or citations
- **Callouts**: Info, warning, success, or error boxes
- **YouTube Videos**: Embed by adding YouTube block

### Best Practices for Content
1. Use H2 for main sections, H3 for subsections
2. Keep paragraphs short (3-4 sentences)
3. Use images to break up long text
4. Add relevant internal links

## Managing Published Posts

### Editing Posts
1. Find the post in "Blog Posts" list
2. Click to open
3. Make changes
4. Click "Publish" to update

### Unpublishing Posts
1. Open the post
2. Click the three dots menu
3. Select "Unpublish"

### Scheduling Posts
1. Set "Published at" to a future date
2. The post won't appear until that date/time

## Viewing Your Blog

### Development
- Blog listing: `http://localhost:3003/blog`
- Individual post: `http://localhost:3003/blog/your-post-slug`

### Production
- Blog listing: `https://yourdomain.com/blog`
- Individual post: `https://yourdomain.com/blog/your-post-slug`

## Image Guidelines

### Recommended Sizes
- **Main/Hero Image**: 1920x1080px (16:9 ratio)
- **In-content Images**: 1200x675px or 800x450px
- **Author Photo**: 200x200px (square)

### File Formats
- Use JPEG for photos
- Use PNG for graphics with transparency
- Keep file sizes under 2MB

## SEO Best Practices

1. **Title**: 50-60 characters
2. **Meta Description**: 150-160 characters
3. **URL Slug**: Short, descriptive, hyphenated
4. **Keywords**: 5-10 relevant terms
5. **Alt Text**: Describe all images

## Content Ideas

### Wellness Topics
- Benefits of regular sauna use
- Meditation and sauna therapy
- Cold plunge techniques
- Seasonal wellness routines

### Design & Lifestyle
- Creating a backyard wellness retreat
- Scandinavian design principles
- Entertaining with outdoor saunas
- Maintenance tips

### Product Information
- Choosing the right sauna
- Installation guides
- Wood types and benefits
- Heater technology explained

## Troubleshooting

### Post Not Showing
- Ensure you clicked "Publish" (not just "Save")
- Check the "Published at" date isn't in the future
- Clear browser cache
- Wait 30 seconds for cache to update

### Images Not Loading
- Check file size (max 20MB)
- Ensure correct format (JPEG, PNG, GIF, SVG)
- Try re-uploading

### Formatting Issues
- Use the preview panel to check formatting
- Avoid copying from Word/Google Docs directly
- Use the "Clear formatting" button if needed

## Advanced Features

### Related Posts
Link related content:
1. In your post, scroll to "Related Posts"
2. Click "Add item"
3. Search and select related posts
4. These appear at the bottom of your post

### Custom Excerpts
Instead of auto-generated excerpts:
1. Write a compelling summary in "Excerpt" field
2. Keep it under 160 characters
3. Include a hook to encourage clicks

### Reading Time
1. Add estimated reading time in minutes
2. Helps readers gauge content length
3. Calculate: ~200 words per minute

## Quick Reference

### Keyboard Shortcuts
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + K**: Add link
- **Ctrl/Cmd + S**: Save draft
- **Ctrl/Cmd + Alt + P**: Publish

### Status Indicators
- 🟡 **Draft**: Not published yet
- 🟢 **Published**: Live on website
- 🔵 **Updated**: Has unpublished changes
- 🔴 **Unpublished**: Was published, now offline

## Support

For issues or questions:
1. Check this guide first
2. Review Sanity documentation: https://www.sanity.io/docs
3. Contact your developer for technical issues

Remember: Changes appear on the website within 30 seconds of publishing!