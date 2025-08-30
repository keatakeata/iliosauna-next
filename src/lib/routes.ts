/**
 * Centralized route configuration
 * IMPORTANT: These routes must match production exactly
 * Any changes here will affect both local and production deployments
 */

export const ROUTES = {
  // Public pages
  HOME: '/',
  SAUNAS: '/saunas',
  OUR_STORY: '/our-story',
  JOURNAL: '/journal',
  CONTACT: '/contact',
  PRODUCTS: '/products',
  
  // E-commerce
  CHECKOUT: '/checkout',
  
  // Authentication (Clerk)
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  
  // Account/Dashboard (Protected)
  ACCOUNT: {
    DASHBOARD: '/account',
    ORDERS: '/account/orders',
    ORDER_DETAIL: (id: string) => `/account/orders/${id}`,
    PROFILE: '/account/profile',
    SUPPORT: '/account/support',
    WISHLIST: '/account/wishlist',
    SETTINGS: '/account/settings',
  },
  
  // API Routes
  API: {
    CONTACT: '/api/contact',
    GHL: '/api/ghl',
    CHECKOUT: '/api/checkout',
    ORDERS: '/api/orders',
    PROFILE: '/api/profile',
  }
} as const;

// Helper function to get absolute URL
export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3005');
  return `${baseUrl}${path}`;
}

// Helper to check if current path matches route
export function isCurrentRoute(currentPath: string, route: string): boolean {
  return currentPath === route;
}

// Helper to check if user is on account pages
export function isAccountPage(path: string): boolean {
  return path.startsWith('/account');
}

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.ACCOUNT.DASHBOARD,
  ROUTES.ACCOUNT.ORDERS,
  ROUTES.ACCOUNT.PROFILE,
  ROUTES.ACCOUNT.SUPPORT,
  ROUTES.ACCOUNT.WISHLIST,
  ROUTES.ACCOUNT.SETTINGS,
  ROUTES.CHECKOUT,
];

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SAUNAS,
  ROUTES.OUR_STORY,
  ROUTES.JOURNAL,
  '/journal/(.*)', // Include all journal/blog post pages
  ROUTES.CONTACT,
  ROUTES.PRODUCTS,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  '/studio',
  '/studio/(.*)', // Include all studio sub-routes
  '/blog', // Blog redirect page
  '/blog/(.*)', // All blog sub-routes
];