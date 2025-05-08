import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Get page, limit, and search query from query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";

    // Path to the ai-images directory in public folder
    const imagesDir = path.join(process.cwd(), "public", "ai-images");

    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json(
        { error: "Images directory not found" },
        { status: 404 }
      );
    }

    // Read the directory
    const files = fs.readdirSync(imagesDir);

    // Filter for image files and exclude .DS_Store
    let imageFiles = files.filter(
      (file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file !== ".DS_Store"
    );

    // Apply search filter if a query is provided
    if (searchQuery) {
      imageFiles = imageFiles.filter((file) => {
        // Replace dashes and underscores with spaces for better matching
        const searchableText = file.toLowerCase().replace(/[-_]/g, " ");
        return searchableText.includes(searchQuery);
      });
    }

    // Sort files by name (which includes timestamp)
    imageFiles.sort().reverse();

    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedImages = imageFiles.slice(startIndex, endIndex);

    // Return the images with pagination metadata
    return NextResponse.json({
      images: paginatedImages,
      total: imageFiles.length,
      page,
      limit,
      hasMore: endIndex < imageFiles.length,
    });
  } catch (error) {
    console.error("Error reading images directory:", error);
    return NextResponse.json(
      { error: "Failed to read images" },
      { status: 500 }
    );
  }
}
