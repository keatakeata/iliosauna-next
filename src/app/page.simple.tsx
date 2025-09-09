export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Ilio Sauna - Temporary Test Page</h1>
      <p>The site is loading correctly. External services (Sanity, Supabase, Clerk) are temporarily disabled.</p>
      <p>This confirms the development server is working.</p>
      
      <h2>Quick Links:</h2>
      <ul>
        <li><a href="/studio">Sanity Studio</a></li>
        <li><a href="/journal">Journal/Blog</a></li>
        <li><a href="/saunas">Saunas</a></li>
        <li><a href="/our-story">Our Story</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      
      <p style={{ marginTop: '2rem', color: '#666' }}>
        The slow loading was caused by external service timeouts. 
        Services need to be properly configured or disabled for development.
      </p>
    </div>
  );
}