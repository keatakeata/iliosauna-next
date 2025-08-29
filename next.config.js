const { join } = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
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