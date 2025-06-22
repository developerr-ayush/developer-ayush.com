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

// GET /api/slang/categories - Get all categories
export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;

  try {
    const categories = await db.slangTerm.groupBy({
      by: ["category"], 
      where: { status: "approved" },
      _count: true,
    });

    const categoryList = categories.map((cat) => cat.category);

    return NextResponse.json(
      {
        success: true,
        data: categoryList,
      },
      {
        headers: corsHeaders(origin),
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
