'use client'

export default function StudioPage() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>Sanity Studio</h1>
      <p style={{ marginTop: '20px', fontSize: '18px' }}>
        Please use the hosted Sanity Studio instead:
      </p>
      <a 
        href="https://bxybmggj.sanity.studio/" 
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#f03e2f',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      >
        Open Sanity Studio →
      </a>
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '10px' }}>How to use:</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Click the button above to open Sanity Studio</li>
          <li>Login with your Sanity account</li>
          <li>Create and publish blog posts</li>
          <li>View them at <a href="/journal">localhost:4448/journal</a></li>
        </ol>
      </div>
    </div>
  )
}