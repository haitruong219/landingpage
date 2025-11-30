/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  compress: true,
  async generateBuildId() {
    return process.env.BUILD_ID || Date.now().toString()
  },
}

module.exports = nextConfig

