import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "../../../../auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  // return NextResponse.json({
  //   success: true,
  //   content: {
  //     title: "Why Companies Are Saying Goodbye to Next.js?",
  //     content: {
  //       time: 1743869505535,
  //       blocks: [
  //         {
  //           id: "block-1",
  //           type: "header",
  //           data: {
  //             text: "Introduction to Next.js and Its Popularity",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-2",
  //           type: "paragraph",
  //           data: {
  //             text: "Next.js, developed by Vercel, is a popular React framework that offers features like server-side rendering and static site generation, aiming to improve both user and developer experiences. However, despite these benefits, some companies are choosing to move away from the framework.",
  //           },
  //         },
  //         {
  //           id: "block-3",
  //           type: "header",
  //           data: {
  //             text: "Key Reasons for the Shift Away from Next.js",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-4",
  //           type: "list",
  //           data: {
  //             style: "unordered",
  //             items: [
  //               "Complexity and Overhead",
  //               "Cost of Deployment and Scaling",
  //               "Limited Flexibility with Back-end Integration",
  //               "Competitive Alternatives",
  //             ],
  //           },
  //         },
  //         {
  //           id: "block-5",
  //           type: "header",
  //           data: {
  //             text: "Exploring the Alternatives",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-6",
  //           type: "paragraph",
  //           data: {
  //             text: "As some companies move away from Next.js, they often turn towards other frameworks and technologies such as Gatsby for static sites, Nuxt.js for Vue applications, or traditional React setups without a framework for more control and simplicity.",
  //           },
  //         },
  //         {
  //           id: "block-7",
  //           type: "header",
  //           data: {
  //             text: "Case Studies: Successes Without Next.js",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-8",
  //           type: "paragraph",
  //           data: {
  //             text: "Several companies have successfully transitioned away from Next.js, finding that alternatives can offer more control over their web infrastructure, reduce costs, or better align with their specific technical requirements and team expertise.",
  //           },
  //         },
  //         {
  //           id: "block-9",
  //           type: "header",
  //           data: {
  //             text: "Conclusion",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-10",
  //           type: "paragraph",
  //           data: {
  //             text: "While Next.js remains a powerful tool for many applications, the evolving web development landscape and diverse needs of businesses mean that it won't always be the best fit for every project.",
  //           },
  //         },
  //       ],
  //       version: "2.28.0",
  //     },
  //     description:
  //       "Explore the reasons why some companies are moving away from Next.js despite its popularity as a React framework.",
  //     slug: "why-companies-are-saying-goodbye-to-next-js",
  //     tags: "Next.js, web development, technology trends",
  //     categories: ["Web Development", "Technology Trends"],
  //   },
  // });
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
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    console.log("Generating blog for prompt:", prompt);

    // Construct the system message with instructions for blog generation
    const systemMessage = `You are a professional blog writer. Generate a complete blog post based on the user's prompt do search the web for relevant information. You're a 22-year-old from Mumbai who's passionate about tech, finance, and fitness. You're a full-stack web developer working in the sports industry, and you run two Instagram channels — @developerr.ayush for tech content and @smart.moneyx for personal finance tips. As a vegetarian, you follow a clean diet with a goal of losing fat, aiming for 1700 calories and 80g of protein daily. You're also an anime lover, especially a big fan of Solo Leveling. Right now, you're learning video editing and working on improving your spoken English to level up your content game even more. 
    Return a JSON object with the following structure:
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

    // Make the OpenAI request
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Extract the response content
    const assistantResponse = response.choices[0]?.message?.content;

    if (!assistantResponse) {
      throw new Error("No response from OpenAI");
    }

    console.log(
      "OpenAI response received:",
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

      if (parsedContent.content.blocks.length < 4) {
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
        "Returning validated content:",
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
          error: "Failed to parse AI response",
          details:
            jsonError instanceof Error ? jsonError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate blog content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
