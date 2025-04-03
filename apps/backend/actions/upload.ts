"use server";

import { z } from "zod";
import cloudinary from "../lib/cloudinary";
import { auth } from "../auth";
import { Role } from "@prisma/client";

// Schema for the upload parameters
const uploadSchema = z.object({
  file: z.string().min(1, "Image data is required"),
  folder: z.string().default("blog"),
});

export type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};

/**
 * Upload an image to Cloudinary
 * @param data - The upload data including base64 image and optional folder
 * @returns The upload result with success status and image URL
 */
export async function uploadImage(
  data: z.infer<typeof uploadSchema>
): Promise<UploadResult> {
  try {
    // Check if the user is authenticated and has required permissions
    const session = await auth();
    console.log(
      "Auth session check:",
      session
        ? {
            hasUser: !!session.user,
            role: session.user?.role,
          }
        : "No session"
    );

    if (!session || !session.user) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    // Allow both ADMIN and USER roles to upload
    if (session.user.role !== Role.ADMIN && session.user.role !== Role.USER) {
      return {
        success: false,
        error: `Unauthorized. Only registered users can upload images.`,
      };
    }

    // Validate input data
    const validatedData = uploadSchema.parse(data);

    // Upload the image to Cloudinary
    console.log(
      "Attempting Cloudinary upload to folder:",
      validatedData.folder
    );
    try {
      const result = await cloudinary.v2.uploader.upload(validatedData.file, {
        folder: validatedData.folder,
        resource_type: "image",
        // You can add more options here if needed
        transformation: [
          { quality: "auto:good" }, // Automatic quality optimization
          { fetch_format: "auto" }, // Automatic format selection (WebP when supported)
        ],
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return {
        success: false,
        error:
          cloudinaryError instanceof Error
            ? cloudinaryError.message
            : "Failed to upload to Cloudinary",
      };
    }
  } catch (error) {
    console.error("Error in uploadImage action:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns The delete result with success status
 */
export async function deleteImage(publicId: string): Promise<UploadResult> {
  try {
    // Check if the user is authenticated and has required permissions
    const session = await auth();
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return {
        success: false,
        error: "Unauthorized. Only admins can delete images.",
      };
    }

    // Delete the image from Cloudinary
    const result = await cloudinary.v2.uploader.destroy(publicId);

    return {
      success: result.result === "ok",
      error: result.result !== "ok" ? "Failed to delete image" : undefined,
    };
  } catch (error) {
    console.error("Error deleting image:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
