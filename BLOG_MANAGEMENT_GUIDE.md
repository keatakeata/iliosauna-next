# 📝 Blog Management Guide for Ilio Sauna

## 🌐 Live URLs & Access Points

### Public Blog
- **Live Blog:** https://iliosauna.com/journal
- **Individual Posts:** https://iliosauna.com/journal/[slug]

### Content Management
- **Sanity Studio:** https://iliosauna.com/studio (or https://sanity.io/manage/project/bxybmggj)
- **Sanity Dashboard:** https://sanity.io/manage/project/bxybmggj

## 📚 Blog System Architecture

### How It Works
1. **Content Storage:** Blog posts are stored in Sanity CMS (headless CMS)
2. **Frontend Display:** Next.js fetches and displays content from Sanity
3. **Real-time Updates:** Changes in Sanity reflect immediately on the website
4. **SEO Optimized:** Each post has meta tags, structured data, and optimized URLs

### Key Components
- **Blog Listing Page:** `/src/app/journal/page.tsx`
- **Individual Post Page:** `/src/app/journal/[slug]/page.tsx`
- **Sanity Schemas:** `/sanity/schemas/`
  - `blogPost.ts` - Main blog post structure
  - `author.ts` - Author profiles
  - `category.ts` - Content categories
  - `blockContent.ts` - Rich text editor configuration

## 🚀 Managing Blog Content

### 1. Adding a New Blog Post

#### Via Sanity Studio (Recommended)
```
1. Go to https://sanity.io/manage/project/bxybmggj
2. Click "Blog Post" in the sidebar
3. Click "Create new Blog Post"
4. Fill in the required fields:
   - Title (required)
   - Slug (auto-generated or custom)
   - Author (select from dropdown)
   - Published Date (required)
   - Excerpt (for preview cards)
   - Main Image (hero image)
   - Categories (select multiple)
   - Tags (add relevant keywords)
   - Body (rich text content)
   - Reading Time (estimated minutes)
   - Featured (check to highlight post)
```

#### Required Fields
- **Title:** The blog post headline
- **Slug:** URL-friendly version (auto-generated from title)
- **Author:** Must create author profile first
- **Published Date:** Controls post visibility and sorting

#### Optional Enhancements
- **Main Image:** Upload high-quality image (recommended 1920x1080)
- **Categories:** Organize content by topic
- **Tags:** Improve searchability
- **SEO Fields:** Custom meta title, description, keywords
- **Related Posts:** Link to similar content

### 2. Creating Author Profiles

```
1. In Sanity Studio, click "Author"
2. Create new Author
3. Add:
   - Name (required)
   - Slug (URL-friendly name)
   - Bio
   - Profile Image
   - Social Media Links
```

### 3. Setting Up Categories

```
1. In Sanity Studio, click "Category"
2. Create categories like:
   - Health & Wellness
   - Design & Architecture
   - Technical & Maintenance
   - Lifestyle
   - Installation Tips
3. Assign color codes for visual distinction
```

## 📝 Content Writing Best Practices

### Blog Post Structure
```markdown
# Compelling Headline
## Introduction (Hook the reader)
- State the problem or benefit
- Preview what you'll cover

## Main Content Sections
### Subheading 1
- Use bullet points for easy scanning
- Include statistics and data
- Add personal stories or case studies

### Subheading 2
- Break up text with images
- Use short paragraphs (3-4 sentences)
- Include actionable tips

## Conclusion
- Summarize key points
- Include call-to-action
- Link to related posts
```

### SEO Optimization
1. **Title:** Include primary keyword, keep under 60 characters
2. **Meta Description:** Compelling summary under 160 characters
3. **URL Slug:** Short, descriptive, keyword-rich
4. **Headers:** Use H2, H3 tags with keywords
5. **Images:** Add alt text for all images
6. **Internal Links:** Link to other relevant blog posts

### Content Ideas for Ilio Sauna
- "5 Health Benefits of Daily Sauna Use"
- "Designing Your Backyard Sauna Oasis"
- "Sauna Maintenance: Monthly Checklist"
- "Traditional vs Infrared: Which is Right for You?"
- "Customer Story: [Name]'s Wellness Journey"
- "Seasonal Sauna Care Tips"
- "The Science Behind Heat Therapy"
- "Installation Day: What to Expect"

## 🖼️ Image Management

### Image Requirements
- **Main Image:** 1920x1080px minimum
- **Format:** JPG for photos, PNG for graphics
- **File Size:** Optimize to under 500KB
- **Alt Text:** Describe image for accessibility

### Uploading Images
1. In blog post editor, click image icon
2. Upload or select from media library
3. Add alt text description
4. Enable hotspot for focal point control

## 🔍 Blog Features on Frontend

### Search & Filter System
- **Search Bar:** Full-text search across titles, excerpts, and tags
- **Category Filters:** Quick filtering by category
- **Tag Cloud:** Popular tags for discovery
- **Sort Options:** Date, popularity, reading time

### User Features
- Estimated reading time
- Author profiles with bio
- Related posts suggestions
- Social sharing buttons
- Newsletter signup integration

## 📊 Analytics & Tracking

### What to Monitor
- Page views per post
- Average time on page
- Bounce rate
- Social shares
- Newsletter signups from blog
- Conversion to product pages

### Where to Check
- **Google Analytics:** Overall traffic patterns
- **Mixpanel:** User behavior tracking
- **Sanity Dashboard:** Content performance

## 🛠️ Troubleshooting

### Common Issues

#### Blog post not appearing
- Check "Published Date" is not in future
- Verify slug is unique
- Clear browser cache
- Wait 1-2 minutes for CDN update

#### Images not loading
- Check image uploaded successfully in Sanity
- Verify image URL is correct
- Ensure alt text is provided

#### Search not working
- Index may need refreshing (automatic every 5 mins)
- Check for special characters in search terms

## 📅 Content Calendar Template

### Weekly Schedule
- **Monday:** Research and outline new post
- **Tuesday:** Write first draft
- **Wednesday:** Add images and formatting
- **Thursday:** SEO optimization and editing
- **Friday:** Publish and promote

### Monthly Themes
- **Week 1:** Health & Wellness focus
- **Week 2:** Design & Installation
- **Week 3:** Customer Stories
- **Week 4:** Maintenance & Technical

## 🚦 Publishing Checklist

Before publishing any blog post:
- [ ] Proofread for spelling and grammar
- [ ] Verify all links work
- [ ] Add featured image with alt text
- [ ] Set appropriate categories and tags
- [ ] Fill in SEO fields
- [ ] Set correct publish date
- [ ] Preview on mobile and desktop
- [ ] Add related posts if applicable
- [ ] Schedule social media promotion

## 📞 Need Help?

### Technical Support
- Sanity issues: support@sanity.io
- Website bugs: Check deployment logs in Vercel

### Content Questions
- Review this guide
- Check existing posts for examples
- Test in draft mode before publishing

## 🎯 Quick Actions

### To add a blog post right now:
1. Go to: https://sanity.io/manage/project/bxybmggj
2. Login with your credentials
3. Click "Blog Post" → "Create"
4. Fill in title, author, date, and content
5. Click "Publish"
6. View at: https://iliosauna.com/journal

### To edit an existing post:
1. Find the post in Sanity Studio
2. Make your changes
3. Click "Publish" to update instantly

---

**Remember:** The blog is a powerful tool for SEO and customer engagement. Consistent, quality content will help establish Ilio Sauna as a thought leader in the wellness space.