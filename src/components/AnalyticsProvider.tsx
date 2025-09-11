'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
// Temporarily disabled to fix build
// import { analytics } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      try {
        // analytics.pageView(pathname)
      } catch (error) {
        // Silently handle analytics errors in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Analytics pageView skipped in dev');
        }
      }
    }
  }, [pathname])

  return <>{children}</>
}