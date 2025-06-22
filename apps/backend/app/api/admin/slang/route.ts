import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";

// GET /api/admin/slang - Get all slang terms for admin (authenticated)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const whereClause: any = {};

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { term: { contains: search, mode: "insensitive" } },
        { meaning: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [slangs, total] = await Promise.all([
      db.slangTerm.findMany({
        where: whereClause,
        select: {
          id: true,
          term: true,
          meaning: true,
          example: true,
          category: true,
          status: true,
          isFeatured: true,
          submittedBy: true,
          submittedAt: true,
          approvedBy: true,
          approvedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { status: "asc" }, // pending first
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      db.slangTerm.count({ where: whereClause }),
    ]);

    // Get stats
    const stats = await db.slangTerm.groupBy({
      by: ["status"],
      _count: true,
    });

    const statsFormatted = {
      total: await db.slangTerm.count(),
      pending: stats.find((s) => s.status === "pending")?._count || 0,
      approved: stats.find((s) => s.status === "approved")?._count || 0,
      rejected: stats.find((s) => s.status === "rejected")?._count || 0,
    };

    return NextResponse.json({
      success: true,
      data: slangs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: statsFormatted,
      },
    });
  } catch (error) {
    console.error("Error fetching admin slangs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slang terms" },
      { status: 500 }
    );
  }
}

// POST /api/admin/slang - Create new slang term as admin (auto-approved)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { term, meaning, example, category, isFeatured } = body;

    if (!term || !meaning) {
      return NextResponse.json(
        { success: false, error: "Term and meaning are required" },
        { status: 400 }
      );
    }

    // Check if term already exists
    const existingTerm = await db.slangTerm.findUnique({
      where: { term: term.toLowerCase().trim() },
    });

    if (existingTerm) {
      return NextResponse.json(
        { success: false, error: "This slang term already exists" },
        { status: 409 }
      );
    }

    const newSlang = await db.slangTerm.create({
      data: {
        term: term.toLowerCase().trim(),
        meaning: meaning.trim(),
        example: example?.trim() || null,
        category: category?.trim() || "General",
        isFeatured: Boolean(isFeatured),
        submittedBy: session.user?.email || "admin",
        status: "approved", // Admin created terms are auto-approved
        approvedBy: session.user?.email,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Slang term created successfully!",
        data: newSlang,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin slang:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create slang term" },
      { status: 500 }
    );
  }
}
