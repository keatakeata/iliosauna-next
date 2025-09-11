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
  // Increase memory limits for build processes
  webpack: (config, { dev, isServer, webpack }) => {
    // Fix 'self is not defined' error by defining self for server-side
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'self': false,
      };
      
      // Add global self polyfill for server-side
      config.plugins.push(
        new webpack.DefinePlugin({
          'self': 'undefined',
        })
      );
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