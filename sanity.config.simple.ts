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
        name: 'testDoc',
        type: 'document',
        title: 'Test Document',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title'
          }
        ]
      }
    ]
  }
})