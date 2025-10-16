/**
 * FEATURE FLAGS - Environment-based feature toggles
 *
 * These are now controlled by NEXT_PUBLIC_ECOM_UI_VISIBLE environment variable:
 * - In development: Set to true in .env.development.local
 * - In production: Set to false in .env.local (or .env.production.local)
 *
 * Created: August 29, 2025
 * Updated: October 6, 2025 - Made environment-based
 */

// Check if e-commerce should be visible based on environment
const isEcomVisible = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_ECOM_UI_VISIBLE === 'true';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_ECOM_UI_VISIBLE === 'true';
};

export const FEATURE_FLAGS = {
  // E-commerce features - now environment-based
  SHOW_CART: isEcomVisible(),           // Cart button in navbar
  SHOW_AUTH: isEcomVisible(),           // Sign in/Sign up buttons
  SHOW_ADD_TO_CART: isEcomVisible(),    // Add to Cart buttons on product pages
  SHOW_BUY_NOW: isEcomVisible(),        // Buy Now buttons on product pages
};

// Helper function to check if e-commerce is enabled
export const isEcommerceEnabled = () => {
  return isEcomVisible();
};