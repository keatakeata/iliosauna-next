'use client';

// Force dynamic rendering for contact form functionality
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import GHLContactForm from '@/components/GHLContactForm';
import { client } from '../../../sanity/lib/client';
import { contactPageQuery } from '../../../sanity/lib/queries';

interface ContactData {
  heroSection: {
    title: string;
    subtitle: string;
  };
  contactInfo: {
    title: string;
    description: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    businessHours: Array<{
      days: string;
      hours: string;
    }>;
  };
  formSection: {
    title: string;
    description: string;
  };
  ctaSection: {
    title: string;
    phoneText: string;
    phoneNumber: string;
    emailText: string;
    emailAddress: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  serviceAreas: Record<string, {
    subtitle: string;
    cities: string[];
  }>;
}

export default function ContactPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showServiceAreasModal, setShowServiceAreasModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // CODE-FIRST CONTENT ARCHITECTURE
  const codeContent: ContactData = {
    heroSection: {
      title: 'Talk to a BC Sauna Expert',
      subtitle: 'We\'re here to help you create your perfect wellness sanctuary'
    },
    contactInfo: {
      title: 'Call us directly',
      description: 'Professional delivery and installation services across British Columbia, with white-glove service from Victoria to Vancouver.',
      phone: '250-597-1244',
      address: {
        street: '404 – 2471 Sidney Ave',
        city: 'Sidney',
        state: 'BC',
        zip: 'V8L3A6',
        country: 'Canada'
      },
      businessHours: [
        { days: 'Monday - Friday', hours: '9am - 6pm PST' },
        { days: 'Saturday', hours: '10am - 4pm PST' },
        { days: 'Sunday', hours: '12pm - 4pm PST' }
      ]
    },
    formSection: {
      title: 'Send us a message',
      description: 'For urgent inquiries, call us directly.'
    },
    ctaSection: {
      title: 'Ready to Experience Luxury?',
      phoneText: 'Call us directly',
      phoneNumber: '250-597-1244'
    },
    socialMedia: {
      facebook: 'https://www.facebook.com/people/Ilio-sauna/61581939952450/',
      instagram: 'https://www.instagram.com/iliosauna/',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com'
    },
    faqItems: [
      {
        question: 'What makes ilio Saunas different?',
        answer: 'Our saunas combine premium Canadian craftsmanship with Scandinavian design principles. Each unit is built with sustainably sourced materials and features advanced heating technology for optimal wellness benefits.'
      },
      {
        question: 'Do you offer installation services?',
        answer: 'Yes, we provide comprehensive installation services throughout British Columbia. Our certified technicians ensure proper setup, electrical connections, and safety compliance for all installations.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Delivery typically takes 4-6 weeks from order confirmation. We provide tracking and white-glove delivery service throughout British Columbia.'
      }
    ],
    serviceAreas: {
      'Vancouver Island': {
        subtitle: 'Complete island coverage',
        cities: [
          'Victoria', 'Saanich', 'Oak Bay', 'Esquimalt', 'Colwood', 'Langford',
          'View Royal', 'Metchosin', 'Sidney', 'Central Saanich', 'North Saanich', 'Sooke',
          'Nanaimo', 'Courtenay', 'Campbell River', 'Port Alberni', 'Parksville', 'Duncan',
          'Comox', 'Port Hardy', 'Port McNeill', 'Ladysmith', 'Chemainus', 'Cumberland',
          'Lake Cowichan', 'Qualicum Beach'
        ]
      },
      'Metro Vancouver': {
        subtitle: 'Greater Vancouver area',
        cities: [
          'Vancouver', 'Burnaby', 'Surrey', 'Richmond', 'Coquitlam', 'Delta',
          'Langley City', 'Maple Ridge', 'New Westminster', 'North Vancouver', 'Pitt Meadows', 'Port Coquitlam',
          'Port Moody', 'West Vancouver', 'White Rock', 'Tsawwassen', 'Lions Bay', 'Bowen Island',
          'Anmore', 'Belcarra'
        ]
      },
      'Fraser Valley': {
        subtitle: 'Eastern communities',
        cities: [
          'Abbotsford', 'Chilliwack', 'Mission', 'Hope', 'Langley Township', 'Harrison Hot Springs',
          'Agassiz', 'Kent', 'Bridal Falls', 'Popkum', 'Ruby Creek', 'Lake Errock',
          'Rosedale'
        ]
      },
      'Sea to Sky & Beyond': {
        subtitle: 'Coastal & mountain regions',
        cities: [
          'Squamish', 'Whistler', 'Pemberton', 'Gibsons', 'Sechelt', 'Powell River',
          'Salt Spring Island', 'Galiano Island', 'Pender Island', 'Mayne Island', 'Saturna Island'
        ]
      }
    }
  };

