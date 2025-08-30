import author from './author'
import blockContent from './blockContent'
import blogPost from './blogPost'
import category from './category'
import saunaProduct from './saunaProduct'
import testimonial from './testimonial'
import homepage from './homepage'
import ourstory from './ourstory'
import saunaspage from './saunaspage'
import contactpage from './contactpage'
import journalpage from './journalpage'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Content types
  saunaProduct,
  blogPost,
  testimonial,
  author,
  category,
  
  // Page schemas
  homepage,
  ourstory,
  saunaspage,
  contactpage,
  journalpage,
  
  // Settings
  siteSettings,
  
  // Block content
  blockContent
]