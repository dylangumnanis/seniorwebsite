/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for IONOS hosting
  output: 'export',
  trailingSlash: true,
  
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
    // Required for static export
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    CUSTOM_NAME: process.env.CUSTOM_NAME,
  },
  
  // Temporarily disable problematic optimizations
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  
  // Improve build performance
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 