import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// CORS headers helper function
function corsHeaders(origin?: string) {
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

    // Vercel deployment URLs (add patterns for Vercel)
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

// Handle preflight OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}

// GET /api/slang - Get all approved slang terms (public)
export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: "approved",
    };

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (featured === "true") {
      whereClause.isFeatured = true;
    }

    if (search) {
      whereClause.OR = [
        { term: { contains: search, mode: "insensitive" } },
        { meaning: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await db.slangTerm.count({
      where: whereClause,
    });

    const slangs = await db.slangTerm.findMany({
      where: whereClause,
      select: {
        id: true,
        term: true,
        meaning: true,
        example: true,
        category: true,
        isFeatured: true,
        status: true,
        submittedBy: true,
        createdAt: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    });

    // Get categories for meta info
    const categories = await db.slangTerm.groupBy({
      by: ["category"],
      where: { status: "approved" },
      _count: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: slangs.map((slang) => ({
          id: slang.id,
          term: slang.term,
          meaning: slang.meaning,
          example: slang.example,
          category: slang.category,
          is_featured: slang.isFeatured,
          status: slang.status,
          submitted_by: slang.submittedBy,
          submitted_at: slang.createdAt,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          categories: categories.map((cat) => cat.category),
        },
      },
      {
        headers: corsHeaders(origin),
      }
    );
  } catch (error) {
    console.error("Error fetching slangs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slang terms" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// POST /api/slang - Submit new slang term (public)
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;

  try {
    const body = await request.json();
    const { term, meaning, example, category, submitted_by } = body;

    // Basic validation
    if (!term || !meaning) {
      return NextResponse.json(
        { success: false, error: "Term and meaning are required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Check if term already exists
    const existingTerm = await db.slangTerm.findFirst({
      where: {
        term: {
          equals: term.toLowerCase().trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingTerm) {
      return NextResponse.json(
        { success: false, error: "This slang term already exists" },
        { status: 409, headers: corsHeaders(origin) }
      );
    }

    // Create new slang term with pending status
    const newSlang = await db.slangTerm.create({
      data: {
        term: term.toLowerCase().trim(),
        meaning: meaning.trim(),
        example: example?.trim() || null,
        category: category?.trim() || "General",
        submittedBy: submitted_by?.trim() || "anonymous",
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Slang term submitted successfully! It will be reviewed by our admin team.",
        data: {
          id: newSlang.id,
          term: newSlang.term,
          meaning: newSlang.meaning,
          example: newSlang.example,
          category: newSlang.category,
          status: newSlang.status,
          submitted_by: newSlang.submittedBy,
          submitted_at: newSlang.createdAt,
        },
      },
      { status: 201, headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error creating slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit slang term" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
