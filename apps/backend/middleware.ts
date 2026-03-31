import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { corsHeaders } from "./lib/cors";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isSlangApiRoute = nextUrl.pathname.startsWith("/api/slang");
  // MCP transport routes (/api/mcp, /api/sse) — use their own JWT auth
  const isMcpRoute =
    nextUrl.pathname.startsWith("/api/mcp") ||
    nextUrl.pathname.startsWith("/api/sse");

  // MCP route — has its own JWT auth, bypass NextAuth
  if (isMcpRoute) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
        },
      });
    }
    return;
  }

  // Handle CORS for slang API routes
  if (isSlangApiRoute) {
    const origin = req.headers.get("origin") || undefined;

    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
      });
    }

    // Allow slang API routes to be accessed publicly with CORS
    return;
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
