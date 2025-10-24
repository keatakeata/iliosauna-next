'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';
import { modalContent } from './modalContent';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { client } from '../../../sanity/lib/client';
import { saunasPageQuery } from '../../../sanity/lib/queries';

// CODE-FIRST CONTENT ARCHITECTURE
interface SaunasData {
  section1: {
    title: string;
    subtitle: string;
    slides: Array<{ url: string; alt: string }>;
  };
  section2: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    videoUrl: string;
    videoPoster: string;
  };
  section3: {
    title: string;
    backgroundImage: string;
    basePrice: string;
    size: string;
    heater: string;
    warranty: string;
    leadTime: string;
  };
  section4: {
    title: string;
    subtitle: string;
    features: Array<{
      id: string;
      title: string;
      description: string;
      imageUrl: string;
    }>;
  };
  section5: {
    guaranteeTitle: string;
    guaranteeDescription: string;
    guaranteeFeatures: string[];
    guaranteeNote: string;
    faqTitle: string;
    faqItems: Array<{ question: string; answer: string }>;
    contactLinkText: string;
  };
}

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
  const scrollPositionRef = useRef(0);
  const { addItem } = useCart();

  // CODE-FIRST STATIC CONTENT - PRIMARY SOURCE OF TRUTH
  const codeContent: SaunasData = {
    section1: {
      title: 'Premium Cedar Saunas',
      subtitle: 'Contemporary luxury saunas crafted with sustainable western red cedar',
      slides: [
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg', alt: 'Luxury sauna interior' },
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f4a1773c4544.jpeg', alt: 'Premium cedar sauna walls' },
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg', alt: 'Modern sauna design' },
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg', alt: 'Cedar sauna exterior' },
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg', alt: 'Professional sauna installation' },
        { url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48eefde6142a736f7c.jpeg', alt: 'Luxury sauna amenities' }
      ]
    },
    section2: {
      title: 'The ilio Difference',
      paragraph1: 'At ilio, we believe wellness should be accessible, beautiful, and transformative. Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.',
      paragraph2: 'Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted with advanced heating systems for an experience that lasts.',
      videoUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0b776b0fbe591e36c.mp4',
      videoPoster: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48eefde667db736f79.jpeg'
    },
    section3: {
      title: 'Premium Specifications',
      backgroundImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48eefde667db736f79.jpeg',
      basePrice: '$19,500 CAD',
      size: '4-6 Person Capacity',
      heater: 'HUUM DROP Heater',
      warranty: '5-Year Structure / 3-Year Heater',
      leadTime: '2-3 Weeks Standard / 6-8 Weeks Custom'
    },
    section4: {
      title: 'Premium Materials',
      subtitle: 'Every detail is chosen for quality, durability, and wellness.',
      features: [
        {
          id: 'western-red-cedar',
          title: 'Western Red Cedar',
          description: 'Sustainably harvested premium western red cedar for natural aroma and beauty',
          imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg'
        },
        {
          id: 'scandinavian-design',
          title: 'Scandinavian Craftsmanship',
          description: 'Precision-engineered with traditional Scandinavian woodworking techniques',
          imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg'
        },
        {
          id: 'warming-systems',
          title: 'Advanced Heating Systems',
          description: 'HUUM premium heaters for optimal heat distribution and energy efficiency',
          imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg'
        }
      ]
    },
    section5: {
      guaranteeTitle: 'Lifetime Support Guarantee',
      guaranteeDescription: 'We stand behind our saunas with comprehensive support and quality assurance.',
      guaranteeFeatures: [
        '5-year structural warranty on sauna build',
        '3-year warranty on HUUM heating systems',
        'Lifetime technical support and maintenance guidance',
        'Free sauna use training and consultation',
        'Priority service for custom modifications'
      ],
      guaranteeNote: 'All warranties subject to terms and conditions. Professional installation by certified technicians recommended.',
      faqTitle: 'Sauna Care & Support',
      faqItems: [
        {
          question: 'What is the optimal sauna temperature?',
          answer: 'The ideal sauna temperature ranges from 150-195°F (65-90°C). Our HUUM heaters allow precise temperature control for personalized comfort.'
        },
        {
          question: 'How often should I clean my sauna?',
          answer: 'Clean your sauna after each use with a soft cloth and mild soap solution. Deep cleaning should be done monthly, with professional maintenance annually.'
        },
        {
          question: 'What maintenance does a sauna require?',
          answer: 'Regular maintenance includes cleaning, checking heater components, and ensuring proper ventilation. We provide detailed maintenance guides with each sauna.'
        },
        {
          question: 'Can I add lighting or accessories?',
          answer: 'Yes! Our saunas are designed for customization with chromotherapy lighting, sound systems, and other wellness accessories. Contact us for installation options.'
        },
        {
          question: 'Do you offer sauna relocation services?',
          answer: 'Yes, we provide professional sauna relocation and reinstallation services. Our certified technicians ensure safe transport and proper setup at your new location.'
        }
      ],
      contactLinkText: 'Contact our sauna experts'
    }
  };

  // Use code content as base, with CMS overrides
  const [saunasData, setSaunasData] = useState<any>(codeContent);

  // Fetch CMS data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(saunasPageQuery);
        setSaunasData(data);
      } catch (error) {
        console.error('Error fetching saunas data:', error);
      }
    };
    fetchData();
  }, []);

  // Trigger page load animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!saunasData?.section1?.slides) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % saunasData.section1.slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [saunasData?.section1?.slides]);

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

  if (!saunasData) {
    return <div>Loading...</div>;
  }

  const { section1, section2, section3, section4, section5 } = saunasData;

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
        <div 
          className="hero-zoom-wrapper"
          style={{
            position: 'absolute',
            inset: '-10%',
            width: '120%',
            height: '120%',
          }}
        >
          {section1.slides?.map((slide: any, index: number) => (
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
                src={slide.url}
                alt={slide.alt}
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
              {section1.title}
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
              {section1.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="ilio-section" style={{ background: 'white', padding: '100px 0' }}>
        <div className="ilio-container">
          <div className="text-center mb-5">
            <h2 className="section-header h2-animate reveal-on-scroll" style={{ 
              marginBottom: '2rem',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 100,
              letterSpacing: '0.05em'
            }}>
              {section2.title}
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
                {section2.paragraph1}
              </p>
              <p className="reveal-on-scroll reveal-delay-3" style={{ 
                maxWidth: '800px', 
                margin: '1.5rem auto 3rem',
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                {section2.paragraph2}
              </p>
            </div>
            
            {/* Video Section */}
            <div className="reveal-on-scroll reveal-delay-4" style={{ 
              maxWidth: '900px', 
              margin: '3rem auto 0',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0
            }}>
              <video 
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={section2.videoPoster}
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
                  src={section2.videoUrl} 
                  type="video/mp4" 
                />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Sauna Specs Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('${section3.backgroundImage}')`,
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
            {section3.title}
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
              <div style={{ fontSize: '2rem', fontWeight: 200 }}>{section3.basePrice}</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-3" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>SIZE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>{section3.size}</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-4" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>HEATER</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>{section3.heater}</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-5" style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>WARRANTY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>{section3.warranty}</div>
            </div>
            
            <div className="reveal-on-scroll reveal-delay-6" style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.7 }}>LEAD TIME</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 200 }}>{section3.leadTime}</div>
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
                        name: 'ilio Premium Cedar Sauna',
                        price: 20000,
                        image: section1.slides?.[0]?.url || '',
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
                        name: 'ilio Premium Cedar Sauna',
                        price: 20000,
                        image: section1.slides?.[0]?.url || '',
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

      {/* Premium Details Section */}
      <section className="ilio-section" style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="ilio-container">
          <div className="text-center mb-5">
            <h2 className="section-header h2-animate reveal-on-scroll" style={{ 
              marginBottom: '2rem',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 100,
              letterSpacing: '0.05em'
            }}>{section4.title}</h2>
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
            }}>{section4.subtitle}</p>
          </div>
          
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
            {section4.features?.map((feature: any, index: number) => (
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
                {feature.imageUrl && (
                  <LazyImage 
                    src={feature.imageUrl}
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
          
          {/* Mobile/Tablet View */}
          <div className="mobile-tablet-grid" style={{ display: 'none' }}>
            {section4.features?.map((feature: any, index: number) => (
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
                {feature.imageUrl && (
                  <LazyImage 
                    src={feature.imageUrl}
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
              }}>{section5.guaranteeTitle}</h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                {section5.guaranteeDescription}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                {section5.guaranteeFeatures?.map((feature: string, index: number) => (
                  <li key={index} style={{ padding: '0.5rem 0', color: '#374151' }}>✓ {feature}</li>
                ))}
              </ul>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                {section5.guaranteeNote}
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
              }}>{section5.faqTitle}</h3>
              
              {section5.faqItems?.map((faq: any, index: number) => (
                <div key={index} style={{ 
                  marginBottom: '1.25rem', 
                  paddingBottom: '1.25rem', 
                  borderBottom: index < section5.faqItems.length - 1 ? '1px solid #E5E7EB' : 'none' 
                }}>
                  <h4 style={{ fontWeight: 500, color: '#111', marginBottom: '0.4rem' }}>{faq.question}</h4>
                  <p style={{ color: '#6B7280', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
              
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
                {section5.contactLinkText}
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
          onClick={() => setActiveModal(undefined)}
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
              onClick={() => setActiveModal(undefined)}
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
                  
                  {/* Additional modal content rendering would go here */}
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
      `}</style>
    </>
  );
}
