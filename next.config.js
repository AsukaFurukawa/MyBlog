/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Disable static file serving from public directory during build
  trailingSlash: false,
}

module.exports = nextConfig 