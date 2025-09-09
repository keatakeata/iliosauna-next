import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Posts')
        .schemaType('blogPost')
        .child(S.documentTypeList('blogPost').title('Blog Posts')),
      
      S.divider(),
      
      S.listItem()
        .title('Homepage')
        .schemaType('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage')
        ),
      
      S.listItem()
        .title('Our Story')
        .schemaType('ourstory')
        .child(
          S.document()
            .schemaType('ourstory')
            .documentId('ourstory')
            .title('Our Story')
        ),
      
      S.listItem()
        .title('Saunas')
        .schemaType('saunaspage')
        .child(
          S.document()
            .schemaType('saunaspage')
            .documentId('saunaspage')
            .title('Saunas Page')
        ),
      
      S.listItem()
        .title('Contact')
        .schemaType('contact')
        .child(
          S.document()
            .schemaType('contact')
            .documentId('contact')
            .title('Contact')
        ),
    ])