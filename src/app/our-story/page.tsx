'use client';

// BUILD FIX: Removed conflicting force-dynamic export for React 19 compatibility

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';
import { sanityFetch } from '../../../sanity/lib/client';

interface OurStoryData {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage?: any;
    backgroundImageUrl?: string;
  };
  passionSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
  };
  builtInCanadaSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    slideshowImages: { image?: any; imageUrl?: string; alt?: string }[];
  };
  craftsmanshipSection: {
    title: string;
    description: string;
    features: { title: string; description: string }[];
  };
  valuesSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  ctaSection: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
}

export default function OurStoryPage() {
  const [ourStoryData, setOurStoryData] = useState<OurStoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Code-First Content Architecture
  const codeContent: OurStoryData = {
    heroSection: {
      title: 'Our Story',
      subtitle: 'Expertly crafted on Vancouver island British Columbia, Canada.',
      backgroundImageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68c2b2c1dee47c7da0f15a48.jpeg'
    },
    passionSection: {
      title: 'A Passion for Wellness',
      paragraph1: 'Ilio is born out of a desire to bring affordable and beautifully designed thermal wellness experiences home to you.',
      paragraph2: 'Based on Vancouver Island in Cobble Hill, the Ilio team is a group of builders, designers and wellness enthusiasts inspired by the natural beauty of the Pacific West Coast.',
      quote: 'Marrying elements of traditional sauna building with renowned West Coast Cedar, the team at Ilio is reimagining the sauna experience for your backyard.'
    },
    builtInCanadaSection: {
      title: 'Built in Canada',
      paragraph1: 'Each Ilio sauna is meticulously crafted in British Columbia, shaped from locally sourced Western Red Cedar and refined through time-honored techniques.',
      paragraph2: 'We are dedicated to supporting local communities while preserving uncompromising quality ensuring every detail embodies excellence from forest to finish.',
      slideshowImages: [
        { imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d671d8e63bf298.jpeg', alt: 'Built in Canada 1' },
        { imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f4a1773c4544.jpeg', alt: 'Built in Canada 2' },
        { imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg', alt: 'Built in Canada 3' },
        { imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg', alt: 'Built in Canada 4' },
        { imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg', alt: 'Built in Canada 5' }
      ]
    },
    craftsmanshipSection: {
      title: 'BC Craftsmanship Meets Scandinavian Tradition',
      description: 'Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna traditions to create something truly special.',
      features: [
        { title: 'Premium Materials', description: 'Canadian red cedar and industry-leading heaters ensure durability and an authentic sauna experience.' },
        { title: 'Handcrafted Quality', description: 'Each unit is carefully built by skilled BC artisans – not mass-produced – ensuring exceptional attention to detail.' },
        { title: 'Modern Innovation', description: 'WiFi-controlled systems bring convenience to tradition, letting you start your sauna from anywhere.' }
      ]
    },
    valuesSection: {
      title: 'What We Stand For',
      paragraph1: 'At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, and transparency in everything we do.',
      paragraph2: 'Our commitment extends beyond delivering exceptional saunas. We\'re dedicated to educating our customers about the profound benefits of heat therapy, supporting sustainable forestry practices, and contributing to the wellness of our communities.',
      paragraph3: 'When you choose Ilio, you\'re not just investing in a sauna – you\'re joining a movement that believes wellness should be accessible, sustainable, and transformative for all Canadians.'
    },
    ctaSection: {
      title: 'Ready to Transform Your Wellness Journey?',
      description: 'Discover how an Ilio sauna can elevate your daily wellness routine',
      primaryButtonText: 'Explore Our Saunas',
      primaryButtonLink: '/saunas',
      secondaryButtonText: 'Get in Touch',
      secondaryButtonLink: '/contact'
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to fetch CMS overrides (optional)
        const query = `*[_type == "ourstory-final"][0] {
          _id,
          heroSection {
            title,
            subtitle,
            backgroundImage {
              asset,
              alt
            },
            backgroundImageUrl
          },
          passionSection {
            title,
            paragraph1,
            paragraph2,
            quote
          },
          builtInCanadaSection {
            title,
            paragraph1,
            paragraph2,
            slideshowImages[] {
              image {
                asset,
                alt
              },
              imageUrl,
              alt
            }
          },
          craftsmanshipSection {
            title,
            description,
            features[] {
              title,
              description
            }
          },
          valuesSection {
            title,
            paragraph1,
            paragraph2,
            paragraph3
          },
          ctaSection {
            title,
            description,
            primaryButtonText,
            primaryButtonLink,
            secondaryButtonText,
            secondaryButtonLink
          }
        }`;

        const cmsData = await sanityFetch({ query });

        // CODE-FIRST: Always use code content, ignore CMS for now
        // CMS is providing test data that's overriding production content
        setOurStoryData(codeContent);
        
        // Commenting out CMS override temporarily
        /*
        if (cmsData) {
          // Deep merge: Code content + CMS overrides
          const mergedContent: OurStoryData = {
            heroSection: { ...codeContent.heroSection, ...cmsData.heroSection },
            passionSection: { ...codeContent.passionSection, ...cmsData.passionSection },
            builtInCanadaSection: { ...codeContent.builtInCanadaSection, ...cmsData.builtInCanadaSection },
            craftsmanshipSection: { ...codeContent.craftsmanshipSection, ...cmsData.craftsmanshipSection },
            valuesSection: { ...codeContent.valuesSection, ...cmsData.valuesSection },
            ctaSection: { ...codeContent.ctaSection, ...cmsData.ctaSection }
          };
          setOurStoryData(mergedContent);
        } else {
          // Pure code content (no CMS)
          setOurStoryData(codeContent);
        }
        */

      } catch (error) {
        console.error('Error fetching CMS data:', error);
        // Fallback to pure code content
        setOurStoryData(codeContent);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!loading && ourStoryData?.builtInCanadaSection?.slideshowImages?.length) {
      const timer = setInterval(() => {
        setCurrentSlide((prev: number) =>
          (prev + 1) % ourStoryData.builtInCanadaSection.slideshowImages.length
        );
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [loading, ourStoryData?.builtInCanadaSection?.slideshowImages?.length]);

  // Detect mobile viewport, iOS, and window width
  useEffect(() => {
    const detectIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
      setIsIOS(detectIOS());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fade in animations
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setPageLoaded(true), 100);
    }
  }, [loading]);

  if (loading) {
    return (
      <>
        <Navbar animated={false} />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #BF5813',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ color: '#666' }}>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!ourStoryData) {
    return (
      <>
        <Navbar animated={false} />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white'
        }}>
          <p>Content not available</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollAnimations />
      <Navbar animated={true} />

      {/* Hero Section */}
      <section 
        className={isIOS ? 'hero-section ios-hero-section' : 'hero-section'}
        style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(rgba(191, 88, 19, 0.1), rgba(0, 0, 0, 0.4)), linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('${
          // Priority: Sanity image first, then URL fallback, then default
          ourStoryData.heroSection.backgroundImage?.asset?.url ||
          ourStoryData.heroSection.backgroundImage?.url ||
          ourStoryData.heroSection.backgroundImageUrl ||
          'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48008e7f401389f87a.jpeg'
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: isMobile ? '70% 30%' : 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: isIOS ? 'scroll' : 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        <div>
          <h1 style={{
            opacity: pageLoaded ? 1 : 0,
            transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 100,
            letterSpacing: '0.08em',
            marginBottom: '1rem',
            color: 'white'
          }}>{ourStoryData.heroSection.title}</h1>
          <p style={{
            opacity: pageLoaded ? 1 : 0,
            transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out 1.05s, transform 1s ease-out 1.05s',
            fontSize: '1.25rem',
            fontWeight: 200,
            letterSpacing: '0.06em',
            color: 'white'
          }}>{ourStoryData.heroSection.subtitle}</p>
        </div>
      </section>

      {/* Passion Section */}
      <section style={{
        padding: '100px 0',
        background: 'white'
      }}>
        <div className="ilio-container">
          <div className="passion-section-container" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div>
              <h2 className="h2 h2-animate reveal-on-scroll" style={{
                marginBottom: '2rem'
              }}>
                {ourStoryData.passionSection.title}
              </h2>
              <div className="reveal-on-scroll reveal-delay-1" style={{
                width: '75%',
                height: '1px',
                background: '#D1D5DB',
                marginBottom: '2rem'
              }}></div>
              <p className="reveal-on-scroll reveal-delay-2" style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5a5a5a',
                marginBottom: '1.5rem'
              }}>
                {ourStoryData.passionSection.paragraph1}
              </p>
              <p className="reveal-on-scroll reveal-delay-3" style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                {ourStoryData.passionSection.paragraph2}
              </p>
            </div>
            <div className="reveal-on-scroll reveal-delay-3" style={{
              background: '#f8f8f8',
              padding: '2.5rem',
              borderLeft: '3px solid #BF5813',
              display: 'flex',
              alignItems: 'center',
              height: 'fit-content',
              marginTop: '4rem'
            }}>
              <p style={{
                fontSize: '18px',
                lineHeight: '1.8',
                fontStyle: 'italic',
                color: '#333',
                margin: 0
              }}>
                "{ourStoryData.passionSection.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built in Canada Section */}
      <section className="built-in-canada-section" style={{
        position: 'relative',
        height: '80vh',
        minHeight: '600px',
        overflow: 'hidden'
      }}>
        {/* Slideshow Background */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {ourStoryData.builtInCanadaSection.slideshowImages.map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              <img
                src={
                  // Priority: Sanity image first, then URL fallback
                  slide.image?.asset?.url ||
                  slide.image?.url ||
                  slide.imageUrl ||
                  'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d671d8e63bf298.jpeg'
                }
                alt={slide.alt || `Ilio Sauna story and craftsmanship showcase image ${index + 1} - Premium BC cedar sauna manufacturing`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="built-canada-overlay" style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '500px',
          maxWidth: '40%',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          zIndex: 10
        }}>
          <div style={{ color: 'white' }}>
            <h2 className="h2 reveal-on-scroll" style={{
              color: 'white',
              marginBottom: '2rem'
            }}>{ourStoryData.builtInCanadaSection.title}</h2>
            <div className="reveal-on-scroll reveal-delay-1" style={{
              width: '75%',
              height: '1px',
              background: 'rgba(255,255,255,0.3)',
              marginBottom: '2rem'
            }}></div>
            <p className="reveal-on-scroll reveal-delay-2" style={{
              fontSize: '16px',
              lineHeight: '1.8',
              marginBottom: '1.5rem',
              color: 'white',
              fontWeight: 300
            }}>
              {ourStoryData.builtInCanadaSection.paragraph1}
            </p>
            <p className="reveal-on-scroll reveal-delay-3" style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: 'white',
              fontWeight: 300
            }}>
              {ourStoryData.builtInCanadaSection.paragraph2}
            </p>
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 3
        }}>
          {ourStoryData.builtInCanadaSection.slideshowImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '40px' : '20px',
                height: '2px',
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section style={{
        padding: '100px 0',
        background: '#f8f8f8'
      }}>
        <div className="ilio-container">
          <h2 className="h2 h2-animate reveal-on-scroll" style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>{ourStoryData.craftsmanshipSection.title}</h2>
          <div className="reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <p className="reveal-on-scroll reveal-delay-2" style={{
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 4rem',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#5a5a5a'
          }}>
            {ourStoryData.craftsmanshipSection.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {ourStoryData.craftsmanshipSection.features.map((feature, index) => (
              <div key={index} className={`reveal-on-scroll reveal-delay-${index + 3}`} style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  color: '#BF5813'
                }}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {index === 0 && <><path d="M4 4C4 4 6 8 12 8C18 8 20 4 20 4M4 12C4 12 6 16 12 16C18 16 20 12 20 12M4 20C4 20 6 24 12 24C18 24 20 20 20 20" strokeLinecap="round"/><line x1="12" y1="2" x2="12" y2="22" strokeLinecap="round"/></>}
                    {index === 1 && <><path d="M6 3L18 3L22 9L12 21L2 9L6 3Z" strokeLinejoin="round"/><path d="M2 9H22M12 3V21M7.5 9L12 3L16.5 9" strokeLinejoin="round"/></>}
                    {index === 2 && <><circle cx="12" cy="18" r="1.5" fill="currentColor"/><path d="M8.5 14.5C9.5 13.5 10.7 13 12 13C13.3 13 14.5 13.5 15.5 14.5" strokeLinecap="round"/><path d="M5.5 11.5C7.5 9.5 9.7 8.5 12 8.5C14.3 8.5 16.5 9.5 18.5 11.5" strokeLinecap="round"/><path d="M2.5 8.5C5.5 5.5 8.7 4 12 4C15.3 4 18.5 5.5 21.5 8.5" strokeLinecap="round"/></>}
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  marginBottom: '1rem',
                  color: '#333'
                }}>{feature.title}</h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 0',
        background: 'white',
        textAlign: 'center'
      }}>
        <div className="ilio-container">
          <h2 className="h2 h2-animate reveal-on-scroll" style={{
            marginBottom: '2rem'
          }}>
            {ourStoryData.ctaSection.title}
          </h2>
          <div className="reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <p className="reveal-on-scroll reveal-delay-2" style={{
            color: '#5a5a5a',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: '1.8'
          }}>
            {ourStoryData.ctaSection.description}
          </p>
          <div className="reveal-on-scroll reveal-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={ourStoryData.ctaSection.primaryButtonLink}
              style={{
                display: 'inline-block',
                padding: '0.9rem 2.4rem',
                background: '#BF5813',
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#A04810';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#BF5813';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {ourStoryData.ctaSection.primaryButtonText}
            </Link>
            <Link
              href={ourStoryData.ctaSection.secondaryButtonLink}
              style={{
                display: 'inline-block',
                padding: '0.9rem 2.4rem',
                background: 'transparent',
                color: '#333',
                border: '1px solid #333',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#BF5813';
                e.currentTarget.style.color = '#BF5813';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#333';
              }}
            >
              {ourStoryData.ctaSection.secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* CLEAN MOBILE LAYOUT - WORKING STATE */}
      <style jsx>{`
        /* PASSSION SECTION - MOBILE STACK TO SINGLE COLUMN */
        .passion-section-container {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 4rem !important;
          align-items: start !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
        }

        /* PASSION SECTION - SINGLE COLUMN ON MOBILE */
        @media (max-width: 768px) {
          .passion-section-container {
            display: block !important;
            gap: 0 !important;
          }

          .passion-section-container > div:first-child {
            margin-bottom: 3rem !important;
          }

          .passion-section-container > div:last-child {
            margin-top: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .built-in-canada-section {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 90vh !important;
            padding: 2rem 1rem !important;
          }

          .built-canada-overlay {
            position: static !important;
            width: 95% !important;
            max-width: 450px !important;
            margin: 0 auto !important;
            background: rgba(0,0,0,0.65) !important;
            border-radius: 16px !important;
            padding: 3rem 2.5rem !important;
            box-sizing: border-box !important;
          }

          .built-canada-overlay h2 {
            font-size: 28px !important;
            line-height: 32px !important;
            text-align: left !important;
            margin-bottom: 2rem !important;
            color: white !important;
          }

          .built-canada-overlay p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            text-align: left !important;
            margin-bottom: 1.5rem !important;
            color: white !important;
          }
        }
        
        /* iOS SPECIFIC FIXES - Ensure proper image rendering and positioning */
        .ios-hero-section {
          /* Override background attachment for iOS */
          background-attachment: scroll !important;
          /* Ensure image stays sharp and properly positioned */
          background-size: cover !important;
          background-position: 70% 30% !important;
          /* Prevent iOS zoom issues */
          -webkit-background-size: cover !important;
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
          /* Force hardware acceleration */
          will-change: transform !important;
        }
        
        /* Apply iOS class conditionally via JavaScript */
        @media screen and (-webkit-min-device-pixel-ratio: 2) {
          .hero-section {
            /* Ensure crisp rendering on retina displays */
            -webkit-backface-visibility: hidden !important;
            backface-visibility: hidden !important;
          }
        }
      `}</style>
    </>
  );
}
// Force recompilation - Deploy ocean image fix
