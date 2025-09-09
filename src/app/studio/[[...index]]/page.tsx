'use client'

import dynamic from 'next/dynamic'

const Studio = dynamic(() => import('./studio'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      Loading Sanity Studio...
    </div>
  ),
})

export default function StudioPage() {
  return <Studio />
}