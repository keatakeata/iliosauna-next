import { groq } from 'next-sanity'

// Homepage queries
export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    heroSection {
      title,
      subtitle,
      buttonText,
      "images": images[]{
        "url": asset->url,
        alt
      }
    },
    aboutSection {
      title,
      paragraph1,
      paragraph2,
      videoUrl,
      "videoPoster": videoPoster.asset->url
    },
    premiumDetailsSection {
      title,
      features[] {
        title,
        description,
        "image": image.asset->url
      }
    },
    testimonialSection {
      title,
      showTestimonials
    },
    ctaSection {
      title,
      subtitle,
      buttonText,
      buttonLink
    }
  }
`

// Our Story page query
export const ourStoryQuery = groq`
  *[_type == "ourstory"][0] {
    heroSection {
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    },
    storySection {
      title,
      content,
      "images": images[]{
        "url": asset->url,
        alt,
        caption
      }
    },
    valuesSection {
      title,
      values[] {
        title,
        description,
        "icon": icon.asset->url
      }
    },
    teamSection {
      title,
      description,
      teamMembers[] {
        name,
        role,
        bio,
        "image": image.asset->url
      }
    },
    ctaSection {
      title,
      buttonText,
      buttonLink
    }
  }
`

// Saunas page query
export const saunasPageQuery = groq`
  *[_type == "saunaspage"][0] {
    heroSection {
      title,
      subtitle,
      buttonText,
      "images": images[]{
        "url": asset->url,
        alt
      }
    },
    introSection {
      title,
      description
    },
    productsSection {
      title,
      displayMode,
      selectedProducts[]-> {
        _id,
        name,
        slug,
        price,
        "heroImage": heroImage.asset->url,
        description
      }
    },
    benefitsSection {
      title,
      benefits[] {
        title,
        description,
        "icon": icon.asset->url
      }
    },
    processSection {
      title,
      steps[] {
        stepNumber,
        title,
        description
      }
    },
    ctaSection {
      title,
      subtitle,
      buttonText,
      buttonLink
    }
  }
`

// Contact page query
export const contactPageQuery = groq`
  *[_type == "contactpage"][0] {
    heroSection {
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    },
    contactInfo {
      title,
      description,
      phone,
      email,
      address,
      businessHours[] {
        days,
        hours
      }
    },
    formSection {
      title,
      description,
      successMessage
    },
    ctaSection {
      title,
      phoneText,
      phoneNumber,
      emailText,
      emailAddress
    },
    socialMedia,
    mapSection {
      showMap,
      mapEmbed
    }
  }
`

// Journal page query
export const journalPageQuery = groq`
  *[_type == "journalpage"][0] {
    heroSection {
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    },
    introSection {
      title,
      description
    },
    featuredSection {
      showFeatured,
      title,
      featuredPosts[]-> {
        _id,
        title,
        slug,
        excerpt,
        "mainImage": mainImage.asset->url,
        publishedAt,
        "author": author->name
      }
    },
    categoriesSection {
      showCategories,
      title
    },
    listingSection {
      postsPerPage,
      layout,
      showExcerpt,
      showAuthor,
      showDate,
      showReadTime
    },
    newsletterSection {
      showNewsletter,
      title,
      description,
      buttonText
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`

// Blog posts query
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    categories[]->{
      title,
      slug
    },
    tags,
    readingTime,
    featured
  }
`

// Single blog post query
export const blogPostQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    body,
    publishedAt,
    "author": author->{
      name,
      bio,
      "image": image.asset->url
    },
    categories[]->{
      title,
      slug
    },
    tags,
    readingTime,
    relatedPosts[]->{
      _id,
      title,
      slug,
      "mainImage": mainImage.asset->url,
      excerpt
    },
    seo {
      metaTitle,
      metaDescription,
      keywords
    }
  }
`

// Featured blog posts query
export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }
`

// Products query
export const productsQuery = groq`
  *[_type == "saunaProduct"] | order(featured desc, _createdAt desc) {
    _id,
    name,
    slug,
    price,
    "heroImage": heroImage.asset->url,
    "galleryImages": galleryImages[].asset->url,
    description,
    specifications,
    features,
    inStock,
    featured
  }
`

// Featured products query
export const featuredProductsQuery = groq`
  *[_type == "saunaProduct" && featured == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    "heroImage": heroImage.asset->url,
    description
  }
`

// Single product query
export const productQuery = groq`
  *[_type == "saunaProduct" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    "heroImage": heroImage.asset->url,
    "galleryImages": galleryImages[].asset->url,
    description,
    specifications,
    features,
    inStock,
    featured,
    dimensions,
    warranty,
    shippingInfo
  }
`

// Testimonials query
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    customerName,
    rating,
    reviewText,
    reviewDate,
    "customerPhoto": customerPhoto.asset->url,
    productPurchased-> {
      name,
      slug
    },
    featured
  }
`

// Site settings query
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    "logo": logo.asset->url,
    "favicon": favicon.asset->url,
    headerSettings {
      showCart,
      showAuth,
      mobileSlogan
    },
    footerSettings {
      copyrightText,
      footerLinks[] {
        title,
        url
      }
    },
    socialMedia,
    contactInfo {
      email,
      phone,
      address
    },
    analytics {
      googleAnalyticsId,
      facebookPixelId
    },
    defaultSeo {
      metaTitle,
      metaDescription,
      "ogImage": ogImage.asset->url
    }
  }
`

// Categories query
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// Authors query
export const authorsQuery = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    "image": image.asset->url
  }
`