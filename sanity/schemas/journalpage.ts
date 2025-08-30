export default {
  name: 'journalpage',
  title: 'Journal Page',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Main heading (e.g., "Journal", "Blog", "Insights")'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'Subheading text'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'introSection',
      title: 'Introduction',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          description: 'Introduction text for the blog/journal'
        }
      ]
    },
    {
      name: 'featuredSection',
      title: 'Featured Posts Section',
      type: 'object',
      fields: [
        {
          name: 'showFeatured',
          title: 'Show Featured Posts',
          type: 'boolean',
          description: 'Display a featured posts section'
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'e.g., "Featured Articles"',
          hidden: ({ parent }) => !parent?.showFeatured
        },
        {
          name: 'featuredPosts',
          title: 'Featured Posts',
          type: 'array',
          of: [{ type: 'reference', to: { type: 'blogPost' } }],
          validation: Rule => Rule.max(3),
          hidden: ({ parent }) => !parent?.showFeatured
        }
      ]
    },
    {
      name: 'categoriesSection',
      title: 'Categories Section',
      type: 'object',
      fields: [
        {
          name: 'showCategories',
          title: 'Show Categories Filter',
          type: 'boolean',
          description: 'Display category filters'
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'e.g., "Browse by Category"',
          hidden: ({ parent }) => !parent?.showCategories
        }
      ]
    },
    {
      name: 'listingSection',
      title: 'Posts Listing Settings',
      type: 'object',
      fields: [
        {
          name: 'postsPerPage',
          title: 'Posts Per Page',
          type: 'number',
          description: 'Number of posts to show per page',
          validation: Rule => Rule.min(1).max(20)
        },
        {
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Grid', value: 'grid' },
              { title: 'List', value: 'list' },
              { title: 'Cards', value: 'cards' }
            ]
          }
        },
        {
          name: 'showExcerpt',
          title: 'Show Post Excerpts',
          type: 'boolean'
        },
        {
          name: 'showAuthor',
          title: 'Show Author Info',
          type: 'boolean'
        },
        {
          name: 'showDate',
          title: 'Show Publish Date',
          type: 'boolean'
        },
        {
          name: 'showReadTime',
          title: 'Show Reading Time',
          type: 'boolean'
        }
      ]
    },
    {
      name: 'newsletterSection',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        {
          name: 'showNewsletter',
          title: 'Show Newsletter Signup',
          type: 'boolean'
        },
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          hidden: ({ parent }) => !parent?.showNewsletter
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          hidden: ({ parent }) => !parent?.showNewsletter
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          hidden: ({ parent }) => !parent?.showNewsletter
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Journal Page Settings'
      }
    }
  }
}