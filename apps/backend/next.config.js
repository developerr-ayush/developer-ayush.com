/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res-console.cloudinary.com",
        pathname: "**",
      },
    ],
    minimumCacheTTL: 60, // 1 minute in seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    formats: ["image/webp", "image/avif"], // Modern image formats for better compression
  },
  compress: true, // Enable compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  reactStrictMode: true, // Enable React strict mode for better error catching
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Increase body size limit for longer content
    },
  },
  serverRuntimeConfig: {
    functionTimeout: 60, // Set 60 second function timeout
  },
};

export default nextConfig;
