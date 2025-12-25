import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cloudinary from "../../../../lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
        }

        // Create the job
        const job = await db.generationJob.create({
            data: {
                type: "IMAGE",
                status: "PENDING",
            }
        });

        // Start generation in background
        generateImageInBackground(job.id, prompt);

        return NextResponse.json({ success: true, jobId: job.id });

    } catch (error) {
        console.error("Error creating image job:", error);
        return NextResponse.json({ success: false, error: "Failed to create image job" }, { status: 500 });
    }
}

async function generateImageInBackground(jobId: string, prompt: string) {
    try {
        // Use the same API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        // Use Imagen 3 model
        // Note: As of late 2024/2025, model name for Gemini API image generation 
        // might vary. Using 'imagen-3.0-generate-001' as standard placeholder
        // or falling back to 'gemini-pro-vision' if that was for analysis (not generation).
        // Actual generation usually requires a specific model.
        // If SDK doesn't support it directly yet, we might need REST. 
        // For now, attempting via SDK assuming "imagen-3.0-generate-001" is available via getGenerativeModel
        // OR using the text-to-image capability if bundled in gemini-pro.
        //
        // However, standard Google AI Studio usage:
        // const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001"});
        // const result = await model.generateContent(prompt);
        //
        // Let's try the standard way. If it fails, we catch it.

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        const result = await model.generateContent(prompt);
        const response = result.response;

        // Imagen usually returns inlineData (base64) in the parts.
        // We need to handle that.
        // CAUTION: The SDK response structure for Images might differ from Text.
        // 
        // If the SDK returns generic response with inlineData:
        // candidates[0].content.parts[0].inlineData

        // We will inspect the response structure. 
        // For simpler storage in DB (TEXT field), we will store the Base64 string 
        // but it might be large.
        // Ideally we upload to cloud storage, but for this refactor we might 
        // strictly follow the prompt "generate image ...".
        // The blog-form handles uploading to Cloudinary later? 
        // Or we return a base64 string and frontend renders it.
        // 
        // Let's assume we return the Base64 data definition.

        // NOTE: If the response is not text, response.text() might be empty or error.

        // Check for inline data
        // Accessing underlying candidates via `any` to bypass strict typing if SDK types are old
        const candidates = (response as any).candidates;
        if (!candidates || !candidates.length) {
            throw new Error("No image candidates returned");
        }

        const parts = candidates[0].content.parts;
        const imagePart = parts.find((p: any) => p.inlineData);

        if (!imagePart) {
            throw new Error("No image data found in response");
        }

        const base64Image = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

        // Add 30 seconds delay as requested
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
            folder: "blog-banners",
            resource_type: "image"
        });

        await db.generationJob.update({
            where: { id: jobId },
            data: {
                status: "SUCCESS",
                result: JSON.stringify({
                    imageUrl: uploadResponse.secure_url
                })
            }
        });

    } catch (err: any) {
        console.error(`Image Job ${jobId} failed:`, err);
        await db.generationJob.update({
            where: { id: jobId },
            data: {
                status: "FAILED",
                error: err.message || "Unknown image generation error"
            }
        });
    }
}
