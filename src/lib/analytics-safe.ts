'use client'

// SSR-Safe Analytics Implementation
// This version ensures NO server-side execution of browser-only code

type TrackingData = Record<string, any>

interface AnalyticsInstance {
  track: (eventName: string, properties?: TrackingData) => void
  identify: (userId: string, traits?: TrackingData) => void
  pageView: (path: string, title?: string) => void
  isReady: boolean
}

class SafeAnalytics implements AnalyticsInstance {
  private mixpanel: any = null
  private initialized = false
  private isClient = false

  constructor() {
    // Only initialize on client-side
    if (typeof window !== 'undefined') {
      this.isClient = true
      this.initializeAsync()
    }
  }

  private async initializeAsync() {
    try {
      // Dynamic import only happens on client-side
      const mixpanelModule = await import('mixpanel-browser')
      this.mixpanel = mixpanelModule.default

      const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
      const isDev = process.env.NODE_ENV === 'development'

      if (!isDev && token && token !== 'your-mixpanel-token-here') {
        this.mixpanel.init(token, {
          debug: false,
          track_pageview: false,
          persistence: 'localStorage',
          ignore_dnt: true,
          api_host: 'https://api.mixpanel.com',
          loaded: () => {
            this.initialized = true
            console.log('📊 Analytics: Mixpanel initialized successfully')
          }
        })
      } else {
        this.initialized = true
        if (isDev) {
          console.log('📊 Analytics: Development mode - using console logging')
        }
      }
    } catch (error) {
      console.warn('📊 Analytics: Failed to initialize:', error)
      this.initialized = true // Mark as ready even if failed
    }
  }

  get isReady(): boolean {
    return this.isClient && this.initialized
  }

  track(eventName: string, properties?: TrackingData): void {
    if (!this.isClient) return

    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Track Event:', eventName, eventData)
      return
    }

    // Track in production if initialized
    if (this.mixpanel && this.initialized) {
      try {
        this.mixpanel.track(eventName, eventData)
      } catch (error) {
        console.warn('📊 Analytics: Tracking failed:', error)
      }
    }
  }

  identify(userId: string, traits?: TrackingData): void {
    if (!this.isClient) return

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Identify User:', userId, traits)
      return
    }

    if (this.mixpanel && this.initialized) {
      try {
        this.mixpanel.identify(userId)
        if (traits) {
          this.mixpanel.people.set(traits)
        }
      } catch (error) {
        console.warn('📊 Analytics: Identify failed:', error)
      }
    }
  }

  pageView(path: string, title?: string): void {
    if (!this.isClient) return

    const pageData = {
      path,
      title: title || document.title,
      referrer: document.referrer,
      url: window.location.href
    }

    this.track('Page Viewed', pageData)
  }
}

// Create singleton instance
let analyticsInstance: SafeAnalytics | null = null

export function getAnalytics(): AnalyticsInstance {
  if (!analyticsInstance) {
    analyticsInstance = new SafeAnalytics()
  }
  return analyticsInstance
}

// Export for backward compatibility
export const analytics = {
  track: (eventName: string, properties?: TrackingData) => getAnalytics().track(eventName, properties),
  identify: (userId: string, traits?: TrackingData) => getAnalytics().identify(userId, traits),
  pageView: (path: string, title?: string) => getAnalytics().pageView(path, title),
  get isReady() { return getAnalytics().isReady }
}