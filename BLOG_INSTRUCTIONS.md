# How to Write and Publish Blog Posts on Your Ilio Sauna Website

## 📝 Quick Start

Your website has a fully functional blog/journal system powered by Sanity CMS. Here's how to create and manage content:

## 🚀 Accessing Sanity Studio

1. **Local Development**:
   - Go to: `http://localhost:3000/studio`
   
2. **Production Site**:
   - Go to: `https://your-domain.com/studio`
   - Login with your Sanity account credentials

## 📋 Creating a New Blog Post

### Step 1: Access the Studio
1. Navigate to `/studio` on your website
2. Log in with your Sanity credentials
3. You'll see the Sanity Studio dashboard

### Step 2: Create a Blog Post
1. Click on **"Blog Posts"** in the left sidebar
2. Click the **"+ Create"** button
3. Fill in the following fields:

#### Required Fields:
- **Title**: Your blog post title
- **Slug**: URL-friendly version (auto-generates from title)
- **Published Date**: When the post should appear as published
- **Excerpt**: Short description (appears in blog listings)
- **Content**: Your main blog content (rich text editor)

#### Optional Fields:
- **Featured**: Check to highlight this post
- **Main Image**: Hero image for the post
- **Categories**: Select relevant categories
- **Tags**: Add searchable tags
- **Author**: Select the author
- **Reading Time**: Estimated minutes to read
- **SEO Title**: Custom title for search engines
- **SEO Description**: Meta description for search results

### Step 3: Rich Text Formatting
The content editor supports:
- **Headings** (H2, H3, H4)
- **Bold** and *Italic* text
- Bullet lists and numbered lists
- Block quotes
- Links (internal and external)
- Images with captions
- Code blocks
- Custom components

### Step 4: Add Images
1. Click the image icon in the editor
2. Upload or select from media library
3. Add alt text for accessibility
4. Optional: Add caption

### Step 5: Publish
1. Review your post in the preview panel
2. Click **"Publish"** button
3. Your post is now live on `/journal`

## 🏷️ Managing Categories

### Create a Category:
1. Go to **"Categories"** in the sidebar
2. Click **"+ Create"**
3. Add:
   - Title (e.g., "Wellness", "Design", "Technical")
   - Slug (auto-generated)
   - Description
   - Color (for visual distinction)
   - Order (for sorting)

## 👤 Managing Authors

### Create an Author Profile:
1. Go to **"Authors"** in the sidebar
2. Click **"+ Create"**
3. Add:
   - Name
   - Slug
   - Bio
   - Profile Image
   - Social Links

## 🔍 How Content Appears on Your Site

### Journal Page (`/journal`):
- Shows all published blog posts
- Includes search functionality
- Filter by categories and tags
- Featured posts appear prominently
- Automatic pagination

### Individual Posts (`/journal/[slug]`):
- Full blog post with rich formatting
- Author information
- Reading time
- Related posts
- Social sharing options

## 🎨 Content Best Practices

### Writing Tips:
1. **Engaging Titles**: Keep them descriptive and interesting
2. **Quality Images**: Use high-resolution images (optimized for web)
3. **Excerpt**: Write compelling summaries (150-200 characters)
4. **Categories**: Use 1-2 relevant categories per post
5. **Tags**: Add 3-5 specific tags for better searchability

### SEO Optimization:
1. **Unique Titles**: Each post should have a unique, descriptive title
2. **Meta Descriptions**: Write custom SEO descriptions (150-160 characters)
3. **Image Alt Text**: Always add descriptive alt text
4. **Internal Linking**: Link to other relevant posts

## 🔧 Troubleshooting

### Post Not Appearing?
1. Check if status is "Published"
2. Verify the published date isn't in the future
3. Clear browser cache
4. Check for required fields

### Images Not Loading?
1. Ensure image is uploaded to Sanity
2. Check image file size (keep under 2MB)
3. Verify image format (JPG, PNG, WebP supported)

### Search Not Finding Posts?
1. Allow 2-3 minutes for indexing
2. Check post is published
3. Verify search terms match content

## 📊 Demo Content

The journal currently shows 3 demo posts as fallback content when no posts exist in Sanity:
1. "The Science Behind Infrared Saunas"
2. "Designing Your Backyard Wellness Retreat"
3. "Sauna Maintenance: A Complete Guide"

These will be replaced once you create real posts in Sanity.

## 🚦 Current Status

✅ **Working Features**:
- Full blog/journal page at `/journal`
- Search functionality
- Category filtering
- Tag filtering
- Responsive design
- Author profiles
- Reading time calculation
- Featured posts

✅ **Sanity Setup**:
- Project ID: `bxybmggj`
- Dataset: `production`
- Studio accessible at `/studio`
- All schemas configured

## 📱 Mobile Optimization

The blog is fully responsive with:
- Touch-friendly navigation
- Optimized image loading
- Mobile-friendly search
- Readable typography
- Fast page loads

## 🎯 Next Steps

1. **Log into Sanity Studio** at `/studio`
2. **Create your first blog post**
3. **Add categories** relevant to your content
4. **Set up author profiles**
5. **Start publishing content regularly**

## 💡 Pro Tips

1. **Schedule Posts**: Set future published dates to schedule content
2. **Draft Mode**: Save without publishing to preview first
3. **Bulk Upload**: Use the media library to upload multiple images at once
4. **Consistent Voice**: Maintain a consistent brand voice across posts
5. **Regular Publishing**: Aim for consistent posting schedule (weekly/biweekly)

---

**Need Help?** The Sanity documentation is available at: https://www.sanity.io/docs
**Studio URL**: `/studio` on your domain
**Live Blog**: `/journal` on your domain