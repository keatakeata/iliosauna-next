'use client';

import { useState } from 'react';
import { sanityImageUrl } from '@/lib/sanity.config';

interface NewsletterSectionProps {
  homepageData?: {
    newsletterSection?: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      backgroundImageFile?: any;
      backgroundImageUrl?: string;
    };
  };
}

export default function NewsletterSection({ homepageData }: NewsletterSectionProps) {
  const newsletterData = homepageData?.newsletterSection;
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
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setEmail('');
        // Auto-clear success message after 5 seconds
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        console.error('Newsletter signup failed:', result.message);
        // Auto-clear error message after 5 seconds
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      // Auto-clear error message after 5 seconds
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="ilio-section ilio-section-full" style={{ 
      background: '#000', 
      position: 'relative' 
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('${newsletterData?.backgroundImageUrl || (newsletterData?.backgroundImageFile ? sanityImageUrl(newsletterData.backgroundImageFile.asset._ref, 1200) : 'https://storage.googleapis.com/msgsndr/gvNdFRn3rXgtEuSNkLL9/media/6857ea424e7e8100371d54fc.jpeg')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.65,
      }} />
      
      <div className="ilio-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ color: 'white', marginBottom: '2rem' }}>
            {newsletterData?.title || 'Join the Exclusive Wellness Circle'}
          </h2>
          <div className="section-divider divider-white reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
            margin: '0 auto 2rem'
          }}></div>
          <p className="section-text reveal-on-scroll reveal-delay-2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '3rem' }}>
            {newsletterData?.subtitle || "Don't miss a thing. Sign up to receive updates about new products, wellness insights, and exclusive offers from Ilio."}
          </p>
          
          <form 
            id="newsletter-form" 
            onSubmit={handleSubmit}
            className="reveal-on-scroll reveal-delay-3" 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              maxWidth: '500px', 
              margin: '0 auto', 
              flexWrap: 'wrap' 
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                background: isSubmitting ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'var(--font-primary)',
                transition: 'all 0.3s ease',
                cursor: isSubmitting ? 'not-allowed' : 'text',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            />
            <button
              type="submit"
              className="btn-hero"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 2rem',
                background: isSubmitting ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? 'Subscribing...' : (newsletterData?.buttonText || 'Subscribe')}
            </button>
          </form>
          {status && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.5rem',
              background: status === 'processing' ? 'rgba(255, 255, 255, 0.1)' :
                         status === 'error' ? 'rgba(255, 107, 107, 0.05)' : 'rgba(255, 255, 255, 0.05)',
              border: status === 'error' ? '1px solid rgba(255, 107, 107, 0.4)' : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              maxWidth: '400px',
              margin: '1.5rem auto 0',
              fontFamily: 'var(--font-primary)',
              fontSize: status === 'success' ? '1.1rem' : '1rem',
              fontWeight: status === 'success' ? '600' : '500',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              {status === 'processing' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Processing your subscription...
                </div>
              )}
              {status === 'success' && (
                <div style={{
                  color: 'white',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  ✓ Thank you for subscribing!
                </div>
              )}
              {status === 'error' && (
                <div style={{
                  color: '#ff6b6b',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  ⚠ Something went wrong. Please try again or contact us directly.
                </div>
              )}
            </div>
          )}

          {/* Add CSS animations for the loading spinner */}
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
