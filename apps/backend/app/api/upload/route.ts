import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../../actions/upload";

/**
 * Handle POST requests to upload images
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "blog";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Read the file as base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload the image
    const result = await uploadImage({
      file: base64File,
      folder,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading image:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * Handle DELETE requests to delete images
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "No publicId provided" },
        { status: 400 }
      );
    }

    const { deleteImage } = await import("../../../actions/upload");
    const result = await deleteImage(publicId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// Maximum file size: 10MB
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10mb",
  },
};
