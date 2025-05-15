/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'uploadthing.com'],
  },
  // Server Actions sind jetzt standardmäßig aktiviert und benötigen keine experimentelle Flag mehr
}

module.exports = nextConfig
