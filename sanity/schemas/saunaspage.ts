export default {
  name: 'saunaspage',
  title: 'Saunas Page',
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
          description: 'Main heading'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'Subheading text'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'images',
          title: 'Slideshow Images',
          type: 'array',
          of: [{
            type: 'image',
            options: { hotspot: true },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative Text'
              }
            ]
          }],
          validation: Rule => Rule.min(1).max(6)
        }
      ]
    },
    {
      name: 'introSection',
      title: 'Introduction Section',
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
          rows: 4
        }
      ]
    },
    {
      name: 'productsSection',
      title: 'Products Display',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'displayMode',
          title: 'Display Mode',
          type: 'string',
          options: {
            list: [
              { title: 'All Products', value: 'all' },
              { title: 'Featured Only', value: 'featured' },
              { title: 'Selected Products', value: 'selected' }
            ]
          }
        },
        {
          name: 'selectedProducts',
          title: 'Selected Products',
          type: 'array',
          of: [{ type: 'reference', to: { type: 'saunaProduct' } }],
          hidden: ({ parent }) => parent?.displayMode !== 'selected'
        }
      ]
    },
    {
      name: 'benefitsSection',
      title: 'Benefits Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Benefit Title',
                type: 'string'
              },
              {
                name: 'description',
                title: 'Benefit Description',
                type: 'text',
                rows: 2
              },
              {
                name: 'icon',
                title: 'Icon',
                type: 'image',
                description: 'Optional icon'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'processSection',
      title: 'Process Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'e.g., "How It Works"'
        },
        {
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'stepNumber',
                title: 'Step Number',
                type: 'string'
              },
              {
                name: 'title',
                title: 'Step Title',
                type: 'string'
              },
              {
                name: 'description',
                title: 'Step Description',
                type: 'text',
                rows: 2
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'ctaSection',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Saunas Page Content'
      }
    }
  }
}