  // Fetch CMS overrides (optional)
  useEffect(() => {
    const fetchCmsData = async () => {
      // Skip CMS fetch in development to avoid timeouts
      if (process.env.NODE_ENV === 'development') {
        console.log('Skipping CMS fetch in development');
        return;
      }
      
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const cmsData = await client.fetch(contactPageQuery, {}, {
          signal: controller.signal
        }).catch(() => undefined);
        
        clearTimeout(timeoutId);

        if (cmsData) {
          // Apply CMS overrides to code content
          const mergedData = {
            heroSection: { ...codeContent.heroSection, ...cmsData.heroSection },
            contactInfo: {
              ...codeContent.contactInfo,
              ...cmsData.contactInfo,
              businessHours: cmsData.contactInfo?.businessHours || codeContent.contactInfo.businessHours
            },
            formSection: { ...codeContent.formSection, ...cmsData.formSection },
            ctaSection: { ...codeContent.ctaSection, ...cmsData.ctaSection },
            socialMedia: { ...codeContent.socialMedia, ...cmsData.socialMedia },
            faqItems: codeContent.faqItems, // Keep code FAQ items (complex merge)
            serviceAreas: codeContent.serviceAreas // Keep code service areas (complex merge)
          };

          // Apply merged data (simplified for this implementation)
          // In a full implementation, you'd update state with merged data
        }
      } catch (error) {
        console.error('CMS fetch failed for contact page:', error);
        // Continue with code content only
      }
    };

    fetchCmsData();
  }, []);

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


  const faqItems = [
    {
      question: "What makes ilio Saunas different?",
      answer: "Our saunas combine premium Canadian craftsmanship with Scandinavian design principles. Each unit is built with sustainably sourced materials and features advanced heating technology for optimal wellness benefits."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we provide comprehensive installation services throughout British Columbia. Our certified technicians ensure proper setup, electrical connections, and safety compliance for all installations."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 4-6 weeks from order confirmation. We provide tracking and white-glove delivery service throughout British Columbia."
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
    <div style={{ overflowX: 'hidden', width: '100%' }}>
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
            {/* Left Column - GHL Contact Form */}
            <div style={{
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'all 0.8s ease-out 0.4s'
            }}>
              <GHLContactForm />
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
                    href="tel:250-597-1244"
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
                    250.597.1244
                  </a>
                ) : (
                  // Desktop: Text style
                  <a 
                    href="tel:250-597-1244"
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
                    250.597.1244
                  </a>
                )}
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.8, marginTop: '15px' }}>
                  Monday - Friday: 9am - 6pm PST<br />
                  Saturday: 10am - 4pm PST
                </p>

                {/* Email */}
                <div style={{ marginTop: '20px' }}>
                  {isMobile ? (
                    <a
                      href="mailto:hello@iliosauna.com"
                      style={{
                        display: 'inline-block',
                        fontSize: '1rem',
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
                      hello@iliosauna.com
                    </a>
                  ) : (
                    <a
                      href="mailto:hello@iliosauna.com"
                      style={{
                        fontSize: '1.2rem',
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
                      hello@iliosauna.com
                    </a>
                  )}
                </div>
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
                  ilio Sauna
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.8 }}>
                  404 – 2471 Sidney Ave<br />
                  Sidney, BC V8L3A6<br />
                  Canada
                </p>
              </div>

              {/* Social Media Icons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                <a
                  href="https://www.instagram.com/iliosauna/"
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
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
              opacity: pageLoaded ? 1 : 0,
              transform: pageLoaded ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.8s ease-out 0.7s'
            }}>
              <MapComponent isMobile={isMobile} />
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
                  href="tel:250-597-1244"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Call us at 250.597.1244
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
