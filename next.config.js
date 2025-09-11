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
  // React 19 compatibility: Handle undefined env vars properly
  async redirects() {
    const clerkEnabled = String(process.env.NEXT_PUBLIC_CLERK_ENABLED || 'false') === 'true';
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
  pageExtensions: String(process.env.NEXT_PUBLIC_CLERK_ENABLED || 'false') === 'true' 
    ? ['tsx', 'ts', 'jsx', 'js'] 
    : ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('account')),
};

module.exports = nextConfig;