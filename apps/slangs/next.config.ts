import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://admin.developer-ayush.com/api/:path*",
      },
    ];
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://admin.developer-ayush.com",
  },
  images: {
    formats: ["image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
