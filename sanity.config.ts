import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Ilio Sauna Studio',
  projectId: 'bxybmggj',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    table(),
  ],

  schema: {
    types: schemaTypes,
  },

  theme: {
    '--default-text-color': '#333333',
    '--card-primary-color': '#ffffff',
    '--card-secondary-color': '#f8f9fa',
    '--text-muted': '#666666',
    '--input-bg': '#ffffff',
    '--input-fg': '#333333',
    '--focus-ring-color': '#BF5813',
    '--brand-primary': '#BF5813',
  },

  basePath: '/studio',
})