export default {
  name: 'saunaspage',
  title: 'Saunas Page',
  type: 'document',
  // Add preview for document list
  preview: {
    prepare() {
      return {
        title: 'Saunas Page',
        subtitle: 'Main saunas landing page content'
      }
    }
  },
  fields: [
    // SECTION 1: HERO SLIDESHOW
    {
      name: 'section1',
      title: 'Section 1 - Hero Slideshow',
      type: 'object',
      description: 'Main hero section with rotating image slides',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        {
          name: 'mainHeading',
          title: 'Main Heading',
          type: 'string',
          initialValue: 'Contemporary Luxury Saunas',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'subHeading',
          title: 'Sub Heading',
          type: 'string',
          initialValue: 'Scandinavian craftsmanship',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'slides',
          title: 'Hero Slides (Drag to Reorder)',
          type: 'array',
          validation: (Rule: any) => Rule.min(3).max(10),
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
                  type: 'url',
                  description: 'Use this if image is hosted externally'
                },
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'alt',
                  media: 'image',
                  imageUrl: 'imageUrl'
                },
                prepare(selection: any) {
                  return {
                    title: selection.title || 'Hero Slide',
                    subtitle: selection.imageUrl || 'Uploaded image',
                    media: selection.media
                  }
                }
              }
            }
          ]
        },
        {
          name: 'autoAdvanceInterval',
          title: 'Auto-Advance Interval (milliseconds)',
          type: 'number',
          initialValue: 4000,
          validation: (Rule: any) => Rule.min(2000).max(10000)
        }
      ],
      preview: {
        select: {
          title: 'mainHeading',
          subtitle: 'subHeading',
          media: 'slides.0.image'
        }
      }
    },

    // SECTION 2: LIVE WELL WITH ILIO
    {
      name: 'section2',
      title: 'Section 2 - Live Well with ilio',
      type: 'object',
      description: 'Video section with descriptive content',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Live well with ilio'
        },
        {
          name: 'paragraph1',
          title: 'First Paragraph',
          type: 'text',
          rows: 4
        },
        {
          name: 'video',
          title: 'Video File',
          type: 'file',
          options: {
            accept: 'video/*'
          }
        },
        {
          name: 'videoUrl',
          title: 'OR Video URL',
          type: 'url'
        },
        {
          name: 'videoPosterImage',
          title: 'Video Poster Image',
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip']
          }
        },
        {
          name: 'videoPoster',
          title: 'OR Video Poster URL',
          type: 'url'
        },
        {
          name: 'paragraph2',
          title: 'Second Paragraph',
          type: 'text',
          rows: 5
        }
      ],
      preview: {
        select: {
          title: 'title',
          media: 'videoPosterImage'
        }
      }
    },

    // SECTION 3: SAUNA SPECS
    {
      name: 'section3',
      title: 'Section 3 - Sauna Specifications',
      type: 'object',
      description: 'Pricing and specifications section',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip']
          }
        },
        {
          name: 'backgroundImageUrl',
          title: 'OR Background Image URL',
          type: 'url'
        },
        {
          name: 'mainTitle',
          title: 'Main Title',
          type: 'string',
          initialValue: 'ilio Sauna'
        },
        {
          name: 'priceLabel',
          title: 'Price Label',
          type: 'string',
          initialValue: 'ALL-INCLUSIVE PRICE'
        },
        {
          name: 'price',
          title: 'Price',
          type: 'string',
          initialValue: '$20,000 CAD'
        },
        {
          name: 'sizeLabel',
          title: 'Size Label',
          type: 'string',
          initialValue: 'SIZE'
        },
        {
          name: 'size',
          title: 'Size',
          type: 'string',
          initialValue: '4-6 person capacity'
        },
        {
          name: 'dimensionsLabel',
          title: 'Dimensions Label',
          type: 'string',
          initialValue: 'DIMENSIONS'
        },
        {
          name: 'dimensionsExterior',
          title: 'Exterior Dimensions',
          type: 'string',
          initialValue: "6'-3\" w × 9' d × 8'-5\" h"
        },
        {
          name: 'dimensionsInterior',
          title: 'Interior Dimensions',
          type: 'string',
          initialValue: "5'-5\" × 6'-3\""
        },
        {
          name: 'heaterLabel',
          title: 'Heater Label',
          type: 'string',
          initialValue: 'HEATER'
        },
        {
          name: 'heater',
          title: 'Heater',
          type: 'string',
          initialValue: '9kW HUUM DROP Finnish heater'
        },
        {
          name: 'warrantyLabel',
          title: 'Warranty Label',
          type: 'string',
          initialValue: 'WARRANTY'
        },
        {
          name: 'warranty',
          title: 'Warranty',
          type: 'string',
          initialValue: '2-year comprehensive coverage'
        },
        {
          name: 'leadTimeLabel',
          title: 'Lead Time Label',
          type: 'string',
          initialValue: 'LEAD TIME'
        },
        {
          name: 'leadTime',
          title: 'Lead Time',
          type: 'string',
          initialValue: '2-4 weeks'
        }
      ],
      preview: {
        select: {
          title: 'mainTitle',
          subtitle: 'price',
          media: 'backgroundImage'
        }
      }
    },

    // SECTION 4: PREMIUM DETAILS
    {
      name: 'section4',
      title: 'Section 4 - Premium Details',
      type: 'object',
      description: '9 premium features with detailed modal content',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Premium Details Included'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'string',
          initialValue: 'Tap any feature to explore'
        },
        {
          name: 'features',
          title: 'Premium Features (9 items)',
          type: 'array',
          validation: (Rule: any) => Rule.length(9),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'id',
                  title: 'Feature ID',
                  type: 'string',
                  description: 'Lowercase with hyphens (e.g., building, doors-and-windows)',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'title',
                  title: 'Feature Title',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'description',
                  title: 'Feature Description',
                  type: 'text',
                  rows: 2
                },
                {
                  name: 'cardImage',
                  title: 'Card Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                    metadata: ['blurhash', 'lqip', 'palette']
                  }
                },
                {
                  name: 'cardImageUrl',
                  title: 'OR Card Image URL',
                  type: 'url'
                },
                {
                  name: 'modalContent',
                  title: 'Modal Content',
                  type: 'object',
                  options: {
                    collapsible: true,
                    collapsed: false
                  },
                  fields: [
                    {
                      name: 'award',
                      title: 'Award Badge (Optional)',
                      type: 'string',
                      description: 'e.g., "🏆 RED DOT AWARD"'
                    },
                    {
                      name: 'title',
                      title: 'Modal Title',
                      type: 'string',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'subtitle',
                      title: 'Modal Subtitle',
                      type: 'string'
                    },
                    {
                      name: 'awardText',
                      title: 'Award Text (Optional)',
                      type: 'text',
                      rows: 2
                    },
                    {
                      name: 'mainImage',
                      title: 'Main Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                        metadata: ['blurhash', 'lqip', 'palette']
                      }
                    },
                    {
                      name: 'mainImageUrl',
                      title: 'OR Main Image URL',
                      type: 'url'
                    },
                    {
                      name: 'gallery',
                      title: 'Gallery Images (Drag to Reorder)',
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
                                metadata: ['blurhash', 'lqip']
                              }
                            },
                            {
                              name: 'imageUrl',
                              title: 'OR Image URL',
                              type: 'url'
                            },
                            {
                              name: 'alt',
                              title: 'Alt Text',
                              type: 'string'
                            }
                          ],
                          preview: {
                            select: {
                              title: 'alt',
                              media: 'image',
                              imageUrl: 'imageUrl'
                            },
                            prepare(selection: any) {
                              return {
                                title: selection.title || 'Gallery Image',
                                subtitle: selection.imageUrl || 'Uploaded',
                                media: selection.media
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      name: 'contentSections',
                      title: 'Content Sections (Drag to Reorder)',
                      description: 'Add various content types to build the modal',
                      type: 'array',
                      of: [
                        { type: 'gridSection' },
                        { type: 'engineeringSection' },
                        { type: 'specsGridSection' },
                        { type: 'featureCardsSection' },
                        { type: 'imageShowcaseSection' },
                        { type: 'specsSection' },
                        { type: 'detailSection' },
                        { type: 'quoteSection' },
                        { type: 'diagramSection' },
                        { type: 'solutionSection' },
                        { type: 'appDownloadSection' },
                        { type: 'howItWorksSection' },
                        { type: 'testimonialsSection' },
                        { type: 'philosophySection' },
                        { type: 'commercialSpecsSection' }
                      ]
                    }
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'subtitle',
                      media: 'mainImage'
                    }
                  }
                }
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'description',
                  media: 'cardImage',
                  imageUrl: 'cardImageUrl'
                },
                prepare(selection: any) {
                  return {
                    title: selection.title || 'Premium Feature',
                    subtitle: selection.subtitle || 'Click to edit',
                    media: selection.media
                  }
                }
              }
            }
          ]
        }
      ],
      preview: {
        select: {
          features: 'features'
        },
        prepare(selection: any) {
          const count = selection.features?.length || 0;
          return {
            title: 'Premium Details',
            subtitle: `${count} features configured`
          }
        }
      }
    },

    // SECTION 5: WHITE-GLOVE EXPERIENCE
    {
      name: 'section5',
      title: 'Section 5 - White-Glove Experience',
      type: 'object',
      description: 'Installation process and trust indicators',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Your White-Glove Sauna Experience'
        },
        {
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          initialValue: "Your sauna is already precision-built in transportable sections, designed to move easily through tight gates and pathways. Here's our proven 6-step process:"
        },
        {
          name: 'trustBadges',
          title: 'Trust Badges (Drag to Reorder)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Badge Text',
                  type: 'string'
                }
              ],
              preview: {
                select: { title: 'text' }
              }
            }
          ]
        },
        {
          name: 'processSteps',
          title: 'Process Steps (6 items)',
          type: 'array',
          validation: (Rule: any) => Rule.length(6),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Step Number',
                  type: 'number',
                  validation: (Rule: any) => Rule.required().min(1).max(6)
                },
                {
                  name: 'title',
                  title: 'Step Title',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'timeline',
                  title: 'Timeline',
                  type: 'string',
                  description: 'e.g., "< 5 minutes", "1-2 weeks before"'
                },
                {
                  name: 'description',
                  title: 'Step Description',
                  type: 'text',
                  rows: 3
                }
              ],
              preview: {
                select: {
                  number: 'number',
                  title: 'title',
                  timeline: 'timeline'
                },
                prepare(selection: any) {
                  return {
                    title: `${selection.number}. ${selection.title}`,
                    subtitle: selection.timeline
                  }
                }
              }
            }
          ]
        },
        {
          name: 'ctaHeading',
          title: 'CTA Heading',
          type: 'string',
          initialValue: 'Ready to Experience the ilio Difference?'
        },
        {
          name: 'ctaText',
          title: 'CTA Text',
          type: 'text',
          rows: 2,
          initialValue: "Start your wellness journey with a sauna crafted for BC's unique climate and lifestyle."
        },
        {
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          initialValue: 'Get Started'
        },
        {
          name: 'primaryButtonLink',
          title: 'Primary Button Link',
          type: 'string',
          initialValue: '/contact'
        },
        {
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          initialValue: 'Our Story'
        },
        {
          name: 'secondaryButtonLink',
          title: 'Secondary Button Link',
          type: 'string',
          initialValue: '/our-story'
        },
        {
          name: 'trustIndicators',
          title: 'Trust Indicators (Drag to Reorder)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Indicator Text',
                  type: 'string'
                }
              ],
              preview: {
                select: { title: 'text' }
              }
            }
          ]
        }
      ],
      preview: {
        select: {
          title: 'title',
          steps: 'processSteps'
        },
        prepare(selection: any) {
          const count = selection.steps?.length || 0;
          return {
            title: selection.title,
            subtitle: `${count} process steps`
          }
        }
      }
    },

    // SECTION 6: COMMON QUESTIONS
    {
      name: 'section6',
      title: 'Section 6 - Common Questions',
      type: 'object',
      description: 'FAQ section',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Common Questions'
        },
        {
          name: 'questions',
          title: 'Questions & Answers',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'text',
                  rows: 4,
                  validation: (Rule: any) => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'question',
                  subtitle: 'answer'
                }
              }
            }
          ]
        },
        {
          name: 'footerLinkText',
          title: 'Footer Link Text',
          type: 'string',
          initialValue: 'Have a different question? Chat with an expert →'
        },
        {
          name: 'footerLinkUrl',
          title: 'Footer Link URL',
          type: 'string',
          initialValue: '/contact'
        }
      ],
      preview: {
        select: {
          title: 'title',
          questions: 'questions'
        },
        prepare(selection: any) {
          const count = selection.questions?.length || 0;
          return {
            title: selection.title,
            subtitle: `${count} questions`
          }
        }
      }
    }
  ]
}
