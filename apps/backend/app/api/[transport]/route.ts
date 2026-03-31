import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../../lib/db";

// ─── Auth helpers ─────────────────────────────────────────────────────────────

const JWT_SECRET =
  process.env.MCP_JWT_SECRET ?? process.env.AUTH_SECRET ?? "mcp-dev-secret";

interface SessionPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  name: string | null;
}

async function loginUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user?.password) return { error: "Invalid credentials" as const };
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Invalid credentials" as const };
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as SessionPayload["role"],
    name: user.name ?? null,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });
  return { token, user: payload };
}

function verifySession(token: string): SessionPayload {
  try {
    const p = jwt.verify(token, JWT_SECRET) as SessionPayload;
    return { userId: p.userId, email: p.email, role: p.role, name: p.name };
  } catch {
    throw new Error("Invalid or expired session token. Please login again.");
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function makeUniqueSlug(base: string) {
  return `${base}-${Date.now().toString().slice(-6)}`;
}

function resolveCategories(cats: string[]) {
  return {
    connectOrCreate: cats.map((cat) => ({
      where: { name: cat },
      create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") },
    })),
  };
}

function serializeContent(content?: string) {
  if (!content) return "";
  try {
    return JSON.stringify(JSON.parse(content));
  } catch {
    return content;
  }
}

// ─── MCP Handler ──────────────────────────────────────────────────────────────

const handler = createMcpHandler(
  (server) => {
    // ── login ─────────────────────────────────────────────────────────────────
    server.registerTool(
      "login",
      {
        title: "Login",
        description:
          "Authenticate with email and password. Returns a session_token required by all other tools. Tokens expire in 4 hours.",
        inputSchema: {
          email: z.string().email().describe("Admin email address"),
          password: z.string().min(1).describe("Admin password"),
        },
      },
      async ({ email, password }) => {
        const res = await loginUser(email, password);
        if ("error" in res) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: res.error }) }] };
        }
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                message: `Logged in as ${res.user.name ?? res.user.email} (${res.user.role}). Use the session_token in all subsequent tool calls.`,
                session_token: res.token,
                user: res.user,
              }),
            },
          ],
        };
      }
    );

    // ── create_blog ───────────────────────────────────────────────────────────
    server.registerTool(
      "create_blog",
      {
        title: "Create Blog",
        description:
          "Create a new blog post. 'banner' is optional when status is 'draft'. 'content' should be an EditorJS OutputData JSON string or plain text. Categories are created automatically if they don't exist.",
        inputSchema: {
          session_token: z.string().min(1).describe("Token from login tool"),
          title: z.string().min(10).max(255).describe("Blog title (10–255 chars)"),
          content: z.string().optional().describe("EditorJS JSON string or plain text"),
          description: z.string().max(1000).optional().describe("Short meta description"),
          banner: z
            .string()
            .url()
            .optional()
            .describe("Banner image URL — required only for publishing"),
          status: z
            .enum(["draft", "published", "archived"])
            .optional()
            .default("draft"),
          slug: z.string().optional().describe("Auto-generated from title if omitted"),
          tags: z.string().optional().describe("Comma-separated tags"),
          categories: z
            .array(z.string())
            .optional()
            .default([])
            .describe("Category name array, e.g. ['TypeScript', 'React']"),
        },
      },
      async ({ session_token, title, content, description, banner, status, slug, tags, categories }) => {
        let session: SessionPayload;
        try {
          session = verifySession(session_token);
        } catch (err) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: err instanceof Error ? err.message : "Unauthorized" }) }] };
        }

        const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
        const finalStatus = isAdmin ? status : "draft";

        if (finalStatus === "published" && !banner) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: "A banner URL is required to publish. Set status to 'draft' first, then add a banner before publishing." }) }],
          };
        }

        const baseSlug = slug || generateSlug(title);
        const uniqueSlug = makeUniqueSlug(baseSlug);

        try {
          const blog = await db.blog.create({
            data: {
              title,
              content: serializeContent(content),
              description: description ?? "",
              status: finalStatus,
              banner: banner ?? "",
              tags: tags ?? "",
              slug: uniqueSlug,
              approved: isAdmin,
              categories: resolveCategories(categories ?? []),
              author: { connect: { email: session.email } },
            },
          });
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  success: true,
                  message: `Blog "${blog.title}" created as ${blog.status}.`,
                  blog: { id: blog.id, title: blog.title, slug: blog.slug, status: blog.status, approved: blog.approved },
                }),
              },
            ],
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          const detail = msg.includes("P2002")
            ? "A blog with this title or slug already exists."
            : `Failed to create blog: ${msg}`;
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: detail }) }] };
        }
      }
    );

    // ── update_blog ───────────────────────────────────────────────────────────
    server.registerTool(
      "update_blog",
      {
        title: "Update Blog",
        description:
          "Update an existing blog post by ID. Only include fields you want to change — omitted fields stay unchanged. Publishing requires a banner URL.",
        inputSchema: {
          session_token: z.string().min(1),
          id: z.string().min(1).describe("Blog ID from create_blog or list_blogs"),
          title: z.string().min(10).max(255).optional(),
          content: z.string().optional(),
          description: z.string().max(1000).optional(),
          banner: z.string().url().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
          slug: z.string().optional(),
          tags: z.string().optional(),
          categories: z.array(z.string()).optional(),
        },
      },
      async ({ session_token, id, title, content, description, banner, status, slug, tags, categories }) => {
        let session: SessionPayload;
        try {
          session = verifySession(session_token);
        } catch (err) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: err instanceof Error ? err.message : "Unauthorized" }) }] };
        }

        const existing = await db.blog.findUnique({ where: { id }, include: { author: true } });
        if (!existing) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Blog "${id}" not found.` }) }] };
        }

        const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
        const isAuthor = session.email === existing.author.email;
        if (!isAdmin && !isAuthor) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "You don't have permission to edit this blog." }) }] };
        }

        const resolvedStatus = status ?? existing.status;
        const resolvedBanner = banner ?? existing.banner ?? "";
        if (resolvedStatus === "published" && !resolvedBanner) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "A banner URL is required to publish." }) }] };
        }

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = serializeContent(content);
        if (description !== undefined) updateData.description = description;
        if (banner !== undefined) updateData.banner = banner;
        if (status !== undefined) {
          updateData.status = isAdmin ? status : "draft";
          if (isAdmin) updateData.approved = true;
        }
        if (slug !== undefined) updateData.slug = slug;
        if (tags !== undefined) updateData.tags = tags;
        if (categories !== undefined) updateData.categories = resolveCategories(categories);

        try {
          const updated = await db.blog.update({ where: { id }, data: updateData });
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  success: true,
                  message: `Blog "${updated.title}" updated successfully.`,
                  blog: { id: updated.id, title: updated.title, slug: updated.slug, status: updated.status },
                }),
              },
            ],
          };
        } catch (err) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Update failed: ${err instanceof Error ? err.message : String(err)}` }) }] };
        }
      }
    );

    // ── get_blog ──────────────────────────────────────────────────────────────
    server.registerTool(
      "get_blog",
      {
        title: "Get Blog",
        description: "Fetch a single blog post by ID or slug. Provide either 'id' or 'slug'.",
        inputSchema: {
          session_token: z.string().min(1),
          id: z.string().optional().describe("Blog ID"),
          slug: z.string().optional().describe("Blog slug"),
        },
      },
      async ({ session_token, id, slug }) => {
        try {
          verifySession(session_token);
        } catch (err) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: err instanceof Error ? err.message : "Unauthorized" }) }] };
        }

        if (!id && !slug) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Provide either 'id' or 'slug'." }) }] };
        }

        const blog = await db.blog.findUnique({
          where: id ? { id } : { slug },
          include: {
            author: { select: { id: true, name: true, email: true } },
            categories: true,
          },
        });

        if (!blog) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Blog not found." }) }] };
        }
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, blog }) }] };
      }
    );

    // ── list_blogs ────────────────────────────────────────────────────────────
    server.registerTool(
      "list_blogs",
      {
        title: "List Blogs",
        description:
          "List blog posts with optional status filter and pagination. Returns IDs you can use with update_blog.",
        inputSchema: {
          session_token: z.string().min(1),
          page: z.number().int().min(1).optional().default(1),
          pageSize: z.number().int().min(1).max(50).optional().default(10),
          status: z.enum(["draft", "published", "archived"]).optional().describe("Filter by status"),
        },
      },
      async ({ session_token, page, pageSize, status }) => {
        try {
          verifySession(session_token);
        } catch (err) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: err instanceof Error ? err.message : "Unauthorized" }) }] };
        }

        const where = status ? { status } : {};
        const skip = (page - 1) * pageSize;

        const [total, blogs] = await Promise.all([
          db.blog.count({ where }),
          db.blog.findMany({
            where,
            include: {
              author: { select: { id: true, name: true } },
              categories: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
          }),
        ]);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                blogs,
                meta: { total, page, pages: Math.ceil(total / pageSize), pageSize },
              }),
            },
          ],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

export { handler as GET, handler as POST };
