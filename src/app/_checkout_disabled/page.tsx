'use client';

// Force dynamic rendering for checkout page (uses Clerk auth)
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState('contact');
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showMobileOrder, setShowMobileOrder] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle body scroll lock when mobile order summary is open
  useEffect(() => {
    if (showMobileOrder && isMobile) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [showMobileOrder, isMobile]);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    province: 'BC',
    postalCode: '',
  });

  // Check cart (allow guest checkout)
  useEffect(() => {
    if (!isLoaded) return;

    // Redirect to saunas if cart is empty
    if (items.length === 0) {
      router.push('/saunas');
    }
  }, [items, router, isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Auto-format postal code
    if (name === 'postalCode') {
      value = value.toUpperCase().replace(/\s/g, '');
      if (value.length > 3) {
        value = value.slice(0, 3) + ' ' + value.slice(3, 6);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) errors.email = 'Required';
    if (!formData.phone) errors.phone = 'Required';
    if (!formData.firstName) errors.firstName = 'Required';
    if (!formData.lastName) errors.lastName = 'Required';
    if (!formData.address) errors.address = 'Required';
    if (!formData.city) errors.city = 'Required';
    if (!formData.postalCode) errors.postalCode = 'Required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    
    if (formData.postalCode && !/^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(formData.postalCode)) {
      errors.postalCode = 'Invalid postal code';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Find first section with error and open it
      if (formErrors.email || formErrors.phone) {
        setActiveSection('contact');
      } else if (formErrors.firstName || formErrors.lastName || formErrors.address || formErrors.city || formErrors.postalCode) {
        setActiveSection('delivery');
      }
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      alert('Your concierge will call within 1 business day to finalize delivery & installation.');
      clearCart();
      router.push('/');
    }, 2000);
  };

  // Currency conversion rates (example rates)
  const exchangeRates = { 
    CAD: 1, 
    USD: 0.74, 
    EUR: 0.68,
    GBP: 0.58,
    AUD: 1.12,
    CNY: 5.33,
    INR: 61.5
  };
  
  const currencySymbols = { 
    CAD: '$', 
    USD: '$', 
    EUR: '€',
    GBP: '£',
    AUD: '$',
    CNY: '¥',
    INR: '₹'
  };

  // Calculate totals
  const subtotal = totalPrice;
  const delivery = 1500; // Delivery & Installation
  const gst = subtotal * 0.05;
  const pst = subtotal * 0.07;
  const totalInCAD = subtotal + delivery + gst + pst;
  const total = totalInCAD * exchangeRates[selectedCurrency as keyof typeof exchangeRates];
  const monthlyPayment = total / 24;

  const paymentIcons = [
    { name: 'Visa', url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af78722aa5a51b11543785.svg' },
    { name: 'Mastercard', url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af7872d79817284532b8a0.svg' },
    { name: 'Amex', url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af78722c36677ea7b2566d.svg' },
    { name: 'Apple Pay', url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af787200de61ec7298e856.svg' },
    { name: 'Google Pay', url: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af787200de61255698e855.svg' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      <Navbar forceScrolled={true} />

      {/* Sign-In Incentive Banner (only show if not signed in) */}
      {!isSignedIn && (
        <div style={{
          background: 'linear-gradient(135deg, #BF5813 0%, #D87440 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          padding: '12px 16px',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  Sign in for faster checkout & order tracking
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Save your info, track orders, and get exclusive member perks
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/sign-in?redirect_url=/checkout')}
              style={{
                padding: '8px 20px',
                background: 'white',
                color: '#BF5813',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            Complete your secure order
          </h1>
          <span className={styles.headerSubtext}>
            All transactions are 100% secure
          </span>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Left: Form */}
          <div>
            <form onSubmit={handleSubmit} id="checkout-form">
              {/* Contact Section */}
              <div style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection === 'contact' ? '' : 'contact')}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: '#fff',
                    border: 'none',
                    borderBottom: activeSection === 'contact' ? '1px solid #e5e5e5' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a' }}>
                    Contact
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#666',
                    transform: activeSection === 'contact' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}>
                    ▼
                  </span>
                </button>
                
                {activeSection === 'contact' && (
                  <div style={{ padding: '24px' }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: `1px solid ${formErrors.email ? '#e74c3c' : '#e5e5e5'}`,
                        borderRadius: '0',
                        fontSize: '15px',
                        marginBottom: '16px',
                        background: '#fff'
                      }}
                    />
                    {formErrors.email && (
                      <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '-12px', marginBottom: '16px' }}>
                        {formErrors.email}
                      </p>
                    )}
                    
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: `1px solid ${formErrors.phone ? '#e74c3c' : '#e5e5e5'}`,
                        borderRadius: '0',
                        fontSize: '15px',
                        background: '#fff'
                      }}
                    />
                    {formErrors.phone && (
                      <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                        {formErrors.phone}
                      </p>
                    )}
                    
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: '#888', 
                      marginTop: '12px',
                      marginBottom: 0 
                    }}>
                      We encrypt your details and never share them.
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Section */}
              <div style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection === 'delivery' ? '' : 'delivery')}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: '#fff',
                    border: 'none',
                    borderBottom: activeSection === 'delivery' ? '1px solid #e5e5e5' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a' }}>
                    Delivery address
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#666',
                    transform: activeSection === 'delivery' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}>
                    ▼
                  </span>
                </button>
                
                {activeSection === 'delivery' && (
                  <div style={{ padding: '24px' }}>
                    <div className={styles.inputGrid}>
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: `1px solid ${formErrors.firstName ? '#e74c3c' : '#e5e5e5'}`,
                            borderRadius: '0',
                            fontSize: '15px',
                            background: '#fff'
                          }}
                        />
                        {formErrors.firstName && (
                          <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: `1px solid ${formErrors.lastName ? '#e74c3c' : '#e5e5e5'}`,
                            borderRadius: '0',
                            fontSize: '15px',
                            background: '#fff'
                          }}
                        />
                        {formErrors.lastName && (
                          <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: `1px solid ${formErrors.address ? '#e74c3c' : '#e5e5e5'}`,
                        borderRadius: '0',
                        fontSize: '15px',
                        marginBottom: '16px',
                        background: '#fff'
                      }}
                    />
                    {formErrors.address && (
                      <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '-12px', marginBottom: '16px' }}>
                        {formErrors.address}
                      </p>
                    )}
                    
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0',
                        fontSize: '15px',
                        marginBottom: '16px',
                        background: '#fff'
                      }}
                    />
                    
                    <div className={styles.addressGrid}>
                      <div>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: `1px solid ${formErrors.city ? '#e74c3c' : '#e5e5e5'}`,
                            borderRadius: '0',
                            fontSize: '15px',
                            background: '#fff'
                          }}
                        />
                        {formErrors.city && (
                          <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '0',
                          fontSize: '15px',
                          background: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="BC">BC</option>
                      </select>
                      <div>
                        <input
                          type="text"
                          name="postalCode"
                          placeholder="Postal"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          maxLength={7}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: `1px solid ${formErrors.postalCode ? '#e74c3c' : '#e5e5e5'}`,
                            borderRadius: '0',
                            fontSize: '15px',
                            background: '#fff',
                            textTransform: 'uppercase'
                          }}
                        />
                        {formErrors.postalCode && (
                          <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                            {formErrors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Section */}
              <div style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                marginBottom: '32px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e5e5e5'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a' }}>
                    Review
                  </span>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '16px' }}>
                    Limited production slots • Reserve your installation
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>
                    Your concierge will call within 1 business day to finalize delivery & installation.
                  </p>
                  
                  {/* Assurance Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5Z" stroke="#666" strokeWidth="1"/>
                        <path d="M5.5 8L7 9.5L10.5 6" stroke="#666" strokeWidth="1"/>
                      </svg>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>Free delivery & installation</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5Z" stroke="#666" strokeWidth="1"/>
                        <path d="M5.5 8L7 9.5L10.5 6" stroke="#666" strokeWidth="1"/>
                      </svg>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>5-year comprehensive warranty</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5Z" stroke="#666" strokeWidth="1"/>
                        <path d="M5.5 8L7 9.5L10.5 6" stroke="#666" strokeWidth="1"/>
                      </svg>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>6-8 week lead time</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Concierge Support */}
              <div style={{
                padding: '24px',
                background: '#fff',
                border: '1px solid #e5e5e5',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '12px' }}>
                  Prefer to finish by phone?
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '4px' }}>
                  Talk to your Ilio Concierge now
                </p>
                <a 
                  href="tel:250-597-1244" 
                  style={{ 
                    fontSize: '1.125rem', 
                    color: '#1a1a1a',
                    textDecoration: 'none'
                  }}
                >
                  250.597.1244
                </a>
              </div>
            </form>
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div 
            className={isMobile && showMobileOrder ? '' : styles.orderSummary}
          >
            {/* Mobile Full-Screen Layout */}
            {isMobile && showMobileOrder ? (
              <>
                {/* Semi-transparent overlay */}
                <div 
                  onClick={() => setShowMobileOrder(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                />
                
                {/* Bottom sheet container - ONLY AS TALL AS CONTENT */}
                <div style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: '#fff',
                  zIndex: 10000,
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  animation: 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}>
                    {/* Header with back button and currency selector */}
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #e5e5e5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#fff'
                    }}>
                      <button
                        onClick={() => setShowMobileOrder(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '24px',
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        ←
                      </button>
                      
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        color: '#1a1a1a',
                        flex: 1,
                        textAlign: 'center'
                      }}>
                        Order Summary
                      </h3>
                      
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        style={{
                          padding: '6px 8px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: '#fff',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        <option value="CAD">CAD $</option>
                        <option value="USD">USD $</option>
                        <option value="EUR">EUR €</option>
                        <option value="GBP">GBP £</option>
                        <option value="AUD">AUD $</option>
                        <option value="CNY">CNY ¥</option>
                        <option value="INR">INR ₹</option>
                      </select>
                    </div>
                    
                    {/* Product Details */}
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #e5e5e5',
                      background: '#fff'
                    }}>
                      {items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#1a1a1a',
                              margin: 0,
                              marginBottom: '2px'
                            }}>
                              {item.name}
                            </p>
                            <p style={{
                              fontSize: '12px',
                              color: '#666',
                              margin: 0
                            }}>
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Price Breakdown - subtotal, tax, delivery, total */}
                    <div style={{
                      padding: '16px 20px',
                      background: '#fafafa',
                      fontSize: '14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Subtotal</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {(subtotal * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Delivery & Installation</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {(delivery * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#666' }}>Tax</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {((gst + pst) * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0).toLocaleString()}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '2px solid #1a1a1a',
                        fontSize: '18px',
                        fontWeight: 600
                      }}>
                        <span>Total</span>
                        <span>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {total.toFixed(0).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* From $996/mo text */}
                      <p style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '8px',
                        textAlign: 'center',
                        margin: '8px 0 0'
                      }}>
                        From {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}{monthlyPayment.toFixed(0)}/mo • 0% for 24 months
                      </p>
                    </div>
                    
                    {/* Place Order Button */}
                    <div style={{
                      padding: '20px',
                      background: '#fff'
                    }}>
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isProcessing || items.length === 0}
                        style={{
                          width: '100%',
                          padding: '18px',
                          backgroundColor: isProcessing ? '#ccc' : '#1a1a1a',
                          color: 'white',
                          border: 'none',
                          fontSize: '16px',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          borderRadius: '4px',
                          cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isProcessing ? 'Processing...' : `Place Secure Order — ${currencySymbols[selectedCurrency as keyof typeof currencySymbols]}${total.toFixed(0).toLocaleString()} ${selectedCurrency}`}
                      </button>
                      
                      {/* Secure text with lock */}
                      <p style={{
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'center',
                        margin: '12px 0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M12 6V4C12 2.34 10.66 1 9 1H7C5.34 1 4 2.34 4 4V6" stroke="#666" strokeWidth="1.5"/>
                          <rect x="3" y="6" width="10" height="9" rx="1" stroke="#666" strokeWidth="1.5"/>
                          <circle cx="8" cy="11" r="1" fill="#666"/>
                        </svg>
                        All transactions are secured and encrypted
                      </p>
                      
                      {/* Payment Icons - Only 5, no duplicate Affirm */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: 0.7
                      }}>
                        {paymentIcons.slice(0, 5).map(icon => (
                          <img 
                            key={icon.name}
                            src={icon.url} 
                            alt={icon.name}
                            style={{ height: '20px' }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Testimonial Section */}
                    <div style={{
                      padding: '16px 20px',
                      background: '#f9f9f9',
                      borderTop: '1px solid #e5e5e5',
                      marginBottom: 0
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="14" height="14" fill="#BF5813" viewBox="0 0 20 20">
                            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/>
                          </svg>
                        ))}
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: '#333',
                        textAlign: 'center',
                        lineHeight: '1.4',
                        fontStyle: 'italic',
                        margin: '0 0 8px'
                      }}>
                        "The installation team was exceptional. Our Ilio Sauna has become the centerpiece of our wellness routine. Worth every penny."
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        <span style={{ fontWeight: 500 }}>Sarah M.</span>
                        <span style={{ color: '#999' }}>•</span>
                        <span>Vancouver, BC</span>
                        <span style={{ color: '#999' }}>•</span>
                        <span style={{ color: '#4CAF50', fontWeight: 500 }}>Verified Buyer</span>
                      </div>
                    </div>
                  
                  {/* Bottom Bar - Hide Order */}
                  <div style={{
                    minHeight: '60px',
                    padding: '12px 20px',
                    borderTop: '2px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fff',
                    marginTop: 0
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>
                        {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}{total.toFixed(0).toLocaleString()} {selectedCurrency}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {totalItems} item{totalItems !== 1 ? 's' : ''} • Free delivery
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMobileOrder(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#f5f5f5',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Hide Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Desktop Layout */
              <div style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '0',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Desktop Header with Currency Selector */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e5e5e5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fff'
                }}>
                  <h2 style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    margin: 0,
                    letterSpacing: '0.02em'
                  }}>
                    Order summary
                  </h2>
                  
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      background: '#fff',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    <option value="CAD">CAD $</option>
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                    <option value="AUD">AUD $</option>
                    <option value="CNY">CNY ¥</option>
                    <option value="INR">INR ₹</option>
                  </select>
                </div>
              
                {/* Desktop Scrollable Content Area */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px',
                  paddingBottom: '24px',
                  WebkitOverflowScrolling: 'touch'
                }}>
                {/* Product */}
                <div style={{ marginBottom: '24px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#1a1a1a',
                          marginBottom: '4px'
                        }}>
                          {item.name}
                        </p>
                        <p style={{
                          fontSize: '0.8rem',
                          color: '#666'
                        }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div style={{
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e5e5',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#666' }}>Unit price</span>
                    <span style={{ color: '#1a1a1a' }}>
                      {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                      {(subtotal * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#666' }}>Delivery/Installation</span>
                    <span style={{ color: '#1a1a1a' }}>
                      {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                      {(delivery * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0).toLocaleString()}
                    </span>
                  </div>
                  {selectedCurrency === 'CAD' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#666' }}>GST</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {gst.toFixed(0)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ color: '#666' }}>PST</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                          {pst.toFixed(0)}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedCurrency !== 'CAD' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span style={{ color: '#666' }}>Tax (estimated)</span>
                      <span style={{ color: '#1a1a1a' }}>
                        {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                        {((gst + pst) * exchangeRates[selectedCurrency as keyof typeof exchangeRates]).toFixed(0)}
                      </span>
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #1a1a1a',
                    fontSize: '1.125rem',
                    fontWeight: 500
                  }}>
                    <span>Total ({selectedCurrency})</span>
                    <span>
                      {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}
                      {total.toFixed(0).toLocaleString()}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginTop: '12px',
                    textAlign: 'center'
                  }}>
                    From {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}{monthlyPayment.toFixed(0)}/mo O.A.C. • No hidden fees
                  </p>
                </div>
              </div>
              
                {/* Desktop Payment Section */}
                <div style={{
                  borderTop: '1px solid #e5e5e5',
                  padding: '20px 24px',
                  background: '#fafafa',
                  marginTop: 'auto'
                }}>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                  All transactions are secured and encrypted
                </p>
                
                {/* Payment Icons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {paymentIcons.map(icon => (
                    <img 
                      key={icon.name}
                      src={icon.url} 
                      alt={icon.name}
                      style={{ height: '24px', width: 'auto', opacity: 0.8 }}
                    />
                  ))}
                </div>
                
                {/* Place Order Button */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing || items.length === 0}
                  style={{
                    width: '100%',
                    padding: isMobile && showMobileOrder ? '20px' : '16px',
                    backgroundColor: isProcessing ? '#ccc' : '#1a1a1a',
                    color: 'white',
                    border: 'none',
                    fontSize: isMobile && showMobileOrder ? '16px' : '15px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {isProcessing ? 'Processing...' : `Place Secure Order — ${currencySymbols[selectedCurrency as keyof typeof currencySymbols]}${total.toFixed(0).toLocaleString()} ${selectedCurrency}`}
                </button>
                
                <p style={{ 
                  fontSize: '0.7rem', 
                  color: '#888', 
                  marginTop: '12px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  Powered by 
                  <img 
                    src="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68af7872271602abe35f8868.svg" 
                    alt="Stripe" 
                    style={{ height: '14px' }}
                  />
                </p>
                
                {/* Trust Elements */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e5e5',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M11.5 5.5V3.5C11.5 1.84 10.16 0.5 8.5 0.5H5.5C3.84 0.5 2.5 1.84 2.5 3.5V5.5" stroke="#666" strokeWidth="1"/>
                      <rect x="1.5" y="5.5" width="11" height="8" stroke="#666" strokeWidth="1"/>
                    </svg>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>PCI DSS</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L8.5 4.5L12.5 5L9.5 7.5L10.5 11.5L7 9.5L3.5 11.5L4.5 7.5L1.5 5L5.5 4.5L7 1Z" stroke="#666" strokeWidth="1"/>
                    </svg>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>256-bit SSL</span>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
        
        {/* Mobile Order Summary Toggle */}
        {isMobile && items.length > 0 && (
          <div className={styles.mobileOrderToggle}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a' }}>
                Total: {currencySymbols[selectedCurrency as keyof typeof currencySymbols]}{total.toFixed(0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </div>
            </div>
          <button
            onClick={() => setShowMobileOrder(!showMobileOrder)}
            style={{
              padding: '10px 20px',
              background: showMobileOrder ? '#666' : '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {showMobileOrder ? 'Hide Order' : 'View Order'}
          </button>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}