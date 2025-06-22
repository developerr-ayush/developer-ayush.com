// Centralized CORS configuration
export function corsHeaders(origin?: string) {
  const allowedOrigins = [
    // Local development
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",

    // Production domains
    "https://slangs.developer-ayush.com",
    "https://slang.developer-ayush.com",
    "https://admin.developer-ayush.com",
    "https://developer-ayush.com",

    // Vercel deployment URLs
    "https://slangs-git-main-ayushshah.vercel.app",
    "https://slangs-ayushshah.vercel.app",
    "https://slang-dictionary.vercel.app",
    "https://developer-ayush-slangs.vercel.app",
  ];

  // Check for Vercel deployment patterns
  const isVercelDeployment =
    origin &&
    (origin.includes("vercel.app") ||
      origin.includes("developer-ayush") ||
      origin.includes("slang"));

  // Allow origin if it's in the allowed list or is a Vercel deployment
  const allowOrigin =
    origin && (allowedOrigins.includes(origin) || isVercelDeployment)
      ? origin
      : "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
}

// Helper function to handle OPTIONS preflight requests
export function handleCORS(request: Request) {
  const origin = request.headers.get("origin") || undefined;
  return new Response(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}
