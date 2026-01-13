'use client';

import React, { useState } from "react";
import Link from "next/link";
import LegalModal from "./LegalModal";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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
                alt="ilio Sauna"
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
                href="https://www.facebook.com/people/ilio-sauna/61581939952450/"
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
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className="footer-link"
            style={{
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '0.75rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            Terms of Service
          </button>
          <p className="footer-copyright" style={{
            margin: 0,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.75rem'
          }}>
            © {new Date().getFullYear()} ilio Sauna. All rights reserved.
          </p>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="footer-link"
            style={{
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '0.75rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            Privacy Policy
          </button>
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

            /* Quick Links - Center aligned */
            .footer-grid > div:nth-child(2) {
              grid-area: quicklinks;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(2) h4 {
              font-size: 0.75rem !important;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(2) nav {
              align-items: center !important;
            }
            .footer-grid > div:nth-child(2) a {
              font-size: 0.75rem !important;
            }

            /* Connect - Center aligned */
            .footer-grid > div:nth-child(3) {
              grid-area: connect;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(3) h4 {
              font-size: 0.75rem !important;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(3) > div {
              align-items: center !important;
            }
            .footer-grid > div:nth-child(3) a {
              font-size: 0.75rem !important;
            }
            .footer-grid > div:nth-child(3) svg {
              display: none !important;
            }

            /* Location - Center aligned */
            .footer-grid > div:nth-child(4) {
              grid-area: location;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(4) h4 {
              font-size: 0.75rem !important;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(4) > div {
              justify-content: center !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            .footer-grid > div:nth-child(4) span {
              font-size: 0.75rem !important;
              text-align: center !important;
            }
            .footer-grid > div:nth-child(4) svg {
              display: none !important;
            }

            .footer-grid > div:nth-child(5) {
              grid-area: newsletter;
            }
          }
        `}</style>
      </div>

      {/* Terms of Service Modal */}
      <LegalModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms of Service"
        content={
          <div>
            <h3 style={{ color: '#BF5813', marginTop: '0', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              OVERVIEW
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              This website is operated by Tone wellness Ltd. (DBA ilio sauna) Throughout the site, the terms "we", "us" and "our" refer to by Tone wellness Ltd. by Tone wellness Ltd offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Our store is provided by Stripe. They provide us with the online e-commerce platform that allows us to sell our products and services to you.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 1 - ONLINE STORE TERMS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You must not transmit any worms or viruses or any code of a destructive nature.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              A breach or violation of any of the Terms will result in an immediate termination of your Services.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 2 - GENERAL CONDITIONS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right to refuse service to anyone for any reason at any time.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Prices for our products are subject to change without notice.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 5 - PRODUCTS OR SERVICES (if applicable)
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 7 - OPTIONAL TOOLS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We may also, in the future, offer new services and/or features through the website (including, the release of new tools and resources). Such new features and/or services shall also be subject to these Terms of Service.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 8 - THIRD-PARTY LINKS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 10 - PERSONAL INFORMATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Your submission of personal information through the store is governed by our Privacy Policy. To view our Privacy Policy.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 12 - PROHIBITED USES
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              In no case shall by Tone wellness Ltd, (ilio sauna) our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content (or product) posted, transmitted, or otherwise made available via the service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 14 - INDEMNIFICATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              You agree to indemnify, defend and hold harmless by Tone wellness Ltd (ilio sauna) and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 15 - SEVERABILITY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 16 - TERMINATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 17 - ENTIRE AGREEMENT
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 18 - GOVERNING LAW
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of British Columbia CA
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 19 - CHANGES TO TERMS OF SERVICE
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              You can review the most current version of the Terms of Service at any time at this page.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 20 - CONTACT INFORMATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Questions about the Terms of Service should be sent to us at <a href="mailto:info@iliosauna.com" style={{ color: '#BF5813', textDecoration: 'none' }}>info@iliosauna.com</a>
            </p>
          </div>
        }
      />

      {/* Privacy Policy Modal */}
      <LegalModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Privacy Policy"
        content={
          <div>
            <h3 style={{ color: '#BF5813', marginTop: '0', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              When you purchase something from our store, as part of the buying and selling process, we collect the personal
              information you give us such as your name, address and email address.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              When you browse our store, we also automatically receive your computer's internet protocol (IP) address in order
              to provide us with information that helps us learn about your browser and operating system.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Email marketing (if applicable): With your permission, we may send you emails about our store, new products and other updates.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 2 - CONSENT
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#2d2d2d' }}>How do you get my consent?</strong>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange
              for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your
              expressed consent, or provide you with an opportunity to say no.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#2d2d2d' }}>How do I withdraw my consent?</strong>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection,
              use or disclosure of your information, at anytime, by contacting us at <a href="mailto:info@iliosauna.com" style={{ color: '#BF5813', textDecoration: 'none' }}>info@iliosauna.com</a>
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 3 - DISCLOSURE
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 4 - STRIPE
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Our store is hosted on Stripe. They provide us with the online e-commerce platform that allows us to sell our products
              and services to you.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Your data is stored through Stripe's data storage, databases and the general Stripe application. They store your data on
              a secure server behind a firewall.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#2d2d2d' }}>Payment:</strong>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If you choose a direct payment gateway to complete your purchase, then Stripe stores your credit card data. It is encrypted
              through the Payment Card Industry Data Security Standard (PCI-DSS). Your purchase transaction data is stored only as long as
              is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is deleted.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              All direct payment gateways adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is
              a joint effort of brands like Visa, MasterCard, American Express and Discover.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              For more insight, you may also want to read Stripe's Terms of Service{' '}
              <a href="https://stripe.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#BF5813', textDecoration: 'none' }}>
                (https://stripe.com/terms)
              </a>{' '}
              or Privacy Statement{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#BF5813', textDecoration: 'none' }}>
                (https://stripe.com/privacy)
              </a>.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 5 - THIRD-PARTY SERVICES
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              In general, the third-party providers used by us will only collect, use and disclose your information to the extent
              necessary to allow them to perform the services they provide to us.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              However, certain third-party service providers, such as payment gateways and other payment transaction processors, have
              their own privacy policies in respect to the information we are required to provide to them for your purchase-related
              transactions.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              For these providers, we recommend that you read their privacy policies so you can understand the manner in which your
              personal information will be handled by these providers.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              In particular, remember that certain providers may be located in or have facilities that are located in a different
              jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a
              third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which
              that service provider or its facilities are located.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              As an example, if you are located in Canada and your transaction is processed by a payment gateway located in the
              United States, then your personal information used in completing that transaction may be subject to disclosure under
              United States legislation, including the Patriot Act.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Once you leave our store's website or are redirected to a third-party website or application, you are no longer governed
              by this Privacy Policy or our website's Terms of Service.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#2d2d2d' }}>Links</strong>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy
              practices of other sites and encourage you to read their privacy statements.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 6 - SECURITY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              To protect your personal information, we take reasonable precautions and follow industry best practices to make sure
              it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If you provide us with your credit card information, the information is encrypted using secure socket layer technology
              (SSL) and stored with a AES-256 encryption. Although no method of transmission over the Internet or electronic storage
              is 100% secure, we follow all PCI-DSS requirements and implement additional generally accepted industry standards.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 7 - COOKIES
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Stripe uses cookies to enable Stripe to hold session information. Stripe uses cookies for fraud prevention systems, and
              for the proper operation of the website and platform. Session cookies expire within 24 hours of your session ending.
              Persistent cookies remain on your device for much longer or until you delete them.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 8 - AGE OF CONSENT
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              By using this site, you represent that you are at least the age of majority in your state or province of residence,
              or that you are the age of majority in your state or province of residence and you have given us your consent to allow
              any of your minor dependents to use this site.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              SECTION 9 - CHANGES TO THIS PRIVACY POLICY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications
              will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify
              you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what
              circumstances, if any, we use and/or disclose it.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              If our store is acquired or merged with another company, your information may be transferred to the new owners so that
              we may continue to sell products to you.
            </p>

            <h3 style={{ color: '#BF5813', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              QUESTIONS AND CONTACT INFORMATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint,
              or simply want more information contact our Privacy Compliance Officer at{' '}
              <a href="mailto:info@iliosauna.com" style={{ color: '#BF5813', textDecoration: 'none' }}>info@iliosauna.com</a>
            </p>
          </div>
        }
      />
    </footer>
  );
}
