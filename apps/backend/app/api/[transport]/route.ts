import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AsyncLocalStorage } from "node:async_hooks";
import { timingSafeEqual } from "node:crypto";
import { db } from "../../../lib/db";
import cloudinary from "../../../lib/cloudinary";
import { validateBlogContent } from "../../../lib/blog-content";
import { baseUrlFrom, isValidAccessToken } from "../../../lib/oauth";

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

// Per-request Authorization header, so tools can authenticate without a login step.
const requestAuth = new AsyncLocalStorage<{ authorization: string | null }>();

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Resolves the caller. Accepted, in order:
 *  1. `session_token` argument (JWT from the `login` tool) — original behaviour
 *  2. `Authorization: Bearer <MCP_API_KEY>` — static key for clients like ChatGPT that
 *     can't run a login step. Acts as MCP_API_USER_EMAIL (default: first SUPER_ADMIN).
 *  3. `Authorization: Bearer <JWT from login>`
 */
async function authenticate(sessionToken?: string): Promise<SessionPayload> {
  if (sessionToken) return verifySession(sessionToken);

  const header = requestAuth.getStore()?.authorization ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!bearer) {
    throw new Error("Not authenticated. Send 'Authorization: Bearer <MCP_API_KEY>' or pass a session_token from login.");
  }

  const apiKey = process.env.MCP_API_KEY;
  if (apiKey && safeEqual(bearer, apiKey)) {
    const email = process.env.MCP_API_USER_EMAIL;
    const user = email
      ? await db.user.findUnique({ where: { email } })
      : await db.user.findFirst({ where: { role: "SUPER_ADMIN" }, orderBy: { email: "asc" } });
    if (!user) throw new Error("API key is valid but no matching MCP user exists. Set MCP_API_USER_EMAIL.");
    return { userId: user.id, email: user.email, role: user.role as SessionPayload["role"], name: user.name ?? null };
  }
  const claims = verifySession(bearer);
  // Re-read the account so deleted users and role changes take effect immediately.
  const fresh = await db.user.findUnique({ where: { id: claims.userId } });
  if (!fresh) throw new Error("Account no longer exists. Please reconnect.");
  return { userId: fresh.id, email: fresh.email, role: fresh.role as SessionPayload["role"], name: fresh.name ?? null };
}

const isAdminRole = (s: SessionPayload) => s.role === "ADMIN" || s.role === "SUPER_ADMIN";

const reply = (obj: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(obj) }] });

/** Authenticate, run, and convert any thrown error into an MCP-friendly error payload. */
async function guarded(
  sessionToken: string | undefined,
  fn: (s: SessionPayload) => Promise<unknown>,
  opts: { admin?: boolean } = {}
) {
  try {
    const s = await authenticate(sessionToken);
    if (opts.admin && !isAdminRole(s)) return reply({ error: "This action requires an ADMIN or SUPER_ADMIN account." });
    return reply(await fn(s));
  } catch (err) {
    return reply({ error: err instanceof Error ? err.message : "Unexpected error" });
  }
}

