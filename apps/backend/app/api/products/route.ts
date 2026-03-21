import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { corsHeaders, handleCORS } from "../../../lib/cors";

export async function OPTIONS(request: Request) {
  return handleCORS(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || undefined;
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("p") || "1");
    const pageSize = parseInt(url.searchParams.get("size") || "12");
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const featured = url.searchParams.get("featured") === "true";
    const skip = (page - 1) * pageSize;

    const where = {
      status: "published" as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { brand: { contains: search, mode: "insensitive" as const } },
          { tags: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category: { equals: category, mode: "insensitive" as const } }),
      ...(featured && { featured: true }),
    };

    const [totalCount, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize),
          totalItems: totalCount,
          itemsPerPage: pageSize,
        },
      },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
