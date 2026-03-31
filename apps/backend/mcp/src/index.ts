#!/usr/bin/env node
/**
 * Blog MCP Server
 *
 * Exposes blog management tools to Claude AI agents via the
 * Model Context Protocol (stdio transport).
 *
 * Tools:
 *  - login          → authenticate and get a session token
 *  - create_blog    → create a new blog post (banner optional for drafts)
 *  - update_blog    → update an existing blog post
 *  - get_blog       → fetch a blog by id or slug
 *  - list_blogs     → list blogs with pagination + status filter
 */

import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

import { loginUser } from "./auth.js";
import {
  handleCreateBlog,
  handleUpdateBlog,
  handleGetBlog,
  handleListBlogs,
} from "./blog.js";

// ─── Server Initialisation ────────────────────────────────────────────────────

const server = new Server(
  {
    name: "blog-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─── List Tools ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ── login ──────────────────────────────────────────────────────────────
    {
      name: "login",
      description:
        "Authenticate with the blog backend using email and password. Returns a session_token that must be passed to all other tools. Tokens expire after 4 hours.",
      inputSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Admin email address",
          },
          password: {
            type: "string",
            description: "Admin password",
          },
        },
        required: ["email", "password"],
      },
    },

    // ── create_blog ────────────────────────────────────────────────────────
    {
      name: "create_blog",
      description: [
        "Create a new blog post.",
        "- 'banner' is optional when status is 'draft' (you can add it later via update_blog).",
        "- 'content' should be an EditorJS OutputData JSON string, or plain text.",
        "- 'categories' is an array of category name strings.",
        "- Only admins can publish directly; non-admins always get status='draft'.",
      ].join(" "),
      inputSchema: {
        type: "object",
        properties: {
          session_token: {
            type: "string",
            description: "Token returned from the login tool",
          },
          title: {
            type: "string",
            description: "Blog title (10–255 characters)",
          },
          content: {
            type: "string",
            description:
              "Blog body as an EditorJS OutputData JSON string or plain text. Optional for drafts.",
          },
          description: {
            type: "string",
            description: "Short description / meta description (max 1000 chars)",
          },
          banner: {
            type: "string",
            description:
              "Full URL to a banner image. Optional when status is 'draft'; required for publishing.",
          },
          status: {
            type: "string",
            enum: ["draft", "published", "archived"],
            description: "Publication status. Defaults to 'draft'.",
          },
          slug: {
            type: "string",
            description:
              "URL slug. Auto-generated from title if omitted. A timestamp suffix is appended for uniqueness.",
          },
          tags: {
            type: "string",
            description: "Comma-separated tags, e.g. 'react,typescript,nextjs'",
          },
          categories: {
            type: "array",
            items: { type: "string" },
            description:
              "Array of category names. Categories are created automatically if they don't exist.",
          },
        },
        required: ["session_token", "title"],
      },
    },

    // ── update_blog ────────────────────────────────────────────────────────
    {
      name: "update_blog",
      description: [
        "Update an existing blog post by its ID.",
        "Only provide the fields you want to change — omitted fields are left unchanged.",
        "Publishing requires a banner URL to be set.",
      ].join(" "),
      inputSchema: {
        type: "object",
        properties: {
          session_token: {
            type: "string",
            description: "Token returned from the login tool",
          },
          id: {
            type: "string",
            description: "The blog post's unique ID (returned from create_blog or list_blogs)",
          },
          title: { type: "string", description: "New title (10–255 characters)" },
          content: {
            type: "string",
            description: "Updated body as EditorJS JSON string or plain text",
          },
          description: { type: "string", description: "Updated short description" },
          banner: { type: "string", description: "New banner image URL" },
          status: {
            type: "string",
            enum: ["draft", "published", "archived"],
            description: "New publication status",
          },
          slug: { type: "string", description: "New URL slug" },
          tags: { type: "string", description: "Comma-separated tags" },
          categories: {
            type: "array",
            items: { type: "string" },
            description: "Replacement category list",
          },
        },
        required: ["session_token", "id"],
      },
    },

    // ── get_blog ───────────────────────────────────────────────────────────
    {
      name: "get_blog",
      description:
        "Fetch a single blog post by its ID or slug. Provide either 'id' or 'slug' (not both required).",
      inputSchema: {
        type: "object",
        properties: {
          session_token: { type: "string" },
          id: { type: "string", description: "Blog post ID" },
          slug: { type: "string", description: "Blog post slug" },
        },
        required: ["session_token"],
      },
    },

    // ── list_blogs ─────────────────────────────────────────────────────────
    {
      name: "list_blogs",
      description:
        "List blog posts with optional status filter and pagination. Returns blog metadata including IDs you can use with update_blog.",
      inputSchema: {
        type: "object",
        properties: {
          session_token: { type: "string" },
          page: {
            type: "number",
            description: "Page number, starting at 1. Default: 1",
          },
          pageSize: {
            type: "number",
            description: "Items per page (1–50). Default: 10",
          },
          status: {
            type: "string",
            enum: ["draft", "published", "archived"],
            description: "Filter by publication status. Omit to list all.",
          },
        },
        required: ["session_token"],
      },
    },
  ],
}));

// ─── Call Tool ────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      // ── login ──────────────────────────────────────────────────────────
      case "login": {
        const { email, password } = args as { email: string; password: string };
        const loginResult = await loginUser(email, password);

        if ("error" in loginResult) {
          result = { error: loginResult.error };
        } else {
          result = {
            success: true,
            message: `Logged in as ${loginResult.user.name ?? loginResult.user.email} (${loginResult.user.role}). Use the session_token in subsequent tool calls.`,
            session_token: loginResult.token,
            user: loginResult.user,
          };
        }
        break;
      }

      // ── create_blog ────────────────────────────────────────────────────
      case "create_blog":
        result = await handleCreateBlog(args);
        break;

      // ── update_blog ────────────────────────────────────────────────────
      case "update_blog":
        result = await handleUpdateBlog(args);
        break;

      // ── get_blog ───────────────────────────────────────────────────────
      case "get_blog":
        result = await handleGetBlog(args);
        break;

      // ── list_blogs ─────────────────────────────────────────────────────
      case "list_blogs":
        result = await handleListBlogs(args);
        break;

      default:
        result = { error: `Unknown tool: ${name}` };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[MCP] Error in tool "${name}":`, message);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: message }),
        },
      ],
      isError: true,
    };
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  console.error("[MCP] Blog MCP server starting...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[MCP] Blog MCP server ready. Listening on stdio.");
}

main().catch((err) => {
  console.error("[MCP] Fatal error:", err);
  process.exit(1);
});
