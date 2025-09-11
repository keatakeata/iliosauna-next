'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Create a client-only analytics component that won't be rendered server-side
const AnalyticsProvider = dynamic(
  () => import('./AnalyticsProvider').then(mod => ({ default: mod.AnalyticsProvider })),
  {
    ssr: false,
    loading: () => null // No loading spinner needed for analytics
  }
)

interface ClientOnlyAnalyticsProps {
  children: ReactNode
}

export default function ClientOnlyAnalytics({ children }: ClientOnlyAnalyticsProps) {
  return (
    <>
      {children}
      <AnalyticsProvider>
        <></>
      </AnalyticsProvider>
    </>
  )
}