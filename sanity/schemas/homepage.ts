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
          title: 'Title',
          type: 'string',
          description: 'Main heading (e.g., "Contemporary Luxury Saunas")'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          description: 'Subheading (e.g., "Scandinavian craftsmanship")'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          description: 'CTA button text (e.g., "View Models")'
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
      name: 'aboutSection',
      title: 'About Section (Make it stand out)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text',
          rows: 4
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text',
          rows: 4
        },
        {
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          description: 'URL to the video file'
        },
        {
          name: 'videoPoster',
          title: 'Video Poster Image',
          type: 'image',
          description: 'Image shown before video plays'
        }
      ]
    },
    {
      name: 'premiumDetailsSection',
      title: 'Premium Details Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Feature Title',
                type: 'string'
              },
              {
                name: 'description',
                title: 'Feature Description',
                type: 'text',
                rows: 2
              },
              {
                name: 'image',
                title: 'Feature Image',
                type: 'image',
                options: { hotspot: true }
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'testimonialSection',
      title: 'Testimonial Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'showTestimonials',
          title: 'Show Testimonials',
          type: 'boolean',
          description: 'Pull testimonials from testimonial documents'
        }
      ]
    },
    {
      name: 'ctaSection',
      title: 'Call to Action Section',
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