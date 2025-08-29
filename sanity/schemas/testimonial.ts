// Testimonial Schema for Sanity
// Copy this schema to your Sanity Studio

export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Vancouver, BC',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
      options: {
        list: [
        { title: '1 Star', value: 1 },
        { title: '2 Stars', value: 2 },
        { title: '3 Stars', value: 3 },
        { title: '4 Stars', value: 4 },
        { title: '5 Stars', value: 5 },
      ],
      },
    },
    {
      name: 'testimonialText',
      title: 'Testimonial',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'productPurchased',
      title: 'Product Purchased',
      type: 'reference',
      to: [{ type: 'saunaProduct' }],
    },
    {
      name: 'customerImage',
      title: 'Customer Photo (optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage',
    },
    {
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'location',
      rating: 'rating',
      media: 'customerImage',
    },
    prepare(selection: any) {
      const { title, subtitle, rating } = selection;
      return {
        title: title,
        subtitle: `${subtitle} - ${'⭐'.repeat(rating)}`,
        media: selection.media,
      };
    },
  },
};