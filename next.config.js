const { join } = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile packages to fix Next.js 15 compatibility
  transpilePackages: ['framer-motion', 'sanity', '@sanity/ui'],
  // Comprehensive headers for development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' data: https: blob: wss:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://www.google.com/maps https://maps.google.com https://ssl.google-analytics.com https://www.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://clerk.com https://*.clerk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://maps.googleapis.com; img-src 'self' data: https: blob: https://maps.gstatic.com https://maps.googleapis.com https://www.google.com/maps; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss: https://maps.googleapis.com https://*.google.com https://api.mixpanel.com https://api-js.mixpanel.com https://ssl.google-analytics.com https://www.google-analytics.com https://clerk.com https://*.clerk.com; frame-src 'self' https://maps.google.com https://www.google.com/maps https://maps.gstatic.com https://clerk.com https://accounts.clerk.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';`
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/**',
      },
    ],
  },

  // Use default build directory for Vercel
  // distDir: '.build', // Commented out for Vercel compatibility

  // Disable type checking during dev (faster startup)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Custom webpack configuration for Windows
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development on Windows
    if (dev && process.platform === 'win32') {
      config.devtool = false;
    }

    // Disable file system caching on Windows
    if (process.platform === 'win32') {
      config.cache = false;
    }

    // Add fallbacks for node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Disable telemetry and analytics
  productionBrowserSourceMaps: false,

  // Experimental features to improve Windows compatibility
  experimental: {
    // Use different worker strategy
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
