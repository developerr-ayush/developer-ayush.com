import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { corsHeaders, handleCORS } from "../../../../lib/cors";

export async function OPTIONS(request: Request) {
  return handleCORS(request);
}

// GET handler for fetching a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const origin = request.headers.get("origin") || undefined;
  const { slug } = await params;
  try {
    // Fetch blog post without incrementing views
    const blog = await db.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(blog, { headers: corsHeaders(origin) });
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
