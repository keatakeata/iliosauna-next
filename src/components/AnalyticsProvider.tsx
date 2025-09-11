'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics-safe'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Track page views on route change (for global navigation)
  useEffect(() => {
    if (pathname && analytics.isReady) {
      try {
        analytics.pageView(pathname)
      } catch (error) {
        // Silently handle analytics errors
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics pageView error:', error);
        }
      }
    }
  }, [pathname])

  return <>{children}</>
}