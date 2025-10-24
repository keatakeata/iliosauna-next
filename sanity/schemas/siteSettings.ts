export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Name of the website (e.g., "ilio Sauna")'
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of the site for SEO'
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Small icon for browser tabs'
    },
    {
      name: 'headerSettings',
      title: 'Header Settings',
      type: 'object',
      fields: [
        {
          name: 'showCart',
          title: 'Show Shopping Cart',
          type: 'boolean',
          description: 'Toggle cart functionality'
        },
        {
          name: 'showAuth',
          title: 'Show Sign In/Sign Up',
          type: 'boolean',
          description: 'Toggle authentication buttons'
        },
        {
          name: 'mobileSlogan',
          title: 'Mobile Menu Slogan',
          type: 'string',
          description: 'Text shown in mobile menu (e.g., "Live well")'
        }
      ]
    },
    {
      name: 'footerSettings',
      title: 'Footer Settings',
      type: 'object',
      fields: [
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string'
        },
        {
          name: 'footerLinks',
          title: 'Footer Links',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Link Title',
                type: 'string'
              },
              {
                name: 'url',
                title: 'Link URL',
                type: 'string'
              }
            ]
          }]
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
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Primary Email',
          type: 'string'
        },
        {
          name: 'phone',
          title: 'Primary Phone',
          type: 'string'
        },
        {
          name: 'address',
          title: 'Business Address',
          type: 'text',
          rows: 3
        }
      ]
    },
    {
      name: 'analytics',
      title: 'Analytics & Tracking',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'GA tracking ID (e.g., G-XXXXXXXXXX)'
        },
        {
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string'
        }
      ]
    },
    {
      name: 'defaultSeo',
      title: 'Default SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3
        },
        {
          name: 'ogImage',
          title: 'Default Open Graph Image',
          type: 'image',
          description: 'Default image for social media shares'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings'
      }
    }
  }
}