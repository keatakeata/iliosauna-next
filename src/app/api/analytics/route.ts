import { NextRequest, NextResponse } from 'next/server';

// This endpoint aggregates analytics data from multiple sources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = Date.now();
    const ranges: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const rangeMs = ranges[range] || ranges['7d'];
    const startDate = new Date(now - rangeMs);

    // Fetch Google Analytics data using the Global Site Tag (gtag)
    // Since we can't access GA4 data server-side without the Measurement Protocol API,
    // we'll use mock data for now and you can connect to GA4 Reporting API later

    // Mock analytics data (replace with real data from your tracking)
    const analyticsData = {
      pageViews: getRandomNumber(range === '24h' ? 100 : range === '7d' ? 500 : 2000, 300),
      uniqueVisitors: getRandomNumber(range === '24h' ? 50 : range === '7d' ? 250 : 1000, 150),
      currentOnline: getRandomNumber(1, 15),
      topPages: [
        { path: '/', views: getRandomNumber(50, 200) },
        { path: '/saunas', views: getRandomNumber(30, 150) },
        { path: '/products', views: getRandomNumber(25, 120) },
        { path: '/our-story', views: getRandomNumber(20, 80) },
        { path: '/journal', views: getRandomNumber(15, 60) },
        { path: '/contact', views: getRandomNumber(10, 50) },
      ].sort((a, b) => b.views - a.views),
      deviceBreakdown: [
        { device: 'Desktop', count: getRandomNumber(40, 60) },
        { device: 'Mobile', count: getRandomNumber(30, 50) },
        { device: 'Tablet', count: getRandomNumber(5, 15) },
      ],
      referrers: [
        { source: 'Google Search', count: getRandomNumber(50, 150) },
        { source: 'Direct', count: getRandomNumber(40, 100) },
        { source: 'Facebook', count: getRandomNumber(20, 60) },
        { source: 'Instagram', count: getRandomNumber(15, 50) },
        { source: 'Email', count: getRandomNumber(10, 30) },
      ].sort((a, b) => b.count - a.count),
      recentEvents: generateRecentEvents(10),
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function getRandomNumber(base: number, variance: number): number {
  return Math.floor(base + (Math.random() - 0.5) * variance);
}

function generateRecentEvents(count: number) {
  const events = [
    'Page View',
    'Product View',
    'Add to Cart',
    'Contact Form Submit',
    'Newsletter Signup',
    'Download Brochure',
  ];

  const pages = [
    '/',
    '/saunas',
    '/products',
    '/our-story',
    '/journal',
    '/contact',
  ];

  const recentEvents = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    const timestamp = new Date(now - Math.random() * 3600000); // Last hour

    recentEvents.push({
      event: randomEvent,
      page: randomPage,
      timestamp: timestamp.toLocaleTimeString(),
    });
  }

  return recentEvents.sort((a, b) =>
    new Date('1970/01/01 ' + b.timestamp).getTime() -
    new Date('1970/01/01 ' + a.timestamp).getTime()
  );
}
