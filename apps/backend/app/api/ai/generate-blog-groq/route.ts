import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "../../../../auth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
    const { prompt, simplified = false } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    console.log(
      `Generating blog using Groq for prompt: ${prompt} (simplified: ${simplified})`
    );

    // Construct the system message with instructions for blog generation
    let systemMessage = `You are a professional blog writer. Generate a complete blog post based on the user's prompt do search the web for relevant information. You're a 22-year-old from Mumbai who's passionate about tech, finance, and fitness. You're a full-stack web developer working in the sports industry, and you run two Instagram channels — @developerr.ayush for tech content and @smart.moneyx for personal finance tips. As a vegetarian, you follow a clean diet with a goal of losing fat, aiming for 1700 calories and 80g of protein daily. You're also an anime lover, especially a big fan of Solo Leveling. Right now, you're learning video editing and working on improving your spoken English to level up your content game even more. 
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
            "type": "quote",
            "data": {
              "text": "Quote text",
              "caption": "Quote caption",
              "alignment": "left"
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
    4. Use various block types like headers, paragraphs, lists, quotes, and delimiters for better readability
    5. Generate a unique ID for each block (you can use format "block-1", "block-2", etc.)
    6. Tags should be comma-separated relevant keywords
    7. Categories should be broader topics that the blog belongs to (1-3 categories)
    8. Slug should be URL-friendly with hyphens between words, derived from the title
    9. The response MUST be a valid JSON object that can be parsed
    10. The title should be at least 10 characters and less than 255 characters
    11. The description should be less than 1000 characters
    12. IMPORTANT: Make sure the "content" object has the exact structure shown above, with "time", "blocks", and "version" properties
    13. IMPORTANT: Each block MUST have an "id", "type", and "data" property exactly as shown in the examples
    `;
    }

    // Make the Groq request with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Groq request timed out")), 45000); // 45 second timeout
    });

    const groqPromise = groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b", // Use different models based on complexity
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: simplified ? 1000 : 4000, // Adjust token count based on complexity
    });

    // We need to handle the response as unknown first
    const rawResponse = await Promise.race([groqPromise, timeoutPromise]);

    // Type guard to ensure we have a chat completion (non-streaming) response
    if (
      !rawResponse ||
      typeof rawResponse !== "object" ||
      !("choices" in rawResponse)
    ) {
      throw new Error("Invalid response from Groq");
    }

    // Now TypeScript knows this has choices
    const response = rawResponse;

    // Extract the response content with type assertion to any
    // @ts-ignore - We know this structure exists in the Groq response
    const assistantResponse = (response as any).choices[0]?.message?.content;

    if (!assistantResponse) {
      throw new Error("No response from Groq");
    }

    console.log(
      "Groq response received:",
      assistantResponse.substring(0, 200) + "..."
    );

    // Parse and validate the JSON response
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : assistantResponse;

      // Parse the JSON
      const parsedContent = JSON.parse(jsonString);

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
        "Returning validated content from Groq:",
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
          },
          null,
          2
        )
      );

      // Return the validated content
      return NextResponse.json({
        success: true,
        content: contentToReturn,
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
          error: "Failed to parse Groq response",
          details:
            jsonError instanceof Error ? jsonError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate blog content with Groq",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
