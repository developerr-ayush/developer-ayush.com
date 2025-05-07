import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";

// GET handler for listing all blogs with pagination
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("p") || "1");
    const pageSize = parseInt(url.searchParams.get("size") || "10");
    const skip = (page - 1) * pageSize;

    // Get total count
    const totalCount = await db.blog.count({
      where: { status: "published" },
    });

    // Get blogs with pagination
    const blogs = await db.blog.findMany({
      where: { status: "published" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        categories: true,
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    // Return paginated response
    return NextResponse.json({
      data: blogs,
      meta: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
