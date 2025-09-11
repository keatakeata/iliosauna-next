/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Increase worker limits for better build performance
    cpus: Math.max(1, require('os').cpus().length - 1),
    workerThreads: true,
    esmExternals: true,
  },
  // Webpack configuration for SSR compatibility
  webpack: (config, { dev, isServer, webpack }) => {
    // Fix browser-only globals for server-side rendering
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Prevent server-side bundling of browser-only APIs
        'self': false,
        'window': false,
        'document': false,
        'navigator': false,
        'localStorage': false,
        'sessionStorage': false,
      };
      
      // Define globals as undefined on server to prevent runtime errors
      config.plugins.push(
        new webpack.DefinePlugin({
          'self': 'undefined',
          'window': 'undefined',
          'document': 'undefined',
          'navigator': 'undefined',
          'localStorage': 'undefined',
          'sessionStorage': 'undefined',
        })
      );
    } else {
      // Client-side: ensure proper browser globals
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'fs': false,
        'path': false,
        'os': false,
      };
    }

    // Exclude browser-only packages from server bundles
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'mixpanel-browser': 'commonjs mixpanel-browser'
      });
    }
    
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
          },
        },
      };
    }
    return config;
  },
  // Temporarily exclude account pages from build if Clerk is not configured
  async redirects() {
    const clerkEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';
    if (!clerkEnabled) {
      return [
        {
          source: '/account/:path*',
          destination: '/',
          permanent: false,
        },
      ];
    }
    return [];
  },
  // Skip building account pages if Clerk is not enabled
  pageExtensions: process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true' 
    ? ['tsx', 'ts', 'jsx', 'js'] 
    : ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('account')),
};

module.exports = nextConfig;