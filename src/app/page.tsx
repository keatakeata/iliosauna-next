'use client';

// Force dynamic rendering to avoid DataCloneError
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SaunaShowcase from '@/components/SaunaShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';

export default function HomePage() {
  const [pageLoaded, setPageLoaded] = useState(false);

  // Trigger page load animations
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollAnimations />
      <Navbar animated={true} />
      <HeroSection pageLoaded={pageLoaded} />
      <AboutSection />
      <SaunaShowcase />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </>
  );
}
