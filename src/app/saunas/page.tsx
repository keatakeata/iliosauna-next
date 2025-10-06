'use client';

// Force dynamic rendering to prevent Vercel from serving stale cached builds
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
// React 19 compatible motion import
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';
import { modalContent } from './modalContent';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import StructuredData from '@/components/StructuredData';
import Head from 'next/head';

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
      rootMargin: '100px'
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
  const [isMobile, setIsMobile] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const scrollPositionRef = useRef(0);
  const { addItem } = useCart();

  // Hero slideshow images - exact from live website
  const heroSlides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e7797e0fe546e46493d4b.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f40ac13c4545.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg'
  ];

  // Premium features data with exact images from live website
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
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689ecad6c6ba4e59e89d6e5b.jpeg'
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

  // Trigger page load animations and detect mobile and Apple devices
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Detect Apple devices (iOS, iPadOS, macOS)
    const detectAppleDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isMacOS = /macintosh|mac os x/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

      // Consider it an Apple device if it's iOS, macOS, or Safari browser
      setIsAppleDevice(isIOS || isMacOS || isSafari);
    };

    checkMobile();
    detectAppleDevice();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Handle scroll locking when modal is open
  useEffect(() => {
    const isModalOpen = activeModal || fullscreenImage;
    
    if (isModalOpen) {
      if (document.body.style.position !== 'fixed') {
        scrollPositionRef.current = window.scrollY;
        
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (document.body.style.position === 'fixed') {
        const savedScrollPosition = scrollPositionRef.current;
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        
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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Saunas', url: '/saunas' }
  ];

  const faqItems = [
    {
      question: "What types of saunas do you offer?",
      answer: "We offer premium cedar barrel saunas and cabin saunas, all crafted with BC cedar and featuring high-quality construction including 2×4 frames, Rockwool R-14 insulation, and dual barriers."
    },
    {
      question: "What areas do you serve?",
      answer: "We serve Vancouver Island, Metro Vancouver, Fraser Valley, and Sea to Sky & Beyond regions. Our service areas include Victoria, Vancouver, Surrey, Burnaby, Nanaimo, Whistler, Squamish, and many more cities across British Columbia. Contact us from Sidney for professional delivery and installation."
    },
    {
      question: "What heating options are available?",
      answer: "Our saunas come with premium electric and wood-burning heater options to suit your preferences and setup requirements."
    },
    {
      question: "What's included with the sauna?",
      answer: "Each sauna includes tempered glass doors and windows, cedar frame construction, premium hardware, and professional installation services."
    }
  ];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <StructuredData
        pageType="product"
        pageTitle="Premium Cedar Saunas - Barrel & Cabin Saunas | Ilio Sauna"
        pageDescription="Discover our collection of premium cedar saunas including barrel and cabin styles. Crafted with BC cedar, featuring R-14 insulation and premium components."
        breadcrumbs={breadcrumbs}
        faqItems={faqItems}
      />
      <ScrollAnimations />
      <Navbar animated={true} />
      
      {/* Hero Slideshow Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        overflowX: 'hidden'
      }}>
        <div 
          className="hero-zoom-wrapper"
          style={{
            position: 'absolute',
            inset: '-10%',
            width: '120%',
            height: '120%',
          }}
        >
          {heroSlides.map((slide, index) => (
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
                alt={
                  index === 0 ? "Premium cedar barrel sauna with R-14 insulation and dual barriers" :
                  index === 1 ? "Luxury cabin sauna featuring tempered glass doors and BC cedar frame" :
                  index === 2 ? "Professional sauna installation with electric and wood-burning heater options" :
                  index === 3 ? "Handcrafted outdoor sauna with premium hardware and weather-resistant construction" :
                  "Contemporary cedar sauna showcasing Scandinavian craftsmanship and design excellence"
                }
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: index === 0 && isMobile ? '65% center' : 'center',
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

      {/* Make It Stand Out Section */}
      <section className="ilio-section" style={{ background: 'white', padding: '100px 0' }}>
        <div className="ilio-container">
          <div className="text-center mb-5">
            <h2 className="section-header h2-animate reveal-on-scroll" style={{ 
              marginBottom: '2rem',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 100,
              letterSpacing: '0.05em'
            }}>
              Live well with ilio
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
                Ilio saunas are beautifully designed and built for longevity. Each unit reflects a union between architectural design and robust structural elements, boasting insulated walls, roof panels, and thermally insulated windows, complete with a covered porch with a cold rinse shower.
              </p>
            </div>
            
            {/* Video Section */}
            <div className="reveal-on-scroll reveal-delay-3" style={{ 
              maxWidth: '900px', 
              margin: '3rem auto',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
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
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              >
                <source 
                  src="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0ebafd8a0cd83ab30.mp4" 
                  type="video/mp4" 
                />
              </video>
            </div>
            
            <div className="text-center">
              <p className="reveal-on-scroll reveal-delay-4" style={{ 
                maxWidth: '800px', 
                margin: '1.5rem auto 3rem',
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                Ilio interiors are created using the finest clear western red cedar interior panelling, known for its anti-inflammatory, astringent and antimicrobial properties, durability, and pleasant aroma. The meticulously designed sauna is built for comfort and relaxation, with two deep-seat stadium benches spanning over six feet, a modern Wi-Fi-enabled heater for remote start, and a full-length glass door that provides a view corridor and a feeling of spaciousness. Bring beauty and wellness to your backyard with Ilio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sauna Specs Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: 'url("https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac4d0764b219.jpeg")',
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
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>ALL-INCLUSIVE PRICE</div>
              <div style={{ fontSize: '2rem', fontWeight: 200 }}>$20,000 CAD</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-3" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>SIZE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>4-6 person capacity</div>
            </div>

            <div className="reveal-on-scroll reveal-delay-3" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>DIMENSIONS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>
                <div>Exterior: 6'-3" w × 9' d × 8'-5" h</div>
                <div style={{ marginTop: '0.25rem' }}>Interior: 5'-5" × 6'-3"</div>
              </div>
            </div>

            <div className="reveal-on-scroll reveal-delay-4" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>HEATER</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>9kW HUUM DROP Finnish heater</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-5" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>WARRANTY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>2-year comprehensive coverage</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-6" style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>LEAD TIME</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>2-4 weeks</div>
            </div>
            
            {/* Add to Cart and Buy Now buttons */}
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
                        image: heroSlides[0],
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
                        image: heroSlides[0],
                        description: '4-6 person capacity, HUUM DROP heater'
                      });
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

      {/* Premium Features Section */}
      <section className="ilio-section" style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="ilio-container premium-features-header">
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
        </div>

        <div className="premium-features-container">

          {/* Desktop Grid View */}
          <div className="desktop-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto',
            willChange: 'transform',
            transform: 'translateZ(0)'
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
                <LazyImage 
                  src={feature.image}
                  alt={`${feature.title} - Premium sauna construction detail showing quality materials and craftsmanship`}
                />
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
          
          {/* Mobile/Tablet Grid View with Framer Motion */}
          <div className="mobile-tablet-grid" style={{ display: 'none' }}>
            {premiumFeatures.map((feature, index) => (
              <motion.div 
                key={`mobile-${feature.id}`}
                onClick={() => setActiveModal(feature.id)}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 25,
                    delay: Math.min(index * 0.05, 0.2),
                    duration: 0.6
                  }
                }}
                viewport={{ once: true, margin: "-100px" }}
                style={{
                  position: 'relative',
                  height: '400px',
                  width: '100vw',
                  marginLeft: 0,
                  marginRight: 0,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: '#f0f0f0'
                }} />
                <img 
                  src={feature.image}
                  alt={`${feature.title} - Premium sauna construction detail showing quality materials and craftsmanship`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                }} />
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* After You Order Your Ilio Sauna Process Section - CRO & GEO Optimized */}
      <section
        style={{ padding: '100px 0', background: 'white', position: 'relative' }}
        itemScope
        itemType="https://schema.org/Service"
        aria-labelledby="sauna-delivery-process"
      >
        {/* Luxury background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(191, 88, 19, 0.02) 0%, rgba(191, 88, 19, 0.01) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}></div>

        <div className="ilio-container" style={{ position: 'relative', zIndex: 1 }}>
          <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              id="sauna-delivery-process"
              className="reveal-on-scroll"
              style={{
                color: '#333',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 100,
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}
              itemProp="name"
            >
              Your White-Glove Sauna Experience
            </h2>
            <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
              width: '75%',
              height: '1px',
              background: '#D1D5DB',
              margin: '0 auto 2rem'
            }}></div>
            <p
              className="reveal-on-scroll reveal-delay-2"
              style={{
                fontSize: '1.2rem',
                color: '#666',
                fontWeight: 300,
                lineHeight: 1.6,
                maxWidth: '800px',
                margin: '0 auto 1.5rem'
              }}
              itemProp="description"
            >
              Your sauna is already precision-built in transportable sections, designed to move easily through tight gates and pathways. Here's our proven 6-step process:
            </p>

            {/* Trust signals for CRO */}
            <div className="reveal-on-scroll reveal-delay-3" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: 500
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>Same-Day First Steam</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: 500
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>2-Year Warranty</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: 500
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>Licensed Electrician Network</span>
              </div>
            </div>
          </header>

          {/* Process steps with enhanced CRO and GEO optimization */}
          <ol style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            listStyle: 'none',
            padding: 0
          }}
          itemScope
          itemType="https://schema.org/HowTo"
          >
            {[
              {
                number: '1',
                title: 'Instant Order Confirmation',
                description: 'You\'ll receive a comprehensive order summary within minutes, including your estimated 2-4 week delivery window and dedicated project manager contact.',
                timeline: '< 5 minutes'
              },
              {
                number: '2',
                title: 'White-Glove Delivery Coordination',
                description: 'Our logistics team personally coordinates your delivery date and confirms access details, ensuring smooth transport through any gate or pathway.',
                timeline: '1-2 weeks before'
              },
              {
                number: '3',
                title: 'Licensed Electrical Setup',
                description: 'Connect with our network of certified electricians or use our detailed wiring guide. Full technical support included at no extra cost.',
                timeline: 'Before delivery'
              },
              {
                number: '4',
                title: 'Professional On-Site Assembly',
                description: 'Our master craftsmen arrive with precision tools, assembling your sauna panels into a weather-sealed sanctuary in hours, not days.',
                timeline: '4-6 hours'
              },
              {
                number: '5',
                title: 'Complete Walkthrough & First Steam',
                description: 'Personal training on all controls, optimal operation, and maintenance. Your first therapeutic session happens the same day.',
                timeline: 'Installation day'
              },
              {
                number: '6',
                title: '2-Year Comprehensive Warranty',
                description: 'Industry-leading coverage with rapid-response support. Local service network across BC ensures peace of mind for years.',
                timeline: 'Ongoing'
              }
            ].map((step, index) => (
              <motion.li
                key={index}
                className={isAppleDevice ? "" : "reveal-on-scroll"}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '2rem 2rem 2rem 4rem',
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                  marginBottom: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  WebkitPerspective: 1000,
                  perspective: 1000,
                  transform: 'translate3d(0, 0, 0)',
                  WebkitTransform: 'translate3d(0, 0, 0)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 25,
                    delay: index * 0.1,
                    duration: 0.6
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  boxShadow: '0 4px 16px rgba(191, 88, 19, 0.1)',
                  transition: { duration: 0.2 }
                }}
                itemProp="step"
                itemScope
                itemType="https://schema.org/HowToStep"
              >
                {/* Step number badge - positioned within card bounds */}
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  background: '#bf5813',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transform: 'translateX(-50%)'
                }}>{step.number}</div>


                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  color: '#333',
                  marginBottom: '1rem',
                  marginTop: '0.5rem'
                }}
                itemProp="name"
                >{step.title}</h3>

                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: 1.6,
                  margin: 0
                }}
                itemProp="text"
                >{step.description}</p>
              </motion.li>
            ))}
          </ol>

          {/* CRO-optimized CTA section */}
          <div className="reveal-on-scroll" style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '3rem',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            position: 'relative'
          }}>
            {/* Luxury accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #bf5813, #d4751e)',
              borderRadius: '0 0 8px 8px'
            }}></div>

            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 400,
              color: '#1a1a1a',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}>
              Ready to Experience the Ilio Difference?
            </h3>

            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Start your wellness journey with a sauna crafted for BC's unique climate and lifestyle.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <motion.a
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  background: '#bf5813',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
                whileHover={{
                  background: '#a04d11'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Started</span>
              </motion.a>

              <motion.a
                href="/our-story"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  background: 'transparent',
                  color: '#bf5813',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: '1px solid #bf5813',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{
                  background: '#bf5813',
                  color: 'white'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Our Story</span>
              </motion.a>
            </div>

            {/* Trust indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              fontSize: '0.85rem',
              color: '#888',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>5-Star Customer Service</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>BC-Wide Delivery</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#bf5813',
                  borderRadius: '50%'
                }}></div>
                <span>Professional Installation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 30-Day Promise & Common Questions Section */}
      <section style={{ padding: '100px 0', background: '#f8f8f8' }}>
        <div className="ilio-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Common Questions */}
            <div className="reveal-on-scroll" style={{
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
                  Most municipalities don't require permits for structures under 108 sq ft. We provide all documentation needed for your local bylaws.
                </p>
              </div>
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E5E7EB' }}>
                <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>Can my electrician handle the wiring?</h4>
                <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Yes! Any licensed electrician can install the 40A/240V connection. We include detailed wiring diagrams and offer free phone support.
                </p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>How much maintenance is required?</h4>
                <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Almost none. Wipe benches monthly, oil exterior annually. The HUUM heater self-cleans with each use. Total: 20 minutes/year.
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
      {activeModal && modalContent[activeModal as keyof typeof modalContent] && (
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ overflow: 'auto', flex: 1, position: 'relative' }}>
              <motion.button
                onClick={() => setActiveModal(null)}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: 90 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
                style={{
                  position: 'sticky',
                  top: '1.5rem',
                  float: 'right',
                  marginRight: '1.5rem',
                  marginTop: '1.5rem',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  zIndex: 10
                }}
              >
                <span style={{ fontSize: '18px', color: '#6b7280' }}>✕</span>
              </motion.button>
            
            {(() => {
              const content = modalContent[activeModal as keyof typeof modalContent];
              return (
                <div style={{ padding: '3rem' }}>
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
                  
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem', color: '#111' }}>
                      {content.title}
                    </h2>
                    <p style={{ color: '#333', marginBottom: '0', fontSize: '1.1rem' }}>
                      {content.subtitle}
                    </p>
                  </div>
                  
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
                  
                  {content.gallery && (
                    <>
                      {/* Desktop/Tablet Gallery */}
                      <div className="desktop-tablet-gallery" style={{
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
                      
                      {/* Mobile Gallery - First image only */}
                      <div className="mobile-gallery-first" style={{ display: 'none', marginBottom: '2rem' }}>
                        {content.gallery && content.gallery[0] && (
                          <img 
                            src={content.gallery[0]}
                            alt={`${content.title} 1`}
                            onClick={() => setFullscreenImage(content.gallery[0])}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              cursor: 'zoom-in'
                            }}
                          />
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Render all modal sections */}
                  {content.sections && content.sections.map((section, idx) => {
                    // Insert mobile gallery images between sections (skip first image, start from index 1)
                    const mobileGalleryImage = content.gallery && content.gallery.length > 1 && content.gallery[idx + 1] && (
                      <div key={`mobile-img-${idx}`} className="mobile-gallery-inline" style={{ display: 'none', marginBottom: '2rem' }}>
                        <img 
                          src={content.gallery[idx + 1]}
                          alt={`${content.title} ${idx + 2}`}
                          onClick={() => setFullscreenImage(content.gallery[idx + 1])}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            cursor: 'zoom-in'
                          }}
                        />
                      </div>
                    );
                    
                    return (
                      <div key={idx}>
                        {mobileGalleryImage}
                        {(() => {
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
                                border: '1px solid #e5e7eb'
                              }}>
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
                                  {item.list?.map((li: string, liIdx: number) => (
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
                                          fontWeight: 500, 
                                          display: 'block'
                                        }}>{li.split(' - ')[0]}</span>
                                        {li.includes(' - ') && (
                                          <span style={{ 
                                            color: '#555', 
                                            fontSize: '0.9rem', 
                                            lineHeight: 1.4, 
                                            display: 'block', 
                                            marginTop: '0.25rem'
                                          }}>{li.split(' - ')[1]}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      
                      case 'callout':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, rgb(255, 245, 240) 0%, rgb(248, 248, 248) 100%)',
                            padding: '2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '1px solid rgb(229, 231, 235)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '4px',
                              height: '100%',
                              background: 'rgb(191, 88, 19)'
                            }}></div>
                            <div className="modal-grid-responsive" style={{
                              display: 'grid',
                              gridTemplateColumns: 'minmax(250px, 300px) 1fr',
                              gap: '1.5rem',
                              alignItems: 'flex-start'
                            }}>
                              {section.image && (
                                <img 
                                  src={section.image}
                                  alt={section.title}
                                  onClick={() => setFullscreenImage(section.image)}
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: 'zoom-in',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px'
                                  }}
                                />
                              )}
                              <div>
                                <h4 style={{
                                  marginBottom: '1rem',
                                  fontSize: '1.2rem',
                                  fontWeight: 500,
                                  color: 'rgb(17, 17, 17)',
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
                                <p style={{ lineHeight: '1.8', color: 'rgb(51, 51, 51)' }}>{section.text}</p>
                              </div>
                            </div>
                          </div>
                        );
                      
                      case 'detail':
                        return (
                          <div key={idx} style={{
                            marginBottom: '2rem'
                          }}>
                            {section.image && (
                              <img 
                                src={section.image}
                                alt={section.title}
                                onClick={() => setFullscreenImage(section.image)}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  borderRadius: '8px',
                                  marginBottom: '2rem',
                                  cursor: 'zoom-in'
                                }}
                              />
                            )}
                            <h4 style={{
                              marginBottom: '0.5rem',
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
                                background: 'rgb(191, 88, 19)',
                                borderRadius: '2px'
                              }}></span>
                              {section.title}
                            </h4>
                            {section.subtitle && (
                              <p style={{
                                color: '#666',
                                marginBottom: '1.5rem',
                                fontSize: '1.1rem'
                              }}>
                                {section.subtitle}
                              </p>
                            )}
                            {section.content && (
                              <div style={{
                                color: '#666',
                                marginBottom: '1.5rem',
                                lineHeight: '1.6'
                              }}>
                                {section.content.includes('\n') ? (
                                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {section.content.split('\n').map((item: string, itemIdx: number) => (
                                      <div key={itemIdx} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem'
                                      }}>
                                        <div style={{
                                          minWidth: '6px',
                                          minHeight: '6px',
                                          width: '6px',
                                          height: '6px',
                                          background: 'rgb(191, 88, 19)',
                                          borderRadius: '50%',
                                          marginTop: '7px',
                                          flexShrink: 0
                                        }}></div>
                                        <span style={{
                                          color: '#333',
                                          lineHeight: '1.8'
                                        }}>
                                          {item.replace('• ', '')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{section.content}</p>
                                )}
                              </div>
                            )}
                            {section.list && (
                              <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {section.list.map((item: string, itemIdx: number) => (
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
                                      background: 'rgb(191, 88, 19)',
                                      borderRadius: '50%',
                                      marginTop: '6px'
                                    }}></div>
                                    <div>
                                      <span style={{ 
                                        color: '#111', 
                                        fontWeight: 500, 
                                        display: 'block'
                                      }}>{item.split(' - ')[0]}</span>
                                      {item.includes(' - ') && (
                                        <span style={{ 
                                          color: '#555', 
                                          fontSize: '0.9rem', 
                                          lineHeight: 1.4, 
                                          display: 'block', 
                                          marginTop: '0.25rem'
                                        }}>{item.split(' - ')[1]}</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      
                      case 'engineering-details':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{
                              marginBottom: '2rem',
                              fontSize: '1.4rem',
                              fontWeight: 500,
                              color: '#333'
                            }}>
                              {section.title}
                            </h4>
                            <div className="engineering-details-grid" style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: '2rem'
                            }}>
                              {section.content?.map((detail, detailIdx) => (
                                <div key={detailIdx} style={{
                                  background: '#fff',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <img
                                    src={detail.image}
                                    alt={detail.subtitle}
                                    onClick={() => setFullscreenImage(detail.image)}
                                    style={{
                                      width: '100%',
                                      height: '200px',
                                      objectFit: 'cover',
                                      cursor: 'zoom-in'
                                    }}
                                  />
                                  <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{
                                      fontSize: '1.1rem',
                                      fontWeight: 500,
                                      marginBottom: '0.75rem',
                                      color: '#333'
                                    }}>
                                      {detail.subtitle}
                                    </h5>
                                    <p style={{
                                      lineHeight: '1.6',
                                      color: '#333',
                                      fontSize: '0.95rem'
                                    }}>
                                      {detail.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );

                      case 'diagram':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{
                              marginBottom: '1.5rem',
                              fontSize: '1.4rem',
                              fontWeight: 500,
                              color: '#333'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                              maxWidth: '600px'
                            }}>
                              {section.points?.map((point, pointIdx) => (
                                <div key={pointIdx} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '1rem',
                                  padding: '0.5rem 0'
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #BF5813 0%, #d96c2c 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 2px 4px rgba(191, 88, 19, 0.2)'
                                  }}>
                                    <span style={{
                                      color: 'white',
                                      fontSize: '14px',
                                      fontWeight: 'bold'
                                    }}>
                                      {pointIdx + 1}
                                    </span>
                                  </div>
                                  <p style={{
                                    color: '#333',
                                    lineHeight: '1.6',
                                    fontSize: '1rem',
                                    margin: '0',
                                    flex: 1
                                  }}>
                                    {point}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );

                      case 'image-showcase':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{
                              marginBottom: '2rem',
                              fontSize: '1.4rem',
                              fontWeight: 500,
                              color: '#333'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                              gap: '1.5rem'
                            }}>
                              {section.images?.map((imageObj, imageIdx) => {
                                // Handle both formats: {src, caption} and string
                                const src = typeof imageObj === 'string' ? imageObj : imageObj.src;
                                const caption = typeof imageObj === 'string' ? null : imageObj.caption;
                                const alt = caption || `${section.title} ${imageIdx + 1}`;

                                return (
                                  <div key={imageIdx} style={{
                                    background: '#fff',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <img
                                      src={src}
                                      alt={alt}
                                      onClick={() => setFullscreenImage(src)}
                                      style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        cursor: 'zoom-in'
                                      }}
                                    />
                                    {caption && (
                                      <div style={{ padding: '1rem' }}>
                                        <p style={{
                                          fontSize: '0.9rem',
                                          color: '#666',
                                          textAlign: 'center',
                                          fontStyle: 'italic',
                                          margin: '0'
                                        }}>
                                          {caption}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      
                      case 'specs-grid':
                        return (
                          <div key={idx} style={{
                            marginBottom: '2rem'
                          }}>
                            {section.title && (
                              <h4 style={{
                                marginBottom: '1rem',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                color: '#111'
                              }}>
                                {section.title}
                              </h4>
                            )}
                            {section.specs ? (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                              }}>
                                {section.specs.map((spec, specIdx) => (
                                  <div key={specIdx} style={{
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
                                      {spec.label}
                                    </div>
                                    <div style={{
                                      fontSize: '0.875rem',
                                      color: '#666'
                                    }}>
                                      {spec.value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '2rem'
                              }}>
                                {section.columns?.map((column, colIdx) => (
                                  <div key={colIdx} style={{
                                    background: '#f8f8f8',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <h4 style={{
                                      marginBottom: '1rem',
                                      fontSize: '1.2rem',
                                      fontWeight: 500,
                                      color: '#111'
                                    }}>
                                      {column.title}
                                    </h4>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                      {column.items?.map((item: string, itemIdx: number) => (
                                        <div key={itemIdx} style={{
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
                                            marginTop: '7px'
                                          }}></div>
                                          <div>
                                            <span style={{
                                              color: '#111',
                                              fontWeight: 500,
                                              display: 'block'
                                            }}>{item.split(' - ')[0]}</span>
                                            {item.includes(' - ') && (
                                              <span style={{
                                                color: '#555',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.4,
                                                display: 'block',
                                                marginTop: '0.25rem'
                                              }}>{item.split(' - ')[1]}</span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      
                      case 'feature-cards':
                        return (
                          <div key={idx} className="feature-cards" style={{
                            display: 'grid',
                            gridTemplateColumns: section.items?.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                          }}>
                            {section.items?.map((item, itemIdx) => (
                              <div key={itemIdx} style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid rgb(229, 231, 235)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                              }}>
                                {item.image ? (
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
                                ) : null}
                                <div style={{ padding: '1.5rem' }}>
                                  <h5 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    marginBottom: '0.75rem',
                                    color: 'rgb(17, 17, 17)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                  }}>
                                    {item.icon ? (
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'linear-gradient(135deg, #BF5813 0%, #d96c2c 100%)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}>
                                        {item.icon === 'sun' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"/>
                                            <line x1="12" y1="1" x2="12" y2="3"/>
                                            <line x1="12" y1="21" x2="12" y2="23"/>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                            <line x1="1" y1="12" x2="3" y2="12"/>
                                            <line x1="21" y1="12" x2="23" y2="12"/>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                          </svg>
                                        )}
                                        {item.icon === 'lightning' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                          </svg>
                                        )}
                                        {item.icon === 'shield' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                          </svg>
                                        )}
                                        {item.icon === 'clock' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                          </svg>
                                        )}
                                        {item.icon === 'smartphone' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                            <line x1="12" y1="18" x2="12" y2="18"/>
                                          </svg>
                                        )}
                                        {item.icon === 'calendar' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                          </svg>
                                        )}
                                        {item.icon === 'chart' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"/>
                                            <line x1="18" y1="20" x2="18" y2="4"/>
                                            <line x1="6" y1="20" x2="6" y2="16"/>
                                          </svg>
                                        )}
                                        {item.icon === 'bell' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                          </svg>
                                        )}
                                        {item.icon === 'thermometer' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                                          </svg>
                                        )}
                                        {item.icon === 'users' && (
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                          </svg>
                                        )}
                                      </div>
                                    ) : (
                                      <div style={{
                                        width: '8px',
                                        height: '8px',
                                        background: 'rgb(191, 88, 19)',
                                        borderRadius: '50%'
                                      }}></div>
                                    )}
                                    {item.title}
                                  </h5>
                                  <p style={{
                                    lineHeight: '1.6',
                                    color: 'rgb(51, 51, 51)',
                                    fontSize: '0.95rem'
                                  }}>
                                    {item.text}
                                  </p>
                                </div>
                              </div>
                            ))}
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
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
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
                      
                      case 'solution':
                        return (
                          <div key={idx} style={{
                            background: '#f9fafb',
                            padding: '2rem',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            marginBottom: '2rem'
                          }}>
                            {section.title && (
                              <h4 style={{
                                color: '#111',
                                marginBottom: '1.5rem',
                                fontSize: '1.1rem'
                              }}>
                                {section.title}
                              </h4>
                            )}
                            <div style={{ display: 'grid', gap: '1rem' }}>
                              {section.items?.map((item, itemIdx) => (
                                <div key={itemIdx} style={{
                                  display: 'flex',
                                  alignItems: 'start',
                                  gap: '0.75rem'
                                }}>
                                  <span style={{
                                    color: '#BF5813',
                                    fontSize: '1.2rem'
                                  }}>✓</span>
                                  <div>
                                    <strong style={{
                                      color: '#111',
                                      display: 'block',
                                      marginBottom: '0.25rem'
                                    }}>
                                      {item.title}
                                    </strong>
                                    <p style={{
                                      fontSize: '0.875rem',
                                      color: '#666',
                                      lineHeight: '1.5'
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
                                {section.problem?.title}
                              </h4>
                              <div style={{ display: 'grid', gap: '1rem' }}>
                                {section.problem?.items?.map((item, itemIdx) => (
                                  <div key={itemIdx} style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.75rem'
                                  }}>
                                    <span style={{
                                      color: '#ef4444',
                                      fontSize: '1.2rem'
                                    }}>✗</span>
                                    <div>
                                      <strong style={{
                                        display: 'block',
                                        marginBottom: '0.25rem'
                                      }}>
                                        {item.title}
                                      </strong>
                                      <p style={{
                                        fontSize: '0.875rem',
                                        opacity: 0.9,
                                        lineHeight: '1.5'
                                      }}>
                                        {item.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                                {section.solution?.title}
                              </h4>
                              <div style={{ display: 'grid', gap: '1rem' }}>
                                {section.solution?.items?.map((item, itemIdx) => (
                                  <div key={itemIdx} style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '0.75rem'
                                  }}>
                                    <span style={{
                                      color: '#16a34a',
                                      fontSize: '1.2rem'
                                    }}>✓</span>
                                    <div>
                                      <strong style={{
                                        color: '#111',
                                        display: 'block',
                                        marginBottom: '0.25rem'
                                      }}>
                                        {item.title}
                                      </strong>
                                      <p style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        lineHeight: '1.5'
                                      }}>
                                        {item.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                              {section.items?.map((item: string, itemIdx: number) => (
                                <div key={itemIdx} style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.75rem',
                                  padding: '0.75rem',
                                  background: 'white',
                                  borderRadius: '8px',
                                  transition: 'transform 0.2s',
                                  cursor: 'default'
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
                                      fontWeight: 500,
                                      color: '#111',
                                      display: 'block',
                                      marginBottom: 0
                                    }}>
                                      {item}
                                    </span>
                                  </div>
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
                              <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {section.items?.map((item: string, itemIdx: number) => (
                                  <div key={itemIdx} style={{
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
                                      flexShrink: 0
                                    }}></div>
                                    <span style={{
                                      color: '#333',
                                      lineHeight: '1.8'
                                    }}>
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      
                      case 'quote':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, rgb(248, 248, 248) 0%, rgb(255, 255, 255) 100%)',
                            padding: '2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            borderLeft: '4px solid rgb(191, 88, 19)'
                          }}>
                            <blockquote style={{ margin: '0px' }}>
                              <p style={{
                                fontStyle: 'italic',
                                fontSize: '1.1rem',
                                color: 'rgb(51, 51, 51)',
                                marginBottom: '1rem',
                                lineHeight: '1.7'
                              }}>
                                "{section.quote || section.text}"
                              </p>
                              <cite style={{
                                fontSize: '0.95rem',
                                color: 'rgb(102, 102, 102)',
                                fontStyle: 'normal',
                                fontWeight: 500
                              }}>
                                — {section.author}
                              </cite>
                            </blockquote>
                          </div>
                        );
                      
                      case 'comparison':
                        return (
                          <div key={idx} style={{
                            background: 'linear-gradient(135deg, #fff5f0 0%, #f8f8f8 100%)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            border: '1px solid #e5e7eb',
                            borderLeft: '4px solid #BF5813'
                          }}>
                            <h4 style={{
                              marginBottom: '1rem',
                              fontSize: '1.2rem',
                              fontWeight: 500,
                              color: '#111'
                            }}>
                              {section.title}
                            </h4>
                            <p style={{ lineHeight: '1.8', color: '#333' }}>{section.text}</p>
                          </div>
                        );
                      
                      case 'single-image':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem', textAlign: 'center', width: '100%' }}>
                            <img
                              src={section.image}
                              alt={section.caption}
                              onClick={() => setFullscreenImage(section.image)}
                              style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                cursor: 'zoom-in',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                            />
                            {section.caption && (
                              <div style={{
                                marginTop: '1rem',
                                padding: '0 1rem',
                                textAlign: 'center'
                              }}>
                                <p style={{
                                  fontSize: '0.9rem',
                                  color: '#666',
                                  fontStyle: 'italic',
                                  margin: 0
                                }}>
                                  {section.caption}
                                </p>
                              </div>
                            )}
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
                            <h4 style={{
                              marginBottom: '0.5rem',
                              fontSize: '1.2rem',
                              fontWeight: 500
                            }}>
                              {section.title}
                            </h4>
                            <p style={{
                              color: '#666',
                              marginBottom: '1.5rem'
                            }}>
                              {section.subtitle}
                            </p>
                            <div style={{
                              display: 'flex',
                              gap: '1rem',
                              justifyContent: 'center',
                              flexWrap: 'wrap'
                            }}>
                              <a 
                                href={section.appStore}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
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
                                  transition: 'transform 0.2s',
                                  border: '1px solid #000'
                                }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                                </svg>
                                <span>App Store</span>
                              </a>
                              <a 
                                href={section.googlePlay}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
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
                                  transition: 'transform 0.2s',
                                  border: '1px solid #000'
                                }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M3.609 1.814L13.792 12l-10.183 10.186a1.5 1.5 0 0 1-.396-1.008V2.822a1.5 1.5 0 0 1 .396-1.008z" fill="#01D277"/>
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
                            <h4 style={{
                              marginBottom: '1.5rem',
                              fontSize: '1.2rem',
                              fontWeight: 500
                            }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                              {section.steps?.map((step: string, stepIdx: number) => (
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
                                  <p style={{
                                    color: '#333',
                                    lineHeight: '1.6'
                                  }}>
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      case 'testimonials':
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{
                              marginBottom: '1.5rem',
                              fontSize: '1.2rem',
                              fontWeight: 500
                            }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                              {section.items?.map((testimonial, testIdx) => (
                                <blockquote key={testIdx} style={{
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
                                    "{testimonial.quote}"
                                  </p>
                                  <cite style={{
                                    fontSize: '0.875rem',
                                    color: '#666',
                                    fontStyle: 'normal'
                                  }}>
                                    — {testimonial.author}
                                  </cite>
                                </blockquote>
                              ))}
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
                              color: 'rgb(17, 17, 17)'
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
                                  background: 'rgb(249, 250, 251)',
                                  padding: '1.25rem',
                                  borderRadius: '12px',
                                  borderLeft: '3px solid rgb(191, 88, 19)'
                                }}>
                                  <h5 style={{
                                    color: 'rgb(17, 17, 17)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem'
                                  }}>
                                    {item.spec}
                                  </h5>
                                  <p style={{
                                    color: 'rgb(102, 102, 102)',
                                    fontSize: '0.875rem',
                                    margin: '0px',
                                    lineHeight: '1.5'
                                  }}>
                                    {item.detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                      default:
                        return (
                          <div key={idx} style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 500 }}>
                              {section.title}
                            </h4>
                            <p style={{ lineHeight: '1.8', color: '#333' }}>{section.text}</p>
                          </div>
                        );
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            </div>
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
            alt="Detailed view of premium cedar sauna construction and craftsmanship"
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
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '24px', color: 'white' }}>✕</span>
          </button>
        </div>
      )}

      <Footer />
      
      <style jsx global>{`
        /* Prevent horizontal scrolling globally */
        html, body {
          overflow-x: hidden !important;
          max-width: 100% !important;
        }

        /* Premium Features Container Fixes */
        .premium-features-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        @media (max-width: 1024px) {
          .desktop-grid {
            display: none !important;
          }
          .mobile-tablet-grid {
            display: block !important;
          }
          .premium-features-container {
            padding: 0 !important;
            max-width: none !important;
            overflow: hidden;
          }
        }
        @media (max-width: 768px) {
          .feature-cards {
            grid-template-columns: 1fr !important;
          }
          .modal-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .engineering-details-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-tablet-gallery {
            display: none !important;
          }
          .mobile-gallery-first,
          .mobile-gallery-inline {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
