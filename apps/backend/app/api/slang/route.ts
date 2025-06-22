import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/slang - Get all approved slang terms (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

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

    const slangs = await prisma.slangTerm.findMany({
      where: whereClause,
      select: {
        id: true,
        term: true,
        meaning: true,
        example: true,
        category: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    // Get categories for meta info
    const categories = await prisma.slangTerm.groupBy({
      by: ["category"],
      where: { status: "approved" },
      _count: true,
    });

    const total = await prisma.slangTerm.count({
      where: { status: "approved" },
    });

    return NextResponse.json({
      success: true,
      data: slangs,
      meta: {
        total,
        categories: categories.map((cat) => ({
          name: cat.category,
          count: cat._count,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching slangs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slang terms" },
      { status: 500 }
    );
  }
}

// POST /api/slang - Submit new slang term (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { term, meaning, example, category, submittedBy } = body;

    // Basic validation
    if (!term || !meaning) {
      return NextResponse.json(
        { success: false, error: "Term and meaning are required" },
        { status: 400 }
      );
    }

    // Check if term already exists
    const existingTerm = await prisma.slangTerm.findUnique({
      where: { term: term.toLowerCase().trim() },
    });

    if (existingTerm) {
      return NextResponse.json(
        { success: false, error: "This slang term already exists" },
        { status: 409 }
      );
    }

    // Create new slang term with pending status
    const newSlang = await prisma.slangTerm.create({
      data: {
        term: term.toLowerCase().trim(),
        meaning: meaning.trim(),
        example: example?.trim() || null,
        category: category?.trim() || "General",
        submittedBy: submittedBy?.trim() || "anonymous",
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
          status: newSlang.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit slang term" },
      { status: 500 }
    );
  }
}
