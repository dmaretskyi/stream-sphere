/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // TODO(dmaretskyi): proxy images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
