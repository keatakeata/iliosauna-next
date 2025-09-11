// DISABLED: Old analytics implementation causing SSR issues
// This file is temporarily disabled to fix "self is not defined" error
// Use analytics-safe.ts instead

import { supabase } from './supabase'

// DISABLED: All analytics functions replaced with no-ops
export const analytics = {
  // All functions are now safe no-ops
  identify: (userId: string, traits?: Record<string, any>) => {
    console.log('📊 Analytics (disabled):', 'identify', userId, traits);
  },
  
  track: async (eventName: string, properties?: Record<string, any>) => {
    console.log('📊 Analytics (disabled):', eventName, properties);
  },
  
  pageView: (pagePath: string, pageTitle?: string) => {
    console.log('📊 Analytics (disabled):', 'pageView', pagePath, pageTitle);
  },
  
  productViewed: (product: any) => {
    console.log('📊 Analytics (disabled):', 'productViewed', product);
  },
  
  addToCart: (product: any) => {
    console.log('📊 Analytics (disabled):', 'addToCart', product);
  },
  
  checkoutStarted: (cart: any) => {
    console.log('📊 Analytics (disabled):', 'checkoutStarted', cart);
  },
  
  purchaseCompleted: (order: any) => {
    console.log('📊 Analytics (disabled):', 'purchaseCompleted', order);
  },
  
  formStarted: (formName: string) => {
    console.log('📊 Analytics (disabled):', 'formStarted', formName);
  },
  
  formSubmitted: (formName: string, formData?: Record<string, any>) => {
    console.log('📊 Analytics (disabled):', 'formSubmitted', formName, formData);
  },
  
  videoPlayed: (videoName: string, duration?: number) => {
    console.log('📊 Analytics (disabled):', 'videoPlayed', videoName, duration);
  },
  
  fileDownloaded: (fileName: string, fileType: string) => {
    console.log('📊 Analytics (disabled):', 'fileDownloaded', fileName, fileType);
  },
  
  configuratorUsed: (configuration: Record<string, any>) => {
    console.log('📊 Analytics (disabled):', 'configuratorUsed', configuration);
  },
  
  quotRequested: (productInfo: Record<string, any>) => {
    console.log('📊 Analytics (disabled):', 'quotRequested', productInfo);
  },
  
  financingViewed: () => {
    console.log('📊 Analytics (disabled):', 'financingViewed');
  }
}

// DISABLED: Helper functions
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr_session';
  return 'disabled_session';
}