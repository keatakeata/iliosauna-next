import { NextResponse } from 'next/server';

export async function GET() {
  // Check which environment variables are available
  const envCheck = {
    hasGHLToken: !!process.env.GHL_ACCESS_TOKEN,
    tokenPreview: process.env.GHL_ACCESS_TOKEN ? 
      process.env.GHL_ACCESS_TOKEN.substring(0, 20) + '...' : 
      'NOT SET',
    hasLocationId: !!process.env.GHL_LOCATION_ID,
    locationId: process.env.GHL_LOCATION_ID || 'NOT SET',
    hasApiBase: !!process.env.GHL_API_BASE,
    apiBase: process.env.GHL_API_BASE || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production'
  };

  // Security: Only show in development or with auth
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      message: 'GHL Configuration Status',
      configured: envCheck.hasGHLToken && envCheck.hasLocationId,
      details: 'Details hidden in production for security'
    });
  }

  return NextResponse.json(envCheck);
}