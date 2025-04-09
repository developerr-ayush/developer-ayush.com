import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "../../../../auth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  // return NextResponse.json({
  //   success: true,
  //   content: {
  //     title:
  //       "How to Create an MCP Model Context Protocol Server Using TypeScript: A Step-by-Step Guide with Weather API Example",
  //     content: {
  //       time: 1743959363252,
  //       blocks: [
  //         {
  //           id: "block-1",
  //           type: "header",
  //           data: {
  //             text: "Introduction to MCP Model Context Protocol",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-2",
  //           type: "paragraph",
  //           data: {
  //             text: "The Model-Context-Protocol (MCP) architecture is a design pattern that separates concerns into three main components: <b>Model</b>, <b>Context</b>, and <b>Protocol</b>. This separation enables cleaner code organization, better maintainability, and scalability. In this guide, we'll create an MCP server using TypeScript and integrate it with a weather API as a practical example.",
  //           },
  //         },
  //         {
  //           id: "block-3",
  //           type: "list",
  //           data: {
  //             style: "unordered",
  //             items: [
  //               "Model: Represents the data structure and business logic",
  //               "Context: Manages the state and flow of the application",
  //               "Protocol: Handles communication and API interactions",
  //             ],
  //           },
  //         },
  //         {
  //           id: "block-4",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-5",
  //           type: "header",
  //           data: {
  //             text: "Step 1: Setting Up the Project",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-6",
  //           type: "paragraph",
  //           data: {
  //             text: "Let's start by initializing a new Node.js project with TypeScript support.",
  //           },
  //         },
  //         {
  //           id: "block-7",
  //           type: "list",
  //           data: {
  //             style: "unordered",
  //             items: [
  //               "Run `npm init -y` to create a package.json file",
  //               "Install TypeScript and required dependencies: `npm install typescript @types/node ts-node`",
  //               "Install Express: `npm install express cors dotenv`",
  //               "Install Axios for API calls: `npm install axios`",
  //             ],
  //           },
  //         },
  //         {
  //           id: "block-8",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-9",
  //           type: "header",
  //           data: {
  //             text: "Step 2: Project Structure",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-10",
  //           type: "paragraph",
  //           data: {
  //             text: "Organize your project into the following structure:",
  //           },
  //         },
  //         {
  //           id: "block-11",
  //           type: "list",
  //           data: {
  //             style: "unordered",
  //             items: [
  //               "src/",
  //               "src/models/",
  //               "src/contexts/",
  //               "src/protocols/",
  //               "src/utils/",
  //               "src/config/",
  //               "index.ts",
  //             ],
  //           },
  //         },
  //         {
  //           id: "block-12",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-13",
  //           type: "header",
  //           data: {
  //             text: "Step 3: Setting Up the Server",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-14",
  //           type: "paragraph",
  //           data: {
  //             text: "Create the main server file (`index.ts`) and set up Express:",
  //           },
  //         },
  //         {
  //           id: "block-15",
  //           type: "code",
  //           data: {
  //             code: "import express, { Request, Response } from 'express';\nimport cors from 'cors';\nimport dotenv from 'dotenv';\n\ndotenv.config();\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(cors());\napp.use(express.json());\n\napp.get('/', (req: Request, res: Response) => {\n  res.status(200).json({ message: 'MCP Server is running!' });\n});\n\napp.listen(PORT, () => {\n  console.log(`Server is running on http://localhost:${PORT}`);\n});",
  //             language: "typescript",
  //           },
  //         },
  //         {
  //           id: "block-16",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-17",
  //           type: "header",
  //           data: {
  //             text: "Step 4: Defining the Protocol",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-18",
  //           type: "paragraph",
  //           data: {
  //             text: "Create a protocol for handling weather data requests.",
  //           },
  //         },
  //         {
  //           id: "block-19",
  //           type: "code",
  //           data: {
  //             code: "interface WeatherRequest {\n  city: string;\n}\n\ninterface WeatherResponse {\n  temperature: number;\n  conditions: string;\n  city: string;\n}",
  //             language: "typescript",
  //           },
  //         },
  //         {
  //           id: "block-20",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-21",
  //           type: "header",
  //           data: {
  //             text: "Step 5: Implementing the Model",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-22",
  //           type: "paragraph",
  //           data: {
  //             text: "Create a model to fetch weather data from an external API.",
  //           },
  //         },
  //         {
  //           id: "block-23",
  //           type: "code",
  //           data: {
  //             code: "import axios from 'axios';\n\nexport class WeatherModel {\n  async getWeather(city: string): Promise<WeatherResponse> {\n    try {\n      const API_KEY = process.env.WEATHER_API_KEY;\n      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;\n      \n      const response = await axios.get(url);\n      \n      return {\n        temperature: response.data.main.temp,\n        conditions: response.data.weather[0].description,\n        city: city\n      } as WeatherResponse;\n    } catch (error) {\n      throw new Error('Failed to fetch weather data');\n    }\n  }\n}",
  //             language: "typescript",
  //           },
  //         },
  //         {
  //           id: "block-24",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-25",
  //           type: "header",
  //           data: {
  //             text: "Step 6: Implementing the Controller",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-26",
  //           type: "paragraph",
  //           data: {
  //             text: "Create a controller to handle incoming requests and interact with the model.",
  //           },
  //         },
  //         {
  //           id: "block-27",
  //           type: "code",
  //           data: {
  //             code: "export class WeatherController {\n  constructor(private weatherModel: WeatherModel) {}\n\n  async getWeather(req: Request<{}, {}, WeatherRequest>): Promise<Response> {\n    try {\n      const weatherData = await this.weatherModel.getWeather(req.body.city);\n      return res.status(200).json(weatherData);\n    } catch (error) {\n      return res.status(500).json({ message: error.message });\n    }\n  }\n}",
  //             language: "typescript",
  //           },
  //         },
  //         {
  //           id: "block-28",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-29",
  //           type: "header",
  //           data: {
  //             text: "Step 7: Connecting Everything",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-30",
  //           type: "paragraph",
  //           data: {
  //             text: "Update the main server file to include the weather endpoint.",
  //           },
  //         },
  //         {
  //           id: "block-31",
  //           type: "code",
  //           data: {
  //             code: "import './config';\nimport express, { Request, Response } from 'express';\nimport { WeatherModel } from './models/WeatherModel';\nimport { WeatherController } from './controllers/WeatherController';\n\nconst app = express();\n\nconst weatherModel = new WeatherModel();\nconst weatherController = new WeatherController(weatherModel);\n\napp.post('/api/weather', weatherController.getWeather);\n",
  //             language: "typescript",
  //           },
  //         },
  //         {
  //           id: "block-32",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-33",
  //           type: "header",
  //           data: {
  //             text: "Testing the Server",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-34",
  //           type: "paragraph",
  //           data: {
  //             text: "Use Postman or your preferred tool to test the endpoint with a POST request to `http://localhost:3000/api/weather` with a body containing the city name.",
  //           },
  //         },
  //         {
  //           id: "block-35",
  //           type: "delimiter",
  //           data: {},
  //         },
  //         {
  //           id: "block-36",
  //           type: "header",
  //           data: {
  //             text: "Conclusion",
  //             level: 2,
  //           },
  //         },
  //         {
  //           id: "block-37",
  //           type: "paragraph",
  //           data: {
  //             text: "You've successfully implemented an MCP Model Context Protocol server using TypeScript! This architecture provides a clean separation of concerns, making your code more maintainable and scalable. You can now expand this server by adding more models, contexts, and protocols for different functionalities.",
  //           },
  //         },
  //         {
  //           id: "block-38",
  //           type: "quote",
  //           data: {
  //             text: "The art of writing code is the art of thinking clearly.",
  //             caption: "Unknown",
  //             alignment: "left",
  //           },
  //         },
  //       ],
  //       version: "2.28.0",
  //     },
  //     description:
  //       "Learn how to build an MCP Model Context Protocol server with TypeScript, using a weather API example. Step-by-step guide with code.",
  //     slug: "how-to-create-mcp-model-context-protocol-server-using-typescript",
  //     tags: "typescript, mcp, model-context-protocol, weather-api, serverless, backend-development",
  //     categories: ["Programming", "Web Development", "TypeScript"],
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
    const { prompt, simplified = false, model } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid prompt" },
        { status: 400 }
      );
    }

    console.log(
      `Generating blog using Groq for prompt: ${prompt} (simplified: ${simplified}, model: ${model || "default"})`
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
    12. IMPORTANT: For code blocks, use the "code" field (not "text") and include a "language" field
    13. IMPORTANT: Make sure the "content" object has the exact structure shown above, with "time", "blocks", and "version" properties
    14. IMPORTANT: Each block MUST have an "id", "type", and "data" property exactly as shown in the examples
    `;
    }

    // Make the Groq request with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Groq request timed out")), 450000); // 45 second timeout
    });

    // Determine which model to use based on the model parameter
    let modelToUse = "meta-llama/llama-4-scout-17b-16e-instruct"; // Default model

    if (model === "llama-4") {
      modelToUse = "meta-llama/llama-4-scout-17b-16e-instruct";
    } else if (model === "deepseek") {
      modelToUse = "deepseek-r1-distill-qwen-32b";
    } else if (model === "llama-3.3") {
      modelToUse = "llama-3.3-70b-specdec";
    }

    const groqPromise = groq.chat.completions.create({
      model: modelToUse, // Use the selected model based on user preference
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
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
