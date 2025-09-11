'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Removed motion import for React 19 compatibility
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExpandableSearch from '@/components/ExpandableSearch';
import { useAnalytics, usePageView } from '@/hooks/useAnalytics';

// Temporary simplified journal page to fix localhost
export default function JournalPage() {
  const analytics = useAnalytics();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track page view automatically
  usePageView('/journal', 'Wellness Journal');

  useEffect(() => {
    // Simple loading simulation
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Navbar />
      
      <main style={{ paddingTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            Wellness Journal
          </h1>
          
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Journal page is temporarily simplified while we fix syntax issues.
            </p>
            <p style={{ color: '#888' }}>
              The mobile positioning fixes for blog posts are preserved and working.
            </p>
            <Link 
              href="/journal/welcome-to-ilio-sauna-blog"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#BF5813',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              View Blog Post (Mobile UI Fixed)
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}