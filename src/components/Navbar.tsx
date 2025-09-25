'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export default function Navbar({ animated = false, forceScrolled = false }: { animated?: boolean; forceScrolled?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(!animated);
  const scrollPositionRef = useRef(0);
  const { totalItems, openCart } = useCart();
  
  const whiteLogo = '/ilio-logo-light.svg';
  const blackLogo = '/ilio-logo-dark.svg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(forceScrolled || window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceScrolled]);

  useEffect(() => {
    if (animated) {
      setTimeout(() => setShowNavbar(true), 100);
    }
  }, [animated]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position to ref
      scrollPositionRef.current = window.scrollY;
      
      // Get scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply scroll lock with position fixed to prevent any scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      // Prevent iOS bounce
      document.documentElement.style.overflow = 'hidden';
    } else if (scrollPositionRef.current >= 0) {
      // Get the saved position before removing styles
      const savedPosition = scrollPositionRef.current;
      
      // Remove all scroll lock styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position instantly without animation
      window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      });
    }
    
    return () => {
      // Cleanup all styles on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        id="main-navigation" 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          boxShadow: isScrolled ? '0 1px 20px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="ilio-container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Mobile Hamburger (left on mobile) */}
          <button 
            className="mobile-only hamburger-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              zIndex: 'auto',
              position: 'relative',
              marginLeft: '-10px', // Align better to the left edge
            }}
          >
            <div id="hamburger-lines" style={{ width: '25px', height: '20px', position: 'relative' }}>
              <span style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: isScrolled ? '#374151' : 'white',
                top: isMobileMenuOpen ? '50%' : 0,
                transform: isMobileMenuOpen ? 'translateY(-50%) rotate(45deg)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                transformOrigin: 'center'
              }}></span>
              <span style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: isScrolled ? '#374151' : 'white',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                opacity: isMobileMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: isScrolled ? '#374151' : 'white',
                bottom: isMobileMenuOpen ? '50%' : 0,
                transform: isMobileMenuOpen ? 'translateY(50%) rotate(-45deg)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                transformOrigin: 'center'
              }}></span>
            </div>
          </button>
          
          {/* Logo (centered on mobile) */}
          <Link href="/" className="navbar-logo" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            zIndex: 'auto',
            position: 'relative',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={isScrolled ? blackLogo : whiteLogo} 
              alt="Ilio Sauna - Premium Cedar Saunas Vancouver Island BC" 
              style={{ 
                height: '38.5px',
                width: 'auto',
                transition: 'all 0.3s ease'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/our-story" className="nav-link" style={{
              color: isScrolled ? '#374151' : 'white',
              textDecoration: 'none',
              fontWeight: 300,
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              fontSize: '0.9625rem',
            }}>
              Our story
            </Link>
            <Link href="/saunas" className="nav-link" style={{
              color: isScrolled ? '#374151' : 'white',
              textDecoration: 'none',
              fontWeight: 300,
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              fontSize: '0.9625rem',
            }}>
              Saunas
            </Link>
            <Link href="/blog" className="nav-link" style={{
              color: isScrolled ? '#374151' : 'white',
              textDecoration: 'none',
              fontWeight: 300,
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              fontSize: '0.9625rem',
            }}>
              Journal
            </Link>
            <Link href="/contact" className="nav-link" style={{
              color: isScrolled ? '#374151' : 'white',
              textDecoration: 'none',
              fontWeight: 300,
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              fontSize: '0.9625rem',
            }}>
              Contact
            </Link>
            
            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              background: isScrolled ? '#e5e7eb' : 'rgba(255,255,255,0.3)',
              margin: '0 0.75rem',
            }}></div>
            
            {/* Cart Icon - CONTROLLED BY FEATURE FLAG */}
            {FEATURE_FLAGS.SHOW_CART && (
              <button 
                className="nav-cart-button" 
                onClick={openCart}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem',
                  position: 'relative'
                }}
                aria-label="Shopping Cart"
              >
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transition: 'stroke 0.3s ease'
                }}
              >
                <g clipPath="url(#clip0_1655_15551)">
                  <path 
                    d="M1.66699 1.66675H2.75546C2.96048 1.66675 3.06299 1.66675 3.14548 1.70445C3.21817 1.73767 3.27978 1.7911 3.32295 1.85837C3.37194 1.9347 3.38644 2.03618 3.41543 2.23913L3.80985 5.00008M3.80985 5.00008L4.68643 11.4429C4.79766 12.2605 4.85328 12.6693 5.04874 12.977C5.22097 13.2482 5.46789 13.4638 5.75979 13.5979C6.09104 13.7501 6.50361 13.7501 7.32875 13.7501H14.4603C15.2458 13.7501 15.6385 13.7501 15.9595 13.6088C16.2424 13.4842 16.4852 13.2833 16.6606 13.0286C16.8594 12.7398 16.9329 12.354 17.0799 11.5824L18.1829 5.79149C18.2346 5.51992 18.2605 5.38414 18.223 5.278C18.1901 5.18489 18.1253 5.10649 18.0399 5.05676C17.9427 5.00008 17.8045 5.00008 17.528 5.00008H3.80985ZM8.33366 17.5001C8.33366 17.9603 7.96056 18.3334 7.50033 18.3334C7.04009 18.3334 6.66699 17.9603 6.66699 17.5001C6.66699 17.0398 7.04009 16.6667 7.50033 16.6667C7.96056 16.6667 8.33366 17.0398 8.33366 17.5001ZM15.0003 17.5001C15.0003 17.9603 14.6272 18.3334 14.167 18.3334C13.7068 18.3334 13.3337 17.9603 13.3337 17.5001C13.3337 17.0398 13.7068 16.6667 14.167 16.6667C14.6272 16.6667 15.0003 17.0398 15.0003 17.5001Z" 
                    strokeWidth="1.66667" 
                    stroke={isScrolled ? '#374151' : 'white'}
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1655_15551">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: '#BF5813',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {totalItems}
                </span>
              )}
            </button>
            )}
            
            {/* Auth Section - CONTROLLED BY FEATURE FLAG */}
            {FEATURE_FLAGS.SHOW_AUTH && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginLeft: '0.5rem'
              }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{
                    background: 'transparent',
                    border: `1px solid ${isScrolled ? '#374151' : 'white'}`,
                    color: isScrolled ? '#374151' : 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 400
                  }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{
                    background: '#BF5813',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 500
                  }}>
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: '32px',
                        height: '32px'
                      }
                    }
                  }}
                />
              </SignedIn>
            </div>
            )}
          </div>
          
          {/* Mobile Spacer or Cart Icon (right on mobile) */}
          {FEATURE_FLAGS.SHOW_CART ? (
            <button 
              className="mobile-only mobile-cart-button" 
            onClick={openCart}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              position: 'relative'
            }}
            aria-label="Shopping Cart"
          >
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transition: 'stroke 0.3s ease'
              }}
            >
              <g clipPath="url(#clip0_mobile_cart)">
                <path 
                  d="M1.66699 1.66675H2.75546C2.96048 1.66675 3.06299 1.66675 3.14548 1.70445C3.21817 1.73767 3.27978 1.7911 3.32295 1.85837C3.37194 1.9347 3.38644 2.03618 3.41543 2.23913L3.80985 5.00008M3.80985 5.00008L4.68643 11.4429C4.79766 12.2605 4.85328 12.6693 5.04874 12.977C5.22097 13.2482 5.46789 13.4638 5.75979 13.5979C6.09104 13.7501 6.50361 13.7501 7.32875 13.7501H14.4603C15.2458 13.7501 15.6385 13.7501 15.9595 13.6088C16.2424 13.4842 16.4852 13.2833 16.6606 13.0286C16.8594 12.7398 16.9329 12.354 17.0799 11.5824L18.1829 5.79149C18.2346 5.51992 18.2605 5.38414 18.223 5.278C18.1901 5.18489 18.1253 5.10649 18.0399 5.05676C17.9427 5.00008 17.8045 5.00008 17.528 5.00008H3.80985ZM8.33366 17.5001C8.33366 17.9603 7.96056 18.3334 7.50033 18.3334C7.04009 18.3334 6.66699 17.9603 6.66699 17.5001C6.66699 17.0398 7.04009 16.6667 7.50033 16.6667C7.96056 16.6667 8.33366 17.0398 8.33366 17.5001ZM15.0003 17.5001C15.0003 17.9603 14.6272 18.3334 14.167 18.3334C13.7068 18.3334 13.3337 17.9603 13.3337 17.5001C13.3337 17.0398 13.7068 16.6667 14.167 16.6667C14.6272 16.6667 15.0003 17.0398 15.0003 17.5001Z" 
                  strokeWidth="1.66667" 
                  stroke={isScrolled ? '#374151' : 'white'}
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_mobile_cart">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#BF5813',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {totalItems}
              </span>
            )}
          </button>
          ) : (
            <div 
              className="mobile-only" 
              style={{ 
                display: 'none',
                width: '40px', 
                height: '40px' 
              }} 
            />
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            zIndex: 9999,
            animation: 'slideIn 0.5s cubic-bezier(0.77, 0, 0.175, 1)',
          }}
          onClick={(e) => {
            // Close menu when clicking on the black background
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '25px',
              right: '25px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              zIndex: 10000,
            }}
            aria-label="Close menu"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Link href="/our-story" onClick={() => setIsMobileMenuOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
            transition: 'opacity 0.3s ease',
            opacity: 0.9,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
            Our story
          </Link>
          <Link href="/saunas" onClick={() => setIsMobileMenuOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
            transition: 'opacity 0.3s ease',
            opacity: 0.9,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
            Saunas
          </Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
            transition: 'opacity 0.3s ease',
            opacity: 0.9,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
            Journal
          </Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
            transition: 'opacity 0.3s ease',
            opacity: 0.9,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
            Contact
          </Link>
          
          {/* Divider and Slogan */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '2rem',
            marginTop: '1rem',
            width: '200px',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem',
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Live well
            </p>
          </div>
          
          {/* Mobile Auth Section - CONTROLLED BY FEATURE FLAG */}
          {FEATURE_FLAGS.SHOW_AUTH && (
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '2.5rem',
            marginTop: '2rem',
            display: 'flex',
            gap: '1.25rem',
            flexDirection: 'column',
            width: '280px'
          }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 300,
                  width: '100%',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.background = 'transparent';
                }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  background: '#BF5813',
                  border: 'none',
                  color: 'white',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 400,
                  width: '100%',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#A04810';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#BF5813';
                }}>
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: 'white', fontSize: '0.9rem', opacity: 0.8 }}>Account</span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: '40px',
                        height: '40px'
                      }
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @media (max-width: 924px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
            align-items: center;
          }
          .navbar-logo {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
          .ilio-container {
            position: relative;
          }
        }
      `}</style>
    </>
  );
}