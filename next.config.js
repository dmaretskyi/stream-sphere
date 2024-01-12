/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     // TODO(dmaretskyi): proxy images.
     remotePatterns: [{
      protocol: 'https',
      hostname: '**',
      port: '',
    }]
  }
}

module.exports = nextConfig
