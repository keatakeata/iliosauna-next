'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ROUTES } from '@/lib/routes';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: 'BC',
    postalCode: '',
  });

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push(ROUTES.SIGN_IN);
      return;
    }

    // Load user data
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phone: user.phoneNumbers[0]?.phoneNumber || '',
        address: '',
        city: '',
        province: 'BC',
        postalCode: '',
      });
      setIsLoading(false);
    }
  }, [user, isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save profile data to Supabase
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceScrolled={true} />
      
      <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <a href={ROUTES.ACCOUNT.DASHBOARD} style={{ color: '#666', textDecoration: 'none' }}>
              Account
            </a>
            <span style={{ margin: '0 8px', color: '#999' }}>/</span>
            <span style={{ color: '#1a1a1a' }}>Profile</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '32px', color: '#1a1a1a' }}>
            My Profile
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Personal Information */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '20px', color: '#1a1a1a' }}>
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                    Email cannot be changed here. Update in account settings.
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Shipping Address */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '20px', color: '#1a1a1a' }}>
                Shipping Address
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                    Province
                  </label>
                  <select
                    name="province"
                    value={profileData.province}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      backgroundColor: '#fff',
                    }}
                  >
                    <option value="BC">BC</option>
                    <option value="AB">AB</option>
                    <option value="ON">ON</option>
                    <option value="QC">QC</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={profileData.postalCode}
                  onChange={handleInputChange}
                  maxLength={7}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Update Address
              </button>
            </div>
          </div>

          {/* Account Security */}
          <div style={{ 
            background: '#fff', 
            padding: '24px', 
            borderRadius: '8px', 
            border: '1px solid #e5e5e5',
            marginTop: '32px'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '20px', color: '#1a1a1a' }}>
              Account Security
            </h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Manage your account security settings and authentication methods.
            </p>
            <button
              onClick={() => router.push(ROUTES.ACCOUNT.SETTINGS)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                color: '#1a1a1a',
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Manage Security Settings
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}