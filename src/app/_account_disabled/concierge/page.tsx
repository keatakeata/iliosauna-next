'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, User, Send } from 'lucide-react';
import { useState } from 'react';
import '../minimal-dashboard.css';

export default function ConciergePage() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  // Mock concierge data
  const concierge = {
    name: 'Sarah Mitchell',
    title: 'Senior Project Manager',
    email: 'sarah@iliosaunas.com',
    phone: '1-250-555-0100',
    availability: 'Mon-Fri 8AM-6PM PST',
    responseTime: 'Within 2 hours'
  };

  const recentMessages = [
    {
      from: 'Sarah',
      date: '2 days ago',
      message: 'Your cedar panels have been cut to specification. I\'ll send photos tomorrow.'
    },
    {
      from: 'You',
      date: '3 days ago',
      message: 'Can you confirm the delivery window for March?'
    },
    {
      from: 'Sarah',
      date: '3 days ago',
      message: 'We\'re targeting March 15-20 for delivery. I\'ll confirm the exact date next week.'
    }
  ];

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Concierge Support</span>
        </div>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Concierge Support</h1>
              <p className="md-subtitle">Your dedicated support throughout the journey</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse Saunas →
            </button>
          </div>
        </div>

        {/* Concierge Contact Card */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--md-neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={32} style={{ color: 'var(--md-neutral-500)' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                {concierge.name}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '1.5rem' }}>
                {concierge.title}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} style={{ color: 'var(--md-neutral-400)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>{concierge.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} style={{ color: 'var(--md-neutral-400)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>{concierge.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} style={{ color: 'var(--md-neutral-400)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>{concierge.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <MessageCircle size={20} style={{ color: 'var(--md-neutral-400)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
              Recent Messages
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {recentMessages.map((msg, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '1rem',
                  background: msg.from === 'You' ? 'var(--md-accent-subtle)' : 'var(--md-neutral-50)',
                  borderRadius: '0.5rem',
                  borderLeft: `3px solid ${msg.from === 'You' ? 'var(--md-accent)' : 'var(--md-neutral-300)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-700)' }}>
                    {msg.from}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)' }}>
                    {msg.date}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)', lineHeight: 1.5 }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid var(--md-neutral-200)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '80px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--md-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--md-neutral-200)'}
            />
            <button 
              className="md-btn"
              style={{ alignSelf: 'flex-end' }}
            >
              <Send size={16} style={{ marginRight: '0.5rem' }} />
              Send
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
            Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <button 
              style={{
                padding: '1rem',
                background: 'var(--md-neutral-50)',
                border: '1px solid var(--md-neutral-200)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-accent)';
                e.currentTarget.style.background = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-neutral-200)';
                e.currentTarget.style.background = 'var(--md-neutral-50)';
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                Schedule a Call
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)' }}>
                Book a time to discuss your project
              </p>
            </button>
            
            <button 
              style={{
                padding: '1rem',
                background: 'var(--md-neutral-50)',
                border: '1px solid var(--md-neutral-200)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-accent)';
                e.currentTarget.style.background = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-neutral-200)';
                e.currentTarget.style.background = 'var(--md-neutral-50)';
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                Request Photos
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)' }}>
                Get latest production updates
              </p>
            </button>
            
            <button 
              style={{
                padding: '1rem',
                background: 'var(--md-neutral-50)',
                border: '1px solid var(--md-neutral-200)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-accent)';
                e.currentTarget.style.background = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--md-neutral-200)';
                e.currentTarget.style.background = 'var(--md-neutral-50)';
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                Urgent Support
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)' }}>
                Get immediate assistance
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}