/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.siteground.com' },
                ],
    },
}

module.exports = nextConfig
