export default {
  name: 'ourstory-clean',
  title: 'Our Story Page (Clean Version)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heroSettings',
      title: '🎯 1. HERO BANNER - Main Top Section',
      type: 'object',
      description: 'The big image banner and text that appears at the very top',
      fields: [
        {
          name: 'mainTitle',
          title: 'Main Headline (H1) - Shows: "Test2: Our Story"',
          type: 'string',
          description: 'The large text displayed over the image',
          defaultValue: 'Test2: Our Story'
        },
        {
          name: 'subTitle',
          title: 'Subheadline Text - Shows: "Redefining Luxury Wellness in BC"',
          type: 'string',
          description: 'Smaller text below the main headline',
          defaultValue: 'Redefining Luxury Wellness in BC'
        },
        {
          name: 'imageSourceUrl',
          title: 'Background Image URL - Your Web Hosting',
          type: 'url',
          description: 'Paste the URL of your background image from web hosting (Google Cloud, AWS, etc.)',
          placeholder: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48008e7f401389f87a.jpeg'
        }
      ]
    },
    {
      name: 'storySection',
      title: '📖 2. MAIN STORY SECTION - "A Passion for Wellness"',
      type: 'object',
      description: 'The main content area with paragraphs and a highlighted quote',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Heading - Shows: "A Passion for Wellness, Made Accessible"',
          type: 'string',
          description: 'The heading for this story section',
          defaultValue: 'A Passion for Wellness, Made Accessible'
        },
        {
          name: 'storyText1',
          title: 'First Story Paragraph - About the sauna industry',
          type: 'text',
          rows: 4,
          description: 'Main story paragraph about observing the industry',
          defaultValue: 'After years observing the sauna industry, we noticed something troubling: premium saunas were selling for over $40,000, putting the wellness benefits of regular sauna use out of reach for most Canadians. We believed there had to be a better way.'
        },
        {
          name: 'storyText2',
          title: 'Second Story Paragraph - About the reimagined company',
          type: 'text',
          rows: 4,
          description: 'Second paragraph about creating accessible luxury',
          defaultValue: 'That belief drove us to reimagine what a luxury sauna company could be. By cutting out excessive markups and focusing on direct relationships with our customers, we\'ve created premium saunas that rival those costing three times as much.'
        },
        {
          name: 'highlightedQuote',
          title: 'QUOTE BOX - Show This Text: "We provide an affordable luxury..."',
          type: 'text',
          rows: 3,
          description: 'The important quote shown in a highlighted box',
          defaultValue: 'We provide an affordable luxury product that can be easily installed in a short time frame – bringing the transformative power of sauna wellness to more Canadian homes.'
        }
      ]
    },
    {
      name: 'canadaSection',
      title: '🇨🇦 3. CANADA BUILT SECTION - "Built in Canada" with Auto-Slideshow',
      type: 'object',
      description: 'The section with automatically rotating images and text about Canadian craftsmanship',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Heading - Shows: "Built in Canada"',
          type: 'string',
          description: 'The heading for this section',
          defaultValue: 'Built in Canada'
        },
        {
          name: 'canadaText1',
          title: 'First Canada Paragraph - About BC craftsmanship',
          type: 'text',
          rows: 3,
          description: 'Text about red cedar and construction techniques',
          defaultValue: 'Every Ilio sauna is proudly crafted in British Columbia using locally sourced Western Red Cedar and time-tested construction techniques.'
        },
        {
          name: 'canadaText2',
          title: 'Second Canada Paragraph - About artisans and quality',
          type: 'text',
          rows: 3,
          description: 'Text about artisans and quality standards',
          defaultValue: 'We believe in supporting local artisans and maintaining the highest quality standards from forest to finish.'
        },
        {
          name: 'autoSlideshowItems',
          title: '🖼️ 5 AUTO-SLIDESHOW IMAGES - Drag any row up/down to reorder!',
          type: 'array',
          description: 'Images that automatically rotate every 4 seconds. Client can drag rows to change order.',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'imageUrl',
                title: 'Image URL - Paste your web hosting link',
                type: 'url',
                description: 'Direct URL to your image (from Google Cloud, AWS, etc.)',
                validation: Rule => Rule.required()
              },
              {
                name: 'altDescription',
                title: 'Alt Text - Image description',
                type: 'string',
                description: 'Brief description for accessibility and SEO'
              }
            ],
            preview: {
              select: {
                title: 'altDescription',
                subtitle: 'imageUrl',
                media: 'imageUrl'
              },
              prepare({ title, subtitle, media }) {
                return {
                  title: title || 'No alt text',
                  subtitle: subtitle || 'No URL',
                  media: media ? { _type: 'image', url: media } : null
                }
              }
            }
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
      title: '⚒️ 4. CRAFTSMANSHIP SECTION - Feature Cards with Icons',
      type: 'object',
      description: 'Section with 3 feature cards that highlight key benefits',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Heading - Shows: "BC Craftsmanship Meets Scandinavian Tradition"',
          type: 'string',
          description: 'The heading for the craftsmanship section',
          defaultValue: 'BC Craftsmanship Meets Scandinavian Tradition'
        },
        {
          name: 'craftIntroText',
          title: 'Introductory Text - Describes the craftsmanship approach',
          type: 'text',
          rows: 3,
          description: 'Long paragraph introducing the craft features',
          defaultValue: 'Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna traditions to create something truly special.'
        },
        {
          name: 'craftFeatures',
          title: '⚒️ 3 FEATURE CARDS - Drag any card up/down to reorder!',
          type: 'array',
          description: 'The three cards showing key features. Client can drag cards to change order.',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'featureTitle',
                title: 'Feature Title',
                type: 'string',
                description: 'The bold heading of the feature card'
              },
              {
                name: 'featureDescription',
                title: 'Feature Description',
                type: 'text',
                rows: 3,
                description: 'The paragraph text inside the card'
              }
            ],
            preview: {
              select: {
                title: 'featureTitle',
                subtitle: 'featureDescription'
              },
              prepare({ title, subtitle }) {
                return {
                  title: title || 'No title',
                  subtitle: subtitle?.slice(0, 50) + (subtitle?.length > 50 ? '...' : '') || 'No description'
                }
              }
            }
          }],
          options: {
            sortable: true
          },
          validation: Rule => Rule.min(3).max(3).error('Must have exactly 3 feature cards')
        }
      ]
    },
    {
      name: 'valuesSection',
      title: '✨ 5. VALUES SECTION - "What We Stand For"',
      type: 'object',
      description: 'Three centered paragraphs about company values',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Heading - Shows: "What We Stand For"',
          type: 'string',
          description: 'The heading for the values section',
          defaultValue: 'What We Stand For'
        },
        {
          name: 'valuesText1',
          title: 'FIRST Values Paragraph - About daily wellness',
          type: 'text',
          rows: 4,
          description: 'First paragraph about wellness philosophy',
          defaultValue: 'At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, and transparency in everything we do.'
        },
        {
          name: 'valuesText2',
          title: 'SECOND Values Paragraph - About commitment',
          type: 'text',
          rows: 4,
          description: 'Second paragraph about company commitment',
          defaultValue: 'Our commitment extends beyond delivering exceptional saunas. We\'re dedicated to educating our customers about the profound benefits of heat therapy, supporting sustainable forestry practices, and contributing to the wellness of our communities.'
        },
        {
          name: 'valuesText3',
          title: 'THIRD Values Paragraph - About the movement',
          type: 'text',
          rows: 4,
          description: 'Third paragraph about the wellness movement',
          defaultValue: 'When you choose Ilio, you\'re not just investing in a sauna – you\'re joining a movement that believes wellness should be accessible, sustainable, and transformative for all Canadians.'
        }
      ]
    },
    {
      name: 'ctaSection',
      title: '🎯 6. CALL TO ACTION SECTION - Bottom Buttons',
      type: 'object',
      description: 'The final section with two call-to-action buttons',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Heading - Shows: "Ready to Transform Your Wellness Journey?"',
          type: 'string',
          description: 'The main heading of the call-to-action section',
          defaultValue: 'Ready to Transform Your Wellness Journey?'
        },
        {
          name: 'ctaDescription',
          title: 'CTA Description - Shows: "Discover how an Ilio sauna..."',
          type: 'text',
          rows: 2,
          description: 'Short description paragraph',
          defaultValue: 'Discover how an Ilio sauna can elevate your daily wellness routine'
        },
        {
          name: 'primaryButtonText',
          title: 'PRIMARY BUTTON Text - Shows: "Explore Our Saunas"',
          type: 'string',
          description: 'The text for the main (orange) button',
          defaultValue: 'Explore Our Saunas'
        },
        {
          name: 'primaryButtonUrl',
          title: 'PRIMARY BUTTON URL - Current: "/saunas"',
          type: 'string',
          description: 'Where the primary button should link to',
          defaultValue: '/saunas'
        },
        {
          name: 'secondaryButtonText',
          title: 'SECONDARY BUTTON Text - Shows: "Get in Touch"',
          type: 'string',
          description: 'The text for the secondary (gray) button',
          defaultValue: 'Get in Touch'
        },
        {
          name: 'secondaryButtonUrl',
          title: 'SECONDARY BUTTON URL - Current: "/contact"',
          type: 'string',
          description: 'Where the secondary button should link to',
          defaultValue: '/contact'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Our Story Page (Clean)',
        subtitle: 'All sections with drag & reorder, URL uploads, thumbnails'
      }
    }
  }
}
