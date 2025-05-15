/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'uploadthing.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
