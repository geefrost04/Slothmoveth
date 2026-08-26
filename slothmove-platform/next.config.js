/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'slothmoveth.com' },
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  },
  experimental: {
    devtoolSegmentExplorer: false
  }
};

module.exports = nextConfig;