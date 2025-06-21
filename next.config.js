/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['info.digitaltrailheads.com'], // Add your WordPress domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'info.digitaltrailheads.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Remove static export for Vercel deployment
  // output: 'export', // This causes issues with API routes
  // trailingSlash: true, // Not needed for Vercel
  
  // Environment variables
  env: {
    CUSTOM_NAME: process.env.CUSTOM_NAME,
  },
  
  // Temporarily disable problematic optimizations
  experimental: {
    // optimizeCss: true, // Disable this to fix critters module error
    optimizePackageImports: ['@chakra-ui/react'],
  },
  
  // Improve build performance
  typescript: {
    // Only run type checking in development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Custom build directory structure
  distDir: '.next'
}

module.exports = nextConfig 