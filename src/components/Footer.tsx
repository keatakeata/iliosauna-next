'use client';

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('processing');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        console.error('Newsletter signup failed:', result.message);
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer style={{
      background: 'var(--color-footer-bg)',
      padding: '3rem 0 2rem'
    }}>
      <div className="ilio-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Main Footer Content - All in one row */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 0.8fr 0.9fr 0.9fr 1.4fr',
          gap: '1.5rem',
          marginBottom: '2rem',
          alignItems: 'start'
        }}>
          {/* Logo and Description */}
          <div style={{ maxWidth: '250px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img
                src="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68d4d30e2c411b8548d5682c.svg"
                alt="Ilio Sauna"
                style={{
                  height: '32px',
                  marginBottom: '0.75rem'
                }}
              />
            </Link>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              Contemporary luxury saunas crafted with Scandinavian design principles. Expertly crafted on Vancouver Island British Columbia, Canada.
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://www.instagram.com/iliosauna/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  color: 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#BF5813';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/people/Ilio-sauna/61581939952450/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  color: 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#BF5813';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Facebook"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              QUICK LINKS
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link
                href="/our-story"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Our Story
              </Link>
              <Link
                href="/saunas"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Saunas
              </Link>
              <Link
                href="/contact"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div style={{ maxWidth: '200px' }}>
            <h4 style={{
              color: 'white',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              CONNECT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href="mailto:hello@iliosauna.com"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                hello@iliosauna.com
              </a>
              <a
                href="tel:+12505971244"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                (250) 597-1244
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              LOCATION
            </h4>
            <div style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.4rem',
              lineHeight: '1.5'
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>
                404 – 2471 Sidney Ave<br />
                Sidney, BC V8L3A6
              </span>
            </div>
          </div>

          {/* Newsletter - Compact */}
          <div style={{ maxWidth: '280px' }}>
            <h4 style={{
              color: 'white',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              NEWSLETTER
            </h4>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              marginBottom: '0.75rem',
              lineHeight: '1.4'
            }}>
              Sign up to receive updates
            </p>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '0.5rem 0.65rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  background: isSubmitting ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s ease',
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.5rem 1.2rem',
                  background: isSubmitting ? 'rgba(191, 88, 19, 0.5)' : '#BF5813',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = '#A04810';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = '#BF5813';
                }}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: status === 'processing' ? 'rgba(255, 255, 255, 0.1)' :
                           status === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(191, 88, 19, 0.1)',
                border: status === 'error' ? '1px solid rgba(255, 107, 107, 0.4)' : '1px solid rgba(191, 88, 19, 0.4)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: status === 'error' ? '#ff6b6b' : 'white',
                textAlign: 'center'
              }}>
                {status === 'processing' && 'Processing...'}
                {status === 'success' && '✓ Subscribed!'}
                {status === 'error' && '⚠ Try again'}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom" style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)'
        }}>
          <Link
            href="/terms"
            className="footer-link"
            style={{
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            Terms & Conditions
          </Link>
          <p className="footer-copyright" style={{
            margin: 0,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.75rem'
          }}>
            © {new Date().getFullYear()} Ilio Sauna. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="footer-link"
            style={{
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Mobile Responsive Styles */}
        <style jsx>{`
          @media (max-width: 900px) {
            .footer-grid {
              grid-template-columns: 0.8fr 1.4fr 0.8fr !important;
              gap: 2rem 0.5rem !important;
              grid-template-areas:
                "logo logo newsletter"
                "quicklinks location connect" !important;
            }
            .footer-grid > div:nth-child(1) {
              grid-area: logo;
              max-width: 100% !important;
            }
            .footer-grid > div:nth-child(2) {
              grid-area: quicklinks;
            }
            .footer-grid > div:nth-child(2) h4,
            .footer-grid > div:nth-child(2) a {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(3) {
              grid-area: connect;
            }
            .footer-grid > div:nth-child(3) h4 {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(3) a {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(4) {
              grid-area: location;
            }
            .footer-grid > div:nth-child(4) h4 {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(4) span {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(5) {
              grid-area: newsletter;
            }
          }
        `}</style>
      </div>
    </footer>
  );
}
