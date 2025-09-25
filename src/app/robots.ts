import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/studio/',
        '/debug/',
        '/test/',
        '/test-page/',
        '/studio-test/',
        '/_*/',
        '/api/',
      ],
    },
    sitemap: 'https://iliosauna.com/sitemap.xml',
  }
}