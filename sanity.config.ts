import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
// import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Ilio Sauna Studio',

  projectId: 'bxybmggj',
  dataset: 'production',

  plugins: [
    codeInput(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton pages
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Homepage')
                      .child(
                        S.document()
                          .schemaType('homepage')
                          .documentId('homepage')
                      ),
                    S.listItem()
                      .title('Our Story')
                      .child(
                        S.document()
                          .schemaType('ourstory')
                          .documentId('ourstory')
                      ),
                    S.listItem()
                      .title('Saunas Page')
                      .child(
                        S.document()
                          .schemaType('saunaspage')
                          .documentId('saunaspage')
                      ),
                    S.listItem()
                      .title('Contact Page')
                      .child(
                        S.document()
                          .schemaType('contactpage')
                          .documentId('contactpage')
                      ),
                    S.listItem()
                      .title('Journal Page')
                      .child(
                        S.document()
                          .schemaType('journalpage')
                          .documentId('journalpage')
                      ),
                  ])
              ),
            S.divider(),
            // Products
            S.listItem()
              .title('Sauna Products')
              .child(S.documentTypeList('saunaProduct').title('Sauna Products')),
            // Blog
            S.listItem()
              .title('Blog Posts')
              .child(S.documentTypeList('blogPost').title('Blog Posts')),
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            // Testimonials
            S.listItem()
              .title('Testimonials')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.divider(),
            // Settings
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ])
    }),
    // visionTool(), // Temporarily disabled due to dependency issues
  ],

  schema: {
    types: schemaTypes,
  },
})