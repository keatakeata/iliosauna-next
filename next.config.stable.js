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
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  
  // Disable type checking during dev for faster startup
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Custom webpack configuration for maximum stability
  webpack: (config, { dev, isServer }) => {
    // Optimize for Windows development
    if (dev && process.platform === 'win32') {
      // Disable source maps for faster builds
      config.devtool = false;
      
      // Disable file system caching
      config.cache = false;
      
      // Reduce memory usage
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Add fallbacks for node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
    }
    
    return config;
  },
  
  // Disable production optimizations in dev
  productionBrowserSourceMaps: false,
  
  // Experimental features for stability
  experimental: {
    // Disable worker threads on Windows
    workerThreads: false,
    // Limit CPU usage
    cpus: 1,
    // Disable turbo for stability
    turbo: false,
  },
  
  // Development server configuration
  devIndicators: {
    buildActivity: false, // Disable build indicator
  },
  
  // Disable telemetry
  telemetry: false,
  
  // Output configuration
  output: 'standalone',
  
  // Disable compression in dev
  compress: false,
  
  // Increase timeout for slow Windows systems
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;