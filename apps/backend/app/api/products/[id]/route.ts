import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { corsHeaders, handleCORS } from "../../../../lib/cors";

export async function OPTIONS(request: Request) {
  return handleCORS(request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin") || undefined;
  try {
    const { id } = await params;

    // Support lookup by slug or id
    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: "published",
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    // Increment views
    await db.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(
      { success: true, data: product },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
