import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    getBlogSystemPrompt,
    getBlogResponseFormat,
    getDefaultModel,
    getJsonFixPatterns
} from "../../../../lib/ai-config";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { prompt, simplified = false, model } = body;

        if (!prompt) {
            return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
        }

        // Create the job
        const job = await db.generationJob.create({
            data: {
                type: "BLOG",
                status: "PENDING",
            }
        });

        // Start generation in background (fire and forget)
        generateBlogInBackground(job.id, prompt, simplified, model);

        return NextResponse.json({ success: true, jobId: job.id });

    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 });
    }
}

async function generateBlogInBackground(jobId: string, prompt: string, simplified: boolean, model?: string) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        const systemMessage = getBlogSystemPrompt();
        const responseFormat = getBlogResponseFormat(!simplified);

        // Add time to template
        const template = JSON.stringify(responseFormat.template).replace(
            '"time": 0',
            `"time": ${Date.now()}`
        );

        const fullSystemMessage = `${systemMessage} ${template}\n\nGuidelines:\n${responseFormat.guidelines.map((g, i) => `${i + 1}. ${g}`).join("\n")}`;

        // Add 15 seconds delay as requested
        await new Promise(resolve => setTimeout(resolve, 15000));

        const modelName = model || getDefaultModel("gemini");
        const geminiModel = genAI.getGenerativeModel({ model: modelName });

        const result = await geminiModel.generateContent([
            { text: fullSystemMessage },
            { text: prompt }
        ]);

        const response = result.response;
        const text = response.text();

        // Parse JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        let parsedContent;

        try {
            parsedContent = JSON.parse(jsonString);
        } catch (e) {
            // Try fixing
            let fixed = jsonString;
            const patterns = getJsonFixPatterns();
            if (patterns && Array.isArray(patterns)) {
                patterns.forEach(p => {
                    const regex = new RegExp(p.pattern, "g");
                    fixed = fixed.replace(regex, p.replacement);
                });
            }
            parsedContent = JSON.parse(fixed);
        }

        // Validate
        if (!parsedContent.title || !parsedContent.content) {
            throw new Error("Invalid content structure provided by AI");
        }

        // Ensure simplified content is respected if requested (optional logic)

        // Save to DB
        await db.generationJob.update({
            where: { id: jobId },
            data: {
                status: "SUCCESS",
                result: JSON.stringify(parsedContent)
            }
        });

    } catch (err: any) {
        console.error(`Job ${jobId} failed:`, err);
        await db.generationJob.update({
            where: { id: jobId },
            data: {
                status: "FAILED",
                error: err.message || "Unknown error"
            }
        });
    }
}
