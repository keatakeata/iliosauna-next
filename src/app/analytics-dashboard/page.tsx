'use client';

import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  currentOnline: number;
  topPages: { path: string; views: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  operatingSystems: { os: string; visitors: number; percentage: number }[];
  countries: { country: string; visitors: number; percentage: number; countryCode?: string }[];
  referrers: { source: string; count: number }[];
  trafficChart: { date: string; visitors: number }[];
  error?: string;
  message?: string;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // 24h, 7d, 30d, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    track('Analytics Dashboard View');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, timeRange, startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      let url = `/api/analytics?range=${timeRange}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setAnalyticsData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ilioanalytics2025') {
      setIsAuthenticated(true);
      localStorage.setItem('analytics_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('analytics_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Analytics Dashboard
          </h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter dashboard password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading analytics...</div>
      </div>
    );
  }

  // Show setup message if GA4 is not configured
  if (!analyticsData || analyticsData.error === 'GA4_NOT_CONFIGURED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-lg p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">⚙️ Google Analytics 4 Setup Required</h1>
          <p className="text-gray-300 mb-4">{analyticsData?.message || 'Google Analytics 4 needs to be configured to view analytics data.'}</p>
          <div className="bg-gray-900 rounded p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">To enable real-time analytics:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>Follow instructions in <code className="bg-gray-700 px-2 py-1 rounded">GA4_SETUP_INSTRUCTIONS.md</code></li>
              <li>Create a Google Cloud service account</li>
              <li>Download the credentials JSON</li>
              <li>Add credentials to environment variables</li>
            </ol>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setLoading(true);
                fetchAnalytics();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('analytics_auth');
                setIsAuthenticated(false);
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">ilio Sauna Analytics</h1>
            <p className="text-gray-400 mt-2">Real-time website analytics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                30 Days
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value && endDate) {
                    setTimeRange('custom');
                  }
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (startDate && e.target.value) {
                    setTimeRange('custom');
                  }
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Visitors"
            value={analyticsData.uniqueVisitors.toLocaleString()}
            change="-3%"
            changeColor="text-red-400"
            icon="👥"
          />
          <StatCard
            title="Page Views"
            value={analyticsData.pageViews.toLocaleString()}
            change="-24%"
            changeColor="text-red-400"
            icon="📄"
          />
          <StatCard
            title="Bounce Rate"
            value={`${analyticsData.bounceRate}%`}
            change="+8%"
            changeColor="text-red-400"
            icon="↗️"
          />
          <StatCard
            title="Currently Online"
            value={analyticsData.currentOnline.toString()}
            icon="🟢"
          />
        </div>

        {/* Traffic Chart */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Traffic Overview</h2>
          <div className="h-64 flex items-end justify-between gap-1">
            {analyticsData.trafficChart.map((item, index) => {
              const maxVisitors = Math.max(...analyticsData.trafficChart.map(d => d.visitors));
              const height = (item.visitors / maxVisitors) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-500 transition-colors relative"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.visitors} visitors
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left">
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Pages</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-2">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{page.path}</span>
                  <span className="text-white font-semibold">{page.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referrers */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Referrers</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-2">
              {analyticsData.referrers.map((referrer, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{referrer.source}</span>
                  <span className="text-white font-semibold">{referrer.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Countries</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-3">
              {analyticsData.countries.map((country, index) => {
                const countryCode = country.countryCode || getCountryCodeFromName(country.country);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                          alt={country.country}
                          className="w-5 h-4 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-gray-300">{country.country}</span>
                      </div>
                      <span className="text-white font-semibold">{country.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Devices</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-3">
              {analyticsData.deviceBreakdown.map((device, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">{device.device}</span>
                    <span className="text-white font-semibold">{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Browsers</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-2">
              {analyticsData.browsers.map((browser, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{browser.browser}</span>
                  <span className="text-white font-semibold">{browser.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Operating Systems</h2>
              <span className="text-gray-400 text-sm">VISITORS</span>
            </div>
            <div className="space-y-2">
              {analyticsData.operatingSystems.map((os, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{os.os}</span>
                  <span className="text-white font-semibold">{os.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-gray-400 text-sm">
          Last updated: {new Date().toLocaleString()} • Auto-refreshes every 30 seconds
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  change,
  changeColor
}: {
  title: string;
  value: string;
  icon: string;
  change?: string;
  changeColor?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        {change && (
          <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
        )}
      </div>
    </div>
  );
}

// Helper function to get country code from country name
function getCountryCodeFromName(country: string): string {
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
    'Belgium': 'BE',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Austria': 'AT',
    'Portugal': 'PT',
    'Ireland': 'IE',
    'New Zealand': 'NZ',
    'Singapore': 'SG',
    'South Korea': 'KR',
    'Russia': 'RU',
    'Turkey': 'TR',
  };

  return countryMap[country] || 'XX';
}
