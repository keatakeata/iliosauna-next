export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'color',
      title: 'Category Color',
      type: 'string',
      description: 'Hex color for category badges (e.g. #9B8B7E)',
      validation: (Rule: any) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji for this category'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which categories appear'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
}