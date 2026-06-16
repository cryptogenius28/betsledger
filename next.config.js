/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from common crypto logo CDNs and operator domains.
  // Extend this list as you add more logo sources.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'assets.coingecko.com' },
      { protocol: 'https', hostname: '**.stake.com' },
      { protocol: 'https', hostname: '**.bc.game' },
      { protocol: 'https', hostname: '**.roobet.com' },
      { protocol: 'https', hostname: '**.nordvpn.com' },
      { protocol: 'https', hostname: '**.expressvpn.com' },
      { protocol: 'https', hostname: '**.surfshark.com' },
    ],
  },
}

module.exports = nextConfig
