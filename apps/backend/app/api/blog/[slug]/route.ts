import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

// GET handler for fetching a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Increment view count
    const blog = await db.blog.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`Error fetching blog with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
