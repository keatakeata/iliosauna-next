'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';

export default function OurStoryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Built in Canada slideshow images - fixing the last two
  const canadaSlides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d671d8e63bf298.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f4a1773c4544.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg'
  ];
  
  // Auto-advance Canada slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % canadaSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [canadaSlides.length]);

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
      
      {/* Hero Section - Static Image */}
      <section style={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48008e7f401389f87a.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
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
          }}>Our Story</h1>
          <p style={{
            opacity: pageLoaded ? 1 : 0,
            transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out 1.05s, transform 1s ease-out 1.05s',
            fontSize: '1.25rem',
            fontWeight: 200,
            letterSpacing: '0.06em',
            color: 'white'
          }}>Redefining Luxury Wellness in BC</p>
        </div>
      </section>

      {/* Passion for Wellness Section - White Background */}
      <section style={{ 
        padding: '100px 0',
        background: 'white'
      }}>
        <div className="ilio-container">
          <div 
            className="passion-wellness-grid"
            style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'start',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
            <div>
              <h2 className="h2-animate reveal-on-scroll" style={{ 
                fontSize: '40px',
                lineHeight: '44px',
                fontWeight: 400,
                marginBottom: '2rem'
              }}>
                A Passion for Wellness, Made Accessible
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
                After years observing the sauna industry, we noticed something troubling: 
                premium saunas were selling for over $40,000, putting the wellness benefits 
                of regular sauna use out of reach for most Canadians. We believed there had 
                to be a better way.
              </p>
              <p className="reveal-on-scroll reveal-delay-3" style={{ 
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5a5a5a'
              }}>
                That belief drove us to reimagine what a luxury sauna company could be. 
                By cutting out excessive markups and focusing on direct relationships with 
                our customers, we've created premium saunas that rival those costing three 
                times as much.
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
                "We provide an affordable luxury product that can be easily installed in a 
                short time frame – bringing the transformative power of sauna wellness to 
                more Canadian homes."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built in Canada Section */}
      <section 
        className="built-in-canada-section"
        style={{ 
          position: 'relative', 
          height: '80vh',
          minHeight: '600px',
          overflow: 'hidden'
        }}>
        {/* Slideshow Background */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {canadaSlides.map((slide, index) => (
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
                src={slide}
                alt={`Built in Canada ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>

        {/* Content Overlay - Fixed as vertical strip */}
        <div 
          className="built-canada-overlay"
          style={{
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
            <h2 className="reveal-on-scroll" style={{ 
              color: 'white',
              fontSize: '40px',
              lineHeight: '44px',
              fontWeight: 400,
              marginBottom: '2rem',
              letterSpacing: '0.05em'
            }}>Built in Canada</h2>
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
              Every Ilio sauna is proudly crafted in British Columbia using locally sourced 
              Western Red Cedar and time-tested construction techniques.
            </p>
            <p className="reveal-on-scroll reveal-delay-3" style={{ 
              fontSize: '16px',
              lineHeight: '1.8',
              color: 'white',
              fontWeight: 300
            }}>
              We believe in supporting local artisans and maintaining the highest quality 
              standards from forest to finish.
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
          {canadaSlides.map((_, index) => (
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

      {/* BC Craftsmanship Section - Off-white Background */}
      <section style={{ 
        padding: '100px 0',
        background: '#f8f8f8'
      }}>
        <div className="ilio-container">
          <h2 className="h2-animate reveal-on-scroll" style={{ 
            textAlign: 'center',
            fontSize: '40px',
            lineHeight: '44px',
            fontWeight: 400,
            marginBottom: '2rem'
          }}>BC Craftsmanship Meets Scandinavian Tradition</h2>
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
            Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials 
            whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna 
            traditions to create something truly special.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Premium Materials Card */}
            <div className="reveal-on-scroll reveal-delay-3" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                color: '#BF5813'
              }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4C4 4 6 8 12 8C18 8 20 4 20 4M4 12C4 12 6 16 12 16C18 16 20 12 20 12M4 20C4 20 6 24 12 24C18 24 20 20 20 20" strokeLinecap="round"/>
                  <line x1="12" y1="2" x2="12" y2="22" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '1rem',
                color: '#333'
              }}>Premium Materials</h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                Canadian red cedar and industry-leading heaters ensure durability and an authentic sauna experience.
              </p>
            </div>

            {/* Handcrafted Quality Card */}
            <div className="reveal-on-scroll reveal-delay-4" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                color: '#BF5813'
              }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 3L18 3L22 9L12 21L2 9L6 3Z" strokeLinejoin="round"/>
                  <path d="M2 9H22M12 3V21M7.5 9L12 3L16.5 9" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '1rem',
                color: '#333'
              }}>Handcrafted Quality</h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                Each unit is carefully built by skilled BC artisans – not mass-produced – ensuring exceptional attention to detail.
              </p>
            </div>

            {/* Modern Innovation Card */}
            <div className="reveal-on-scroll reveal-delay-5" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                color: '#BF5813'
              }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                  <path d="M8.5 14.5C9.5 13.5 10.7 13 12 13C13.3 13 14.5 13.5 15.5 14.5" strokeLinecap="round"/>
                  <path d="M5.5 11.5C7.5 9.5 9.7 8.5 12 8.5C14.3 8.5 16.5 9.5 18.5 11.5" strokeLinecap="round"/>
                  <path d="M2.5 8.5C5.5 5.5 8.7 4 12 4C15.3 4 18.5 5.5 21.5 8.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '1rem',
                color: '#333'
              }}>Modern Innovation</h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                WiFi-controlled systems bring convenience to tradition, letting you start your sauna from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Stand For Section - White Background */}
      <section style={{ 
        padding: '100px 0',
        background: 'white'
      }}>
        <div className="ilio-container">
          <h2 className="h2-animate reveal-on-scroll" style={{ 
            textAlign: 'center',
            fontSize: '40px',
            lineHeight: '44px',
            fontWeight: 400,
            marginBottom: '2rem'
          }}>What We Stand For</h2>
          <div className="reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 3rem'
          }}></div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p className="reveal-on-scroll reveal-delay-2" style={{ 
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5a5a5a',
              marginBottom: '1.5rem'
            }}>
              At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. 
              We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, 
              and transparency in everything we do.
            </p>
            <p className="reveal-on-scroll reveal-delay-3" style={{ 
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5a5a5a',
              marginBottom: '1.5rem'
            }}>
              Our commitment extends beyond delivering exceptional saunas. We're dedicated to educating our 
              customers about the profound benefits of heat therapy, supporting sustainable forestry practices, 
              and contributing to the wellness of our communities.
            </p>
            <p className="reveal-on-scroll reveal-delay-4" style={{ 
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5a5a5a'
            }}>
              When you choose Ilio, you're not just investing in a sauna – you're joining a movement that 
              believes wellness should be accessible, sustainable, and transformative for all Canadians.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Off-white Background */}
      <section style={{ 
        padding: '100px 0',
        background: '#f8f8f8',
        textAlign: 'center'
      }}>
        <div className="ilio-container">
          <h2 className="h2-animate reveal-on-scroll" style={{ 
            fontSize: '40px',
            lineHeight: '44px',
            fontWeight: 400,
            marginBottom: '2rem'
          }}>
            Ready to Transform Your Wellness Journey?
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
            Discover how an Ilio sauna can elevate your daily wellness routine
          </p>
          <div className="reveal-on-scroll reveal-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/saunas"
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
              Explore Our Saunas
            </Link>
            <Link 
              href="/contact"
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
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Animation and Mobile-specific styles */}
      <style jsx>{`
        /* Page load animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .built-in-canada-section {
            height: 100vh !important;
            min-height: auto !important;
            position: relative !important;
          }
          
          .built-canada-overlay {
            position: absolute !important;
            width: 85% !important;
            max-width: 400px !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: rgba(0,0,0,0.68) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            padding: 2.5rem !important;
            border-radius: 8px !important;
            z-index: 10;
          }
          
          .built-canada-overlay h2 {
            font-size: 32px !important;
            line-height: 36px !important;
            text-align: center !important;
          }
          
          .built-canada-overlay > div > div:nth-child(2) {
            margin: 1.5rem auto !important;
          }
          
          .built-canada-overlay p {
            font-size: 15px !important;
            text-align: center !important;
          }
          
          /* Adjust slide indicators on mobile */
          .built-in-canada-section > div:last-child {
            bottom: 3rem !important;
            z-index: 20 !important;
          }
        }
        
        @media (max-width: 480px) {
          .built-canada-overlay {
            width: 90% !important;
            padding: 2rem 1.5rem !important;
          }
          
          .built-canada-overlay h2 {
            font-size: 28px !important;
            line-height: 32px !important;
          }
          
          .built-canada-overlay p {
            font-size: 14px !important;
          }
        }
        
        /* Passion for Wellness mobile layout */
        @media (max-width: 768px) {
          .passion-wellness-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .passion-wellness-grid > div:last-child {
            margin-top: 0 !important;
          }
        }
        
        /* All H2s on mobile */
        @media (max-width: 768px) {
          h2 {
            font-size: 32px !important;
            line-height: 36px !important;
          }
        }
        
        @media (max-width: 480px) {
          h2 {
            font-size: 28px !important;
            line-height: 32px !important;
          }
        }
      `}</style>
    </>
  );
}