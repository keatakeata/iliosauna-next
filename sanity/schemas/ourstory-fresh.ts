export default {
  name: 'ourstory-fresh',
  title: 'Our Story Page (Fresh)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  options: {
    ignoreWarningsOnPublish: true,
  },
  fields: [
    {
      name: 'heroSection',
      title: '1. HERO SECTION',
      type: 'object',
      description: 'Main banner at top of page',
      fields: [
        {
          name: 'title',
          title: 'Large Title (H1)',
          type: 'string',
          description: 'The big heading at top',
          defaultValue: 'Test: Our Story'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'Text below the main title',
          defaultValue: 'Redefining Luxury Wellness in BC'
        },
        {
          name: 'backgroundImageUrl',
          title: 'Background Image URL',
          type: 'url',
          description: 'URL from your web hosting',
          placeholder: 'https://storage.googleapis.com/your-image.jpg'
        }
      ]
    },
    {
      name: 'passionSection',
      title: '2. PASSION SECTION',
      type: 'object',
      description: 'Main story section',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'A Passion for Wellness, Made Accessible'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 4,
          description: 'First paragraph of content',
          defaultValue: 'After years observing the sauna industry, we noticed something troubling: premium saunas were selling for over $40,000, putting the wellness benefits of regular sauna use out of reach for most Canadians. We believed there had to be a better way.'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 4,
          description: 'Second paragraph of content',
          defaultValue: 'That belief drove us to reimagine what a luxury sauna company could be. By cutting out excessive markups and focusing on direct relationships with our customers, we\'ve created premium saunas that rival those costing three times as much.'
        },
        {
          name: 'quote',
          title: 'Quote Text',
          type: 'text',
          rows: 3,
          description: 'The italicized quote',
          defaultValue: 'We provide an affordable luxury product that can be easily installed in a short time frame – bringing the transformative power of sauna wellness to more Canadian homes.'
        }
      ]
    },
    {
      name: 'builtInCanadaSection',
      title: '3. CANADA SECTION',
      type: 'object',
      description: 'Section with slideshow',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Heading for this section',
          defaultValue: 'Built in Canada'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 3,
          description: 'First paragraph',
          defaultValue: 'Every Ilio sauna is proudly crafted in British Columbia using locally sourced Western Red Cedar and time-tested construction techniques.'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 3,
          description: 'Second paragraph',
          defaultValue: 'We believe in supporting local artisans and maintaining the highest quality standards from forest to finish.'
        },
        {
          name: 'slideshowImages',
          title: '5 Slideshow Images (Drag to reorder)',
          type: 'array',
          description: 'Auto-rotating images',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'imageUrl',
                title: 'Image URL',
                type: 'url',
                description: 'URL from your web hosting'
              },
              {
                name: 'alt',
                title: 'Alt Text',
                type: 'string',
                description: 'Alternative text'
              }
            ]
          }],
          options: {
            sortable: true
          },
          validation: Rule => Rule.max(5)
        }
      ]
    },
    {
      name: 'craftsmanshipSection',
      title: '4. CRAFTSMANSHIP SECTION',
      type: 'object',
      description: 'Feature cards section',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Heading for this section',
          defaultValue: 'BC Craftsmanship Meets Scandinavian Tradition'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          description: 'Intro paragraph',
          defaultValue: 'Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna traditions to create something truly special.'
        },
        {
          name: 'features',
          title: '3 Feature Cards (Drag to reorder)',
          type: 'array',
          description: 'The three feature items',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Card Title',
                type: 'string',
                description: 'Heading of card'
              },
              {
                name: 'description',
                title: 'Card Description',
                type: 'text',
                rows: 3,
                description: 'Description text'
              }
            ]
          }],
          options: {
            sortable: true
          },
          validation: Rule => Rule.max(3)
        }
      ]
    },
    {
      name: 'valuesSection',
      title: '5. VALUES SECTION',
      type: 'object',
      description: 'What we stand for section',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Section heading',
          defaultValue: 'What We Stand For'
        },
        {
          name: 'paragraph1',
          title: 'Paragraph 1',
          type: 'text',
          rows: 4,
          description: 'First values paragraph',
          defaultValue: 'At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, and transparency in everything we do.'
        },
        {
          name: 'paragraph2',
          title: 'Paragraph 2',
          type: 'text',
          rows: 4,
          description: 'Second values paragraph',
          defaultValue: 'Our commitment extends beyond delivering exceptional saunas. We\'re dedicated to educating our customers about the profound benefits of heat therapy, supporting sustainable forestry practices, and contributing to the wellness of our communities.'
        },
        {
          name: 'paragraph3',
          title: 'Paragraph 3',
          type: 'text',
          rows: 4,
          description: 'Third values paragraph',
          defaultValue: 'When you choose Ilio, you\'re not just investing in a sauna – you\'re joining a movement that believes wellness should be accessible, sustainable, and transformative for all Canadians.'
        }
      ]
    },
    {
      name: 'ctaSection',
      title: '6. CALL TO ACTION SECTION',
      type: 'object',
      description: 'Bottom section with buttons',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'CTA heading',
          defaultValue: 'Ready to Transform Your Wellness Journey?'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          description: 'CTA subtitle text',
          defaultValue: 'Discover how an Ilio sauna can elevate your daily wellness routine'
        },
        {
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          description: 'Main button label',
          defaultValue: 'Explore Our Saunas'
        },
        {
          name: 'primaryButtonLink',
          title: 'Primary Button URL',
          type: 'string',
          description: 'Primary button destination',
          defaultValue: '/saunas'
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          description: 'Second button label',
          defaultValue: 'Get in Touch'
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button URL',
          type: 'string',
          description: 'Secondary button destination',
          defaultValue: '/contact'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Our Story Page (Fresh)',
        subtitle: 'New clean schema with all sections'
      }
    }
  }
}
