'use client';

import { usePathname } from 'next/navigation';

interface StructuredDataProps {
  pageType?: 'homepage' | 'product' | 'about' | 'contact' | 'blog' | 'article';
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
  productData?: {
    name: string;
    description: string;
    price?: string;
    image?: string;
  };
}

export default function StructuredData({
  pageType = 'homepage',
  pageTitle,
  pageDescription,
  breadcrumbs,
  faqItems,
  productData
}: StructuredDataProps) {
  const pathname = usePathname();
  const baseUrl = 'https://iliosauna.com';
  const currentUrl = `${baseUrl}${pathname}`;

  // Base organization data
  const organizationData = {
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#organization`,
    name: 'Ilio Sauna',
    description: 'Premium cedar sauna manufacturer specializing in outdoor barrel and cabin saunas. Serving Vancouver Island and BC with luxury wellness solutions.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/ilio-logo-light.svg`,
      width: 300,
      height: 100
    },
    image: `${baseUrl}/ilio-logo-light.svg`,
    telephone: '+1-250-555-0123',
    email: 'info@iliosauna.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Victoria',
      addressRegion: 'BC',
      addressCountry: 'CA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.4284,
      longitude: -123.3656
    },
    areaServed: [
      {
        '@type': 'Place',
        name: 'Vancouver Island'
      },
      {
        '@type': 'Place',
        name: 'British Columbia'
      }
    ],
    priceRange: '$$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Interac'],
    openingHours: 'Mo-Fr 09:00-17:00',
    sameAs: [
      'https://www.facebook.com/iliosauna',
      'https://www.instagram.com/iliosauna'
    ]
  };

  // Website data with search functionality
  const websiteData = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Ilio Sauna - Premium Cedar Saunas',
    description: 'Experience luxury outdoor saunas crafted with BC cedar. Transform your backyard into a wellness retreat.',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Current page data
  const webPageData = {
    '@type': 'WebPage',
    '@id': `${currentUrl}/#webpage`,
    url: currentUrl,
    name: pageTitle || 'Ilio Sauna - Premium Cedar Saunas',
    description: pageDescription || 'Experience luxury outdoor saunas crafted with BC cedar.',
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    about: {
      '@id': `${baseUrl}/#organization`
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${baseUrl}/ilio-logo-light.svg`
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  };

  // Build the @graph array
  const graph: any[] = [organizationData, websiteData, webPageData];

  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbData = {
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}/#breadcrumbs`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.url}`
      }))
    };
    graph.push(breadcrumbData);
  }

  // Add FAQ schema if provided
  if (faqItems && faqItems.length > 0) {
    const faqData = {
      '@type': 'FAQPage',
      '@id': `${currentUrl}/#faq`,
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    };
    graph.push(faqData);
  }

  // Add product schema if provided
  if (productData) {
    const productSchema = {
      '@type': 'Product',
      '@id': `${currentUrl}/#product`,
      name: productData.name,
      description: productData.description,
      manufacturer: {
        '@id': `${baseUrl}/#organization`
      },
      brand: {
        '@type': 'Brand',
        name: 'Ilio Sauna'
      },
      ...(productData.image && {
        image: {
          '@type': 'ImageObject',
          url: productData.image
        }
      }),
      ...(productData.price && {
        offers: {
          '@type': 'Offer',
          price: productData.price,
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
          seller: {
            '@id': `${baseUrl}/#organization`
          }
        }
      })
    };
    graph.push(productSchema);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': graph
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
}