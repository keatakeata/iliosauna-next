// Sauna Product Schema for Sanity
// Copy this schema to your Sanity Studio

export default {
  name: 'saunaProduct',
  title: 'Sauna Products',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ]
        }
      ],
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price (optional)',
      type: 'number',
      validation: (Rule: any) => Rule.positive(),
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' }
          ],
        },
      ],
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        {
          name: 'dimensions',
          title: 'Dimensions',
          type: 'string',
        },
        {
          name: 'capacity',
          title: 'Capacity',
          type: 'string',
        },
        {
          name: 'heaterType',
          title: 'Heater Type',
          type: 'string',
        },
        {
          name: 'heaterPower',
          title: 'Heater Power',
          type: 'string',
        },
        {
          name: 'material',
          title: 'Material',
          type: 'string',
        },
        {
          name: 'warranty',
          title: 'Warranty',
          type: 'string',
        },
      ],
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'orderRank',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'heroImage',
      inStock: 'inStock',
    },
    prepare(selection: any) {
      const { title, price, media, inStock } = selection;
      return {
        title: title,
        subtitle: `$${price} - ${inStock ? 'In Stock' : 'Out of Stock'}`,
        media: media,
      };
    },
  },
};