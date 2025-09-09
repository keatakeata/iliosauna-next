'use client';

import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { ArrowLeft, Bell, Shield, Globe, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import '../minimal-dashboard.css';

export default function MinimalSettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeSection, setActiveSection] = useState('profile');

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Back Navigation */}
        <button 
          onClick={() => router.push('/account')}
          className="md-btn-text"
          style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Account Settings</h1>
              <p className="md-subtitle">Manage your account preferences</p>
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

        {/* Settings Navigation */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'preferences', label: 'Preferences', icon: Globe }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  padding: '1rem',
                  background: activeSection === item.id ? 'var(--md-accent-subtle)' : 'white',
                  border: `1px solid ${activeSection === item.id ? 'var(--md-accent)' : 'var(--md-neutral-200)'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} style={{ color: activeSection === item.id ? 'var(--md-accent)' : 'var(--md-neutral-400)' }} />
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: activeSection === item.id ? 500 : 400,
                  color: activeSection === item.id ? 'var(--md-accent)' : 'var(--md-neutral-700)'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem'
        }}>
          {activeSection === 'profile' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                Profile Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.5rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={`${user?.firstName} ${user?.lastName}`}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--md-neutral-200)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.emailAddresses[0]?.emailAddress}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--md-neutral-200)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'var(--md-neutral-50)',
                      color: 'var(--md-neutral-600)'
                    }}
                  />
                </div>
                <button className="md-btn">Save Changes</button>
              </div>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                Notification Preferences
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Order status updates',
                  'Production milestone notifications',
                  'Delivery scheduling alerts',
                  'Maintenance reminders'
                ].map((item, index) => (
                  <label key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--md-neutral-50)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>{item}</span>
                    <input type="checkbox" defaultChecked={index < 2} />
                  </label>
                ))}
                <button className="md-btn" style={{ marginTop: '1rem' }}>Update Preferences</button>
              </div>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                Security Settings
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ 
                  padding: '1rem',
                  background: 'var(--md-neutral-50)',
                  borderRadius: '0.5rem'
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-700)', marginBottom: '0.5rem' }}>
                    Password
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '1rem' }}>
                    Last changed 3 months ago
                  </p>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      border: '1px solid var(--md-neutral-200)',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Change Password
                  </button>
                </div>
                <div style={{ 
                  padding: '1rem',
                  background: 'var(--md-neutral-50)',
                  borderRadius: '0.5rem'
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-700)', marginBottom: '0.5rem' }}>
                    Two-Factor Authentication
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '1rem' }}>
                    Add an extra layer of security
                  </p>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      border: '1px solid var(--md-neutral-200)',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'preferences' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
                Display Preferences
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.5rem' }}>
                    Language
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--md-neutral-200)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white',
                    outline: 'none'
                  }}>
                    <option>English</option>
                    <option>Français</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.5rem' }}>
                    Currency
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--md-neutral-200)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white',
                    outline: 'none'
                  }}>
                    <option>CAD - Canadian Dollar</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
                <button className="md-btn">Save Preferences</button>
              </div>
            </>
          )}
        </div>

        {/* Sign Out */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'white',
          border: '1px solid var(--md-neutral-200)',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <button 
            onClick={handleSignOut}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'var(--md-neutral-700)',
              border: '1px solid var(--md-neutral-300)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
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
  );
}