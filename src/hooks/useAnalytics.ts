'use client'

import { useEffect, useState, useCallback } from 'react'

// Types for better TypeScript support
interface AnalyticsConfig {
  mixpanelToken?: string
  isProduction: boolean
  isDevelopment: boolean
}

interface TrackingData {
  [key: string]: any
}

interface AnalyticsInstance {
  track: (eventName: string, properties?: TrackingData) => void
  identify: (userId: string, traits?: TrackingData) => void
  pageView: (path: string, title?: string) => void
  isReady: boolean
}

export function useAnalytics(): AnalyticsInstance {
  const [mixpanel, setMixpanel] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  const config: AnalyticsConfig = {
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  }

  // Wait for hydration before initializing anything
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Initialize Mixpanel only after hydration and in browser
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return
    
    // Only initialize in production with valid token
    if (!config.isProduction || !config.mixpanelToken || config.mixpanelToken === 'your-mixpanel-token-here') {
      if (config.isDevelopment) {
        console.log('📊 Analytics: Skipping Mixpanel in development')
      }
      setIsInitialized(true) // Mark as "ready" even if skipped
      return
    }

    // Temporarily use simple console logging instead of Mixpanel
    // TODO: Re-enable Mixpanel after resolving SSR issues
    console.log('📊 Analytics: Using console-based tracking (Mixpanel disabled temporarily)')
    setIsInitialized(true)
  }, [isHydrated, config.isProduction, config.mixpanelToken, config.isDevelopment])

  // Safe tracking function (console-based for now)
  const track = useCallback((eventName: string, properties?: TrackingData) => {
    // Always use console logging for now (Mixpanel temporarily disabled)
    console.log('📊 Track Event:', eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'ssr',
    })
  }, [])  

  // Safe identify function (console-based for now)
  const identify = useCallback((userId: string, traits?: TrackingData) => {
    console.log('📊 Identify User:', userId, traits)
  }, [])

  // Safe page view tracking
  const pageView = useCallback((path: string, title?: string) => {
    if (typeof window === 'undefined') return

    const pageData = {
      path,
      title: title || document.title,
      referrer: document.referrer,
      url: window.location.href
    }

    track('Page Viewed', pageData)
  }, [track])

  return {
    track,
    identify,
    pageView,
    isReady: isHydrated && isInitialized
  }
}

// Utility hook for page view tracking
export function usePageView(path?: string, title?: string) {
  const analytics = useAnalytics()

  useEffect(() => {
    if (analytics.isReady && typeof window !== 'undefined') {
      const pagePath = path || window.location.pathname
      analytics.pageView(pagePath, title)
    }
  }, [analytics, path, title])
}