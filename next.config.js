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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/msgsndr/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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