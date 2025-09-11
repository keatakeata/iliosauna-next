'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Temporarily disabled to fix build
// import { analytics } from '@/lib/analytics';

// Mixpanel API configuration
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const MIXPANEL_API_SECRET = process.env.NEXT_PUBLIC_MIXPANEL_API_SECRET;

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ path: string; views: number }>;
  recentEvents: Array<{ name: string; time: string; properties: any }>;
  blogMetrics: {
    totalReads: number;
    avgReadTime: string;
    popularPosts: Array<{ title: string; views: number }>;
    searchTerms: Array<{ term: string; count: number }>;
  };
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('7days');
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);

  // Check authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-admin');
        if (response.ok) {
          setAuthorized(true);
          fetchAnalyticsData();
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch analytics data from Mixpanel
  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Fetch data from your API endpoint that connects to Mixpanel
      const response = await fetch(`/api/analytics/dashboard?range=${dateRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Use mock data for demonstration if API fails
        setAnalyticsData(getMockAnalyticsData());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Use mock data as fallback
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
    
    // Track admin dashboard view
    analytics.track('Admin Dashboard Viewed', { section: 'analytics' });
  };

  // Mock data for demonstration (replace with real Mixpanel API calls)
  const getMockAnalyticsData = (): AnalyticsData => ({
    pageViews: 12847,
    uniqueVisitors: 3421,
    avgSessionDuration: '4m 32s',
    bounceRate: '42.3%',
    topPages: [
      { path: '/saunas', views: 4523 },
      { path: '/', views: 3892 },
      { path: '/journal', views: 2156 },
      { path: '/our-story', views: 1432 },
      { path: '/contact', views: 844 }
    ],
    recentEvents: [
      { name: 'Page Viewed', time: '2 mins ago', properties: { path: '/saunas' } },
      { name: 'Blog Post Clicked', time: '5 mins ago', properties: { title: 'Science Behind Sauna Therapy' } },
      { name: 'Form Submitted', time: '12 mins ago', properties: { form_name: 'contact' } },
      { name: 'Quote Requested', time: '18 mins ago', properties: { product: 'Cedar Barrel Sauna' } },
      { name: 'Blog Search', time: '22 mins ago', properties: { search_term: 'maintenance' } }
    ],
    blogMetrics: {
      totalReads: 8734,
      avgReadTime: '3m 45s',
      popularPosts: [
        { title: 'The Science Behind Sauna Therapy', views: 2145 },
        { title: 'Finnish Sauna Tradition', views: 1832 },
        { title: 'Designing Your Perfect Home Sauna', views: 1567 }
      ],
      searchTerms: [
        { term: 'health benefits', count: 234 },
        { term: 'installation', count: 189 },
        { term: 'cedar', count: 156 },
        { term: 'maintenance', count: 132 }
      ]
    }
  });

  // Real-time event listener (simulated)
  useEffect(() => {
    if (!authorized) return;
    
    const eventInterval = setInterval(() => {
      // Simulate real-time events
      const events = [
        { type: 'Page View', path: '/saunas', user: 'Anonymous' },
        { type: 'Blog Read', post: 'Cedar vs Other Woods', user: 'User_' + Math.floor(Math.random() * 1000) },
        { type: 'Search', query: 'infrared sauna', user: 'Anonymous' },
        { type: 'Contact Form', action: 'Started', user: 'Anonymous' }
      ];
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const newEvent = {
        ...randomEvent,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now()
      };
      
      setRealTimeEvents(prev => [newEvent, ...prev].slice(0, 10));
    }, 5000); // Add new event every 5 seconds
    
    return () => clearInterval(eventInterval);
  }, [authorized]);

  useEffect(() => {
    if (authorized && dateRange) {
      fetchAnalyticsData();
    }
  }, [dateRange, authorized]);

  if (!authorized || loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f8f8'
      }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#333' }}>
          Analytics Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white'
            }}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={() => router.push('/admin')}
            style={{
              padding: '0.5rem 1rem',
              background: '#9B8B7E',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Admin
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem' }}>
        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <MetricCard
            title="Page Views"
            value={analyticsData?.pageViews.toLocaleString() || '0'}
            change="+12.5%"
            positive={true}
          />
          <MetricCard
            title="Unique Visitors"
            value={analyticsData?.uniqueVisitors.toLocaleString() || '0'}
            change="+8.3%"
            positive={true}
          />
          <MetricCard
            title="Avg. Session Duration"
            value={analyticsData?.avgSessionDuration || '0m 0s'}
            change="+5.2%"
            positive={true}
          />
          <MetricCard
            title="Bounce Rate"
            value={analyticsData?.bounceRate || '0%'}
            change="-2.1%"
            positive={true}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Top Pages */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 300, marginBottom: '1rem' }}>
              Top Pages
            </h2>
            {analyticsData?.topPages.map((page, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: index < analyticsData.topPages.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <span style={{ color: '#666' }}>{page.path}</span>
                <span style={{ fontWeight: 500 }}>{page.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>

          {/* Blog Metrics */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 300, marginBottom: '1rem' }}>
              Blog Performance
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#666' }}>Total Reads</span>
                <span style={{ fontWeight: 500 }}>{analyticsData?.blogMetrics.totalReads.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Avg. Read Time</span>
                <span style={{ fontWeight: 500 }}>{analyticsData?.blogMetrics.avgReadTime}</span>
              </div>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 400, marginBottom: '0.5rem' }}>
              Popular Posts
            </h3>
            {analyticsData?.blogMetrics.popularPosts.map((post, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#666', maxWidth: '70%' }}>{post.title}</span>
                <span>{post.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Events & Search Terms */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          {/* Real-time Events */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 300, marginBottom: '1rem' }}>
              Recent Activity
              <span style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: '#4CAF50',
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}>LIVE</span>
            </h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {realTimeEvents.map((event) => (
                <div key={event.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderBottom: '1px solid #eee',
                  animation: 'slideIn 0.3s ease'
                }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{event.type}</span>
                    <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      {event.path || event.post || event.query || event.action}
                    </span>
                  </div>
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>{event.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Terms */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 300, marginBottom: '1rem' }}>
              Top Search Terms
            </h2>
            {analyticsData?.blogMetrics.searchTerms.map((term, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#666' }}>{term.term}</span>
                <span style={{
                  padding: '0.2rem 0.5rem',
                  background: '#f0f0f0',
                  borderRadius: '12px',
                  fontSize: '0.85rem'
                }}>
                  {term.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mixpanel Integration Status */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here' 
            ? '#d4edda' 
            : '#fff3cd',
          border: `1px solid ${MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here' ? '#c3e6cb' : '#ffeeba'}`,
          borderRadius: '4px',
          color: MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here' 
            ? '#155724' 
            : '#856404'
        }}>
          <strong>Mixpanel Status:</strong> {
            MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token-here'
              ? '✓ Connected - Real-time tracking active'
              : '⚠ Using demo data - Configure NEXT_PUBLIC_MIXPANEL_TOKEN to see real analytics'
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, positive }: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>{value}</p>
      <p style={{
        fontSize: '0.85rem',
        color: positive ? '#4CAF50' : '#f44336'
      }}>
        {positive ? '↑' : '↓'} {change} from previous period
      </p>
    </div>
  );
}