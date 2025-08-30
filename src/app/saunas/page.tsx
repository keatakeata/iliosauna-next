'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';
import { modalContent } from './modalContent';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

// Lazy Loading Image Component for Performance
function LazyImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && src) {
      setImageSrc(src);
    }
  }, [src]);

  useEffect(() => {
    if (!containerRef) return;
    
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0,
      rootMargin: '100px' // Start loading 100px before image enters viewport
    });
    
    observer.observe(containerRef);
    
    return () => {
      observer.disconnect();
    };
  }, [containerRef, onIntersection]);

  return (
    <>
      <div
        ref={setContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
          transition: 'filter 0.3s ease-out',
          ...style
        }}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            ...style
          }}
        />
      )}
    </>
  );
}

export default function SaunasPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);
  const { addItem } = useCart();

  // Trigger page load animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Slideshow images
  const slides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e7797e0fe546e46493d4b.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f40ac13c4545.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg'
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [slides.length]);

  // Handle scroll locking when modal is open
  useEffect(() => {
    const isModalOpen = activeModal || fullscreenImage;
    
    if (isModalOpen) {
      // Only save scroll position if body is not already fixed (first modal/fullscreen opening)
      if (document.body.style.position !== 'fixed') {
        scrollPositionRef.current = window.scrollY;
        
        // Apply scroll lock styles
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Only restore if body is currently fixed
      if (document.body.style.position === 'fixed') {
        const savedScrollPosition = scrollPositionRef.current;
        
        // Remove all scroll lock styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        
        // Restore scroll position without animation
        if (savedScrollPosition >= 0) {
          window.scrollTo({
            top: savedScrollPosition,
            left: 0,
            behavior: 'instant' as ScrollBehavior
          });
        }
      }
    }
  }, [activeModal, fullscreenImage]);

  const premiumFeatures = [
    { 
      id: 'structural',
      title: 'Building',
      description: '2×4 frame, Rockwool R-14, dual barriers',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e787c914f6a78afadce42.jpeg'
    },
    { 
      id: 'doors',
      title: 'Doors and Windows',
      description: 'Tempered glass, cedar frame, premium hardware',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6dd9c1c1203c2dc791.jpeg'
    },
    { 
      id: 'flooring',
      title: 'Flooring',
      description: 'Waterproof, coved, zero-maintenance',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6de916f4ccf63c46c1.jpeg'
    },
    { 
      id: 'lighting',
      title: 'Lighting',
      description: '3000K under-bench ambient glow',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac105564b218.jpeg'
    },
    { 
      id: 'heater',
      title: 'Heater',
      description: '9 kW HUUM DROP, Red Dot Award winner',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg'
    },
    { 
      id: 'control',
      title: 'Smart Control / App',
      description: 'Start from anywhere, ready when you are',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68aafb46622ad160dd29c5ca.png'
    },
    { 
      id: 'gauge',
      title: 'Instruments',
      description: 'Fischer 194.01 precision gauge',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d6715de23bf29a.jpeg'
    },
    { 
      id: 'timer',
      title: 'Sand Timer',
      description: '15-minute traditional hourglass',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a59ba2ea7a25.jpeg'
    },
    { 
      id: 'hooks',
      title: 'Steel Hardware',
      description: 'Matte black corrosion-resistant',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48a6e2ac5b4164b058.jpeg'
    }
  ];

  // Modal content imported from modalContent.ts

  return (
    <>
      <ScrollAnimations />
      <Navbar animated={true} />
      
      {/* Hero Slideshow Section */}
      <section style={{ 
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Single Continuously Zooming Container */}
        <div 
          className="hero-zoom-wrapper"
          style={{
            position: 'absolute',
            inset: '-10%',
            width: '120%',
            height: '120%',
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={`slide-${index}`}
              className="hero-slide-wrapper-saunas"
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
              <img
                src={slide}
                alt={`Ilio Sauna ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="eager"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
              }} />
            </div>
          ))}
        </div>
        
        {/* Hero Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '4rem 0 3rem',
          zIndex: 10
        }}>
          <div className="ilio-container">
            <h1 style={{
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s',
              color: 'white',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 100,
              letterSpacing: '0.08em',
              marginBottom: '0.5rem'
            }}>
              Contemporary Luxury Saunas
            </h1>
            <p style={{
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 1s ease-out 1.05s, transform 1s ease-out 1.05s',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.25rem',
              fontWeight: 200,
              letterSpacing: '0.06em'
            }}>
              Scandinavian craftsmanship
            </p>
          </div>
        </div>
      </section>

      {/* Story Section with correct video */}
      <section className="ilio-section" style={{ background: 'white', padding: '100px 0' }}>
        <div className="ilio-container">
          <div className="text-center mb-5">
            <h2 className="section-header h2-animate reveal-on-scroll" style={{ 
              marginBottom: '2rem',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 100,
              letterSpacing: '0.05em'
            }}>
              Make it stand out
            </h2>
            <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
              width: '75%',
              height: '1px',
              background: '#D1D5DB',
              margin: '0 auto 2rem'
            }}></div>
            <div className="section-text">
              <p className="reveal-on-scroll reveal-delay-2" style={{ 
                maxWidth: '800px', 
                margin: '0 auto',
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                At Ilio, we believe wellness should be accessible, beautiful, and transformative.
                Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.
              </p>
              <p className="reveal-on-scroll reveal-delay-3" style={{ 
                maxWidth: '800px', 
                margin: '1.5rem auto 3rem',
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted 
                with advanced heating systems for an experience that lasts.
              </p>
            </div>
            
            {/* Video Section - 16:9 Aspect Ratio */}
            <div className="reveal-on-scroll reveal-delay-4" style={{ 
              maxWidth: '900px', 
              margin: '3rem auto 0',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              paddingBottom: '56.25%', /* 16:9 aspect ratio (9/16 = 0.5625) */
              height: 0
            }}>
              <video 
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              >
                <source 
                  src="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0ebafd8a0cd83ab30.mp4" 
                  type="video/mp4" 
                />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Sauna Specs Section - Updated */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac4d0764b219.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 0'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px',
          padding: '0 2rem'
        }}>
          <h2 className="reveal-on-scroll" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 100,
            letterSpacing: '0.05em',
            marginBottom: '2rem',
            color: 'white'
          }}>
            Ilio <span style={{ fontWeight: 300 }}>Sauna</span>
          </h2>
          <div className="reveal-on-scroll reveal-delay-1" style={{
            width: '115px',
            height: '2px',
            background: 'rgba(255,255,255,0.5)',
            margin: '0 auto 3rem'
          }}></div>
          
          <div style={{ textAlign: 'left' }}>
            <div className="reveal-on-scroll reveal-delay-2" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>BASE PRICE</div>
              <div style={{ fontSize: '2rem', fontWeight: 200 }}>$20,000 CAD</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-3" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>SIZE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>4-6 person capacity</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-4" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>HEATER</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>9kW HUUM DROP Finnish heater</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-5" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>WARRANTY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>5-year comprehensive coverage</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-6" style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>LEAD TIME</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>6-8 weeks</div>
            </div>
            
            {/* Add to Cart and Buy Now buttons - CONTROLLED BY FEATURE FLAGS */}
            {(FEATURE_FLAGS.SHOW_ADD_TO_CART || FEATURE_FLAGS.SHOW_BUY_NOW) && (
              <div className="reveal-on-scroll reveal-delay-7" style={{ 
                display: 'flex', 
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {FEATURE_FLAGS.SHOW_ADD_TO_CART && (
                  <button
                onClick={() => {
                  addItem({
                    id: 'ilio-sauna-premium',
                    name: 'Ilio Premium Cedar Sauna',
                    price: 20000,
                    image: slides[0],
                    description: '4-6 person capacity, HUUM DROP heater'
                  });
                }}
                style={{
                  flex: '1 1 200px',
                  padding: '16px 32px',
                  backgroundColor: '#BF5813',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a64a11';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#BF5813';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ADD TO CART
              </button>
              )}
              
              {FEATURE_FLAGS.SHOW_BUY_NOW && (
                <button
                onClick={() => {
                  addItem({
                    id: 'ilio-sauna-premium',
                    name: 'Ilio Premium Cedar Sauna',
                    price: 20000,
                    image: slides[0],
                    description: '4-6 person capacity, HUUM DROP heater'
                  });
                  // Navigate to checkout
                  window.location.href = '/checkout';
                }}
                style={{
                  flex: '1 1 200px',
                  padding: '16px 32px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #BF5813',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#BF5813';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                BUY NOW
              </button>
              )}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Details Section - Complete Redesign */}
      <section className="ilio-section" style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="ilio-container">
          <div className="text-center mb-5">
            <h2 className="section-header h2-animate reveal-on-scroll" style={{ 
              marginBottom: '2rem',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 100,
              letterSpacing: '0.05em'
            }}>Premium Details Included</h2>
            <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
              width: '75%',
              height: '1px',
              background: '#D1D5DB',
              margin: '0 auto 2rem'
            }}></div>
            <p className="section-text reveal-on-scroll reveal-delay-2" style={{
              fontSize: '1.1rem',
              color: '#5a5a5a',
              marginBottom: '3rem'
            }}>Tap any feature to explore</p>
          </div>
          
          {/* Desktop Grid View - Hidden on mobile/tablet */}
          <div className="desktop-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto',
            willChange: 'transform',
            transform: 'translateZ(0)' // Force GPU acceleration
          }}>
            {premiumFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className={`reveal-on-scroll reveal-delay-${Math.min(index + 3, 8)}`}
                onClick={() => setActiveModal(feature.id)}
                style={{
                  position: 'relative',
                  height: '250px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('.card-overlay') as HTMLElement;
                  if (overlay) {
                    overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 50%)';
                  }
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('.card-overlay') as HTMLElement;
                  if (overlay) {
                    overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 50%)';
                  }
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {feature.image && (
                  <LazyImage 
                    src={feature.image}
                    alt={feature.title}
                  />
                )}
                <div 
                  className="card-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 50%)',
                    transition: 'background 0.4s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.25rem',
                  color: 'white',
                  zIndex: 2
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    marginBottom: '0.25rem',
                    color: 'white'
                  }}>{feature.title}</h3>
                  <p style={{ 
                    fontSize: '0.875rem',
                    opacity: 0.9,
                    marginBottom: '0.25rem',
                    color: 'white'
                  }}>{feature.description}</p>
                  <span style={{ fontSize: '0.875rem', color: 'white' }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile/Tablet View - Full width stacked */}
          <div className="mobile-tablet-grid" style={{ display: 'none' }}>
            {premiumFeatures.map((feature, index) => (
              <div 
                key={feature.id}
                className={`reveal-on-scroll reveal-delay-${Math.min(index + 3, 8)}`}
                onClick={() => setActiveModal(feature.id)}
                style={{
                  position: 'relative',
                  height: '400px',
                  width: '100vw',
                  marginLeft: 'calc(-50vw + 50%)',
                  marginRight: 'calc(-50vw + 50%)',
                  cursor: 'pointer'
                }}
              >
                {feature.image && (
                  <LazyImage 
                    src={feature.image}
                    alt={feature.title}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}/>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'white',
                  zIndex: 2
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    marginBottom: '0.5rem',
                    color: 'white'
                  }}>{feature.title}</h3>
                  <p style={{ 
                    fontSize: '1rem',
                    opacity: 0.9,
                    marginBottom: '0.75rem',
                    color: 'white'
                  }}>{feature.description}</p>
                  <span style={{ fontSize: '1rem', color: 'white' }}>Tap to explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee & FAQ Section */}
      <section style={{ padding: '100px 0', background: '#f8f8f8' }}>
        <div className="ilio-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Guarantee */}
            <div className="reveal-on-scroll" style={{
              background: '#F9FAFB',
              padding: '3rem',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 7V11C4 16.5 7.5 21.3 12 22C16.5 21.3 20 16.5 20 11V7L12 2Z" stroke="#BF5813" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#BF5813" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.75rem',
                fontWeight: 300,
                marginBottom: '1rem',
                color: '#333'
              }}>30-Day Löyly-Love Promise</h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                We&apos;re so confident you&apos;ll love your Ilio sauna that we offer a full 30-day trial. 
                If you&apos;re not experiencing deeper sleep, less stress, and that post-sauna glow—we&apos;ll 
                arrange pickup and issue a complete refund. No questions, no hassle.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                <li style={{ padding: '0.5rem 0', color: '#374151' }}>✓ 100% money-back guarantee</li>
                <li style={{ padding: '0.5rem 0', color: '#374151' }}>✓ We handle removal & shipping</li>
                <li style={{ padding: '0.5rem 0', color: '#374151' }}>✓ Keep all accessories as our gift</li>
                <li style={{ padding: '0.5rem 0', color: '#374151' }}>✓ No restocking fees ever</li>
              </ul>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                *In 3 years, we&apos;ve had exactly 2 returns. Both customers bought larger models.
              </p>
            </div>
            
            {/* FAQ */}
            <div className="reveal-on-scroll reveal-delay-1" style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#BF5813" strokeWidth="1.5"/>
                  <path d="M9.5 9C9.5 7.5 10.5 6.5 12 6.5C13.5 6.5 14.5 7.5 14.5 9C14.5 10.5 13.5 11 12 11.5V13" stroke="#BF5813" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="16.5" r="0.5" fill="#BF5813"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.75rem',
                fontWeight: 300,
                marginBottom: '1.5rem',
                color: '#333'
              }}>Common Questions</h3>
              
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>Do I need a building permit?</h4>
                <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Most municipalities don&apos;t require permits for structures under 108 sq ft. 
                  We provide all documentation needed for your local bylaws.
                </p>
              </div>
              
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>Can my electrician handle the wiring?</h4>
                <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Yes! Any licensed electrician can install the 40A/240V connection. 
                  We include detailed wiring diagrams and offer free phone support.
                </p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>How much maintenance is required?</h4>
                <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Almost none. Wipe benches monthly, oil exterior annually. 
                  The HUUM heater self-cleans with each use. Total: 20 minutes/year.
                </p>
              </div>
              <Link 
                href="/contact"
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  color: '#BF5813',
                  textDecoration: 'none',
                  fontWeight: 400,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Have a different question? Chat with an expert →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
            >
              ✕
            </button>
            
            {modalContent[activeModal as keyof typeof modalContent] && (() => {
              const content = modalContent[activeModal as keyof typeof modalContent];
              return (
                <div style={{ padding: '3rem' }}>
                  {/* Award badge if present */}
                  {content.award && (
                    <div style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      display: 'inline-block',
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      {content.award}
                    </div>
                  )}
                  
                  {/* Title and subtitle - centered */}
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem', color: '#111' }}>
                      {content.title}
                    </h2>
                    <p style={{ color: '#333', marginBottom: '0', fontSize: '1.1rem' }}>
                      {content.subtitle}
                    </p>
                  </div>
                  
                  {/* Award text if present */}
                  {content.awardText && (
                    <p style={{ 
                      fontStyle: 'italic',
                      color: '#9B8B7E',
                      marginBottom: '2rem',
                      paddingLeft: '1rem',
                      borderLeft: '3px solid #FFD700'
                    }}>
                      {content.awardText}
                    </p>
                  )}
                  
                  {/* Main image */}
                  {content.mainImage && (
                    <img 
                      src={content.mainImage}
                      alt={content.title}
                      onClick={() => setFullscreenImage(content.mainImage || null)}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        cursor: 'zoom-in'
                      }}
                    />
                  )}
                  
                  {/* Gallery if present */}
                  {content.gallery && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '2rem'
                    }}>
                      {content.gallery.map((img, idx) => img ? (
                        <img 
                          key={idx}
                          src={img}
                          alt={`${content.title} ${idx + 1}`}
                          onClick={() => setFullscreenImage(img)}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            cursor: 'zoom-in'
                          }}
                        />
                      ) : null)}
                    </div>
                  )}
                  
                  {/* Sections */}
                  {content.sections && content.sections.map((section, idx) => {
                    switch(section.type) {
                      case 'grid':
                        return (
                          <div key={idx} style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            {section.items?.map((item, itemIdx) => (
                              <div key={itemIdx} style={{
                                background: '#f8f8f8',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                              >
                                <h4 style={{ 
                                  marginBottom: '1rem', 
                                  fontSize: '1.2rem', 
                                  fontWeight: 500,
                                  color: '#111',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <span style={{
                                    width: '4px',
                                    height: '20px',
                                    background: '#BF5813',
                                    borderRadius: '2px'
                                  }}></span>
                                  {item.title}
                                </h4>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                  {item.list?.map((li: string, liIdx: number) => {
                                    const [title, ...desc] = li.split(' - ');
                                    const description = desc.join(' - ');
                                    return (
                                      <div key={liIdx} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem'
                                      }}>
                                        <div style={{
                                          minWidth: '6px',
                                          minHeight: '6px',
                                          width: '6px',
                                          height: '6px',
                                          background: '#BF5813',
                                          borderRadius: '50%',
                                          marginTop: '7px',
                                          opacity: 0.6
                                        }}></div>
                                        <div>
                                          <span style={{
                                            color: '#111',
                                            fontWeight: description ? 500 : 400,
                                            display: 'block'
                                          }}>
                                            {title}
                                          </span>
                                          {description && (
                                            <span style={{
                                              color: '#555',
                                              fontSize: '0.9rem',
                                              lineHeight: '1.4',
                                              display: 'block',
                                              marginTop: '0.25rem'
                                            }}>
                                              {description}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      
                      case 'callout':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, #fff5f0 0%, #f8f8f8 100%)',
                            padding: '2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '1px solid #e5e7eb',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '4px',
                              height: '100%',
                              background: '#BF5813'
                            }}></div>
                            <div className="modal-grid-responsive" style={{
                              display: 'grid',
                              gridTemplateColumns: section.image ? 'minmax(250px, 300px) 1fr' : '1fr',
                              gap: '1.5rem',
                              alignItems: 'flex-start'
                            }}>
                              {section.image && (
                                <img 
                                  src={section.image}
                                  alt={section.title}
                                  onClick={() => setFullscreenImage(section.image || null)}
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: 'zoom-in',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }}
                                />
                              )}
                              <div>
                                <h4 style={{ 
                                  marginBottom: '1rem', 
                                  fontSize: '1.2rem', 
                                  fontWeight: 500, 
                                  color: '#111',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.8 }}>
                                    <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="#BF5813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 12L11 14L15 10" stroke="#BF5813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {section.title}
                                </h4>
                                <p style={{ lineHeight: '1.8', color: '#333' }}>{section.text}</p>
                              </div>
                            </div>
                          </div>
                        );
                      
                      case 'detail':
                        return (
                          <div key={idx} style={{ 
                            marginBottom: '2rem',
                            background: 'linear-gradient(135deg, #f8f8f8 0%, #fff 100%)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb'
                          }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <span style={{
                                width: '4px',
                                height: '20px',
                                background: '#BF5813',
                                borderRadius: '2px'
                              }}></span>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              {section.list?.map((item, itemIdx) => {
                                const [title, ...desc] = item.split(' - ');
                                const description = desc.join(' - ');
                                return (
                                  <div key={itemIdx} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                    padding: '0.5rem 0'
                                  }}>
                                    <div style={{
                                      minWidth: '8px',
                                      minHeight: '8px',
                                      width: '8px',
                                      height: '8px',
                                      background: '#BF5813',
                                      borderRadius: '50%',
                                      marginTop: '6px'
                                    }}></div>
                                    <div>
                                      <span style={{
                                        color: '#111',
                                        fontWeight: description ? 500 : 400,
                                        display: 'block'
                                      }}>
                                        {title}
                                      </span>
                                      {description && (
                                        <span style={{
                                          color: '#555',
                                          fontSize: '0.9rem',
                                          lineHeight: '1.4',
                                          display: 'block',
                                          marginTop: '0.25rem'
                                        }}>
                                          {description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      
                      case 'cards':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            {section.title && (
                              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                                {section.title}
                              </h4>
                            )}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                              gap: '1rem'
                            }}>
                              {section.items?.map((card, cardIdx) => (
                                <div key={cardIdx} style={{
                                  background: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '1rem',
                                  textAlign: 'center'
                                }}>
                                  <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#333' }}>
                                    {card.value}
                                  </div>
                                  <div style={{ fontSize: '0.875rem', color: '#333', marginTop: '0.25rem' }}>
                                    {card.label}
                                  </div>
                                  {card.description && (
                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                                      {card.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'specs-grid':
                        return (
                          <div key={idx} className="specs-grid-container" style={{ 
                            marginBottom: '2rem',
                            display: 'grid',
                            gap: '1.5rem'
                          }}>
                            {section.columns?.map((column, colIdx) => (
                              <div key={colIdx} style={{ 
                                background: '#f8f8f8',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb'
                              }}>
                                <h4 style={{ 
                                  marginBottom: '1.5rem', 
                                  fontSize: '1.2rem', 
                                  fontWeight: 500,
                                  color: '#111',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <span style={{
                                    width: '4px',
                                    height: '20px',
                                    background: '#BF5813',
                                    borderRadius: '2px'
                                  }}></span>
                                  {column.title}
                                </h4>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                  {column.items?.map((item, itemIdx) => {
                                    const [title, ...desc] = item.split(' - ');
                                    const description = desc.join(' - ');
                                    return (
                                      <div key={itemIdx} style={{ 
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: 'white',
                                        borderRadius: '8px',
                                        transition: 'transform 0.2s ease',
                                        cursor: 'default'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                      }}
                                      >
                                        <div style={{
                                          minWidth: '8px',
                                          minHeight: '8px',
                                          width: '8px',
                                          height: '8px',
                                          background: '#BF5813',
                                          borderRadius: '50%',
                                          marginTop: '6px'
                                        }}></div>
                                        <div>
                                          <span style={{ 
                                            fontWeight: 500, 
                                            color: '#111',
                                            display: 'block',
                                            marginBottom: description ? '0.25rem' : '0'
                                          }}>
                                            {title}
                                          </span>
                                          {description && (
                                            <span style={{ 
                                              color: '#555',
                                              fontSize: '0.9rem',
                                              lineHeight: '1.4'
                                            }}>
                                              {description}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      
                      case 'specs':
                        return (
                          <div key={idx} style={{ 
                            marginBottom: '2rem',
                            background: '#f8f8f8',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb'
                          }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <span style={{
                                width: '4px',
                                height: '20px',
                                background: '#BF5813',
                                borderRadius: '2px'
                              }}></span>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              {section.items?.map((item, itemIdx) => {
                                const [title, ...desc] = item.split(' - ');
                                const description = desc.join(' - ');
                                return (
                                  <div key={itemIdx} style={{ 
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'white',
                                    borderRadius: '8px',
                                    transition: 'transform 0.2s ease',
                                    cursor: 'default'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                  }}
                                  >
                                    <div style={{
                                      minWidth: '8px',
                                      minHeight: '8px',
                                      width: '8px',
                                      height: '8px',
                                      background: '#BF5813',
                                      borderRadius: '50%',
                                      marginTop: '6px'
                                    }}></div>
                                    <div>
                                      <span style={{ 
                                        fontWeight: 500, 
                                        color: '#111',
                                        display: 'block',
                                        marginBottom: description ? '0.25rem' : '0'
                                      }}>
                                        {title}
                                      </span>
                                      {description && (
                                        <span style={{ 
                                          color: '#555',
                                          fontSize: '0.9rem',
                                          lineHeight: '1.4'
                                        }}>
                                          {description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      
                      case 'comparison':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, #fff5f0 0%, #f8f8f8 100%)',
                            padding: '2rem',
                            borderRadius: '12px',
                            borderLeft: '4px solid #BF5813',
                            marginBottom: '2rem',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '1.5rem',
                              right: '1.5rem',
                              width: '40px',
                              height: '40px',
                              background: '#BF5813',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.1
                            }}>
                              <span style={{ fontSize: '24px', color: 'white' }}>✓</span>
                            </div>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500, color: '#111' }}>
                              {section.title}
                            </h4>
                            <p style={{ lineHeight: '1.8', color: '#333' }}>{section.text}</p>
                          </div>
                        );
                      
                      case 'diagram':
                        return (
                          <div key={idx} style={{ 
                            marginBottom: '2rem',
                            background: '#f8f8f8',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb'
                          }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <span style={{
                                width: '4px',
                                height: '20px',
                                background: '#BF5813',
                                borderRadius: '2px'
                              }}></span>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              {section.points?.map((point, pointIdx) => (
                                <div key={pointIdx} style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.75rem',
                                  padding: '0.75rem',
                                  background: 'white',
                                  borderRadius: '8px'
                                }}>
                                  <div style={{
                                    minWidth: '24px',
                                    minHeight: '24px',
                                    width: '24px',
                                    height: '24px',
                                    background: '#BF5813',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    flexShrink: 0
                                  }}>
                                    {pointIdx + 1}
                                  </div>
                                  <span style={{ color: '#333', lineHeight: '1.6' }}>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'feature-cards':
                        return (
                          <div key={idx} style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            {section.items?.map((item, itemIdx) => (
                              <div key={itemIdx} style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                              >
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    onClick={() => setFullscreenImage(item.image)}
                                    style={{
                                      width: '100%',
                                      height: '200px',
                                      objectFit: 'cover',
                                      cursor: 'zoom-in'
                                    }}
                                  />
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                  <h5 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    marginBottom: '0.75rem',
                                    color: '#111',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                  }}>
                                    {item.icon ? (
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'linear-gradient(135deg, #BF5813 0%, #D96C2C 100%)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}>
                                        {item.icon === 'sun' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"></circle>
                                            <line x1="12" y1="1" x2="12" y2="3"></line>
                                            <line x1="12" y1="21" x2="12" y2="23"></line>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                            <line x1="1" y1="12" x2="3" y2="12"></line>
                                            <line x1="21" y1="12" x2="23" y2="12"></line>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                          </svg>
                                        )}
                                        {item.icon === 'lightning' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                          </svg>
                                        )}
                                        {item.icon === 'shield' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                          </svg>
                                        )}
                                        {item.icon === 'clock' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                          </svg>
                                        )}
                                        {item.icon === 'smartphone' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                            <line x1="12" y1="18" x2="12" y2="18"></line>
                                          </svg>
                                        )}
                                        {item.icon === 'calendar' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                          </svg>
                                        )}
                                        {item.icon === 'chart' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                          </svg>
                                        )}
                                        {item.icon === 'bell' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                          </svg>
                                        )}
                                        {item.icon === 'thermometer' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                                          </svg>
                                        )}
                                        {item.icon === 'users' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                          </svg>
                                        )}
                                      </div>
                                    ) : (
                                      <div style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#BF5813',
                                        borderRadius: '50%'
                                      }}></div>
                                    )}
                                    {item.title}
                                  </h5>
                                  <p style={{
                                    lineHeight: '1.6',
                                    color: '#333',
                                    fontSize: '0.95rem'
                                  }}>
                                    {item.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      
                      case 'features':
                        return (
                          <div key={idx} style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            {section.items?.map((feature, featIdx) => (
                              <div key={featIdx}>
                                <h5 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                  {feature.title}
                                </h5>
                                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                                  {feature.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        );
                      
                      case 'solution':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                              {section.features?.map((feat, featIdx) => (
                                <li key={featIdx} style={{ marginBottom: '0.5rem', color: '#666' }}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      
                      case 'technical':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                              {section.specs?.map((spec, specIdx) => (
                                <li key={specIdx} style={{ marginBottom: '0.5rem', color: '#666' }}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      
                      case 'compatibility':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                              {section.items?.map((item, itemIdx) => (
                                <li key={itemIdx} style={{ marginBottom: '0.5rem', color: '#666' }}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      
                      case 'philosophy':
                        return (
                          <div key={idx} style={{
                            background: '#f8f8f8',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '2rem'
                          }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <p style={{ lineHeight: '1.8', color: '#333' }}>{section.text}</p>
                          </div>
                        );
                      
                      case 'engineering-details':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '2rem', fontSize: '1.4rem', fontWeight: 500, color: '#333' }}>
                              {section.title}
                            </h4>
                            
                            {/* Grid layout for desktop (3x2), tablet (side-by-side), mobile (stacked) */}
                            <div className="engineering-details-grid" style={{
                              display: 'grid',
                              gap: '2rem'
                            }}>
                              {section.content?.map((item, contentIdx) => (
                                <div key={contentIdx} className="engineering-detail-card" style={{
                                  background: '#fff',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  {/* Image */}
                                  {item.image && (
                                    <img 
                                      src={item.image}
                                      alt={item.subtitle}
                                      onClick={() => setFullscreenImage(item.image || null)}
                                      className="zoomable-image"
                                      style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        cursor: 'zoom-in'
                                      }}
                                    />
                                  )}
                                  
                                  {/* Text content */}
                                  <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{
                                      fontSize: '1.1rem',
                                      fontWeight: 500,
                                      marginBottom: '0.75rem',
                                      color: '#333'
                                    }}>
                                      {item.subtitle}
                                    </h5>
                                    <p style={{
                                      lineHeight: '1.6',
                                      color: '#333',
                                      fontSize: '0.95rem'
                                    }}>
                                      {item.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'problem-solution':
                        return (
                          <div key={idx} style={{
                            display: 'grid',
                            gap: '1.5rem',
                            marginBottom: '2rem',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                          }}>
                            {/* Problem Section */}
                            <div style={{
                              background: '#1a1a1a',
                              color: 'white',
                              padding: '2rem',
                              borderRadius: '12px'
                            }}>
                              <h4 style={{
                                fontSize: '1.1rem',
                                marginBottom: '1.5rem',
                                color: 'white'
                              }}>
                                {typeof section.problem === 'object' && !Array.isArray(section.problem) ? section.problem.title : 'Problems'}
                              </h4>
                              <div style={{ display: 'grid', gap: '1rem' }}>
                                {typeof section.problem === 'object' && !Array.isArray(section.problem) && section.problem.items?.map((item: any, itemIdx: number) => (
                                  <div key={itemIdx} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <span style={{ color: '#EF4444', fontSize: '1.2rem' }}>✗</span>
                                    <div>
                                      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                                      <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.5' }}>{item.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Solution Section */}
                            <div style={{
                              background: '#f9fafb',
                              padding: '2rem',
                              borderRadius: '12px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <h4 style={{
                                color: '#111',
                                marginBottom: '1.5rem',
                                fontSize: '1.1rem'
                              }}>
                                {typeof section.solution === 'object' && !Array.isArray(section.solution) ? section.solution.title : 'Solution'}
                              </h4>
                              <div style={{ display: 'grid', gap: '1rem' }}>
                                {typeof section.solution === 'object' && !Array.isArray(section.solution) && section.solution.items?.map((item: any, itemIdx: number) => (
                                  <div key={itemIdx} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <span style={{ color: '#BF5813', fontSize: '1.2rem' }}>✓</span>
                                    <div>
                                      <strong style={{ color: '#111', display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>{item.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      
                      case 'app-download':
                        return (
                          <div key={idx} style={{
                            textAlign: 'center',
                            padding: '2rem 0',
                            marginBottom: '2rem',
                            borderTop: '1px solid #e5e7eb',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{section.subtitle}</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <a href={section.appStore} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#000',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                transition: 'transform 0.2s ease',
                                border: '1px solid #000'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                                </svg>
                                <span>App Store</span>
                              </a>
                              <a href={section.googlePlay} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#000',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                transition: 'transform 0.2s ease',
                                border: '1px solid #000'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M3.609 1.814L13.792 12l-10.183 10.186a1.5 1.5 0 0 1-.396-1.008V2.822a1.5 1.5 0 0 1 .396-1.008zM14.75 12.958l2.849 2.849-12.047 6.896a1.5 1.5 0 0 1-1.218.024l10.416-10.727zm0-1.916L4.334 1.273a1.5 1.5 0 0 1 1.218.024l12.047 6.896-2.849 2.849zm.208.958l3.462 3.462a1.5 1.5 0 0 1 0 2.122l-3.462 3.462L22.392 12l-7.434-7.434v7.434z" fill="#01D277"/>
                                  <path d="M3.609 1.814L13.792 12l-10.183 10.186a1.5 1.5 0 0 1-.396-1.008V2.822a1.5 1.5 0 0 1 .396-1.008z" fill="#00F076"/>
                                  <path d="M14.75 12.958l2.849 2.849-12.047 6.896a1.5 1.5 0 0 1-1.218.024l10.416-10.727z" fill="#00E0FF"/>
                                  <path d="M14.75 11.042L4.334 1.273a1.5 1.5 0 0 1 1.218.024l12.047 6.896-2.849 2.849z" fill="#FFEF00"/>
                                  <path d="M14.958 12l3.462 3.462a1.5 1.5 0 0 1 0 2.122l-3.462 3.462L22.392 12l-7.434-7.434v7.434z" fill="#FF3A44"/>
                                </svg>
                                <span>Google Play</span>
                              </a>
                            </div>
                          </div>
                        );
                      
                      case 'how-it-works':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                              {section.steps?.map((step, stepIdx) => (
                                <div key={stepIdx} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '1rem'
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: '#BF5813',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontWeight: 500
                                  }}>
                                    {stepIdx + 1}
                                  </div>
                                  <p style={{ color: '#333', lineHeight: '1.6' }}>
                                    {typeof step === 'string' ? step : `${step.title}: ${step.description}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'testimonials':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                              {section.items?.map((item, itemIdx) => (
                                <blockquote key={itemIdx} style={{
                                  borderLeft: '3px solid #BF5813',
                                  paddingLeft: '1.5rem',
                                  margin: 0
                                }}>
                                  <p style={{
                                    fontStyle: 'italic',
                                    color: '#333',
                                    marginBottom: '0.5rem',
                                    lineHeight: '1.6'
                                  }}>
                                    "{item.quote}"
                                  </p>
                                  <cite style={{
                                    fontSize: '0.875rem',
                                    color: '#666',
                                    fontStyle: 'normal'
                                  }}>
                                    — {item.author}
                                  </cite>
                                </blockquote>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'fischer-legacy':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                              {section.text}
                            </p>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '1rem'
                            }}>
                              {section.items?.map((item, itemIdx) => (
                                <div key={itemIdx} style={{
                                  background: '#f8f8f8',
                                  padding: '1rem',
                                  borderRadius: '8px',
                                  textAlign: 'center'
                                }}>
                                  <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 500,
                                    color: '#BF5813',
                                    marginBottom: '0.25rem'
                                  }}>
                                    {item.value}
                                  </div>
                                  <div style={{
                                    fontSize: '0.875rem',
                                    color: '#666'
                                  }}>
                                    {item.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'model-features':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                              {section.items?.map((item, itemIdx) => (
                                <li key={itemIdx} style={{ marginBottom: '0.5rem', color: '#333' }}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      
                      case 'quote':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, #f8f8f8 0%, #fff 100%)',
                            padding: '2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            borderLeft: '4px solid #BF5813'
                          }}>
                            <blockquote style={{ margin: 0 }}>
                              <p style={{
                                fontStyle: 'italic',
                                fontSize: '1.1rem',
                                color: '#333',
                                marginBottom: '1rem',
                                lineHeight: '1.7'
                              }}>
                                "{section.text}"
                              </p>
                              <cite style={{
                                fontSize: '0.95rem',
                                color: '#666',
                                fontStyle: 'normal',
                                fontWeight: 500
                              }}>
                                — {section.author}
                              </cite>
                            </blockquote>
                          </div>
                        );
                      
                      case 'installation-features':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{
                              display: 'grid',
                              gap: '1.5rem'
                            }}>
                              {section.items?.map((item, itemIdx) => (
                                <div key={itemIdx} style={{
                                  background: '#f9fafb',
                                  padding: '1.5rem',
                                  borderRadius: '12px',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <h5 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: 500,
                                    color: '#111',
                                    marginBottom: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                  }}>
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      background: '#BF5813',
                                      borderRadius: '50%'
                                    }}></div>
                                    {item.title}
                                  </h5>
                                  <p style={{
                                    color: '#333',
                                    lineHeight: '1.6',
                                    fontSize: '0.95rem'
                                  }}>
                                    {item.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'specs-list':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{
                              background: '#f9fafb',
                              padding: '1.5rem',
                              borderRadius: '12px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <ul style={{ 
                                paddingLeft: '1.5rem', 
                                lineHeight: '1.8',
                                margin: 0
                              }}>
                                {section.items?.map((item, itemIdx) => (
                                  <li key={itemIdx} style={{ 
                                    marginBottom: '0.5rem', 
                                    color: '#333' 
                                  }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      
                      case 'commercial-specs':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ 
                              marginBottom: '1.5rem', 
                              fontSize: '1.2rem', 
                              fontWeight: 500,
                              color: '#111'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                              gap: '1rem'
                            }}>
                              {section.items?.map((item, itemIdx) => (
                                <div key={itemIdx} style={{
                                  background: '#f9fafb',
                                  padding: '1.25rem',
                                  borderRadius: '12px',
                                  borderLeft: '3px solid #BF5813'
                                }}>
                                  <h5 style={{
                                    color: '#111',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                  }}>
                                    {item.spec}
                                  </h5>
                                  <p style={{
                                    color: '#666',
                                    fontSize: '0.875rem',
                                    margin: 0,
                                    lineHeight: '1.5'
                                  }}>
                                    {item.detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'image-showcase':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            {section.title && (
                              <h4 style={{ 
                                marginBottom: '1.5rem', 
                                fontSize: '1.2rem', 
                                fontWeight: 500,
                                color: '#111'
                              }}>
                                {section.title}
                              </h4>
                            )}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                              gap: '1.5rem'
                            }}>
                              {section.images?.map((img, imgIdx) => (
                                <div key={imgIdx} style={{
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  background: 'white',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <img
                                    src={typeof img === 'string' ? img : img.src}
                                    alt={typeof img === 'string' ? '' : img.caption}
                                    onClick={() => setFullscreenImage(typeof img === 'string' ? img : img.src)}
                                    style={{
                                      width: '100%',
                                      height: '250px',
                                      objectFit: 'cover',
                                      cursor: 'zoom-in'
                                    }}
                                  />
                                  {typeof img !== 'string' && img.caption && (
                                    <p style={{
                                      padding: '1rem',
                                      fontSize: '0.9rem',
                                      color: '#666',
                                      margin: 0,
                                      borderTop: '1px solid #f0f0f0'
                                    }}>
                                      {img.caption}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'single-image':
                        return (
                          <div key={idx} style={{ 
                            marginBottom: '2rem',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                          }}>
                            <img
                              src={section.image}
                              alt={section.caption || ''}
                              onClick={() => setFullscreenImage(section.image || null)}
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                cursor: 'zoom-in'
                              }}
                            />
                            {section.caption && (
                              <p style={{
                                padding: '1rem 1.5rem',
                                fontSize: '0.95rem',
                                color: '#666',
                                margin: 0,
                                background: '#f9fafb',
                                borderTop: '1px solid #e5e7eb',
                                fontStyle: 'italic'
                              }}>
                                {section.caption}
                              </p>
                            )}
                          </div>
                        );
                      
                      default:
                        return null;
                    }
                  })}
                  
                  {/* Problem list for comparison sections */}
                  {content.sections && content.sections.some(s => s.problems) && 
                    content.sections.filter(s => s.problems).map((section, idx) => (
                      <div key={`problems-${idx}`} style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                          {section.title}
                        </h4>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                          {section.problems?.map((problem, probIdx) => (
                            <li key={probIdx} style={{ marginBottom: '0.5rem', color: '#666' }}>{problem}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  }
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out'
          }}
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          />
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
      
      <style jsx global>{`
        @media (max-width: 1024px) {
          .desktop-grid {
            display: none !important;
          }
          .mobile-tablet-grid {
            display: block !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-tablet-grid {
            display: none !important;
          }
        }
        
        /* Responsive grid for callouts */
        @media (max-width: 768px) {
          .modal-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Engineering details grid - Desktop & Tablet (2 columns) */
        @media (min-width: 769px) {
          .engineering-details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Engineering details grid - Mobile (1 column) */
        @media (max-width: 768px) {
          .engineering-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Specs grid - Desktop (2 columns) */
        @media (min-width: 769px) {
          .specs-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Specs grid - Mobile/Tablet (1 column) */
        @media (max-width: 768px) {
          .specs-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}