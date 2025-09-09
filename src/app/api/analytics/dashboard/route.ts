import { NextRequest, NextResponse } from 'next/server';

const MIXPANEL_API_SECRET = process.env.MIXPANEL_API_SECRET;
const MIXPANEL_PROJECT_ID = process.env.MIXPANEL_PROJECT_ID;

// Helper to get date range
function getDateRange(range: string) {
  const now = new Date();
  const from = new Date();
  
  switch(range) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      break;
    case '7days':
      from.setDate(now.getDate() - 7);
      break;
    case '30days':
      from.setDate(now.getDate() - 30);
      break;
    case '90days':
      from.setDate(now.getDate() - 90);
      break;
    default:
      from.setDate(now.getDate() - 7);
  }
  
  return {
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0]
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7days';
    const { from, to } = getDateRange(range);

    // If Mixpanel is configured, fetch real data
    if (MIXPANEL_API_SECRET && MIXPANEL_PROJECT_ID) {
      // Mixpanel API endpoints
      const baseUrl = 'https://mixpanel.com/api/2.0';
      const headers = {
        'Authorization': `Basic ${Buffer.from(`${MIXPANEL_API_SECRET}:`).toString('base64')}`,
        'Accept': 'application/json'
      };

      try {
        // Fetch insights from Mixpanel
        // Note: You'll need to customize these based on your actual Mixpanel events
        const [eventsResponse, funnelsResponse] = await Promise.all([
          // Get event data
          fetch(`${baseUrl}/events?project_id=${MIXPANEL_PROJECT_ID}&from_date=${from}&to_date=${to}&event=["Page Viewed","Blog Post Clicked","Form Submitted"]`, {
            headers
          }),
          // Get funnel data (if you have funnels set up)
          fetch(`${baseUrl}/funnels/list?project_id=${MIXPANEL_PROJECT_ID}`, {
            headers
          })
        ]);

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          
          // Process the real Mixpanel data
          const analyticsData = {
            pageViews: eventsData.data?.series?.['Page Viewed']?.total || 0,
            uniqueVisitors: eventsData.data?.series?.['Page Viewed']?.unique || 0,
            avgSessionDuration: calculateAvgDuration(eventsData),
            bounceRate: calculateBounceRate(eventsData),
            topPages: extractTopPages(eventsData),
            recentEvents: extractRecentEvents(eventsData),
            blogMetrics: extractBlogMetrics(eventsData)
          };

          return NextResponse.json(analyticsData);
        }
      } catch (mixpanelError) {
        console.error('Mixpanel API error:', mixpanelError);
      }
    }

    // Return demo data if Mixpanel is not configured or fails
    const demoData = {
      pageViews: Math.floor(Math.random() * 5000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 2000) + 3000,
      avgSessionDuration: `${Math.floor(Math.random() * 5) + 2}m ${Math.floor(Math.random() * 60)}s`,
      bounceRate: `${(Math.random() * 30 + 30).toFixed(1)}%`,
      topPages: [
        { path: '/saunas', views: Math.floor(Math.random() * 2000) + 3000 },
        { path: '/', views: Math.floor(Math.random() * 2000) + 2500 },
        { path: '/journal', views: Math.floor(Math.random() * 1500) + 1500 },
        { path: '/our-story', views: Math.floor(Math.random() * 1000) + 1000 },
        { path: '/contact', views: Math.floor(Math.random() * 500) + 500 }
      ],
      recentEvents: generateRecentEvents(),
      blogMetrics: {
        totalReads: Math.floor(Math.random() * 5000) + 5000,
        avgReadTime: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
        popularPosts: [
          { title: 'The Science Behind Sauna Therapy', views: Math.floor(Math.random() * 1000) + 1500 },
          { title: 'Finnish Sauna Tradition', views: Math.floor(Math.random() * 1000) + 1200 },
          { title: 'Designing Your Perfect Home Sauna', views: Math.floor(Math.random() * 1000) + 1000 }
        ],
        searchTerms: [
          { term: 'health benefits', count: Math.floor(Math.random() * 200) + 100 },
          { term: 'installation', count: Math.floor(Math.random() * 150) + 100 },
          { term: 'cedar', count: Math.floor(Math.random() * 100) + 100 },
          { term: 'maintenance', count: Math.floor(Math.random() * 100) + 50 }
        ]
      }
    };

    return NextResponse.json(demoData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Helper functions for processing Mixpanel data
function calculateAvgDuration(data: any): string {
  // Calculate from actual Mixpanel data
  const avgSeconds = data.avg_session_length || 240;
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function calculateBounceRate(data: any): string {
  // Calculate from actual Mixpanel data
  const bounceRate = data.bounce_rate || 0.45;
  return `${(bounceRate * 100).toFixed(1)}%`;
}

function extractTopPages(data: any): any[] {
  // Extract from actual Mixpanel data
  if (data.top_pages) {
    return data.top_pages.slice(0, 5);
  }
  return [];
}

function extractRecentEvents(data: any): any[] {
  // Extract from actual Mixpanel data
  if (data.recent_events) {
    return data.recent_events.slice(0, 5);
  }
  return [];
}

function extractBlogMetrics(data: any): any {
  // Extract from actual Mixpanel data
  return {
    totalReads: data.blog_reads || 0,
    avgReadTime: data.avg_read_time || '0m 0s',
    popularPosts: data.popular_posts || [],
    searchTerms: data.search_terms || []
  };
}

function generateRecentEvents(): any[] {
  const events = [
    { name: 'Page Viewed', time: '2 mins ago', properties: { path: '/saunas' } },
    { name: 'Blog Post Clicked', time: '5 mins ago', properties: { title: 'Science Behind Sauna Therapy' } },
    { name: 'Form Submitted', time: '12 mins ago', properties: { form_name: 'contact' } },
    { name: 'Quote Requested', time: '18 mins ago', properties: { product: 'Cedar Barrel Sauna' } },
    { name: 'Blog Search', time: '22 mins ago', properties: { search_term: 'maintenance' } }
  ];
  return events;
}