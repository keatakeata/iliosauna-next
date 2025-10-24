export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Main Headline',
          type: 'string',
          description: 'Currently shows: "Contemporary Luxury Saunas"',
          defaultValue: 'Contemporary Luxury Saunas'
        },
        {
          name: 'subtitle',
          title: 'Subheading',
          type: 'string',
          description: 'Currently shows: "Built in Canada. Inspired by Scandinavian craftsmanship"',
defaultValue: 'Built in Canada. Inspired by Scandinavian craftsmanship'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          description: 'Currently shows: "View Models" - this button links to the saunas page',
defaultValue: 'View Models'
        },
        {
          name: 'images',
          title: 'Slideshow Images',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'imageFile',
                title: 'Upload Image',
                type: 'image',
                options: { hotspot: true }
              },
              {
                name: 'imageUrl',
                title: 'OR Image URL (CYA hosted)',
                type: 'url',
                description: 'Use this for CYA hosted images instead of uploading'
              },
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative Text'
              }
            ],
            preview: {
              select: {
                imageFile: 'imageFile',
                imageUrl: 'imageUrl',
                alt: 'alt'
              },
              prepare(selection) {
                const { imageFile, imageUrl, alt } = selection
                return {
                  title: alt || 'Hero Image',
                  media: imageFile,
                  imageUrl: imageUrl
                }
              },
              component: (props) => {
                const { ImagePreview } = require('../components/ImagePreview')
                return ImagePreview(props)
              }
            }
          }],
          validation: Rule => Rule.min(1).max(6)
        }
      ]
    },
    {
      name: 'aboutSection',
      title: '"Make it stand out" Section (About)',
      type: 'object',
      description: 'This is the section with the heading "Make it stand out" that appears after the hero section',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'Currently shows: "Make it stand out"',
defaultValue: 'Make it stand out'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text',
          rows: 4,
          description: 'Currently: "At ilio, we believe wellness should be accessible, beautiful, and transformative. Our contemporary saunas combine Scandinavian craftsmanship with modern design principles."',
defaultValue: 'At ilio, we believe wellness should be accessible, beautiful, and transformative. Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.'
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text',
          rows: 4,
          description: 'Currently: "Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted with advanced heating systems for an experience that lasts."',
defaultValue: 'Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted with advanced heating systems for an experience that lasts.'
        },
        {
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          description: 'Currently shows the sauna craftsmanship video',
defaultValue: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0b776b0fbe591e36c.mp4'
        },
        {
          name: 'videoPoster',
          title: 'Video Poster Image',
          type: 'image',
          description: 'Image shown before video plays (thumbnail)'
        }
      ]
    },
    {
      name: 'saunaShowcaseSection',
      title: '"ilio Sauna" Section (3 Product Cards)',
      type: 'object',
      description: 'This is the section with "ilio Sauna" heading and 3 cards: Contemporary Design, Premium Materials, Wellness Focused',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'Currently shows: "ilio Sauna"',
          defaultValue: 'ilio Sauna'
        },
        {
          name: 'subtitle',
          title: 'Section Description',
          type: 'text',
          description: 'Currently shows: "Thoughtfully designed saunas that seamlessly integrate into your lifestyle and space"',
          defaultValue: 'Thoughtfully designed saunas that seamlessly integrate into your lifestyle and space'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          description: 'Currently shows: "Explore Sauna Options"',
          defaultValue: 'Explore Sauna Options'
        },
        {
          name: 'cards',
          title: 'Sauna Feature Cards',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Card Title',
                type: 'string'
              },
              {
                name: 'description',
                title: 'Card Description',
                type: 'text'
              },
              {
                name: 'image',
                title: 'Legacy Image (keep for migration)',
                type: 'image',
                hidden: true
              },
              {
                name: 'imageFile',
                title: 'Upload Image',
                type: 'image'
              },
              {
                name: 'imageUrl',
                title: 'OR Image URL (CYA hosted)',
                type: 'url',
                description: 'Use this for CYA hosted images instead of uploading'
              }
            ],
            preview: {
              select: {
                title: 'title',
                image: 'image',
                imageFile: 'imageFile',
                imageUrl: 'imageUrl'
              },
              prepare(selection) {
                const { title, image, imageFile, imageUrl } = selection
                return {
                  title: title || 'Sauna Card',
                  media: imageFile || image,
                  imageUrl: imageUrl
                }
              },
              component: (props) => {
                const { ImagePreview } = require('../components/ImagePreview')
                return ImagePreview(props)
              }
            }
          }],
          initialValue: [
            {
              title: 'Contemporary Design',
              description: 'Minimalist aesthetics meet maximum comfort in our signature contemporary designs'
            },
            {
              title: 'Premium Materials', 
              description: 'Handpicked Western Red Cedar and premium components for lasting beauty'
            },
            {
              title: 'Wellness Focused',
              description: 'Engineered for optimal heat distribution and therapeutic benefits'
            }
          ]
        }
      ]
    },
    {
      name: 'testimonialSection',
      title: '"Client Experiences" Section (Reviews Carousel)',
      type: 'object',
      description: 'This is the section with "Client Experiences" heading and sliding customer testimonials with star ratings',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'Currently shows: "Client Experiences"',
          defaultValue: 'Client Experiences'
        },
        {
          name: 'subtitle',
          title: 'Section Description',
          type: 'text',
          description: 'Currently shows: "Discover what our early adopters are saying about their ilio Sauna journey"',
          defaultValue: 'Discover what our early adopters are saying about their ilio Sauna journey'
        }
      ]
    },
    {
      name: 'newsletterSection',
      title: '"They grow up so fast" Section (Email Signup)',
      type: 'object',
      description: 'This is the dark section with background image, "They grow up so fast" heading and email signup form',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'Currently shows: "They grow up so fast"',
          defaultValue: 'They grow up so fast'
        },
        {
          name: 'subtitle',
          title: 'Section Description',
          type: 'text',
          description: 'Currently shows: "Don\'t miss a thing. Sign up to receive updates about new products, wellness insights, and exclusive offers from ilio."',
          defaultValue: 'Don\'t miss a thing. Sign up to receive updates about new products, wellness insights, and exclusive offers from ilio.'
        },
        {
          name: 'buttonText',
          title: 'Subscribe Button Text',
          type: 'string',
          description: 'Currently shows: "Subscribe"',
          defaultValue: 'Subscribe'
        },
        {
          name: 'backgroundImageFile',
          title: 'Upload Background Image',
          type: 'image',
          description: 'Upload background image for this section'
        },
        {
          name: 'backgroundImageUrl',
          title: 'OR Background Image URL (CYA hosted)',
          type: 'url',
          description: 'Use this for CYA hosted background image instead of uploading'
        }
      ]
    },
    {
      name: 'contactSection',
      title: '"Contact" Section (Final CTA)',
      type: 'object',
      description: 'This is the final section with "Contact" heading and "Get Started" button',
      fields: [
        {
          name: 'title',
          title: 'Section Heading',
          type: 'string',
          description: 'Currently shows: "Contact"',
          defaultValue: 'Contact'
        },
        {
          name: 'subtitle',
          title: 'Section Description',
          type: 'text',
          description: 'Currently shows: "Ready to transform your space with a luxury sauna? Get in touch to discuss your project"',
          defaultValue: 'Ready to transform your space with a luxury sauna? Get in touch to discuss your project'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          description: 'Currently shows: "Get Started"',
          defaultValue: 'Get Started'
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          description: 'Where the button links to',
          defaultValue: '/contact'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'heroSection.title'
    },
    prepare() {
      return {
        title: 'Homepage Content'
      }
    }
  }
}