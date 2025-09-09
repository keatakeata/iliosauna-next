export default {
  name: 'saunaspage',
  title: 'Saunas Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Saunas Page Content',
      readOnly: true
    },
    {
      name: 'section1',
      title: 'Section 1 - Hero Slideshow',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Main Title',
          type: 'string',
          initialValue: 'Contemporary Luxury Saunas'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Scandinavian craftsmanship'
        },
        {
          name: 'slides',
          title: 'Slideshow Images',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                },
                {
                  name: 'imageUrl',
                  title: 'Image URL (if using external)',
                  type: 'url'
                },
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'section2',
      title: 'Section 2 - Make it stand out',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Make it stand out'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text',
          initialValue: 'At Ilio, we believe wellness should be accessible, beautiful, and transformative. Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.'
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text',
          initialValue: 'Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted with advanced heating systems for an experience that lasts.'
        },
        {
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          initialValue: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0ebafd8a0cd83ab30.mp4'
        },
        {
          name: 'videoPoster',
          title: 'Video Poster Image URL',
          type: 'url',
          initialValue: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg'
        }
      ]
    },
    {
      name: 'section3',
      title: 'Section 3 - Ilio Sauna Pricing',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Ilio Sauna'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image URL',
          type: 'url',
          initialValue: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac4d0764b219.jpeg'
        },
        {
          name: 'basePrice',
          title: 'Base Price',
          type: 'string',
          initialValue: '$20,000 CAD'
        },
        {
          name: 'size',
          title: 'Size',
          type: 'string',
          initialValue: '4-6 person capacity'
        },
        {
          name: 'heater',
          title: 'Heater',
          type: 'string',
          initialValue: '9kW HUUM DROP Finnish heater'
        },
        {
          name: 'warranty',
          title: 'Warranty',
          type: 'string',
          initialValue: '5-year comprehensive coverage'
        },
        {
          name: 'leadTime',
          title: 'Lead Time',
          type: 'string',
          initialValue: '6-8 weeks'
        }
      ]
    },
    {
      name: 'section4',
      title: 'Section 4 - Premium Details Included',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Premium Details Included'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Tap any feature to explore'
        },
        {
          name: 'features',
          title: 'Premium Features',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'id',
                  title: 'Feature ID',
                  type: 'string'
                },
                {
                  name: 'title',
                  title: 'Feature Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Feature Description',
                  type: 'string'
                },
                {
                  name: 'image',
                  title: 'Feature Image',
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                },
                {
                  name: 'imageUrl',
                  title: 'Image URL (if using external)',
                  type: 'url'
                },
                {
                  name: 'modalContent',
                  title: 'Modal Content',
                  type: 'object',
                  fields: [
                    {
                      name: 'modalTitle',
                      title: 'Modal Title',
                      type: 'string'
                    },
                    {
                      name: 'modalSubtitle',
                      title: 'Modal Subtitle',
                      type: 'string'
                    },
                    {
                      name: 'award',
                      title: 'Award Badge',
                      type: 'string'
                    },
                    {
                      name: 'awardText',
                      title: 'Award Description',
                      type: 'text'
                    },
                    {
                      name: 'mainImage',
                      title: 'Main Modal Image URL',
                      type: 'url'
                    },
                    {
                      name: 'gallery',
                      title: 'Gallery Images',
                      type: 'array',
                      of: [{ type: 'url' }]
                    },
                    {
                      name: 'sections',
                      title: 'Content Sections',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          preview: {
                            select: {
                              title: 'title',
                              sectionType: 'sectionType'
                            },
                            prepare(selection) {
                              const { title, sectionType } = selection
                              return {
                                title: title || `${sectionType || 'Section'}`,
                                subtitle: sectionType ? `Type: ${sectionType}` : 'Content Section'
                              }
                            }
                          },
                          fields: [
                            {
                              name: 'sectionType',
                              title: 'Section Type',
                              type: 'string',
                              options: {
                                list: [
                                  { title: 'Grid', value: 'grid' },
                                  { title: 'Callout', value: 'callout' },
                                  { title: 'Detail', value: 'detail' },
                                  { title: 'Engineering Details', value: 'engineering-details' },
                                  { title: 'Specs Grid', value: 'specs-grid' },
                                  { title: 'Feature Cards', value: 'feature-cards' },
                                  { title: 'Comparison', value: 'comparison' },
                                  { title: 'Problem Solution', value: 'problem-solution' },
                                  { title: 'Specs', value: 'specs' },
                                  { title: 'Specs List', value: 'specs-list' },
                                  { title: 'Installation Features', value: 'installation-features' },
                                  { title: 'Feature Cards', value: 'feature-cards' },
                                  { title: 'Image Showcase', value: 'image-showcase' },
                                  { title: 'Single Image', value: 'single-image' },
                                  { title: 'Diagram', value: 'diagram' },
                                  { title: 'Fischer Legacy', value: 'fischer-legacy' },
                                  { title: 'Model Features', value: 'model-features' },
                                  { title: 'Philosophy', value: 'philosophy' },
                                  { title: 'Commercial Specs', value: 'commercial-specs' },
                                  { title: 'App Download', value: 'app-download' },
                                  { title: 'How It Works', value: 'how-it-works' },
                                  { title: 'Testimonials', value: 'testimonials' },
                                  { title: 'Quote', value: 'quote' },
                                  { title: 'Other', value: 'other' }
                                ]
                              }
                            },
                            {
                              name: 'title',
                              title: 'Section Title',
                              type: 'string'
                            },
                            {
                              name: 'text',
                              title: 'Section Text',
                              type: 'text'
                            },
                            {
                              name: 'image',
                              title: 'Section Image URL',
                              type: 'url'
                            },
                            {
                              name: 'items',
                              title: 'Section Items',
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
                                      name: 'text',
                                      title: 'Item Text',
                                      type: 'text'
                                    },
                                    {
                                      name: 'image',
                                      title: 'Item Image URL',
                                      type: 'url'
                                    },
                                    {
                                      name: 'list',
                                      title: 'Item List',
                                      type: 'array',
                                      of: [{ type: 'string' }]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              name: 'engineeringDetails',
                              title: 'Engineering Details (for engineering-details type)',
                              type: 'array',
                              of: [
                                {
                                  type: 'object',
                                  fields: [
                                    {
                                      name: 'subtitle',
                                      title: 'Detail Subtitle',
                                      type: 'string'
                                    },
                                    {
                                      name: 'image',
                                      title: 'Detail Image URL',
                                      type: 'url'
                                    },
                                    {
                                      name: 'text',
                                      title: 'Detail Text',
                                      type: 'text'
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
      name: 'section5',
      title: 'Section 5 - Guarantee & FAQ',
      type: 'object',
      fields: [
        {
          name: 'guaranteeTitle',
          title: 'Guarantee Title',
          type: 'string',
          initialValue: '30-Day Löyly-Love Promise'
        },
        {
          name: 'guaranteeDescription',
          title: 'Guarantee Description',
          type: 'text',
          initialValue: 'We\'re so confident you\'ll love your Ilio sauna that we offer a full 30-day trial. If you\'re not experiencing deeper sleep, less stress, and that post-sauna glow—we\'ll arrange pickup and issue a complete refund. No questions, no hassle.'
        },
        {
          name: 'guaranteeFeatures',
          title: 'Guarantee Features',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: [
            '100% money-back guarantee',
            'We handle removal & shipping',
            'Keep all accessories as our gift',
            'No restocking fees ever'
          ]
        },
        {
          name: 'guaranteeNote',
          title: 'Guarantee Note',
          type: 'string',
          initialValue: '*In 3 years, we\'ve had exactly 2 returns. Both customers bought larger models.'
        },
        {
          name: 'faqTitle',
          title: 'FAQ Title',
          type: 'string',
          initialValue: 'Common Questions'
        },
        {
          name: 'faqItems',
          title: 'FAQ Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string'
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'text'
                }
              ]
            }
          ]
        },
        {
          name: 'contactLinkText',
          title: 'Contact Link Text',
          type: 'string',
          initialValue: 'Have a different question? Chat with an expert →'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Saunas Page Content'
      }
    }
  }
}