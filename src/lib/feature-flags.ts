/**
 * FEATURE FLAGS - Temporary on/off switches for features
 * 
 * TO ENABLE E-COMMERCE FEATURES AGAIN:
 * Simply change these values from false to true
 * 
 * Created: August 29, 2025
 * Reason: Business owner not ready for e-commerce yet
 */

export const FEATURE_FLAGS = {
  // E-commerce features
  SHOW_CART: false,           // Cart button in navbar
  SHOW_AUTH: false,           // Sign in/Sign up buttons
  SHOW_ADD_TO_CART: false,    // Add to Cart buttons on product pages
  SHOW_BUY_NOW: false,        // Buy Now buttons on product pages
  
  // When ready to go live with e-commerce, just change above to true
  // Example: SHOW_CART: true,
};

// Helper function to check if e-commerce is enabled
export const isEcommerceEnabled = () => {
  return FEATURE_FLAGS.SHOW_CART || 
         FEATURE_FLAGS.SHOW_ADD_TO_CART || 
         FEATURE_FLAGS.SHOW_BUY_NOW;
};