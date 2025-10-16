// Grid Section Type - ENHANCED
export const gridSection = {
  name: 'gridSection',
  title: 'Grid Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'grid',
      hidden: true
    },
    {
      name: 'gridTitle',
      title: 'Grid Title (Optional)',
      type: 'string'
    },
    {
      name: 'gridItems',
      title: 'Grid Items (Drag to Reorder)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Item Title',
              type: 'string'
            },
            {
              name: 'list',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ],
          preview: {
            select: { title: 'title', list: 'list' },
            prepare(selection: any) {
              const count = selection.list?.length || 0;
              return {
                title: selection.title || 'Grid Item',
                subtitle: `${count} points`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'gridTitle', items: 'gridItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '📊 Grid Section',
        subtitle: selection.title || `${count} grid items`
      }
    }
  }
}

// Engineering Details Section Type - ENHANCED
export const engineeringSection = {
  name: 'engineeringSection',
  title: 'Engineering Details Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'engineering-details',
      hidden: true
    },
    {
      name: 'engineeringTitle',
      title: 'Section Title',
      type: 'string'
    },
    {
      name: 'engineeringItems',
      title: 'Engineering Details (Drag to Reorder)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'subtitle',
              title: 'Detail Title',
              type: 'string'
            },
            {
              name: 'text',
              title: 'Detail Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'image',
              title: 'Detail Image',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette']
              }
            },
            {
              name: 'imageUrl',
              title: 'OR Detail Image URL',
              type: 'url'
            }
          ],
          preview: {
            select: {
              title: 'subtitle',
              media: 'image',
              imageUrl: 'imageUrl'
            },
            prepare(selection: any) {
              return {
                title: selection.title || 'Engineering Detail',
                subtitle: selection.imageUrl || 'Image uploaded',
                media: selection.media
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'engineeringTitle', items: 'engineeringItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '🔧 Engineering Details',
        subtitle: selection.title || `${count} details with images`
      }
    }
  }
}

// Specs Grid Section Type - ENHANCED
export const specsGridSection = {
  name: 'specsGridSection',
  title: 'Specs Grid Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'specs-grid',
      hidden: true
    },
    {
      name: 'specsGridColumns',
      title: 'Columns (Drag to Reorder)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Column Title',
              type: 'string'
            },
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ],
          preview: {
            select: { title: 'title', items: 'items' },
            prepare(selection: any) {
              const count = selection.items?.length || 0;
              return {
                title: selection.title || 'Column',
                subtitle: `${count} items`
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { columns: 'specsGridColumns' },
    prepare(selection: any) {
      const count = selection.columns?.length || 0;
      return {
        title: '📋 Specs Grid',
        subtitle: `${count} columns`
      }
    }
  }
}

// Feature Cards Section Type - ENHANCED
export const featureCardsSection = {
  name: 'featureCardsSection',
  title: 'Feature Cards Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'feature-cards',
      hidden: true
    },
    {
      name: 'featureCardsItems',
      title: 'Feature Cards (Drag to Reorder)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name (Optional)',
              type: 'string',
              description: 'e.g., sun, lightning, shield, clock, smartphone, etc.',
              options: {
                list: [
                  { title: '☀️ Sun', value: 'sun' },
                  { title: '⚡ Lightning', value: 'lightning' },
                  { title: '🛡️ Shield', value: 'shield' },
                  { title: '⏱️ Clock', value: 'clock' },
                  { title: '📱 Smartphone', value: 'smartphone' },
                  { title: '📅 Calendar', value: 'calendar' },
                  { title: '📊 Chart', value: 'chart' },
                  { title: '🌡️ Thermometer', value: 'thermometer' },
                  { title: '👥 Users', value: 'users' }
                ]
              }
            },
            {
              name: 'title',
              title: 'Card Title',
              type: 'string'
            },
            {
              name: 'text',
              title: 'Card Text',
              type: 'text',
              rows: 2
            },
            {
              name: 'image',
              title: 'Card Image (Optional)',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip']
              }
            },
            {
              name: 'imageUrl',
              title: 'OR Card Image URL',
              type: 'url'
            }
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
              media: 'image'
            },
            prepare(selection: any) {
              const iconMap: Record<string, string> = {
                sun: '☀️',
                lightning: '⚡',
                shield: '🛡️',
                clock: '⏱️',
                smartphone: '📱',
                calendar: '📅',
                chart: '📊',
                thermometer: '🌡️',
                users: '👥'
              };
              const emoji = selection.icon ? iconMap[selection.icon] || '' : '';
              return {
                title: `${emoji} ${selection.title || 'Feature Card'}`.trim(),
                media: selection.media
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { items: 'featureCardsItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '🎴 Feature Cards',
        subtitle: `${count} cards`
      }
    }
  }
}

// Image Showcase Section Type - ENHANCED
export const imageShowcaseSection = {
  name: 'imageShowcaseSection',
  title: 'Image Showcase Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'image-showcase',
      hidden: true
    },
    {
      name: 'showcaseTitle',
      title: 'Section Title',
      type: 'string'
    },
    {
      name: 'showcaseImages',
      title: 'Images (Drag to Reorder)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Upload Image',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette']
              }
            },
            {
              name: 'imageUrl',
              title: 'OR Image URL',
              type: 'url'
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            }
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'image',
              imageUrl: 'imageUrl'
            },
            prepare(selection: any) {
              return {
                title: selection.title || 'Showcase Image',
                subtitle: selection.imageUrl || 'Uploaded',
                media: selection.media
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'showcaseTitle', images: 'showcaseImages' },
    prepare(selection: any) {
      const count = selection.images?.length || 0;
      return {
        title: '🖼️ Image Showcase',
        subtitle: selection.title || `${count} images`
      }
    }
  }
}

