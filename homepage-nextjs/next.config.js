/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Silence the "multiple lockfiles" workspace-root warning by anchoring
  // output tracing to the project folder itself.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'slothmoveth.com' },
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  },
  // Ensure SVGs are served with the correct MIME type and avoid image-optimizer
  // picking them up (we serve them as static files via <img>).
  async headers() {
    return [
      {
        source: '/pic/:path*.svg',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;