/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@repo/ui"],
  },
  transpilePackages: ["@repo/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://admin.developer-ayush.com"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
