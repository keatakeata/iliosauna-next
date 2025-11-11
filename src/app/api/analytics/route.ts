import { NextRequest, NextResponse } from 'next/server';
import { fetchGA4Analytics } from '@/lib/ga4';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    // Calculate date range
    const now = new Date();
    let startDate: string;
    let endDate: string = now.toISOString().split('T')[0]; // today in YYYY-MM-DD

    if (customStart && customEnd) {
      startDate = customStart;
      endDate = customEnd;
    } else {
      const ranges: Record<string, number> = {
        '24h': 1,
        '7d': 7,
        '30d': 30,
      };
      const daysAgo = ranges[range] || 7;
      const start = new Date(now);
      start.setDate(start.getDate() - daysAgo);
      startDate = start.toISOString().split('T')[0];
    }

    console.log(`[Analytics API] Fetching data from ${startDate} to ${endDate}`);

    // Try to fetch real data from GA4
    const ga4Data = await fetchGA4Analytics(startDate, endDate);

    if (ga4Data) {
      console.log('[Analytics API] Successfully fetched GA4 data');
      return NextResponse.json(ga4Data);
    }

    // If GA4 is not configured, return a helpful message
    console.warn('[Analytics API] GA4 not configured, returning setup instructions');
    return NextResponse.json({
      error: 'GA4_NOT_CONFIGURED',
      message: 'Google Analytics 4 is not yet configured. Please see GA4_SETUP_INSTRUCTIONS.md for setup steps.',
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      currentOnline: 0,
      topPages: [],
      countries: [],
      deviceBreakdown: [],
      browsers: [],
      operatingSystems: [],
      referrers: [],
      trafficChart: []
    });

  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error',
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        currentOnline: 0,
        topPages: [],
        countries: [],
        deviceBreakdown: [],
        browsers: [],
        operatingSystems: [],
        referrers: [],
        trafficChart: []
      },
      { status: 500 }
    );
  }
}
