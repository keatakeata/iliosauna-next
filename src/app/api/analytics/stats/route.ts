import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projectId = process.env.MIXPANEL_PROJECT_ID || '3411339';
    const apiSecret = process.env.MIXPANEL_API_SECRET;
    
    if (!apiSecret) {
      // Return mock data if no API secret
      return NextResponse.json({
        totalBlogs: 3,
        publishedBlogs: 2,
        draftBlogs: 1,
        totalViews: 213,
        uniqueVisitors: 42,
        avgSessionDuration: '2m 34s'
      });
    }

    // For now, return mock data since Mixpanel API requires specific endpoints
    // In production, you would fetch from Mixpanel's API here
    return NextResponse.json({
      totalBlogs: 3,
      publishedBlogs: 2, 
      draftBlogs: 1,
      totalViews: 213,
      uniqueVisitors: 42,
      avgSessionDuration: '2m 34s'
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    // Return fallback data on error
    return NextResponse.json({
      totalBlogs: 3,
      publishedBlogs: 2,
      draftBlogs: 1,
      totalViews: 213,
      uniqueVisitors: 42,
      avgSessionDuration: '2m 34s'
    });
  }
}