export default {
  name: 'ourstory',
  title: 'Our Story Page',
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
          description: 'Main heading (e.g., "Our Story")'
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
      name: 'storySection',
      title: 'Story Content',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Story Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' }
              ]
            }
          ],
          description: 'Rich text content for your story'
        },
        {
          name: 'images',
          title: 'Story Images',
          type: 'array',
          of: [{
            type: 'image',
            options: { hotspot: true },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative Text'
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'valuesSection',
      title: 'Values Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'values',
          title: 'Company Values',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Value Title',
                type: 'string'
              },
              {
                name: 'description',
                title: 'Value Description',
                type: 'text',
                rows: 3
              },
              {
                name: 'icon',
                title: 'Icon Image',
                type: 'image',
                description: 'Optional icon for this value'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'teamSection',
      title: 'Team Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text'
        },
        {
          name: 'teamMembers',
          title: 'Team Members',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'name',
                title: 'Name',
                type: 'string'
              },
              {
                name: 'role',
                title: 'Role',
                type: 'string'
              },
              {
                name: 'bio',
                title: 'Bio',
                type: 'text',
                rows: 3
              },
              {
                name: 'image',
                title: 'Photo',
                type: 'image',
                options: { hotspot: true }
              }
            ]
          }]
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
        title: 'Our Story Page Content'
      }
    }
  }
}