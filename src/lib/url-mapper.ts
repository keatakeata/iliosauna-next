// URL Mapping Configuration
// Maps local development URLs to production URLs for easy reference

export const URL_MAPPINGS = {
  // Base URLs
  local: process.env.NEXT_PUBLIC_LOCAL_URL || 'http://localhost:3001',
  production: process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://iliosauna.com',
  
  // Page mappings
  pages: {
    home: {
      local: '/',
      production: '/',
    },
    saunas: {
      local: '/saunas',
      production: '/saunas',
    },
    ourStory: {
      local: '/our-story',
      production: '/our-story',
    },
    journal: {
      local: '/journal',
      production: '/journal',
    },
    contact: {
      local: '/contact',
      production: '/contact',
    },
    products: {
      local: '/products',
      production: '/products',
    },
    checkout: {
      local: '/checkout',
      production: '/checkout',
    },
    account: {
      local: '/account',
      production: '/account',
    },
    signIn: {
      local: '/sign-in',
      production: '/sign-in',
    },
    signUp: {
      local: '/sign-up',
      production: '/sign-up',
    },
  },
  
  // API endpoints
  api: {
    contact: {
      local: '/api/contact',
      production: '/api/contact',
    },
    ghl: {
      local: '/api/ghl',
      production: '/api/ghl',
    },
  },
};

// Helper function to get the appropriate URL based on environment
export function getUrl(page: keyof typeof URL_MAPPINGS.pages | keyof typeof URL_MAPPINGS.api, type: 'page' | 'api' = 'page'): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl = isDevelopment ? URL_MAPPINGS.local : URL_MAPPINGS.production;
  
  if (type === 'api') {
    const apiRoute = URL_MAPPINGS.api[page as keyof typeof URL_MAPPINGS.api];
    if (!apiRoute) return baseUrl;
    return baseUrl + (isDevelopment ? apiRoute.local : apiRoute.production);
  }
  
  const pageRoute = URL_MAPPINGS.pages[page as keyof typeof URL_MAPPINGS.pages];
  if (!pageRoute) return baseUrl;
  return baseUrl + (isDevelopment ? pageRoute.local : pageRoute.production);
}

// Helper to get production URL for any local URL
export function getProductionUrl(localPath: string): string {
  return URL_MAPPINGS.production + localPath;
}

// Helper to get local URL for any production path
export function getLocalUrl(productionPath: string): string {
  return URL_MAPPINGS.local + productionPath;
}

// Environment-aware base URL
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? URL_MAPPINGS.local 
  : URL_MAPPINGS.production;