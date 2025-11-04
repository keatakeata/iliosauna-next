export default {
  name: 'ghlProduct',
  title: 'GHL Products',
  type: 'document',
  fields: [
    {
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
      description: 'Unique product ID from Stripe (source of truth for pricing)'
    },
    {
      name: 'ghlProductId',
      title: 'GHL Product ID',
      type: 'string',
      description: 'Unique product ID from GoHighLevel',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    },
    {
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'salePrice',
      title: 'Sale Price (CAD)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0)
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'Image URL',
              type: 'url'
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            },
            {
              name: 'priceIds',
              title: 'Associated Price IDs',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Price variant IDs this image is associated with'
            },
            {
              name: 'isFeatured',
              title: 'Is Featured Image',
              type: 'boolean'
            }
          ]
        }
      ]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Saunas', value: 'saunas' },
          { title: 'Infrared', value: 'infrared' },
          { title: 'Cold Therapy', value: 'cold-therapy' },
          { title: 'Wellness', value: 'wellness' }
        ]
      }
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of key product features'
    },
    {
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Variant Name',
              type: 'string'
            },
            {
              name: 'price',
              title: 'Variant Price',
              type: 'number'
            },
            {
              name: 'priceId',
              title: 'Price ID',
              type: 'string',
              description: 'GHL Price ID for matching to images'
            },
            {
              name: 'stripePriceId',
              title: 'Stripe Price ID',
              type: 'string',
              description: 'Stripe Price ID (source of truth)'
            },
            {
              name: 'sku',
              title: 'SKU',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'ghlVariants',
      title: 'GHL Variant Options',
      type: 'array',
      description: 'Variant options from GHL (Wood Finish, Size, Bundle Type, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Variant ID',
              type: 'string'
            },
            {
              name: 'name',
              title: 'Variant Name',
              type: 'string'
            },
            {
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'id',
                      title: 'Option ID',
                      type: 'string'
                    },
                    {
                      name: 'name',
                      title: 'Option Name',
                      type: 'string'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'stockCount',
      title: 'Stock Count',
      type: 'number',
      validation: (Rule: any) => Rule.min(0)
    },
    {
      name: 'allowOutOfStockPurchase',
      title: 'Allow Selling While Out of Stock',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'badge',
      title: 'Product Badge',
      type: 'string',
      options: {
        list: [
          { title: 'Featured', value: 'Featured' },
          { title: 'New', value: 'New' },
          { title: 'Best Seller', value: 'Best Seller' },
          { title: 'Limited', value: 'Limited' }
        ]
      }
    },
    {
      name: 'productCollection',
      title: 'Product Collection',
      type: 'string',
      description: 'Collection or series this product belongs to'
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string'
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Search engine listing title'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Search engine listing description'
    },
    {
      name: 'taxable',
      title: 'Taxable',
      type: 'boolean',
      description: 'Whether this product is subject to taxes',
      initialValue: true
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime'
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Show/hide this product on the website',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0.url'
    }
  }
}
