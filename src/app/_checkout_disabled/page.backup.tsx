'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Information
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    province: 'BC',
    postalCode: '',
    
    // Payment Method (for now just placeholder)
    paymentMethod: 'credit_card'
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/saunas');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    
    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Canadian postal code validation
    if (formData.postalCode && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postalCode)) {
      errors.postalCode = 'Please enter a valid postal code';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // TODO: Integrate with Stripe
    // For now, just simulate processing
    setTimeout(() => {
      alert('Order placed successfully! (Demo - Stripe integration coming soon)');
      clearCart();
      router.push('/');
    }, 2000);
  };

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.12; // 12% tax (PST + GST in BC)
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar forceScrolled={true} />
      
      <div style={{
        minHeight: '100vh',
        paddingTop: 'calc(var(--navbar-height) + 40px)',
        paddingBottom: '80px',
        background: '#fafafa'
      }}>
        <div className="ilio-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Header */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 200,
            letterSpacing: '0.05em',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Checkout
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Left Column - Form */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    marginBottom: '20px',
                    letterSpacing: '0.05em'
                  }}>
                    Contact Information
                  </h2>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${formErrors.email ? '#e74c3c' : '#e0e0e0'}`,
                        borderRadius: '4px',
                        fontSize: '16px',
                        transition: 'border-color 0.3s'
                      }}
                    />
                    {formErrors.email && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' }}>
                        {formErrors.email}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${formErrors.phone ? '#e74c3c' : '#e0e0e0'}`,
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    {formErrors.phone && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' }}>
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    marginBottom: '20px',
                    letterSpacing: '0.05em'
                  }}>
                    Delivery Address
                  </h2>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `1px solid ${formErrors.firstName ? '#e74c3c' : '#e0e0e0'}`,
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                      {formErrors.firstName && (
                        <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                          {formErrors.firstName}
                        </span>
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
                          padding: '12px',
                          border: `1px solid ${formErrors.lastName ? '#e74c3c' : '#e0e0e0'}`,
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                      {formErrors.lastName && (
                        <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                          {formErrors.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${formErrors.address ? '#e74c3c' : '#e0e0e0'}`,
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    {formErrors.address && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                        {formErrors.address}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: '15px'
                  }}>
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `1px solid ${formErrors.city ? '#e74c3c' : '#e0e0e0'}`,
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                      {formErrors.city && (
                        <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                          {formErrors.city}
                        </span>
                      )}
                    </div>
                    <div>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          fontSize: '16px',
                          background: 'white'
                        }}
                      >
                        <option value="BC">BC</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `1px solid ${formErrors.postalCode ? '#e74c3c' : '#e0e0e0'}`,
                          borderRadius: '4px',
                          fontSize: '16px'
                        }}
                      />
                      {formErrors.postalCode && (
                        <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                          {formErrors.postalCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Section (Placeholder) */}
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    marginBottom: '20px',
                    letterSpacing: '0.05em'
                  }}>
                    Payment Method
                  </h2>
                  
                  <div style={{
                    padding: '20px',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <p style={{ color: '#666', fontSize: '0.95rem' }}>
                      Secure payment processing powered by Stripe
                    </p>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '10px' }}>
                      Payment details will be collected on the next step
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: isProcessing ? '#999' : '#BF5813',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = '#a64a11';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = '#BF5813';
                    }
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: 400,
                marginBottom: '20px',
                letterSpacing: '0.05em'
              }}>
                Order Summary
              </h2>
              
              {/* Items */}
              <div style={{ marginBottom: '20px' }}>
                {items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
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
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        marginBottom: '5px'
                      }}>
                        {item.name}
                      </h4>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#666'
                      }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 500
                    }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div style={{
                borderTop: '2px solid #e0e0e0',
                paddingTop: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span>Shipping</span>
                  <span style={{ color: '#27ae60' }}>FREE</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <span>Tax (PST + GST)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  borderTop: '2px solid #e0e0e0',
                  paddingTop: '15px'
                }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)} CAD</span>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🔒</span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    Secure checkout
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🚚</span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    Free BC delivery
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    5-year warranty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}