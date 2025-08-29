'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, User, Send, Bell, Shield, CreditCard, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import '../minimal-dashboard.css';

export default function SupportPage() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('concierge');

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

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Support & Settings</span>
        </div>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Support & Settings</h1>
              <p className="md-subtitle">Contact your concierge and manage account preferences</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse Saunas
            </button>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="md-settings-layout">
          {/* Sidebar */}
          <div className="md-settings-sidebar">
            <button 
              className={`md-settings-tab ${activeTab === 'concierge' ? 'active' : ''}`}
              onClick={() => setActiveTab('concierge')}
            >
              <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
              Concierge Support
            </button>
            <button 
              className={`md-settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} style={{ marginRight: '0.5rem' }} />
              Profile
            </button>
            <button 
              className={`md-settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={16} style={{ marginRight: '0.5rem' }} />
              Notifications
            </button>
            <button 
              className={`md-settings-tab ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard size={16} style={{ marginRight: '0.5rem' }} />
              Billing
            </button>
            <button 
              className={`md-settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={16} style={{ marginRight: '0.5rem' }} />
              Security
            </button>
          </div>

          {/* Content */}
          <div className="md-settings-content">
            {activeTab === 'concierge' && (
              <>
                {/* Concierge Contact Card */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                    Your Dedicated Concierge
                  </h2>
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
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                        {concierge.name}
                      </h3>
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
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1rem' }}>
                    Recent Messages
                  </h3>
                  
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
              </>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                  Profile Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '0.5rem' }}>
                      Name
                    </label>
                    <input 
                      type="text"
                      value={user?.fullName || ''}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        background: 'var(--md-neutral-50)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '0.5rem' }}>
                      Email
                    </label>
                    <input 
                      type="email"
                      value={user?.emailAddresses?.[0]?.emailAddress || ''}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        background: 'var(--md-neutral-50)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '0.5rem' }}>
                      Phone
                    </label>
                    <input 
                      type="tel"
                      placeholder="Add phone number"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '0.5rem' }}>
                      Delivery Address
                    </label>
                    <textarea
                      placeholder="Enter delivery address"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                    />
                  </div>
                  <button className="md-btn" style={{ alignSelf: 'flex-start' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                  Notification Preferences
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Production Updates', description: 'Get notified when your sauna moves to a new production stage' },
                    { label: 'Delivery Updates', description: 'Receive alerts about delivery scheduling and tracking' },
                    { label: 'Concierge Messages', description: 'Email notifications for new messages from your concierge' },
                    { label: 'Resource Availability', description: 'Be informed when new resources or guides are available' }
                  ].map((item, index) => (
                    <label key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--md-neutral-50)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.25rem' }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)' }}>
                          {item.description}
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                  Billing Information
                </h2>
                <div style={{ padding: '2rem', background: 'var(--md-neutral-50)', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <CreditCard size={48} style={{ color: 'var(--md-neutral-400)', margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '1rem' }}>
                    Your payment information is securely managed through Stripe
                  </p>
                  <button className="md-btn">
                    Manage Payment Methods
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                  Security Settings
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ 
                    padding: '1rem',
                    background: 'var(--md-neutral-50)',
                    borderRadius: '0.5rem'
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.5rem' }}>
                      Two-Factor Authentication
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)', marginBottom: '1rem' }}>
                      Add an extra layer of security to your account
                    </p>
                    <button className="md-btn" style={{ fontSize: '0.875rem' }}>
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div style={{ 
                    padding: '1rem',
                    background: 'var(--md-neutral-50)',
                    borderRadius: '0.5rem'
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.5rem' }}>
                      Sign Out
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-600)', marginBottom: '1rem' }}>
                      Sign out of your account on this device
                    </p>
                    <button 
                      onClick={handleSignOut}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--md-neutral-800)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}