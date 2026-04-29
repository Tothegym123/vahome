/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Serve modern formats for fastest delivery
    formats: ['image/avif', 'image/webp'],
    
    // Responsive breakpoints matching Tailwind defaults
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache optimized images for 60 days (immutable photos rarely change)
    minimumCacheTTL: 5184000,
    
    // Allowed image sources
    remotePatterns: [
      // Unsplash (current placeholders)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // SiteGround
      { protocol: 'https', hostname: '**.siteground.com' },
      // Vercel Blob (future self-hosted MLS photos)
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Cloudinary (alternative CDN)
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // AWS S3 (alternative storage)
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.us-east-1.amazonaws.com' },
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
      // Common MLS photo CDNs
      { protocol: 'https', hostname: '**.mlsgrid.com' },
      { protocol: 'https', hostname: '**.trestle.corelogic.com' },
      { protocol: 'https', hostname: '**.paragonrels.com' },
      { protocol: 'https', hostname: '**.reinmls.com' },
      { protocol: 'https', hostname: '**.rfrein.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
    { source: '/military-resources', destination: '/military', permanent: true },
    { source: '/military-resources/:path*', destination: '/military/:path*', permanent: true },
      {
        source: '/blog/Inspection-vs--Appraisal-for-Home-Buyer',
        destination: '/blog/Inspection-vs--Appraisal-for-Home-Buyers',
        permanent: true,
      },
      {
        source: '/myteam',
        destination: '/agents',
        permanent: true,
      },
      {
        source: '/neighborhood/:id/:slug*',
        destination: '/map',
        permanent: true,
      },
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/property-listings/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/site/privacy-terms',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/military',
        destination: '/military-resources/',
        permanent: true,
      },
      {
        source: '/military/',
        destination: '/military-resources/',
        permanent: true,
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
