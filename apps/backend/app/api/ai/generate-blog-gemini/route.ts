import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../../auth";

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

    // Construct the system message with instructions for blog generation
    let systemMessage = `You are a professional blog writer. Generate a complete blog post based on the user's prompt do search the web for relevant information. You're a 22-year-old from Mumbai who's passionate about tech, finance, and fitness. You're a full-stack web developer working in the sports industry, and you run two Instagram channels — @developerr.ayush for tech content and @smart.moneyx for personal finance tips.  
    Return a JSON object with the following structure:`;

    // Use a simpler structure with fewer sections for simplified requests
    if (simplified) {
      systemMessage += `
    {
      "title": "Blog title",
      "description": "A compelling meta description for the blog (100-160 characters)",
      "content": {
        "time": ${Date.now()},
        "blocks": [
          {
            "id": "block-1",
            "type": "header",
            "data": {
              "text": "Header text",
              "level": 2
            }
          },
          {
            "id": "block-2",
            "type": "paragraph",
            "data": {
              "text": "Paragraph text"
            }
          },
          {
            "id": "block-3",
            "type": "table",
            "data": {
              "withHeadings": false,
              "stretched": false,
              "content": [
                [
                  "Header 1", 
                  "Header 2", 
                  "Header 3"
                ],
                [
                  "Row 1, Cell 1", 
                  "Row 1, Cell 2", 
                  "Row 1, Cell 3"
                ],
                [
                  "Row 2, Cell 1", 
                  "Row 2, Cell 2", 
                  "Row 2, Cell 3"
                ]
              ]
            }
          }
        ],
        "version": "2.28.0"
      },
      "slug": "url-friendly-slug",
      "tags": "tag1, tag2",
      "categories": ["Category1"]
    }
    
    Guidelines:
    1. Keep the content brief with only 2-3 sections
    2. Limit the total word count to 500 words
    3. Make the content focused and concise
    4. Generate a unique ID for each block (format "block-1", "block-2", etc.)
    5. The response MUST be a valid JSON object that can be parsed
    6. When including tables, the EXACT format shown above MUST be used (with content array containing arrays of cell values)
    `;
    } else {
      systemMessage += `
    {
      "title": "Blog title",
      "description": "A compelling meta description for the blog (100-160 characters)",
      "content": {
        "time": ${Date.now()},
        "blocks": [
          {
            "id": "block-1",
            "type": "header",
            "data": {
              "text": "Header text",
              "level": A number between 1-6, usually 2 for section headers
            }
          },
          {
            "id": "block-2",
            "type": "paragraph",
            "data": {
              "text": "Paragraph text with <b>formatting</b> if needed"
            }
          },
          {
            "id": "block-3",
            "type": "list",
            "data": {
              "style": "unordered",
              "items": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            }
          },
          {
            "id": "block-4",
            "type": "delimiter",
            "data": {}
          },
          {
            "id": "block-5",
            "type": "code",
            "data": {
              "code": "console.log('Hello world');",
              "language": "javascript" 
            }
          },
          {
            "id": "block-6",
            "type": "quote",
            "data": {
              "text": "Quote text",
              "caption": "Quote caption",
              "alignment": "left"
            }
          },
          {
            "id": "block-7", 
            "type": "table",
            "data": {
              "withHeadings": false,
              "stretched": false,
              "content": [
                [
                  "Header 1", 
                  "Header 2", 
                  "Header 3"
                ],
                [
                  "Row 1, Cell 1", 
                  "Row 1, Cell 2", 
                  "Row 1, Cell 3"
                ],
                [
                  "Row 2, Cell 1", 
                  "Row 2, Cell 2", 
                  "Row 2, Cell 3"
                ]
              ]
            }
          }
        ],
        "version": "2.28.0"
      },
      "slug": "url-friendly-slug",
      "tags": "tag1, tag2, tag3",
      "categories": ["Category1", "Category2"]
    }
    
    Guidelines:
    1. The content should be well-structured with headers, paragraphs, and lists where appropriate
    2. Include at least 4-6 content sections with appropriate headers
    3. Make the content informative, engaging, and factually accurate
    4. Use various block types like headers, paragraphs, lists, quotes, tables, code blocks, and delimiters for better readability
    5. Generate a unique ID for each block (you can use format "block-1", "block-2", etc.)
    6. Tags should be comma-separated relevant keywords
    7. Categories should be broader topics that the blog belongs to (1-3 categories)
    8. Slug should be URL-friendly with hyphens between words, derived from the title
    9. The response MUST be a valid JSON object that can be parsed
    10. The title should be at least 10 characters and less than 255 characters
    11. The description should be less than 1000 characters
    12. IMPORTANT: For code blocks, use the "code" field (not "text") and include a "language" field
    13. IMPORTANT: Make sure the "content" object has the exact structure shown above, with "time", "blocks", and "version" properties
    14. IMPORTANT: Each block MUST have an "id", "type", and "data" property exactly as shown in the examples
    15. IMPORTANT: For tables, you MUST use the exact format shown with a 'content' array containing arrays of cell values
    `;
    }

    // Set up a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Gemini request timed out")), 450000); // 45 second timeout
    });

    // Define available models and their order for fallback
    const modelOptions = [
      model || "gemini-2.5-pro-preview-05-06", // Default or user-specified model
      "gemini-2.5-pro-preview-05-06",
      "gemini-2.5-flash-preview-04-17",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.5-pro-002",
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

        // Attempt to fix common JSON syntax errors
        let fixedJsonString = jsonString
          // Fix missing commas between properties
          .replace(/("text"\s*:\s*"[^"]*")\s*("level"\s*:\s*\d+)/g, "$1,$2")
          .replace(/("text"\s*:\s*"[^"]*")\s*("style"\s*:\s*"[^"]*")/g, "$1,$2")
          .replace(
            /("text"\s*:\s*"[^"]*")\s*("caption"\s*:\s*"[^"]*")/g,
            "$1,$2"
          )
          .replace(
            /("text"\s*:\s*"[^"]*")\s*("alignment"\s*:\s*"[^"]*")/g,
            "$1,$2"
          )
          .replace(
            /("caption"\s*:\s*"[^"]*")\s*("alignment"\s*:\s*"[^"]*")/g,
            "$1,$2"
          );

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

      // Perform validation checks
      if (
        !parsedContent.title ||
        typeof parsedContent.title !== "string" ||
        parsedContent.title.length < 10 ||
        parsedContent.title.length > 255
      ) {
        throw new Error(
          "Invalid title: Title should be between 10 and 255 characters"
        );
      }

      if (
        !parsedContent.description ||
        typeof parsedContent.description !== "string" ||
        parsedContent.description.length > 1000
      ) {
        throw new Error(
          "Invalid description: Description should be less than 1000 characters"
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

      // Check minimum content blocks based on mode
      if (!simplified && parsedContent.content.blocks.length < 4) {
        throw new Error("Content is too short: Add more sections");
      } else if (simplified && parsedContent.content.blocks.length < 2) {
        throw new Error("Content is too short: Add more sections");
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
