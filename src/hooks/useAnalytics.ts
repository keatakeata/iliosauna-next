'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAnalytics } from '@/lib/analytics-safe'

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
  const [isClient, setIsClient] = useState(false)
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const analytics = isClient ? getAnalytics() : {
    track: () => {},
    identify: () => {},
    pageView: () => {},
    isReady: false
  }

  return analytics
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