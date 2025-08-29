'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Subscribing...');
    
    // Here you would integrate with your newsletter service
    // For now, we'll just simulate it
    setTimeout(() => {
      setStatus('Thank you for subscribing!');
      setEmail('');
    }, 1000);
  };

  return (
    <section id="newsletter" className="ilio-section ilio-section-full" style={{ 
      background: '#000', 
      position: 'relative' 
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('https://storage.googleapis.com/msgsndr/gvNdFRn3rXgtEuSNkLL9/media/6857ea424e7e8100371d54fc.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.65,
      }} />
      
      <div className="ilio-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ color: 'white', marginBottom: '2rem' }}>
            They grow up so fast
          </h2>
          <div className="section-divider divider-white reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
            margin: '0 auto 2rem'
          }}></div>
          <p className="section-text reveal-on-scroll reveal-delay-2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '3rem' }}>
            Don't miss a thing. Sign up to receive updates about new products, wellness insights, 
            and exclusive offers from Ilio.
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontFamily: 'var(--font-primary)',
                transition: 'all 0.3s ease',
              }}
            />
            <button type="submit" className="btn-hero" style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}>
              Subscribe
            </button>
          </form>
          {status && (
            <p style={{ color: 'white', marginTop: '1rem', fontSize: '0.9rem' }}>
              {status}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}