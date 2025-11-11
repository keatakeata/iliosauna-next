'use client';

import { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  currentOnline: number;
  topPages: { path: string; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
  referrers: { source: string; count: number }[];
  recentEvents: { event: string; timestamp: string; page: string }[];
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    currentOnline: 0,
    topPages: [],
    deviceBreakdown: [],
    referrers: [],
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // 24h, 7d, 30d

  useEffect(() => {
    // Track that someone viewed the analytics dashboard
    track('Analytics Dashboard View');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      // Refresh every 30 seconds
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
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
    // Simple password check - you can change this password
    if (password === 'ilioanalytics2025') {
      setIsAuthenticated(true);
      localStorage.setItem('analytics_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  // Check if already authenticated on mount
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter dashboard password"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">ilio Sauna Analytics</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 rounded-lg ${timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Page Views"
            value={analyticsData.pageViews.toLocaleString()}
            icon="📊"
            color="bg-blue-600"
          />
          <StatCard
            title="Unique Visitors"
            value={analyticsData.uniqueVisitors.toLocaleString()}
            icon="👥"
            color="bg-green-600"
          />
          <StatCard
            title="Currently Online"
            value={analyticsData.currentOnline.toString()}
            icon="🟢"
            color="bg-purple-600"
          />
          <StatCard
            title="Avg. Time on Site"
            value="2m 34s"
            icon="⏱️"
            color="bg-orange-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Top Pages</h2>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span className="text-gray-300">{page.path}</span>
                  <span className="text-white font-semibold">{page.views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referrers */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Top Referrers</h2>
            <div className="space-y-3">
              {analyticsData.referrers.map((referrer, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span className="text-gray-300">{referrer.source}</span>
                  <span className="text-white font-semibold">{referrer.count} visits</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Device Breakdown</h2>
            <div className="space-y-3">
              {analyticsData.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <span className="text-gray-300">{device.device}</span>
                  <span className="text-white font-semibold">{device.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Events</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analyticsData.recentEvents.map((event, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded">
                  <div className="text-white font-semibold">{event.event}</div>
                  <div className="text-gray-400 text-sm">{event.page}</div>
                  <div className="text-gray-500 text-xs">{event.timestamp}</div>
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

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold text-white mt-2`}>{value}</div>
    </div>
  );
}
