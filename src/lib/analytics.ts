import mixpanel from 'mixpanel-browser'
import { supabase } from './supabase'

// Initialize Mixpanel
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!
const IS_DEV = process.env.NEXT_PUBLIC_MIXPANEL_ENV === 'development'

// Only initialize if we have a token
if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: IS_DEV,
    track_pageview: true,
    persistence: 'localStorage',
    ignore_dnt: false
  })
}

// Core analytics functions
export const analytics = {
  // Identify a user (call after login)
  identify: (userId: string, traits?: Record<string, any>) => {
    if (!MIXPANEL_TOKEN || MIXPANEL_TOKEN === 'your-mixpanel-token-here') return
    
    mixpanel.identify(userId)
    if (traits) {
      mixpanel.people.set(traits)
    }
  },

  // Track an event
  track: async (eventName: string, properties?: Record<string, any>) => {
    // Log to console in development
    if (IS_DEV) {
      console.log('🔍 Track Event:', eventName, properties)
    }

    // Send to Mixpanel
    if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      })
    }

    // Store in Supabase for your own analysis
    try {
      const { error } = await supabase.from('events').insert({
        event_name: eventName,
        properties: properties || {},
        session_id: getSessionId(),
        occurred_at: new Date().toISOString()
      })
      
      if (error && IS_DEV) {
        console.error('Error storing event:', error)
      }
    } catch (error) {
      // Don't break the app if analytics fails
      if (IS_DEV) {
        console.error('Analytics error:', error)
      }
    }
  },

  // Track page view
  pageView: (pagePath: string, pageTitle?: string) => {
    analytics.track('Page Viewed', {
      path: pagePath,
      title: pageTitle || document.title,
      referrer: document.referrer,
      url: window.location.href
    })
  },

  // Track e-commerce events
  productViewed: (product: {
    id: string
    name: string
    price: number
    category?: string
  }) => {
    analytics.track('Product Viewed', product)
  },

  addToCart: (product: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    analytics.track('Added to Cart', product)
  },

  checkoutStarted: (cart: {
    value: number
    items_count: number
    items: any[]
  }) => {
    analytics.track('Checkout Started', cart)
  },

  purchaseCompleted: (order: {
    order_id: string
    total: number
    products: any[]
    customer_id?: string
  }) => {
    analytics.track('Purchase Completed', order)
    
    // Track revenue in Mixpanel
    if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here') {
      mixpanel.people.track_charge(order.total)
    }
  },

  // Track form interactions
  formStarted: (formName: string) => {
    analytics.track('Form Started', { form_name: formName })
  },

  formSubmitted: (formName: string, formData?: Record<string, any>) => {
    analytics.track('Form Submitted', {
      form_name: formName,
      ...formData
    })
  },

  // Track user engagement
  videoPlayed: (videoName: string, duration?: number) => {
    analytics.track('Video Played', {
      video_name: videoName,
      duration
    })
  },

  fileDownloaded: (fileName: string, fileType: string) => {
    analytics.track('File Downloaded', {
      file_name: fileName,
      file_type: fileType
    })
  },

  // Track high-intent actions for luxury items
  configuratorUsed: (configuration: Record<string, any>) => {
    analytics.track('Configurator Used', configuration)
  },

  quotRequested: (productInfo: Record<string, any>) => {
    analytics.track('Quote Requested', productInfo)
  },

  financingViewed: () => {
    analytics.track('Financing Options Viewed')
  }
}

// Helper function to get or create session ID
function getSessionId(): string {
  const SESSION_KEY = 'iliosauna_session_id'
  let sessionId = sessionStorage.getItem(SESSION_KEY)
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  
  return sessionId
}

// Auto-track page views
if (typeof window !== 'undefined') {
  // Track initial page view
  analytics.pageView(window.location.pathname)
  
  // Track route changes (for Next.js)
  const handleRouteChange = () => {
    analytics.pageView(window.location.pathname)
  }
  
  // Listen for popstate (browser back/forward)
  window.addEventListener('popstate', handleRouteChange)
}