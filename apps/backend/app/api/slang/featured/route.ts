import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// CORS headers helper function
function corsHeaders(origin?: string) {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://slangs.developer-ayush.com",
    "https://admin.developer-ayush.com",
    // Add your deployment URLs here
  ];

  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle preflight OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

// GET /api/slang/featured - Get a random featured slang term
export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;

  try {
    // Get all featured terms
    const featuredSlangs = await db.slangTerm.findMany({
      where: {
        status: "approved",
        isFeatured: true,
      },
      select: {
        id: true,
        term: true,
        meaning: true,
        example: true,
        category: true,
        isFeatured: true,
        createdAt: true,
      },
    });

    if (featuredSlangs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "No featured slang terms found",
        },
        {
          headers: corsHeaders(origin),
        }
      );
    }

    // Get a random featured term based on the current date
    const today = new Date().getDate();
    const randomIndex = today % featuredSlangs.length;
    const featuredSlang = featuredSlangs[randomIndex];

    return NextResponse.json(
      {
        success: true,
        data: {
          id: featuredSlang?.id,
          term: featuredSlang?.term,
          meaning: featuredSlang?.meaning,
          example: featuredSlang?.example,
          category: featuredSlang?.category,
          is_featured: featuredSlang?.isFeatured,
          submitted_at: featuredSlang?.createdAt,
        },
      },
      {
        headers: corsHeaders(origin),
      }
    );
  } catch (error) {
    console.error("Error fetching featured slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch featured slang" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
