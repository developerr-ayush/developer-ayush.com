import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";

// POST handler for incrementing view count of a single blog post by slug
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const blog = await db.blog.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
      select: {
        views: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ views: blog.views });
  } catch (error) {
    console.error(`Error incrementing views for slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
