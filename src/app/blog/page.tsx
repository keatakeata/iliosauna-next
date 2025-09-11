'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to /journal page which has the full implementation
    router.replace('/journal');
  }, [router]);
  
  return <div style={{ display: 'none' }}>Redirecting...</div>;
}