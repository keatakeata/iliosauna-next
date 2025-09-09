import author from './author'
import blockContent from './blockContent'
import blogPost from './blogPost'
import category from './category'
import saunaProduct from './saunaProduct'
import testimonial from './testimonial'
import homepage from './homepage'
import ourstoryFinal from './ourstory-final'
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
  ourstoryFinal,  // ONLY our final schema - all others removed
  saunaspage,
  contactpage,
  journalpage,

  // Settings
  siteSettings,

  // Block content
  blockContent
]