function verifySession(token: string): SessionPayload {
  try {
    const p = jwt.verify(token, JWT_SECRET) as SessionPayload & { typ?: string };
    // Refuse OAuth codes / refresh tokens / client ids signed with the same secret.
    if ((p.typ !== undefined && p.typ !== "access") || typeof p.userId !== "string" || typeof p.email !== "string") {
      throw new Error("bad token type");
    }
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
          session_token: z.string().optional().describe("Optional: token from the login tool. Not needed when the request carries an Authorization bearer key."),
          title: z.string().min(10).max(255).describe("Blog title (10–255 chars)"),
          content: z.string().optional().describe("Editor.js JSON ({\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"...\"}}]}) or plain text. Block types: header(text,level), paragraph(text), list(style,items), table(content[][]), image(file.url), code(code,language), embed(service,source), quote, delimiter. Plain text is split on blank lines; '# ' lines become headings. Invalid content is rejected with the exact reason."),
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
            .array(z.string().trim().min(1).max(40))
            .max(10)
            .optional()
            .default([])
            .describe("Category name array, e.g. ['TypeScript', 'React']"),
        },
      },
      async ({ session_token, title, content, description, banner, status, slug, tags, categories }) => {
        let session: SessionPayload;
        try {
          session = await authenticate(session_token);
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

        const checked = validateBlogContent(content);
        if (!checked.ok) return { content: [{ type: "text" as const, text: JSON.stringify({ error: checked.error }) }] };
        if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "slug must be lowercase letters, numbers and single hyphens, e.g. my-first-post." }) }] };
        }
        if (await db.blog.findUnique({ where: { title }, select: { id: true } })) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: `A post titled "${title}" already exists. Use a different title or update_blog.` }) }] };
        }

        const baseSlug = slug || generateSlug(title);
        const uniqueSlug = makeUniqueSlug(baseSlug);

        try {
          const blog = await db.blog.create({
            data: {
              title,
              content: checked.json,
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
          session_token: z.string().optional(),
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
          session = await authenticate(session_token);
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
        if (title !== undefined && title !== existing.title) {
          if (await db.blog.findUnique({ where: { title }, select: { id: true } })) {
            return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Another post is already titled "${title}".` }) }] };
          }
          updateData.title = title;
        }
        if (content !== undefined) {
          const checked = validateBlogContent(content);
          if (!checked.ok) return { content: [{ type: "text" as const, text: JSON.stringify({ error: checked.error }) }] };
          updateData.content = checked.json;
        }
        if (description !== undefined) updateData.description = description;
        if (banner !== undefined) updateData.banner = banner;
        if (status !== undefined) {
          updateData.status = isAdmin ? status : "draft";
          if (isAdmin) updateData.approved = true;
        }
        if (slug !== undefined) {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return { content: [{ type: "text" as const, text: JSON.stringify({ error: "slug must be lowercase letters, numbers and single hyphens." }) }] };
          }
          const clash = await db.blog.findUnique({ where: { slug }, select: { id: true } });
          if (clash && clash.id !== id) {
            return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Slug "${slug}" is already used by another post.` }) }] };
          }
          updateData.slug = slug;
        }
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
          session_token: z.string().optional(),
          id: z.string().optional().describe("Blog ID"),
          slug: z.string().optional().describe("Blog slug"),
        },
      },
      async ({ session_token, id, slug }) => {
        try {
          await authenticate(session_token);
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
          session_token: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          pageSize: z.number().int().min(1).max(50).optional().default(10),
          status: z.enum(["draft", "published", "archived"]).optional().describe("Filter by status"),
        },
      },
      async ({ session_token, page, pageSize, status }) => {
        try {
          await authenticate(session_token);
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

    // ── upload_image ──────────────────────────────────────────────────────────
    server.registerTool(
      "upload_image",
      {
        title: "Upload Image",
        description:
          "Upload an image to Cloudinary and get back a permanent URL to use as a blog 'banner', product 'image', or inside post content. Provide EITHER 'url' (a public image URL to copy) OR 'base64' (raw base64 or a data: URI, max ~8 MB).",
        inputSchema: {
          session_token: z.string().optional(),
          url: z.string().url().optional().describe("Public http(s) image URL to import"),
          base64: z.string().optional().describe("Base64 image data, with or without the data:image/...;base64, prefix"),
          mime_type: z.string().optional().default("image/png").describe("Used only when base64 has no data: prefix"),
          folder: z.enum(["blog", "blog-banners", "products"]).optional().default("blog"),
        },
      },
      async ({ session_token, url, base64, mime_type, folder }) =>
        guarded(session_token, async () => {
          if (!url === !base64) throw new Error("Provide exactly one of 'url' or 'base64'.");
          let file = url!;
          if (base64) {
            file = base64.startsWith("data:") ? base64 : `data:${mime_type};base64,${base64}`;
            if (file.length > 11_000_000) throw new Error("Image is too large (max ~8 MB).");
            if (!/^data:image\//.test(file)) throw new Error("Only image data is accepted.");
          }
          const res = await cloudinary.v2.uploader.upload(file, {
            folder,
            resource_type: "image",
            transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
          });
          return { success: true, url: res.secure_url, public_id: res.public_id, width: res.width, height: res.height };
        })
    );

    // ── categories ────────────────────────────────────────────────────────────
    server.registerTool(
      "list_categories",
      {
        title: "List Categories",
        description: "List all blog categories with post counts.",
        inputSchema: { session_token: z.string().optional() },
      },
      async ({ session_token }) =>
        guarded(session_token, async () => {
          const cats = await db.category.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, slug: true, showInHome: true, _count: { select: { blogs: true } } },
          });
          return { success: true, categories: cats.map((c) => ({ ...c, posts: c._count.blogs, _count: undefined })) };
        })
    );

    server.registerTool(
      "create_category",
      {
        title: "Create Category",
        description: "Create a blog category (names are stored lowercase). Categories are also created automatically by create_blog.",
        inputSchema: { session_token: z.string().optional(), name: z.string().min(2).max(40), showInHome: z.boolean().optional().default(false) },
      },
      async ({ session_token, name, showInHome }) =>
        guarded(session_token, async () => {
          const n = name.trim().toLowerCase();
          const cat = await db.category.upsert({
            where: { name: n },
            update: {},
            create: { name: n, slug: n.replace(/ /g, "-"), showInHome },
          });
          return { success: true, category: cat };
        })
    );

    // ── products ──────────────────────────────────────────────────────────────
    const productFields = {
      name: z.string().min(2),
      slug: z.string().min(2).optional().describe("Auto-generated from name if omitted"),
      shortDescription: z.string().max(500).optional(),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      salePrice: z.number().min(0).optional(),
      image: z.string().url().optional().describe("Image URL, e.g. from upload_image"),
      affiliateLink: z.string().url().optional(),
      amazonLink: z.string().url().optional(),
      flipkartLink: z.string().url().optional(),
      instagramPost: z.string().url().optional(),
      category: z.string().optional(),
      brand: z.string().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.string().optional().describe("Comma-separated"),
      status: z.enum(["draft", "published", "archived"]).optional(),
      featured: z.boolean().optional(),
    };

    server.registerTool(
      "list_products",
      {
        title: "List Products",
        description: "List products, optionally filtered by status or a search term.",
        inputSchema: {
          session_token: z.string().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
          search: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          pageSize: z.number().int().min(1).max(50).optional().default(20),
        },
      },
      async ({ session_token, status, search, page, pageSize }) =>
        guarded(session_token, async () => {
          const where = {
            ...(status ? { status } : {}),
            ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { brand: { contains: search, mode: "insensitive" as const } }] } : {}),
          };
          const [total, products] = await Promise.all([
            db.product.count({ where }),
            db.product.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
          ]);
          return { success: true, products, meta: { total, page, pages: Math.ceil(total / pageSize), pageSize } };
        })
    );

    server.registerTool(
      "create_product",
      { title: "Create Product", description: "Create a product listing (admin only). Defaults to draft.", inputSchema: { session_token: z.string().optional(), ...productFields } },
      async ({ session_token, ...p }) =>
        guarded(
          session_token,
          async () => {
            const product = await db.product.create({
              data: { ...p, slug: p.slug ?? generateSlug(p.name), status: p.status ?? "draft", featured: p.featured ?? false, images: [] },
            });
            return { success: true, product };
          },
          { admin: true }
        )
    );

    server.registerTool(
      "update_product",
      {
        title: "Update Product",
        description: "Update a product by ID (admin only). Only include fields to change.",
        inputSchema: { session_token: z.string().optional(), id: z.string().min(1), ...Object.fromEntries(Object.entries(productFields).map(([k, v]) => [k, v.optional()])) },
      },
      async ({ session_token, id, ...p }) =>
        guarded(
          session_token,
          async () => {
            const product = await db.product.update({ where: { id }, data: p });
            return { success: true, product };
          },
          { admin: true }
        )
    );

    // ── slang ─────────────────────────────────────────────────────────────────
    server.registerTool(
      "list_slang",
      {
        title: "List Slang",
        description: "List slang terms. Use status 'pending' to see the moderation queue.",
        inputSchema: {
          session_token: z.string().optional(),
          status: z.enum(["pending", "approved", "rejected"]).optional(),
          search: z.string().optional(),
          page: z.number().int().min(1).optional().default(1),
          pageSize: z.number().int().min(1).max(50).optional().default(20),
        },
      },
      async ({ session_token, status, search, page, pageSize }) =>
        guarded(session_token, async () => {
          const where = {
            ...(status ? { status } : {}),
            ...(search ? { OR: [{ term: { contains: search, mode: "insensitive" as const } }, { meaning: { contains: search, mode: "insensitive" as const } }] } : {}),
          };
          const [total, terms] = await Promise.all([
            db.slangTerm.count({ where }),
            db.slangTerm.findMany({ where, orderBy: { submittedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
          ]);
          return { success: true, terms, meta: { total, page, pages: Math.ceil(total / pageSize), pageSize } };
        })
    );

    server.registerTool(
      "moderate_slang",
      {
        title: "Moderate Slang",
        description: "Approve, reject, or toggle 'featured' on a slang term by ID (admin only).",
        inputSchema: { session_token: z.string().optional(), id: z.string().min(1), action: z.enum(["approve", "reject", "feature"]) },
      },
      async ({ session_token, id, action }) =>
        guarded(
          session_token,
          async (s) => {
            const term = await db.slangTerm.findUnique({ where: { id } });
            if (!term) throw new Error("Slang term not found.");
            const data =
              action === "feature"
                ? { isFeatured: !term.isFeatured }
                : { status: action === "approve" ? ("approved" as const) : ("rejected" as const), approvedBy: s.email, approvedAt: new Date() };
            return { success: true, term: await db.slangTerm.update({ where: { id }, data }) };
          },
          { admin: true }
        )
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

// Authenticates at the HTTP layer so unauthenticated clients get the OAuth challenge
// (401 + WWW-Authenticate) they need to start the connector sign-in flow.
async function withAuthHeader(req: Request) {
  const authorization = req.headers.get("authorization");
  const base = baseUrlFrom(req.headers, req.url);
  const challenge = (error?: string) =>
    new Response(JSON.stringify({ error: error ?? "unauthorized", error_description: "Authenticate via OAuth or send a bearer API key." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": `Bearer resource_metadata="${base}/.well-known/oauth-protected-resource"${error ? `, error="${error}"` : ""}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "WWW-Authenticate",
      },
    });

  if (authorization) {
    const token = authorization.replace(/^bearer\s+/i, "").trim();
    const apiKey = process.env.MCP_API_KEY;
    const ok = (apiKey && safeEqual(token, apiKey)) || isValidAccessToken(token);
    if (!ok) return challenge("invalid_token");
  } else {
    // Legacy flow: the `login` tool and calls carrying a session_token work without a header.
    let legacy = false;
    if (req.method === "POST") {
      try {
        const body = await req.clone().text();
        legacy = /"name"\s*:\s*"login"/.test(body) || body.includes('"session_token"');
      } catch {
        /* treat as unauthenticated */
      }
    }
    if (!legacy) return challenge();
  }
  return requestAuth.run({ authorization }, () => handler(req));
}

export { withAuthHeader as GET, withAuthHeader as POST };
