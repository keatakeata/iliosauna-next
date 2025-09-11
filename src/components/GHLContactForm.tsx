'use client';

import React, { useState } from 'react';
// Removed motion import for React 19 compatibility

interface FormData {
  // Basic fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Custom fields
  purchase_timeline: string;
  primary_interest: string;
  budget_range: string;
  previous_sauna_owner: string;
  preferred_contact_method: string;
  lead_source: string;
  referral_name?: string;
  special_requests?: string;
  newsletter_optin: string;
}

const GHLContactForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    purchase_timeline: '',
    primary_interest: '',
    budget_range: '',
    previous_sauna_owner: '',
    preferred_contact_method: '',
    lead_source: '',
    referral_name: '',
    special_requests: '',
    newsletter_optin: 'Yes'
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare data for GHL API
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        source: 'Website Contact Form',
        tags: ['Website Lead', 'Contact Form', `Timeline: ${formData.purchase_timeline}`],
        customFields: {
          purchase_timeline: formData.purchase_timeline,
          primary_interest: formData.primary_interest,
          budget_range: formData.budget_range,
          previous_sauna_owner: formData.previous_sauna_owner,
          preferred_contact_method: formData.preferred_contact_method,
          lead_source: formData.lead_source,
          referral_name: formData.referral_name || '',
          special_requests: formData.special_requests || '',
          newsletter_optin: formData.newsletter_optin
        }
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      // Log the response for debugging
      console.log('API Response:', result);

      if (!response.ok) {
        console.error('API Error:', result);
        throw new Error(result.message || 'Failed to submit form');
      }

      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            purchase_timeline: '',
            primary_interest: '',
            budget_range: '',
            previous_sauna_owner: '',
            preferred_contact_method: '',
            lead_source: '',
            referral_name: '',
            special_requests: '',
            newsletter_optin: 'Yes'
          });
          setCurrentStep(0);
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      console.error('Error details:', error.message);
      setSubmitStatus('error');
      // Store error message for display
      setFormData(prev => ({ ...prev, errorMessage: error.message || 'Something went wrong' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.purchase_timeline !== '';
      case 1:
        return formData.primary_interest !== '';
      case 2:
        return formData.budget_range !== '' && formData.previous_sauna_owner !== '';
      case 3:
        return formData.firstName !== '' && formData.lastName !== '' && 
               formData.email !== '' && formData.preferred_contact_method !== '';
      default:
        return true;
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#FAF8F5',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          {['Timeline', 'Interest', 'Details', 'Contact'].map((label, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.85rem',
                fontWeight: index <= currentStep ? 600 : 400,
                color: index <= currentStep ? '#BF5813' : '#9B8B7E'
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div style={{
          height: '4px',
          backgroundColor: '#E5DDD5',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#BF5813',
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 20px',
            backgroundColor: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#1D140B' }}>Thank You!</h3>
          <p style={{ color: '#5C4E3F' }}>
            We've received your inquiry and will contact you within 1 business day.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Purchase Timeline */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ marginBottom: '20px', color: '#1D140B' }}>
                  When are you looking to purchase?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['ASAP - Ready to buy', 'Within 1-3 months', 'Within 3-6 months', 'Just researching'].map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: formData.purchase_timeline === option ? '#FFF5ED' : 'white',
                        border: `2px solid ${formData.purchase_timeline === option ? '#BF5813' : '#E5DDD5'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="radio"
                        name="purchase_timeline"
                        value={option}
                        checked={formData.purchase_timeline === option}
                        onChange={(e) => updateFormData('purchase_timeline', e.target.value)}
                        style={{ marginRight: '12px' }}
                      />
                      <span style={{ color: '#3D2914' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Primary Interest */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ marginBottom: '20px', color: '#1D140B' }}>
                  What's your primary interest in a sauna?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Wellness & Therapy',
                    'Family Bonding',
                    'Entertaining Guests',
                    'Retreat/Airbnb Revenue',
                    'Year-Round Outdoor Living'
                  ].map((option) => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: formData.primary_interest === option ? '#FFF5ED' : 'white',
                        border: `2px solid ${formData.primary_interest === option ? '#BF5813' : '#E5DDD5'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="radio"
                        name="primary_interest"
                        value={option}
                        checked={formData.primary_interest === option}
                        onChange={(e) => updateFormData('primary_interest', e.target.value)}
                        style={{ marginRight: '12px' }}
                      />
                      <span style={{ color: '#3D2914' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ marginBottom: '20px', color: '#1D140B' }}>
                  Tell us a bit more
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Budget Range
                  </label>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => updateFormData('budget_range', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5DDD5',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      fontSize: '1rem'
                    }}
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="Under $20,000">Under $20,000</option>
                    <option value="$20,000 - $25,000">$20,000 - $25,000</option>
                    <option value="$25,000+">$25,000+</option>
                    <option value="Unsure - need guidance">Unsure - need guidance</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Have you owned a sauna before?
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Yes', 'No'].map((option) => (
                      <label
                        key={option}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px',
                          backgroundColor: formData.previous_sauna_owner === option ? '#FFF5ED' : 'white',
                          border: `2px solid ${formData.previous_sauna_owner === option ? '#BF5813' : '#E5DDD5'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name="previous_sauna_owner"
                          value={option}
                          checked={formData.previous_sauna_owner === option}
                          onChange={(e) => updateFormData('previous_sauna_owner', e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ color: '#3D2914' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.lead_source}
                    onChange={(e) => updateFormData('lead_source', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5DDD5',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select source</option>
                    <option value="Google">Google Search</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="Event">Event/Show</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {formData.lead_source === 'Referral' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginBottom: '20px' }}
                  >
                    <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                      Referral Name
                    </label>
                    <input
                      type="text"
                      value={formData.referral_name}
                      onChange={(e) => updateFormData('referral_name', e.target.value)}
                      placeholder="Who referred you?"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5DDD5',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ marginBottom: '20px', color: '#1D140B' }}>
                  Let's get in touch
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5DDD5',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5DDD5',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5DDD5',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5DDD5',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Preferred Contact Method *
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Email', 'Phone', 'Text'].map((option) => (
                      <label
                        key={option}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px',
                          backgroundColor: formData.preferred_contact_method === option ? '#FFF5ED' : 'white',
                          border: `2px solid ${formData.preferred_contact_method === option ? '#BF5813' : '#E5DDD5'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name="preferred_contact_method"
                          value={option}
                          checked={formData.preferred_contact_method === option}
                          onChange={(e) => updateFormData('preferred_contact_method', e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ color: '#3D2914', fontSize: '0.9rem' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#5C4E3F', fontSize: '0.95rem' }}>
                    Special Requests or Questions (Optional)
                  </label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) => updateFormData('special_requests', e.target.value)}
                    rows={4}
                    placeholder="Tell us about your space, specific needs, or any questions you have..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5DDD5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.newsletter_optin === 'Yes'}
                    onChange={(e) => updateFormData('newsletter_optin', e.target.checked ? 'Yes' : 'No')}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ color: '#5C4E3F', fontSize: '0.9rem' }}>
                    Send me exclusive offers and sauna wellness tips
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              style={{
                padding: '14px 24px',
                backgroundColor: currentStep === 0 ? '#E5DDD5' : 'white',
                color: currentStep === 0 ? '#9B8B7E' : '#3D2914',
                border: '2px solid #E5DDD5',
                borderRadius: '4px',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                opacity: currentStep === 0 ? 0.5 : 1
              }}
            >
              Previous
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: isStepValid() ? '#BF5813' : '#E5DDD5',
                  color: isStepValid() ? 'white' : '#9B8B7E',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isStepValid() ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isSubmitting}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: isStepValid() && !isSubmitting ? '#BF5813' : '#E5DDD5',
                  color: isStepValid() && !isSubmitting ? 'white' : '#9B8B7E',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isStepValid() && !isSubmitting ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
              </button>
            )}
          </div>

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#FEE',
                border: '1px solid #FCC',
                borderRadius: '4px',
                color: '#C00',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              Something went wrong. Please try again or call us directly at 604-555-0100.
            </motion.div>
          )}
        </form>
      )}
    </div>
  );
};

export default GHLContactForm;