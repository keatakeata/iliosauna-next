'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { sanityImageUrl } from '@/lib/sanity.config';

interface HeroSectionProps {
  homepageData?: {
    heroSection: {
      title: string;
      subtitle: string;
      buttonText: string;
      images: { imageFile?: any; imageUrl?: string; alt: string }[];
    };
  };
}

export default function HeroSection({ homepageData }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Updated images - exact sequence from live site
  const fallbackSlides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/688e6fd14f59c85a9f60aa2d.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg'
  ];

  let slides = fallbackSlides;
  if (homepageData?.heroSection?.images?.length) {
    const sanitySlides = homepageData.heroSection.images
      .map(img => img.imageUrl)
      .filter((url): url is string => Boolean(url));
    if (sanitySlides.length > 0) {
      slides = sanitySlides;
    }
  }



  // Get text content from Sanity or use defaults
  const heroTitle = homepageData?.heroSection?.title || 'Contemporary Luxury Saunas';
  const heroSubtitle = homepageData?.heroSection?.subtitle || 'Scandinavian craftsmanship';
  const heroButtonText = homepageData?.heroSection?.buttonText || 'View Models';

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Mobile detection for responsive positioning
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section 
      id="hero" 
      className="hero-section ilio-section-full"
      style={{ 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        paddingTop: 0
      }}
    >
      {/* Single Continuously Zooming Container */}
      <div 
        ref={containerRef}
        className="hero-zoom-wrapper"
        style={{
          position: 'absolute',
          inset: '-10%', // Extra space for zoom
          width: '120%',
          height: '120%',
        }}
      >
        {/* All slides rendered, only opacity changes */}
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`} // Static key - never changes
            className="hero-slide-wrapper"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: currentSlide === index ? 2 : 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide}
              alt={`Luxury sauna ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition:
                  // Mobile specific positioning for Image 3 (index 2)
                  (isMobile && index === 2) ? '80% center' : // Image 3 - more to the right on mobile
                  // Desktop positioning
                  index === 1 ? '70% center' : // Image 2 - slightly left of right
                  index === 5 ? '40% center' : // Image 6 - slightly right of left
                  'center center'
              }}
              loading="eager"
              onError={(e) => {
                console.error('Hero image failed to load:', slide);
                e.currentTarget.style.backgroundColor = '#ff0000';
              }}
              onLoad={() => {
                console.log('Hero image loaded successfully:', slide);
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
            }} />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div 
        className="hero-content" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '4rem 0 3rem',
        }}
      >
        <div className="ilio-container">
          <div className="hero-text" style={{ color: 'white', textAlign: 'left', maxWidth: '600px' }}>
            <h1 
              style={{
                opacity: pageLoaded ? 1 : 0,
                transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s ease-out, transform 1s ease-out',
                color: 'white',
                fontFamily: 'var(--font-primary)',
                fontSize: 'clamp(2.4rem, 3.6vw, 3.6rem)',
                fontWeight: 100,
                letterSpacing: '0.08em',
                marginBottom: '0.6rem',
              }}
            >
              {heroTitle}
            </h1>
            <p style={{ 
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1s ease-out, transform 1s ease-out',
              color: 'rgba(255,255,255,0.8)', 
              margin: '0 0 1.5rem', 
              fontSize: '1.08rem', 
              fontWeight: 200, 
              letterSpacing: '0.06em' 
            }}>
              {heroSubtitle}
            </p>
            <Link 
              href="/saunas" 
              style={{
                opacity: pageLoaded ? 1 : 0,
                transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s ease-out 1.3s, transform 1s ease-out 1.3s, all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-block',
                padding: '0.72rem 1.8rem',
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {heroButtonText} <span style={{ marginLeft: '0.6rem', transition: 'transform 0.3s ease' }}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
