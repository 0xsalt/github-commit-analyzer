/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel image optimization enabled by default
  // Add remotePatterns here if you need to load images from external domains

  // Enable standalone output for Docker deployments
  output: 'standalone',
};

module.exports = nextConfig;
