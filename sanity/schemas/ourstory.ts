export default {
  name: 'ourstory',
  title: 'Our Story Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  options: {
    ignoreWarningsOnPublish: true,
  },
  fields: [
    {
      name: 'heroSection',
      title: '1. HERO SECTION - Main Banner at Top of Page',
      type: 'object',
      description: 'The big banner image and text at the very top of the Our Story page',
      fields: [
        {
          name: 'title',
          title: 'Large Main Title (H1 - Currently: "Test: Our Story")',
          type: 'string',
          description: 'The big text at the top of the page',
          defaultValue: 'Test: Our Story'
        },
        {
          name: 'subtitle',
          title: 'Smaller Subtitle Text',
          type: 'string',
          description: 'The smaller text below the main title',
          defaultValue: 'Redefining Luxury Wellness in BC'
        },
        {
          name: 'backgroundImageUrl',
          title: 'Background Image (URL from your web hosting)',
          type: 'url',
          description: 'The URL of your background image from web hosting',
          placeholder: 'e.g., https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48008e7f401389f87a.jpeg'
        }
      ]
    },
    {
      name: 'passionSection',
      title: '2. PASSION SECTION - "A Passion for Wellness"',
      type: 'object',
      description: 'The main content section with two paragraphs and a quote box',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'A Passion for Wellness, Made Accessible'
        },
        {
          name: 'paragraph1',
          title: 'FIRST Paragraph (Long Text Block)',
          type: 'text',
          rows: 4,
          description: 'The first paragraph of content',
          defaultValue: 'After years observing the sauna industry, we noticed something troubling: premium saunas were selling for over $40,000, putting the wellness benefits of regular sauna use out of reach for most Canadians. We believed there had to be a better way.'
        },
        {
          name: 'paragraph2',
          title: 'SECOND Paragraph (Long Text Block)',
          type: 'text',
          rows: 4,
          description: 'The second paragraph of content',
          defaultValue: 'That belief drove us to reimagine what a luxury sauna company could be. By cutting out excessive markups and focusing on direct relationships with our customers, we\'ve created premium saunas that rival those costing three times as much.'
        },
        {
          name: 'quote',
          title: 'QUOTE BOX (Big Highlighted Text)',
          type: 'text',
          rows: 3,
          description: 'The italicized quote in the gray box',
          defaultValue: 'We provide an affordable luxury product that can be easily installed in a short time frame – bringing the transformative power of sauna wellness to more Canadian homes.'
        }
      ]
    },
    {
      name: 'builtInCanadaSection',
      title: '3. CANADA SECTION - "Built in Canada" (Auto Slideshow)',
      type: 'object',
      description: 'Section with rotating background images and text',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'Built in Canada'
        },
        {
          name: 'paragraph1',
          title: 'FIRST Paragraph (Text Beside Slideshow)',
          type: 'text',
          rows: 3,
          description: 'The first paragraph of content',
          defaultValue: 'Every Ilio sauna is proudly crafted in British Columbia using locally sourced Western Red Cedar and time-tested construction techniques.'
        },
        {
          name: 'paragraph2',
          title: 'SECOND Paragraph (Text Beside Slideshow)',
          type: 'text',
          rows: 3,
          description: 'The second paragraph of content',
          defaultValue: 'We believe in supporting local artisans and maintaining the highest quality standards from forest to finish.'
        },
        {
          name: 'slideshowImages',
          title: 'BACKGROUND SLIDESHOW Images (5 images - Drag to reorder)',
          type: 'array',
          description: 'The images that rotate automatically in the background',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'imageUrl',
                title: 'Image URL from your web hosting',
                type: 'url',
                description: 'URL of the image',
                validation: Rule => Rule.required()
              },
              {
                name: 'alt',
                title: 'Alt Description (for accessibility)',
                type: 'string',
                description: 'Alternative text for screen readers'
              }
            ],
            preview: {
              select: {
                title: 'alt',
                subtitle: 'imageUrl',
                media: 'imageUrl'
              }
            }
          }],
          options: {
            sortable: true  // Allows drag-and-drop reordering
          },
          validation: Rule => Rule.max(5)
        }
      ]
    },
    {
      name: 'craftsmanshipSection',
      title: '4. CRAFTSMANSHIP SECTION - "BC Craftsmanship Meets Scandinavian Tradition"',
      type: 'object',
      description: 'Gray background section with feature cards',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'BC Craftsmanship Meets Scandinavian Tradition'
        },
        {
          name: 'description',
          title: 'Section Description (Intro Text)',
          type: 'text',
          rows: 3,
          description: 'The long paragraph introducing the features',
          defaultValue: 'Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna traditions to create something truly special.'
        },
        {
          name: 'features',
          title: 'FEATURE CARDS (3 cards - Drag to reorder)',
          type: 'array',
          description: 'The three feature cards below the description',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Card Title',
                type: 'string',
                description: 'The heading of the feature card'
              },
              {
                name: 'description',
                title: 'Card Description',
                type: 'text',
                rows: 3,
                description: 'The description text inside the card'
              }
            ]
          }],
          options: {
            sortable: true  // Allows drag-and-drop reordering
          },
          validation: Rule => Rule.max(3)
        }
      ]
    },
    {
      name: 'valuesSection',
      title: '5. VALUES SECTION - "What We Stand For"',
      type: 'object',
      description: 'White background section with three paragraphs',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'What We Stand For'
        },
        {
          name: 'paragraph1',
          title: 'FIRST Paragraph',
          type: 'text',
          rows: 4,
          description: 'The first paragraph of values content',
          defaultValue: 'At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, and transparency in everything we do.'
        },
        {
          name: 'paragraph2',
          title: 'SECOND Paragraph',
          type: 'text',
          rows: 4,
          description: 'The second paragraph of values content',
          defaultValue: 'Our commitment extends beyond delivering exceptional saunas. We\'re dedicated to educating our customers about the profound benefits of heat therapy, supporting sustainable forestry practices, and contributing to the wellness of our communities.'
        },
        {
          name: 'paragraph3',
          title: 'THIRD Paragraph',
          type: 'text',
          rows: 4,
          description: 'The third paragraph of values content',
          defaultValue: 'When you choose Ilio, you\'re not just investing in a sauna – you\'re joining a movement that believes wellness should be accessible, sustainable, and transformative for all Canadians.'
        }
      ]
    },
    {
      name: 'ctaSection',
      title: '6. CTA SECTION - "Ready to Transform Your Wellness Journey?"',
      type: 'object',
      description: 'Call-to-action section with buttons',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'The main heading of the CTA section',
          defaultValue: 'Ready to Transform Your Wellness Journey?'
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          description: 'The short description paragraph',
          defaultValue: 'Discover how an Ilio sauna can elevate your daily wellness routine'
        },
        {
          name: 'primaryButtonText',
          title: 'PRIMARY BUTTON Text',
          type: 'string',
          description: 'The text for the main call-to-action button',
          defaultValue: 'Explore Our Saunas'
        },
        {
          name: 'primaryButtonLink',
          title: 'PRIMARY BUTTON URL',
          type: 'string',
          description: 'The URL the primary button links to',
          defaultValue: '/saunas'
        },
        {
          name: 'secondaryButtonText',
          title: 'SECONDARY BUTTON Text',
          type: 'string',
          description: 'The text for the secondary button',
          defaultValue: 'Get in Touch'
        },
        {
          name: 'secondaryButtonLink',
          title: 'SECONDARY BUTTON URL',
          type: 'string',
          description: 'The URL the secondary button links to',
          defaultValue: '/contact'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Our Story Page Content',
        subtitle: 'All sections with image previews'
      }
    }
  }
}
