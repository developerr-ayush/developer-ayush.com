import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Path to the ai-images directory
    const imagesDir = path.join(process.cwd(), "ai-images");

    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json(
        { error: "Images directory not found" },
        { status: 404 }
      );
    }

    // Read the directory
    const files = fs.readdirSync(imagesDir);

    // Filter for image files
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Sort files by name (which includes timestamp)
    imageFiles.sort().reverse();

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error reading images directory:", error);
    return NextResponse.json(
      { error: "Failed to read images" },
      { status: 500 }
    );
  }
}
