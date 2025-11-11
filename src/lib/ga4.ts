import { BetaAnalyticsDataClient } from '@google-analytics/data';

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

// Initialize GA4 client
function getGA4Client() {
  if (analyticsDataClient) {
    return analyticsDataClient;
  }

  try {
    // Try to load credentials from environment variable
    const credentialsJson = process.env.GA4_CREDENTIALS;

    if (credentialsJson) {
      const credentials = JSON.parse(credentialsJson);
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials
      });
    } else {
      console.warn('GA4_CREDENTIALS not found in environment variables');
      return null;
    }

    return analyticsDataClient;
  } catch (error) {
    console.error('Failed to initialize GA4 client:', error);
    return null;
  }
}

export interface GA4AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  currentOnline: number;
  topPages: { path: string; views: number }[];
  countries: { country: string; visitors: number; percentage: number; countryCode: string }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  operatingSystems: { os: string; visitors: number; percentage: number }[];
  referrers: { source: string; count: number }[];
  trafficChart: { date: string; visitors: number }[];
}

export async function fetchGA4Analytics(
  startDate: string,
  endDate: string
): Promise<GA4AnalyticsData | null> {
  const client = getGA4Client();
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!client || !propertyId) {
    console.warn('GA4 client or property ID not configured');
    return null;
  }

  try {
    // Fetch multiple reports in parallel
    const [
      overviewReport,
      pagesReport,
      countriesReport,
      devicesReport,
      browsersReport,
      osReport,
      referrersReport,
      dailyReport
    ] = await Promise.all([
      // Overview metrics
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'activeUsers' }
        ]
      }),
      // Top pages
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
      }),
      // Countries
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'totalUsers' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }]
      }),
      // Devices
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'totalUsers' }]
      }),
      // Browsers
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'browser' }],
        metrics: [{ name: 'totalUsers' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }]
      }),
      // Operating Systems
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'operatingSystem' }],
        metrics: [{ name: 'totalUsers' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }]
      }),
      // Referrers
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        limit: 10,
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }),
      // Daily traffic
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
      })
    ]);

    // Parse overview metrics
    const overviewRow = overviewReport[0].rows?.[0];
    const pageViews = parseInt(overviewRow?.metricValues?.[0]?.value || '0');
    const uniqueVisitors = parseInt(overviewRow?.metricValues?.[1]?.value || '0');
    const bounceRate = Math.round(parseFloat(overviewRow?.metricValues?.[2]?.value || '0') * 100);
    const currentOnline = parseInt(overviewRow?.metricValues?.[3]?.value || '0');

    // Parse top pages
    const topPages = (pagesReport[0].rows || []).map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0')
    }));

    // Parse countries with country codes
    const totalVisitors = uniqueVisitors;
    const countries = (countriesReport[0].rows || []).map(row => {
      const country = row.dimensionValues?.[0]?.value || '';
      const visitors = parseInt(row.metricValues?.[0]?.value || '0');
      const percentage = Math.round((visitors / totalVisitors) * 100);
      const countryCode = getCountryCode(country);
      return { country, visitors, percentage, countryCode };
    });

    // Parse devices
    const deviceData = devicesReport[0].rows || [];
    const totalDeviceUsers = deviceData.reduce((sum, row) =>
      sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);
    const deviceBreakdown = deviceData.map(row => {
      const device = row.dimensionValues?.[0]?.value || '';
      const count = parseInt(row.metricValues?.[0]?.value || '0');
      const percentage = Math.round((count / totalDeviceUsers) * 100);
      return {
        device: device.charAt(0).toUpperCase() + device.slice(1),
        count,
        percentage
      };
    });

    // Parse browsers
    const browserData = browsersReport[0].rows || [];
    const totalBrowserUsers = browserData.reduce((sum, row) =>
      sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);
    const browsers = browserData.map(row => {
      const browser = row.dimensionValues?.[0]?.value || '';
      const count = parseInt(row.metricValues?.[0]?.value || '0');
      const percentage = Math.round((count / totalBrowserUsers) * 100);
      return { browser, count, percentage };
    });

    // Parse operating systems
    const osData = osReport[0].rows || [];
    const totalOsUsers = osData.reduce((sum, row) =>
      sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);
    const operatingSystems = osData.map(row => {
      const os = row.dimensionValues?.[0]?.value || '';
      const visitors = parseInt(row.metricValues?.[0]?.value || '0');
      const percentage = Math.round((visitors / totalOsUsers) * 100);
      return { os, visitors, percentage };
    });

    // Parse referrers
    const referrers = (referrersReport[0].rows || []).map(row => ({
      source: row.dimensionValues?.[0]?.value || '',
      count: parseInt(row.metricValues?.[0]?.value || '0')
    }));

    // Parse daily traffic
    const trafficChart = (dailyReport[0].rows || []).map(row => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      const date = new Date(
        parseInt(dateStr.substring(0, 4)),
        parseInt(dateStr.substring(4, 6)) - 1,
        parseInt(dateStr.substring(6, 8))
      );
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: parseInt(row.metricValues?.[0]?.value || '0')
      };
    });

    return {
      pageViews,
      uniqueVisitors,
      bounceRate,
      currentOnline,
      topPages,
      countries,
      deviceBreakdown,
      browsers,
      operatingSystems,
      referrers,
      trafficChart
    };

  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return null;
  }
}

// Helper function to map country names to country codes for flags
function getCountryCode(country: string): string {
  const countryMap: Record<string, string> = {
    'Canada': 'CA',
    'United States': 'US',
    'United States of America': 'US',
    'Netherlands': 'NL',
    'Switzerland': 'CH',
    'United Kingdom': 'GB',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Australia': 'AU',
    'Japan': 'JP',
    'China': 'CN',
    'India': 'IN',
    'Brazil': 'BR',
    'Mexico': 'MX',
    // Add more as needed
  };

  return countryMap[country] || 'XX';
}
