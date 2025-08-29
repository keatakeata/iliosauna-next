'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showServiceAreasModal, setShowServiceAreasModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 50);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle modal open/close with body scroll lock
  useEffect(() => {
    if (showServiceAreasModal || showFaqModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showServiceAreasModal, showFaqModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Thank you! We\'ll be in touch soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const faqItems = [
    {
      question: "What makes Ilio Saunas different?",
      answer: "Our saunas combine premium Canadian craftsmanship with Scandinavian design principles. Each unit is built with sustainably sourced materials and features advanced heating technology for optimal wellness benefits."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we provide comprehensive installation services throughout British Columbia. Our certified technicians ensure proper setup, electrical connections, and safety compliance for all installations."
    },
    {
      question: "What is your warranty coverage?",
      answer: "We offer a comprehensive 5-year warranty on all sauna structures, 3-year coverage on heating elements, and lifetime support for maintenance and repairs."
    },
    {
      question: "Can I customize my sauna?",
      answer: "Absolutely! We offer various customization options including size, wood type, heating system, lighting, and additional features like sound systems and chromotherapy."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard models typically ship within 2-3 weeks. Custom orders may take 6-8 weeks depending on specifications. We provide tracking and white-glove delivery service."
    }
  ];

  const serviceAreas = {
    "Vancouver Island": {
      subtitle: "Complete island coverage",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
      cities: [
        "Victoria", "Saanich", "Oak Bay", "Esquimalt", "Colwood", "Langford",
        "View Royal", "Metchosin", "Sidney", "Central Saanich", "North Saanich", "Sooke",
        "Nanaimo", "Courtenay", "Campbell River", "Port Alberni", "Parksville", "Duncan",
        "Comox", "Port Hardy", "Port McNeill", "Ladysmith", "Chemainus", "Cumberland",
        "Lake Cowichan", "Qualicum Beach"
      ]
    },
    "Metro Vancouver": {
      subtitle: "Greater Vancouver area",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
        </svg>
      ),
      cities: [
        "Vancouver", "Burnaby", "Surrey", "Richmond", "Coquitlam", "Delta",
        "Langley City", "Maple Ridge", "New Westminster", "North Vancouver", "Pitt Meadows", "Port Coquitlam",
        "Port Moody", "West Vancouver", "White Rock", "Tsawwassen", "Lions Bay", "Bowen Island",
        "Anmore", "Belcarra"
      ]
    },
    "Fraser Valley": {
      subtitle: "Eastern communities",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
        </svg>
      ),
      cities: [
        "Abbotsford", "Chilliwack", "Mission", "Hope", "Langley Township", "Harrison Hot Springs",
        "Agassiz", "Kent", "Bridal Falls", "Popkum", "Ruby Creek", "Lake Errock",
        "Rosedale"
      ]
    },
    "Sea to Sky & Beyond": {
      subtitle: "Coastal & mountain regions",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.5 10.5L2 22l1.5-1.5L5 14l2 3 2.5-5 4 8 1.5-1.5L12 10l2 3 3.5-7L22 22l-3.5-11.5L14 6l-2 3-2.5-5z"/>
        </svg>
      ),
      cities: [
        "Squamish", "Whistler", "Pemberton", "Gibsons", "Sechelt", "Powell River",
        "Salt Spring Island", "Galiano Island", "Pender Island", "Mayne Island", "Saturna Island"
      ]
    }
  };

  return (
    <>
      <Navbar animated={true} forceScrolled={true} />
      
      {/* Hero Section with Header */}
      <section style={{ 
        paddingTop: 'calc(var(--navbar-height) + 60px)',
        paddingBottom: '60px',
        background: '#fff'
      }}>
        <div className="ilio-container">
          {/* Header with Divider */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              color: '#1a1a1a',
              marginBottom: '20px',
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out'
            }}>
              Talk to a BC Sauna Expert
            </h1>
            
            {/* Divider - 50% width and gray */}
            <div style={{
              width: '50%',
              height: '1px',
              background: '#e0e0e0',
              margin: '0 auto 20px',
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'all 0.8s ease-out 0.2s'
            }} />
            
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              fontWeight: 300,
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease-out 0.3s'
            }}>
              We&apos;re here to help you create your perfect wellness sanctuary
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {/* Left Column - Form with Card Background */}
            <div style={{
              background: '#F9FAFB',
              padding: '40px',
              borderRadius: '12px',
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'all 0.8s ease-out 0.4s'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: '#333'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: '#333'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: '#333'
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      background: 'white',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    color: '#333'
                  }}>
                    Message
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      background: 'white',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    padding: '14px 40px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(191, 88, 19, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div style={{
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.8s ease-out 0.5s'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '15px', // Reduced spacing
                fontWeight: 400,
                color: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Call us directly
              </h2>

              <div style={{ marginBottom: '40px' }}>
                {isMobile ? (
                  // Mobile: Button style
                  <a 
                    href="tel:604-555-0100"
                    style={{ 
                      display: 'inline-block',
                      fontSize: '1.2rem', 
                      fontWeight: 300, 
                      color: 'var(--color-primary)',
                      background: 'transparent',
                      border: '1.5px solid var(--color-primary)',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                  >
                    604.555.0100
                  </a>
                ) : (
                  // Desktop: Text style
                  <a 
                    href="tel:604-555-0100"
                    style={{ 
                      fontSize: '1.8rem', 
                      fontWeight: 300, 
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#333';
                    }}
                  >
                    604.555.0100
                  </a>
                )}
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.8, marginTop: '15px' }}>
                  Monday - Friday: 9am - 6pm PST<br />
                  Saturday: 10am - 4pm PST<br />
                  <span style={{ color: '#888' }}>Text inquiries welcome</span>
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '15px', 
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#333'
                }}>
                  Ilio Sauna
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.8 }}>
                  Sidney, Vancouver Island<br />
                  British Columbia<br />
                  Canada<br />
                  <span style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                    Premium craftsmanship since 2024
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '15px', 
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#333'
                }}>
                  Email Us
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '5px' }}>
                  General Inquiries
                </p>
                <a 
                  href="mailto:info@ilioluxurysaunas.com" 
                  style={{ 
                    fontSize: '0.95rem', 
                    color: 'var(--color-primary)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  info@ilioluxurysaunas.com
                </a>
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px' }}>
                  We respond within 1 business day
                </p>
              </div>

              {/* Social Media Icons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a 
                  href="https://pinterest.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label="Pinterest"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>

                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section with Service Areas and FAQ Cards */}
      <section style={{
        paddingTop: '60px',
        paddingBottom: '60px',
        background: '#f8f8f8'
      }}>
        <div className="ilio-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Map */}
            <div style={{
              width: '100%',
              height: isMobile ? '350px' : '500px',
              background: '#e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.8s ease-out 0.7s'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83087.17839730281!2d-123.47822699475775!3d48.65072144033474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548f738bddb06171%3A0x38e8f3741ebb48ed!2sSidney%2C%20BC%2C%20Canada!5e0!3m2!1sen!2sus!4v1635959062001!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Right Side Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Service Areas Card */}
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                opacity: pageLoaded ? 1 : 0,
                transform: pageLoaded ? 'translateX(0)' : 'translateX(30px)',
                transition: 'all 0.8s ease-out 0.8s'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '25px',
                  fontWeight: 300,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#1a1a1a'
                }}>
                  Service Areas
                </h3>

                <div style={{ marginBottom: '25px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: 'var(--color-primary)', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} />
                      <strong style={{ fontSize: '0.95rem', color: '#333' }}>Vancouver Island</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginLeft: '16px' }}>
                      Victoria to Campbell River
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: 'var(--color-primary)', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} />
                      <strong style={{ fontSize: '0.95rem', color: '#333' }}>Lower Mainland</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginLeft: '16px' }}>
                      Metro Vancouver & Fraser Valley
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: 'var(--color-primary)', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} />
                      <strong style={{ fontSize: '0.95rem', color: '#333' }}>Sea to Sky</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginLeft: '16px' }}>
                      Squamish to Whistler
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: 'var(--color-primary)', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} />
                      <strong style={{ fontSize: '0.95rem', color: '#333' }}>Sunshine Coast</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginLeft: '16px' }}>
                      Gibsons to Powell River
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: 'var(--color-primary)', 
                        borderRadius: '50%',
                        marginRight: '10px'
                      }} />
                      <strong style={{ fontSize: '0.95rem', color: '#333' }}>Gulf Islands</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginLeft: '16px' }}>
                      Salt Spring to Galiano
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowServiceAreasModal(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  View all service areas in detail
                  <span style={{ marginLeft: '8px' }}>→</span>
                </button>

                <p style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: '15px'
                }}>
                  Remote locations? Contact us for custom delivery solutions.
                </p>
              </div>

              {/* FAQ Link Button */}
              <button
                onClick={() => setShowFaqModal(true)}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid var(--color-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: pageLoaded ? 1 : 0,
                  transform: pageLoaded ? 'translateX(0)' : 'translateX(30px)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(191, 88, 19, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
                }}
              >
                Find instant answers in our FAQ →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Modal */}
      {showServiceAreasModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setShowServiceAreasModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '50px',
              position: 'relative',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowServiceAreasModal(false)}
              style={{
                position: 'absolute',
                top: '25px',
                right: '25px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '2.2rem',
                marginBottom: '10px',
                fontWeight: 300,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#1a1a1a'
              }}>
                Our Service Areas
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                fontWeight: 300
              }}>
                Professional delivery and installation across British Columbia
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}>
              {Object.entries(serviceAreas).map(([region, data]) => (
                <div key={region}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '2px solid var(--color-primary)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      marginRight: '15px',
                      color: 'var(--color-primary)'
                    }}>
                      {data.icon}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        color: '#1a1a1a',
                        marginBottom: '3px'
                      }}>
                        {region}
                      </h3>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#888',
                        fontStyle: 'italic'
                      }}>
                        {data.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '10px'
                  }}>
                    {data.cities.map((city) => (
                      <div
                        key={city}
                        style={{
                          padding: '10px 15px',
                          background: '#f8f8f8',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          color: '#555',
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#333';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.background = '#f8f8f8';
                          e.currentTarget.style.color = '#555';
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '50px',
              padding: '25px',
              background: '#f8f8f8',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '10px' }}>
                <strong>Delivery & Installation Throughout BC</strong>
              </p>
              <p style={{ fontSize: '0.95rem', color: '#666' }}>
                We provide professional delivery and installation services across British Columbia.
                Contact us for custom quotes to your specific location.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setShowFaqModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '40px',
              position: 'relative',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFaqModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '2rem',
              marginBottom: '30px',
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {faqItems.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      background: expandedFaq === index ? '#f8f8f8' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: '#333',
                      textAlign: 'left'
                    }}>
                      {item.question}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      color: 'var(--color-primary)',
                      transform: expandedFaq === index ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease'
                    }}>
                      +
                    </span>
                  </button>
                  
                  {expandedFaq === index && (
                    <div style={{
                      padding: '0 20px 20px',
                      background: '#f8f8f8'
                    }}>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#666',
                        lineHeight: 1.8
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '30px',
              textAlign: 'center',
              padding: '20px',
              background: '#f8f8f8',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#666' }}>
                Still have questions? <br />
                <a 
                  href="tel:604-555-0100"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Call us at 604.555.0100
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}