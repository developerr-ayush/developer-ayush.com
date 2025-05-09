import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../../auth";
import  {
  getBlogSystemPrompt,
  getBlogResponseFormat,
  getDefaultModel,
  getModelList,
  getTimeout,
  getValidationRules,
  getJsonFixPatterns,
} from "../../../../lib/ai-config";

// Initialize the GoogleGenerativeAI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Fallback to secondary API key if primary fails
const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2 || "");

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { prompt, simplified = false, model } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    console.log(
      `Generating blog using Gemini for prompt: ${prompt} (simplified: ${simplified}, model: ${model || "default"})`
    );

    // Get system message from config
    let systemMessage = getBlogSystemPrompt();

    // Get response format from config
    const responseFormat = getBlogResponseFormat(!simplified);

    // Add the current timestamp to the template
    const template = JSON.stringify(responseFormat.template).replace(
      '"time": 0',
      `"time": ${Date.now()}`
    );

    // Add the response format template and guidelines to the system message
    systemMessage +=
      " " +
      template +
      "\n\nGuidelines:\n" +
      responseFormat.guidelines.map((g, i) => `${i + 1}. ${g}`).join("\n");

    // Set up a timeout promise using the configured timeout value
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Gemini request timed out")),
        getTimeout(simplified)
      );
    });

    // Define available models and their order for fallback from config
    const defaultModel = getDefaultModel("gemini");
    const modelOptions = [
      model || defaultModel, // Default or user-specified model
      ...getModelList("gemini"),
    ];

    // Remove duplicates from model options
    const uniqueModels = [...new Set(modelOptions)];

    // Try each model in sequence until one works
    let assistantResponse: string | null = null;
    let lastError: unknown = null;
    let currentGenAI = genAI;
    let successfulModel = null;

    for (const modelName of uniqueModels) {
      try {
        console.log(`Attempting with model: ${modelName}`);

        const geminiModel = currentGenAI.getGenerativeModel({
          model: modelName,
        });

        const geminiPromise = geminiModel.generateContent([
          { text: systemMessage },
          { text: prompt },
        ]);

        const result = await Promise.race([geminiPromise, timeoutPromise]);

        // Check if result is valid - using type assertions for the Google SDK response
        const response = result as any;
        if (
          response &&
          response.response &&
          typeof response.response.text === "function"
        ) {
          assistantResponse = response.response.text();
          successfulModel = modelName;
          console.log(
            `Successfully generated content with model: ${modelName}`
          );
          break;
        }
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        lastError = error;

        // If this is the last model with the primary API key, try the backup API key
        if (
          modelName === uniqueModels[uniqueModels.length - 1] &&
          currentGenAI === genAI &&
          process.env.GEMINI_API_KEY_2
        ) {
          console.log("Switching to backup API key");
          currentGenAI = genAI2;
          continue;
        }
      }
    }

    if (!assistantResponse) {
      const errorDetails =
        lastError instanceof Error
          ? (lastError as Error).message
          : "Unknown error";
      throw new Error(`All Gemini models failed: ${errorDetails}`);
    }

    console.log(
      `Gemini response received from ${successfulModel}:`,
      assistantResponse.substring(0, 200) + "..."
    );

    // Parse and validate the JSON response
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : assistantResponse;

      // Parse the JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(jsonString);
      } catch (error) {
        const parseError = error as Error;
        console.error("JSON parse error:", parseError.message);

        // Attempt to fix common JSON syntax errors using patterns from config
        let fixedJsonString = jsonString;
        const jsonFixPatterns = getJsonFixPatterns();

        for (const fix of jsonFixPatterns) {
          const regex = new RegExp(fix.pattern, "g");
          fixedJsonString = fixedJsonString.replace(regex, fix.replacement);
        }

        try {
          parsedContent = JSON.parse(fixedJsonString);
          console.log("Successfully fixed and parsed JSON");
        } catch (error) {
          const secondError = error as Error;
          console.error("Failed to fix JSON:", secondError.message);
          throw new Error(
            `Invalid JSON response from Gemini: ${parseError.message}`
          );
        }
      }

      console.log(
        "Parsed content structure:",
        JSON.stringify(
          {
            title: parsedContent.title ? "✓" : "✗",
            description: parsedContent.description ? "✓" : "✗",
            content: parsedContent.content
              ? {
                  time: parsedContent.content.time ? "✓" : "✗",
                  blocks: Array.isArray(parsedContent.content.blocks)
                    ? `✓ (${parsedContent.content.blocks.length} blocks)`
                    : "✗",
                  version: parsedContent.content.version ? "✓" : "✗",
                }
              : "✗",
            slug: parsedContent.slug ? "✓" : "✗",
            tags: parsedContent.tags ? "✓" : "✗",
            categories: parsedContent.categories ? "✓" : "✗",
          },
          null,
          2
        )
      );

      // Get validation rules from config
      const validationRules = getValidationRules();

      // Perform validation checks
      if (
        !parsedContent.title ||
        typeof parsedContent.title !== "string" ||
        parsedContent.title.length < validationRules.minTitleLength ||
        parsedContent.title.length > validationRules.maxTitleLength
      ) {
        throw new Error(
          `Invalid title: Title should be between ${validationRules.minTitleLength} and ${validationRules.maxTitleLength} characters`
        );
      }

      if (
        !parsedContent.description ||
        typeof parsedContent.description !== "string" ||
        parsedContent.description.length > validationRules.maxDescriptionLength
      ) {
        throw new Error(
          `Invalid description: Description should be less than ${validationRules.maxDescriptionLength} characters`
        );
      }

      if (
        !parsedContent.content ||
        !parsedContent.content.blocks ||
        !Array.isArray(parsedContent.content.blocks)
      ) {
        throw new Error("Invalid content structure");
      }

      // Ensure all required EditorJS structure is present
      if (!parsedContent.content.time) {
        parsedContent.content.time = Date.now();
      }

      if (!parsedContent.content.version) {
        parsedContent.content.version = "2.28.0";
      }

      // Validate each block has required properties
      parsedContent.content.blocks = parsedContent.content.blocks.map(
        (block: any, index: number) => {
          if (!block.id) {
            block.id = `block-${index + 1}`;
          }

          // Ensure block has proper structure with type and data
          if (!block.type) {
            throw new Error(
              `Block at index ${index} missing required "type" property`
            );
          }

          if (!block.data || typeof block.data !== "object") {
            throw new Error(
              `Block at index ${index} missing required "data" property`
            );
          }

          return block;
        }
      );

      // Check minimum content blocks based on mode using config values
      if (
        !simplified &&
        parsedContent.content.blocks.length < validationRules.minBlocksDetailed
      ) {
        throw new Error(
          `Content is too short: Add more sections (minimum ${validationRules.minBlocksDetailed})`
        );
      } else if (
        simplified &&
        parsedContent.content.blocks.length <
          validationRules.minBlocksSimplified
      ) {
        throw new Error(
          `Content is too short: Add more sections (minimum ${validationRules.minBlocksSimplified})`
        );
      }

      // Generate slug if not provided
      if (!parsedContent.slug) {
        parsedContent.slug = parsedContent.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }

      // Ensure categories is an array
      if (!parsedContent.categories) {
        parsedContent.categories = [];
      } else if (!Array.isArray(parsedContent.categories)) {
        parsedContent.categories = [parsedContent.categories];
      }

      const contentToReturn = {
        title: parsedContent.title,
        content: parsedContent.content,
        description: parsedContent.description,
        slug: parsedContent.slug,
        tags: parsedContent.tags || "",
        categories: parsedContent.categories,
      };

      console.log(
        "Returning validated content from Gemini:",
        JSON.stringify(
          {
            title: contentToReturn.title.substring(0, 30) + "...",
            content: {
              time: contentToReturn.content.time,
              blocks: `${contentToReturn.content.blocks.length} blocks`,
              version: contentToReturn.content.version,
            },
            description: contentToReturn.description.substring(0, 30) + "...",
            slug: contentToReturn.slug,
            categories: contentToReturn.categories,
            model: successfulModel,
          },
          null,
          2
        )
      );

      // Return the validated content
      return NextResponse.json({
        success: true,
        content: contentToReturn,
        model: successfulModel,
      });
    } catch (jsonError) {
      console.error(
        "JSON parsing error:",
        jsonError,
        "Response:",
        assistantResponse
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse Gemini response",
          details:
            jsonError instanceof Error ? jsonError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate blog content with Gemini",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
