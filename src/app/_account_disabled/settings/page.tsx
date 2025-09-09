'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../minimal-dashboard.css';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    priceAlerts: true,
    newProducts: false,
    smsNotifications: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    analytics: true,
    marketing: false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    language: 'en',
    currency: 'CAD',
    timezone: 'America/Vancouver',
  });

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setIsLoading(false);
  }, [user, isLoaded, isSignedIn, router]);

  const handleNotificationChange = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    });
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key as keyof typeof privacySettings],
    });
  };

  const handleDisplayChange = (key: string, value: string) => {
    setDisplaySettings({
      ...displaySettings,
      [key]: value,
    });
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="md-dashboard">
        <div className="md-container">
          <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--md-neutral-400)' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Settings</span>
        </div>

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

        <div className="md-settings-layout">
          {/* Sidebar */}
          <div className="md-settings-sidebar">
            {['notifications', 'privacy', 'security', 'display', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`md-settings-tab ${activeTab === tab ? 'active' : ''}`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md-settings-content">
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '24px', color: 'var(--md-neutral-800)' }}>
                  Notification Preferences
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '12px', color: 'var(--md-neutral-800)' }}>
                      Email Notifications
                    </h3>
                    
                    {Object.entries({
                      orderUpdates: 'Order status updates',
                      promotions: 'Promotional offers and discounts',
                      newsletter: 'Monthly newsletter',
                      priceAlerts: 'Price drop alerts for wishlist items',
                      newProducts: 'New product announcements',
                    }).map(([key, label]) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.95rem', color: 'var(--md-neutral-600)' }}>{label}</span>
                        <input
                          type="checkbox"
                          checked={notificationSettings[key as keyof typeof notificationSettings]}
                          onChange={() => handleNotificationChange(key)}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                          }}
                        />
                      </label>
                    ))}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '12px', color: 'var(--md-neutral-800)' }}>
                      SMS Notifications
                    </h3>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span style={{ fontSize: '0.95rem', color: 'var(--md-neutral-600)' }}>
                        Receive SMS updates for orders
                      </span>
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="md-btn"
                  style={{ marginTop: '24px' }}
                >
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '24px', color: 'var(--md-neutral-800)' }}>
                  Privacy Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.entries({
                    shareData: 'Share usage data to improve our services',
                    analytics: 'Allow analytics cookies',
                    marketing: 'Allow marketing cookies',
                  }).map(([key, label]) => (
                    <div key={key} style={{ borderBottom: '1px solid var(--md-neutral-100)', paddingBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', color: 'var(--md-neutral-800)', marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--md-neutral-500)' }}>
                            {key === 'shareData' && 'Help us improve by sharing anonymous usage data'}
                            {key === 'analytics' && 'Used to understand how you use our site'}
                            {key === 'marketing' && 'Used to show you relevant advertisements'}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings[key as keyof typeof privacySettings]}
                          onChange={() => handlePrivacyChange(key)}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            marginTop: '2px',
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'var(--md-neutral-50)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '12px' }}>
                    Learn more about how we protect your privacy
                  </p>
                  <a href="/privacy" style={{ color: 'var(--md-accent)', fontSize: '0.875rem', fontWeight: '500' }}>
                    View Privacy Policy →
                  </a>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="md-btn"
                  style={{ marginTop: '24px' }}
                >
                  Save Privacy Settings
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '24px', color: 'var(--md-neutral-800)' }}>
                  Security Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ padding: '20px', background: 'var(--md-neutral-50)', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: 'var(--md-neutral-800)' }}>
                      Password
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '12px' }}>
                      Last changed 3 months ago
                    </p>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: 'var(--md-neutral-800)',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Change Password
                    </button>
                  </div>

                  <div style={{ padding: '20px', background: 'var(--md-neutral-50)', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: 'var(--md-neutral-800)' }}>
                      Two-Factor Authentication
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '12px' }}>
                      Add an extra layer of security to your account
                    </p>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: 'var(--md-neutral-800)',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Enable 2FA
                    </button>
                  </div>

                  <div style={{ padding: '20px', background: 'var(--md-neutral-50)', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: 'var(--md-neutral-800)' }}>
                      Active Sessions
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '12px' }}>
                      Manage devices where you're signed in
                    </p>
                    <div style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '8px' }}>
                      Current device • {new Date().toLocaleDateString()}
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: 'var(--md-neutral-800)',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      View All Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '24px', color: 'var(--md-neutral-800)' }}>
                  Display Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>
                      Language
                    </label>
                    <select
                      value={displaySettings.language}
                      onChange={(e) => handleDisplayChange('language', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>
                      Currency
                    </label>
                    <select
                      value={displaySettings.currency}
                      onChange={(e) => handleDisplayChange('currency', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>
                      Timezone
                    </label>
                    <select
                      value={displaySettings.timezone}
                      onChange={(e) => handleDisplayChange('timezone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                      <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                      <option value="America/Toronto">Eastern Time (Toronto)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="md-btn"
                  style={{ marginTop: '24px' }}
                >
                  Save Display Settings
                </button>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '24px', color: 'var(--md-neutral-800)' }}>
                  Account Management
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ padding: '20px', background: 'var(--md-neutral-50)', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: 'var(--md-neutral-800)' }}>
                      Export Your Data
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '12px' }}>
                      Download a copy of your account data
                    </p>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: 'var(--md-neutral-800)',
                        border: '1px solid var(--md-neutral-200)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Request Data Export
                    </button>
                  </div>

                  <div style={{ padding: '20px', background: 'rgba(204, 85, 0, 0.05)', borderRadius: '8px', border: '1px solid rgba(204, 85, 0, 0.2)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '8px', color: 'var(--md-accent)' }}>
                      Danger Zone
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '16px' }}>
                      Irreversible actions for your account
                    </p>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        onClick={handleSignOut}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'white',
                          color: 'var(--md-neutral-600)',
                          border: '1px solid var(--md-neutral-200)',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'white',
                          color: 'var(--md-accent)',
                          border: '1px solid var(--md-accent)',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
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