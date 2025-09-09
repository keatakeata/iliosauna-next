'use client';

import { useRouter } from 'next/navigation';
import { FileText, PenTool, Layout, Eye, Edit3, BarChart3, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState({
    totalBlogs: 3,
    publishedBlogs: 2,
    draftBlogs: 1,
    totalViews: 213
  });

  useEffect(() => {
    // Fetch analytics data from our API
    fetch('/api/analytics/stats')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.log('Analytics fetch error:', err));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '0.5rem',
            color: '#2c3e50'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
            Manage your website content and view analytics
          </p>
        </header>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {[
            { label: 'Total Blogs', value: analytics.totalBlogs, icon: FileText, color: '#3498db' },
            { label: 'Published', value: analytics.publishedBlogs, icon: Edit3, color: '#27ae60' },
            { label: 'Drafts', value: analytics.draftBlogs, icon: PenTool, color: '#f39c12' },
            { label: 'Total Views', value: analytics.totalViews, icon: Eye, color: '#e74c3c' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <stat.icon size={32} color={stat.color} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '300', color: '#2c3e50' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Management Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          
          {/* Sanity Studio Access */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '400',
              marginBottom: '1.5rem',
              color: '#2c3e50'
            }}>
              Content Management
            </h3>
            
            <button
              onClick={() => {
                // Navigate to Sanity Studio
                window.location.href = '/studio';
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#9B8B7E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Edit3 size={20} />
              Open Sanity Studio
            </button>
            
            <p style={{ fontSize: '0.9rem', color: '#6c757d', textAlign: 'center' }}>
              Full CMS interface for managing all content
            </p>
          </div>

          {/* Quick Links */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '400',
              marginBottom: '1.5rem',
              color: '#2c3e50'
            }}>
              Quick Links
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="/journal"
                target="_blank"
                style={{
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#2c3e50',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FileText size={16} />
                View Blog Posts
              </a>
              
              <a
                href="/admin/analytics"
                style={{
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#2c3e50',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <BarChart3 size={16} />
                View Analytics
              </a>
            </div>
          </div>
          
          {/* Instructions */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '400',
              marginBottom: '1.5rem',
              color: '#2c3e50'
            }}>
              How to Edit Content
            </h3>
            
            <ol style={{
              paddingLeft: '1.2rem',
              fontSize: '0.9rem',
              color: '#6c757d',
              lineHeight: '1.8'
            }}>
              <li>Click "Open Sanity Studio" above</li>
              <li>Select the content type you want to edit:
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  <li><strong>Blog Posts</strong> - Create & edit articles</li>
                  <li><strong>Homepage</strong> - Edit homepage content</li>
                  <li><strong>Our Story</strong> - Update company story</li>
                  <li><strong>Saunas</strong> - Manage sauna products</li>
                  <li><strong>Contact</strong> - Update contact info</li>
                </ul>
              </li>
              <li>Make your changes and click "Publish"</li>
              <li>Changes appear instantly on the website</li>
            </ol>
          </div>
          
        </div>
      </div>
    </div>
  );
}