export default {
  name: 'contactpage',
  title: 'Contact Page',
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
          description: 'Main heading (e.g., "Get in Touch")'
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
      name: 'contactInfo',
      title: 'Contact Information',
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
          rows: 3
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string'
        },
        {
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            {
              name: 'street',
              title: 'Street Address',
              type: 'string'
            },
            {
              name: 'city',
              title: 'City',
              type: 'string'
            },
            {
              name: 'state',
              title: 'State/Province',
              type: 'string'
            },
            {
              name: 'zip',
              title: 'ZIP/Postal Code',
              type: 'string'
            },
            {
              name: 'country',
              title: 'Country',
              type: 'string'
            }
          ]
        },
        {
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'days',
                title: 'Days',
                type: 'string',
                description: 'e.g., "Monday - Friday"'
              },
              {
                name: 'hours',
                title: 'Hours',
                type: 'string',
                description: 'e.g., "9:00 AM - 6:00 PM"'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'formSection',
      title: 'Contact Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Form Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Form Description',
          type: 'text',
          rows: 2
        },
        {
          name: 'successMessage',
          title: 'Success Message',
          type: 'string',
          description: 'Message shown after successful form submission'
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
          type: 'string',
          description: 'e.g., "Ready to Experience Luxury?"'
        },
        {
          name: 'phoneText',
          title: 'Phone CTA Text',
          type: 'string',
          description: 'e.g., "Call us directly"'
        },
        {
          name: 'phoneNumber',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'emailText',
          title: 'Email CTA Text',
          type: 'string',
          description: 'e.g., "Send us an email"'
        },
        {
          name: 'emailAddress',
          title: 'Email Address',
          type: 'string'
        }
      ]
    },
    {
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url'
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url'
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url'
        }
      ]
    },
    {
      name: 'mapSection',
      title: 'Map Section',
      type: 'object',
      fields: [
        {
          name: 'showMap',
          title: 'Show Map',
          type: 'boolean',
          description: 'Display embedded map on contact page'
        },
        {
          name: 'mapEmbed',
          title: 'Map Embed Code',
          type: 'text',
          description: 'Google Maps embed code or similar',
          hidden: ({ parent }) => !parent?.showMap
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page Content'
      }
    }
  }
}