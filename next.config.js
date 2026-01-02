/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['info.digitaltrailheads.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'info.digitaltrailheads.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  
  // Environment variables
  env: {
    CUSTOM_NAME: process.env.CUSTOM_NAME,
  },
  
  // Optimizations
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  
  // Build settings
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 