'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const GHLContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showValidation, setShowValidation] = useState(false);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Validate form
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare data for GHL API
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        customFields: {
          project_details: formData.message
        },
        source: 'Website Contact Form',
        tags: ['Website Lead', 'Contact Form']
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#28a745'
        }}>
          ✓
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          marginBottom: '1rem',
          color: '#1a1a1a'
        }}>
          Thank You!
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '0',
          fontWeight: 300
        }}>
          We've received your message and will contact you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '2.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
      maxWidth: '100%'
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '100%',
        margin: '0 auto'
      }}>
      {/* Name Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 300,
          fontSize: '1rem',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px',
            border: fieldErrors.name ? '1px solid #dc2626' : '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 300,
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = fieldErrors.name ? '#dc2626' : 'var(--color-primary)';
            e.target.style.outline = 'none';
          }}
          onBlur={(e) => e.target.style.borderColor = fieldErrors.name ? '#dc2626' : '#e0e0e0'}
        />
        {fieldErrors.name && (
          <div style={{
            color: '#dc2626',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
            fontWeight: 300
          }}>
            {fieldErrors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 300,
          fontSize: '1rem',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px',
            border: fieldErrors.email ? '1px solid #dc2626' : '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 300,
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = fieldErrors.email ? '#dc2626' : 'var(--color-primary)';
            e.target.style.outline = 'none';
          }}
          onBlur={(e) => e.target.style.borderColor = fieldErrors.email ? '#dc2626' : '#e0e0e0'}
        />
        {fieldErrors.email && (
          <div style={{
            color: '#dc2626',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
            fontWeight: 300
          }}>
            {fieldErrors.email}
          </div>
        )}
      </div>

      {/* Phone Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 300,
          fontSize: '1rem',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 300,
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.outline = 'none';
          }}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      {/* Message Field */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 300,
          fontSize: '1rem',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Project Details
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => updateFormData('message', e.target.value)}
          rows={5}
          placeholder="Tell us about your project or ask any questions..."
          style={{
            width: '100%',
            padding: '14px 18px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 300,
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.outline = 'none';
          }}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            background: isSubmitting ? 'rgba(191, 88, 19, 0.5)' : 'transparent',
            color: isSubmitting ? 'white' : 'var(--color-primary)',
            padding: '16px 32px',
            border: '1px solid var(--color-primary)',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 400,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div style={{
          marginTop: '1rem',
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          There was an error sending your message. Please try again or contact us directly.
        </div>
      )}
      </form>
    </div>
  );
};

export default GHLContactForm;