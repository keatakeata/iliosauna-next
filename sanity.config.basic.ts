import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Ilio Sauna Studio',
  
  projectId: 'bxybmggj',
  dataset: 'production',
  
  plugins: [structureTool()],
  
  schema: {
    types: [
      {
        name: 'blogPost',
        type: 'document',
        title: 'Blog Post',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
              source: 'title',
              maxLength: 96
            },
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'excerpt',
            type: 'text',
            title: 'Excerpt',
            rows: 3
          },
          {
            name: 'mainImage',
            type: 'image',
            title: 'Main Image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'body',
            type: 'array',
            title: 'Content',
            of: [
              {
                type: 'block',
                styles: [
                  {title: 'Normal', value: 'normal'},
                  {title: 'H2', value: 'h2'},
                  {title: 'H3', value: 'h3'},
                  {title: 'Quote', value: 'blockquote'}
                ],
                marks: {
                  decorators: [
                    {title: 'Strong', value: 'strong'},
                    {title: 'Emphasis', value: 'em'}
                  ]
                }
              },
              {
                type: 'image',
                options: {hotspot: true}
              }
            ]
          },
          {
            name: 'publishedAt',
            type: 'datetime',
            title: 'Published At'
          }
        ]
      }
    ]
  }
})