'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { analytics } from '@/lib/analytics'
import { syncUserWithSupabase } from '@/lib/supabase'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname)
    }
  }, [pathname])

  // Identify user when they log in
  useEffect(() => {
    if (isLoaded && user) {
      // Identify in Mixpanel
      analytics.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        created_at: user.createdAt
      })

      // Sync with Supabase (non-blocking)
      syncUserWithSupabase(user).catch(err => {
        console.warn('Failed to sync user with Supabase (non-critical):', err)
      })
    }
  }, [user, isLoaded])

  return <>{children}</>
}