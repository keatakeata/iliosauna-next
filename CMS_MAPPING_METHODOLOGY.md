# CMS Page Mapping Methodology - Proven Success Formula

## The "Our Story Page" Perfect Method

This methodology produced flawless results for the Our Story page and should be replicated exactly for all future page mappings.

### Step 1: Live Page Analysis
1. **Read the actual live page file** (e.g., `src/app/our-story/page.tsx`)
2. **Count and identify EXACT sections** - don't assume, count them manually
3. **Extract ALL content** including:
   - Hero images and text
   - Section headings and descriptions
   - Image URLs and alt text
   - Video URLs
   - Button text and links
   - Any dynamic content

### Step 2: Schema Creation Rules
1. **Match section count exactly** - if live page has 6 sections, schema has 6 sections
2. **Use numbered sections** - `section1`, `section2`, etc. for clarity
3. **Include ALL content fields** found in live page:
   ```typescript
   // Example structure that worked perfectly:
   {
     name: 'section1',
     title: 'Hero Section',
     type: 'object',
     fields: [
       { name: 'heading', type: 'string' },
       { name: 'description', type: 'text' },
       { name: 'images', type: 'array', of: [{ type: 'image' }] }
     ]
   }
   ```

### Step 3: Content Population Strategy
1. **Create NDJSON file** with actual live content
2. **Use real data** - extract every piece of text, image, and media from live page
3. **Set proper defaults** so page works immediately after import
4. **Include all media assets** with proper references

### Step 4: Schema Deployment Process
```bash
# Deploy schema first
sanity schema deploy

# Import content second
sanity dataset import [page-name]-content.ndjson production
```

### Step 5: Component Integration
1. **Update page component** to use Sanity data
2. **Maintain exact same structure** as live page
3. **Add proper error handling** for missing CMS data
4. **Test mobile responsiveness** if applicable

## Key Success Factors

### ✅ What Made Our Story Perfect:
- **Exact section matching** (6 sections = 6 schema sections)
- **Complete content extraction** from live page
- **Proper schema field types** matching content needs
- **Real content population** not placeholder text
- **Immediate functionality** after deployment

### ❌ What to Avoid:
- Generic schema templates
- Assuming section structure
- Placeholder content
- Missing content fields
- Schema/content mismatches

## Replication Checklist

For each new page mapping:
- [ ] Read live page file completely
- [ ] Count exact sections manually
- [ ] Extract ALL content and media
- [ ] Create schema matching exact structure
- [ ] Populate with real content
- [ ] Deploy schema then import content
- [ ] Test functionality immediately

## Template Schema Structure
```typescript
export default {
  name: '[pagename]page',
  title: '[Page Name] Page',
  type: 'document',
  fields: [
    {
      name: 'section1',
      title: 'Section 1 - [Actual Section Name]',
      type: 'object',
      fields: [
        // Extract exact fields from live page
      ]
    },
    // Repeat for each section found in live page
  ]
}
```

This methodology ensures **100% accuracy** and **immediate functionality** for every CMS page mapping.