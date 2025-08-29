'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection({ pageLoaded = false }: { pageLoaded?: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const slides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/688e6fd14f59c85a9f60aa2d.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg'
  ];

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
              }}
              loading="eager" // Pre-load all images
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
                transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s',
                color: 'white',
                fontFamily: 'var(--font-primary)',
                fontSize: 'clamp(2.4rem, 3.6vw, 3.6rem)',
                fontWeight: 100,
                letterSpacing: '0.08em',
                marginBottom: '0.6rem',
              }}
            >
              Contemporary Luxury Saunas
            </h1>
            <p style={{ 
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1s ease-out 1.05s, transform 1s ease-out 1.05s',
              color: 'rgba(255,255,255,0.8)', 
              margin: '0 0 1.5rem', 
              fontSize: '1.08rem', 
              fontWeight: 200, 
              letterSpacing: '0.06em' 
            }}>
              Scandinavian craftsmanship
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
              View Models <span style={{ marginLeft: '0.6rem', transition: 'transform 0.3s ease' }}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}