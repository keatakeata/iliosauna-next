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
    description: 'Premium cedar sauna manufacturer specializing in outdoor barrel and cabin saunas. Professional delivery and installation across British Columbia.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/ilio-logo-light.svg`,
      width: 300,
      height: 100
    },
    image: `${baseUrl}/ilio-logo-light.svg`,
    telephone: '+1-250-597-1244',
    email: 'hello@iliosauna.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '404 – 2471 Sidney Ave',
      addressLocality: 'Sidney',
      addressRegion: 'BC',
      postalCode: 'V8L3A6',
      addressCountry: 'CA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.6523,
      longitude: -123.3991
    },
    areaServed: [
      // Vancouver Island
      {
        '@type': 'Place',
        name: 'Vancouver Island',
        containedInPlace: {
          '@type': 'Place',
          name: 'British Columbia, Canada'
        },
        containsPlace: [
          { '@type': 'Place', name: 'Victoria, BC' },
          { '@type': 'Place', name: 'Saanich, BC' },
          { '@type': 'Place', name: 'Oak Bay, BC' },
          { '@type': 'Place', name: 'Sidney, BC' },
          { '@type': 'Place', name: 'Langford, BC' },
          { '@type': 'Place', name: 'Colwood, BC' },
          { '@type': 'Place', name: 'Sooke, BC' },
          { '@type': 'Place', name: 'Nanaimo, BC' },
          { '@type': 'Place', name: 'Courtenay, BC' },
          { '@type': 'Place', name: 'Campbell River, BC' },
          { '@type': 'Place', name: 'Duncan, BC' },
          { '@type': 'Place', name: 'Parksville, BC' },
          { '@type': 'Place', name: 'Qualicum Beach, BC' }
        ]
      },
      // Metro Vancouver
      {
        '@type': 'Place',
        name: 'Metro Vancouver',
        containedInPlace: {
          '@type': 'Place',
          name: 'British Columbia, Canada'
        },
        containsPlace: [
          { '@type': 'Place', name: 'Vancouver, BC' },
          { '@type': 'Place', name: 'Burnaby, BC' },
          { '@type': 'Place', name: 'Surrey, BC' },
          { '@type': 'Place', name: 'Richmond, BC' },
          { '@type': 'Place', name: 'Coquitlam, BC' },
          { '@type': 'Place', name: 'Delta, BC' },
          { '@type': 'Place', name: 'North Vancouver, BC' },
          { '@type': 'Place', name: 'West Vancouver, BC' },
          { '@type': 'Place', name: 'New Westminster, BC' },
          { '@type': 'Place', name: 'Maple Ridge, BC' },
          { '@type': 'Place', name: 'Port Moody, BC' },
          { '@type': 'Place', name: 'White Rock, BC' }
        ]
      },
      // Fraser Valley
      {
        '@type': 'Place',
        name: 'Fraser Valley',
        containedInPlace: {
          '@type': 'Place',
          name: 'British Columbia, Canada'
        },
        containsPlace: [
          { '@type': 'Place', name: 'Abbotsford, BC' },
          { '@type': 'Place', name: 'Chilliwack, BC' },
          { '@type': 'Place', name: 'Mission, BC' },
          { '@type': 'Place', name: 'Hope, BC' },
          { '@type': 'Place', name: 'Langley Township, BC' },
          { '@type': 'Place', name: 'Harrison Hot Springs, BC' }
        ]
      },
      // Sea to Sky & Beyond
      {
        '@type': 'Place',
        name: 'Sea to Sky & Beyond',
        containedInPlace: {
          '@type': 'Place',
          name: 'British Columbia, Canada'
        },
        containsPlace: [
          { '@type': 'Place', name: 'Squamish, BC' },
          { '@type': 'Place', name: 'Whistler, BC' },
          { '@type': 'Place', name: 'Pemberton, BC' },
          { '@type': 'Place', name: 'Gibsons, BC' },
          { '@type': 'Place', name: 'Sechelt, BC' },
          { '@type': 'Place', name: 'Powell River, BC' },
          { '@type': 'Place', name: 'Salt Spring Island, BC' },
          { '@type': 'Place', name: 'Galiano Island, BC' },
          { '@type': 'Place', name: 'Pender Island, BC' }
        ]
      }
    ],
    priceRange: '$$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Interac', 'E-transfer'],
    openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00', 'Su 12:00-16:00'],
    sameAs: [
      'https://www.facebook.com/people/Ilio-sauna/61581939952450/',
      'https://www.instagram.com/iliosauna/'
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
    datePublished: '2024-01-01T00:00:00.000Z',
    dateModified: '2024-12-01T00:00:00.000Z'
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
      suppressHydrationWarning={true}
    />
  );
}