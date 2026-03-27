import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { corsHeaders, handleCORS } from "../../../../../lib/cors";

export async function OPTIONS(request: Request) {
  return handleCORS(request);
}

// POST handler for incrementing view count of a single product by id/slug
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin") || undefined;
  const { id } = await params;

  try {
    // Lookup by slug or id first to get the correct id for the update
    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    const updatedProduct = await db.product.update({
      where: { id: product.id },
      data: {
        views: { increment: 1 },
      },
      select: {
        views: true,
      },
    });

    return NextResponse.json(
      { success: true, data: { views: updatedProduct.views } },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error(`Error incrementing product views for ${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to increment view count" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
