// Our Story CMS - CompHtrkpletely Clean Schema
// Built using Sanity CLI best practices

export default {
  name: 'ourstory-final',
  title: 'Our Story CMS (Final Clean)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  fields: [
    // HERO SECTION - Nested object to match page component structure
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      description: 'Main hero section with title, subtitle, and background image',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          description: 'The main headline',
          placeholder: 'Our Story'
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'string',
          description: 'Smaller text below the main headline',
          placeholder: 'Redefining Luxury Wellness in BC'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image (optional)',
          type: 'image',
          description: 'Hero background image'
        },
        {
          name: 'backgroundImageUrl',
          title: 'Background Image URL (fallback)',
          type: 'url',
          description: 'URL fallback for background image',
          placeholder: 'https://storage.googleapis.com/your-image.jpg'
        }
      ]
    },

    // PASSION SECTION
    {
      name: 'passionSection',
      title: 'Passion Section',
      type: 'object',
      description: 'Main story section with passion for wellness',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          placeholder: 'A Passion for Wellness, Made Accessible'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 4,
          placeholder: 'After years observing the sauna industry...'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 4,
          placeholder: 'That belief drove us to reimagine...'
        },
        {
          name: 'quote',
          title: 'Quote Text',
          type: 'text',
          rows: 3,
          placeholder: 'We provide an affordable luxury product...'
        }
      ]
    },

    // BUILT IN CANADA SECTION
    {
      name: 'builtInCanadaSection',
      title: 'Built in Canada Section',
      type: 'object',
      description: 'Section about local craftsmanship',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          placeholder: 'Built in Canada'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 3,
          placeholder: 'Every ilio sauna is proudly crafted...'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 3,
          placeholder: 'We believe in supporting local artisans...'
        },
        {
          name: 'slideshowImages',
          title: 'Slideshow Images',
          type: 'array',
          description: 'Images for the slideshow gallery',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'image',
                title: 'Image',
                type: 'image',
                description: 'Image file'
              },
              {
                name: 'imageUrl',
                title: 'Image URL (fallback)',
                type: 'url',
                description: 'URL fallback for image',
                placeholder: 'https://storage.googleapis.com/your-image.jpg'
              },
              {
                name: 'alt',
                title: 'Alt Text',
                type: 'string',
                description: 'Alt text for accessibility'
              }
            ],
            preview: {
              select: {
                title: 'alt',
                subtitle: 'imageUrl'
              },
              prepare({ title, subtitle }: { title?: string, subtitle?: string }) {
                return {
                  title: title || 'Image needs alt text',
                  subtitle: subtitle ? subtitle.substring(0, 40) + '...' : 'No URL'
                }
              }
            }
          }],
          options: {
            sortable: true
          },
          validation: (Rule: any) => Rule.max(6).warning('Keep slideshow to 6 images or fewer')
        }
      ]
    },

    // CRAFTSMANSHIP SECTION
    {
      name: 'craftsmanshipSection',
      title: 'Craftsmanship Section',
      type: 'object',
      description: 'Section about craftsmanship and features',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          placeholder: 'BC Craftsmanship Meets Scandinavian Tradition'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          placeholder: 'Every ilio sauna is meticulously crafted...'
        },
        {
          name: 'features',
          title: 'Features',
          type: 'array',
          description: 'Feature cards',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Feature Title',
                type: 'string',
                placeholder: 'Premium Materials'
              },
              {
                name: 'description',
                title: 'Feature Description',
                type: 'text',
                rows: 3,
                placeholder: 'Canadian red cedar and industry-leading heaters...'
              }
            ],
            preview: {
              select: {
                title: 'title',
                subtitle: 'description'
              },
              prepare({ title, subtitle }: { title?: string, subtitle?: string }) {
                return {
                  title: title || 'Feature needs title',
                  subtitle: subtitle ? subtitle.substring(0, 50) + '...' : 'No description'
                }
              }
            }
          }],
          validation: (Rule: any) => Rule.min(3).max(3).error('Must have exactly 3 features')
        }
      ]
    },

    // VALUES SECTION
    {
      name: 'valuesSection',
      title: 'Values Section',
      type: 'object',
      description: 'Section about company values',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          placeholder: 'What We Stand For'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 4,
          placeholder: 'At ilio, we believe that wellness...'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 4,
          placeholder: 'Our commitment extends beyond...'
        },
        {
          name: 'paragraph3',
          title: 'Paragraph 3',
          type: 'text',
          rows: 4,
          placeholder: 'When you choose ilio...'
        }
      ]
    },

    // CALL TO ACTION SECTION
    {
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      description: 'Call to action section',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          placeholder: 'Ready to Transform Your Wellness Journey?'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          placeholder: 'Discover how an ilio sauna can elevate your daily wellness routine'
        },
        {
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          placeholder: 'Explore Our Saunas'
        },
        {
          name: 'primaryButtonLink',
          title: 'Primary Button URL',
          type: 'string',
          placeholder: '/saunas'
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          placeholder: 'Get in Touch'
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button URL',
          type: 'string',
          placeholder: '/contact'
        }
      ]
    }
  ],

  preview: {
    prepare() {
      return {
        title: 'Our Story CMS (Final)',
        subtitle: 'Complete with thumbnails, drag-and-drop reordering, URL inputs'
      }
    }
  }
}
