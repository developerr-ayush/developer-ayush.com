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
    ],
    minimumCacheTTL: 60, // 1 minute in seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional image sizes
    formats: ["image/webp", "image/avif"], // Modern image formats for better compression
  },
  compress: true, // Enable compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  reactStrictMode: true, // Enable React strict mode for better error catching
  sourceMaps: true,

  // // Add configuration to serve static files from the ai-images directory
  // async rewrites() {
  //   return [
  //     {
  //       source: "/ai-images/:path*",
  //       destination: "/ai-images/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