// Specs Section Type - ENHANCED
export const specsSection = {
  name: 'specsSection',
  title: 'Specs List Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'specs',
      hidden: true
    },
    {
      name: 'specsTitle',
      title: 'Section Title',
      type: 'string'
    },
    {
      name: 'specsItems',
      title: 'Specifications',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],
  preview: {
    select: { title: 'specsTitle', items: 'specsItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '📝 Specs List',
        subtitle: selection.title || `${count} specs`
      }
    }
  }
}

// Detail Section Type - ENHANCED
export const detailSection = {
  name: 'detailSection',
  title: 'Text Detail Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'detail',
      hidden: true
    },
    {
      name: 'detailTitle',
      title: 'Section Title',
      type: 'string'
    },
    {
      name: 'detailContent',
      title: 'Content',
      type: 'text',
      rows: 5
    }
  ],
  preview: {
    select: { title: 'detailTitle' },
    prepare(selection: any) {
      return {
        title: '📄 Text Detail',
        subtitle: selection.title || 'Text content'
      }
    }
  }
}

// Quote Section Type - ENHANCED
export const quoteSection = {
  name: 'quoteSection',
  title: 'Quote Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'quote',
      hidden: true
    },
    {
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      rows: 3
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    }
  ],
  preview: {
    select: { quote: 'quote', author: 'author' },
    prepare(selection: any) {
      return {
        title: '💬 Quote',
        subtitle: selection.author || 'Testimonial'
      }
    }
  }
}

// Diagram Section Type - ENHANCED
export const diagramSection = {
  name: 'diagramSection',
  title: 'Diagram Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'diagram',
      hidden: true
    },
    {
      name: 'diagramTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'diagramPoints',
      title: 'Points',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],
  preview: {
    select: { title: 'diagramTitle', points: 'diagramPoints' },
    prepare(selection: any) {
      const count = selection.points?.length || 0;
      return {
        title: '📐 Diagram',
        subtitle: selection.title || `${count} points`
      }
    }
  }
}

// Solution Section Type - ENHANCED
export const solutionSection = {
  name: 'solutionSection',
  title: 'Solution Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'solution',
      hidden: true
    },
    {
      name: 'solutionItems',
      title: 'Solution Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 3
            }
          ],
          preview: {
            select: { title: 'title' }
          }
        }
      ]
    }
  ],
  preview: {
    select: { items: 'solutionItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '✅ Solution',
        subtitle: `${count} solution items`
      }
    }
  }
}

// App Download Section Type - ENHANCED
export const appDownloadSection = {
  name: 'appDownloadSection',
  title: 'App Download Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'app-download',
      hidden: true
    },
    {
      name: 'downloadTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'downloadSubtitle',
      title: 'Subtitle',
      type: 'string'
    },
    {
      name: 'appStoreUrl',
      title: 'App Store URL',
      type: 'url'
    },
    {
      name: 'googlePlayUrl',
      title: 'Google Play URL',
      type: 'url'
    }
  ],
  preview: {
    prepare() {
      return {
        title: '📱 App Download',
        subtitle: 'App Store & Google Play links'
      }
    }
  }
}

// How It Works Section Type - ENHANCED
export const howItWorksSection = {
  name: 'howItWorksSection',
  title: 'How It Works Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'how-it-works',
      hidden: true
    },
    {
      name: 'worksTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'worksSteps',
      title: 'Steps',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],
  preview: {
    select: { title: 'worksTitle', steps: 'worksSteps' },
    prepare(selection: any) {
      const count = selection.steps?.length || 0;
      return {
        title: '🔄 How It Works',
        subtitle: selection.title || `${count} steps`
      }
    }
  }
}

// Testimonials Section Type - ENHANCED
export const testimonialsSection = {
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'testimonials',
      hidden: true
    },
    {
      name: 'testimonialsTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'testimonialsItems',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string'
            }
          ],
          preview: {
            select: { author: 'author', quote: 'quote' },
            prepare(selection: any) {
              return {
                title: selection.author || 'Testimonial',
                subtitle: selection.quote?.substring(0, 60) + '...'
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'testimonialsTitle', items: 'testimonialsItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '⭐ Testimonials',
        subtitle: selection.title || `${count} testimonials`
      }
    }
  }
}

// Philosophy Section Type - ENHANCED
export const philosophySection = {
  name: 'philosophySection',
  title: 'Philosophy Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'philosophy',
      hidden: true
    },
    {
      name: 'philosophyTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'philosophyText',
      title: 'Text',
      type: 'text',
      rows: 5
    }
  ],
  preview: {
    select: { title: 'philosophyTitle' },
    prepare(selection: any) {
      return {
        title: '💭 Philosophy',
        subtitle: selection.title || 'Philosophy section'
      }
    }
  }
}

// Commercial Specs Section Type - ENHANCED
export const commercialSpecsSection = {
  name: 'commercialSpecsSection',
  title: 'Commercial Specs Section',
  type: 'object',
  fields: [
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      initialValue: 'commercial-specs',
      hidden: true
    },
    {
      name: 'commercialSpecsTitle',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'commercialSpecsItems',
      title: 'Specs Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'spec',
              title: 'Spec',
              type: 'string'
            },
            {
              name: 'detail',
              title: 'Detail',
              type: 'text',
              rows: 2
            }
          ],
          preview: {
            select: { title: 'spec', subtitle: 'detail' }
          }
        }
      ]
    }
  ],
  preview: {
    select: { title: 'commercialSpecsTitle', items: 'commercialSpecsItems' },
    prepare(selection: any) {
      const count = selection.items?.length || 0;
      return {
        title: '🏭 Commercial Specs',
        subtitle: selection.title || `${count} specs`
      }
    }
  }
}
