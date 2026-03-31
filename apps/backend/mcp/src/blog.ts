import { z } from "zod";
import { db } from "./db.js";
import { verifySession, SessionPayload } from "./auth.js";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const createBlogSchema = z.object({
  session_token: z.string().min(1, "session_token is required"),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(255, "Title must be less than 255 characters"),
  content: z
    .string()
    .optional()
    .describe(
      "EditorJS OutputData as JSON string, or plain markdown/text. Optional for drafts."
    ),
  description: z.string().max(1000).optional(),
  /** Banner image URL — optional when status is draft */
  banner: z
    .string()
    .url("banner must be a valid URL")
    .optional()
    .or(z.literal("")),
  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .default("draft"),
  slug: z.string().optional(),
  tags: z.string().optional(),
  categories: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Array of category names, e.g. ['TypeScript', 'React']"),
});

export const updateBlogSchema = z.object({
  session_token: z.string().min(1, "session_token is required"),
  id: z.string().min(1, "Blog id is required"),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(255)
    .optional(),
  content: z.string().optional(),
  description: z.string().max(1000).optional(),
  banner: z.string().url("banner must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).optional(),
  slug: z.string().optional(),
  tags: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export const getBlogSchema = z.object({
  session_token: z.string().min(1, "session_token is required"),
  id: z.string().optional(),
  slug: z.string().optional(),
});

export const listBlogsSchema = z.object({
  session_token: z.string().min(1, "session_token is required"),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(50).optional().default(10),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function makeUniqueSlug(base: string): string {
  return `${base}-${Date.now().toString().slice(-6)}`;
}

function resolveCategories(categories: string[]) {
  return {
    connectOrCreate: categories.map((cat) => ({
      where: { name: cat },
      create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") },
    })),
  };
}

function serializeContent(content: string | undefined): string {
  if (!content) return "";
  // Try parsing to validate JSON, then re-stringify for consistency
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed);
  } catch {
    // Plain text — store as-is
    return content;
  }
}

// ─── Tool Handlers ────────────────────────────────────────────────────────────

export async function handleCreateBlog(args: unknown) {
  const parsed = createBlogSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: `Invalid arguments: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    };
  }

  const {
    session_token,
    title,
    content,
    description,
    banner,
    status,
    slug,
    tags,
    categories,
  } = parsed.data;

  // Validate session
  let session: SessionPayload;
  try {
    session = verifySession(session_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  // If published, require a banner
  if (status === "published" && !banner) {
    return {
      error:
        "A banner URL is required when publishing a blog. Save as 'draft' first, then add a banner before publishing.",
    };
  }

  // Admins auto-approve; users create draft-only
  const isAdmin =
    session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  const finalStatus = isAdmin ? status : "draft";
  const approved = isAdmin;

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
        approved,
        categories: resolveCategories(categories),
        author: { connect: { email: session.email } },
      },
      include: { author: { select: { id: true, name: true, email: true } }, categories: true },
    });

    return {
      success: true,
      message: `Blog "${blog.title}" created successfully as ${blog.status}.`,
      blog: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        status: blog.status,
        approved: blog.approved,
        createdAt: blog.createdAt,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("P2002")) {
      return {
        error: "A blog with this title or slug already exists. Try a different title.",
      };
    }
    return { error: `Failed to create blog: ${msg}` };
  }
}

export async function handleUpdateBlog(args: unknown) {
  const parsed = updateBlogSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: `Invalid arguments: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    };
  }

  const {
    session_token,
    id,
    title,
    content,
    description,
    banner,
    status,
    slug,
    tags,
    categories,
  } = parsed.data;

  let session: SessionPayload;
  try {
    session = verifySession(session_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  const existing = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!existing) return { error: `Blog with id "${id}" not found.` };

  const isAdmin =
    session.role === "ADMIN" || session.role === "SUPER_ADMIN";
  const isAuthor = session.email === existing.author.email;

  if (!isAdmin && !isAuthor) {
    return { error: "You don't have permission to edit this blog." };
  }

  // Published but no banner? Block it.
  const resolvedBanner = banner ?? existing.banner ?? "";
  const resolvedStatus = status ?? existing.status;
  if (resolvedStatus === "published" && !resolvedBanner) {
    return {
      error:
        "A banner URL is required to publish. Add a banner first, or keep status as 'draft'.",
    };
  }

  // Build update payload — only include fields that were actually provided
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
  if (categories !== undefined) {
    updateData.categories = resolveCategories(categories);
  }

  try {
    const updated = await db.blog.update({
      where: { id },
      data: updateData,
      include: { author: { select: { id: true, name: true } }, categories: true },
    });

    return {
      success: true,
      message: `Blog "${updated.title}" updated successfully.`,
      blog: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        status: updated.status,
        approved: updated.approved,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (err: unknown) {
    return {
      error: `Failed to update blog: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function handleGetBlog(args: unknown) {
  const parsed = getBlogSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: `Invalid arguments: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    };
  }

  const { session_token, id, slug } = parsed.data;

  try {
    verifySession(session_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  if (!id && !slug) {
    return { error: "Provide either 'id' or 'slug' to fetch a blog." };
  }

  const blog = await db.blog.findUnique({
    where: id ? { id } : { slug },
    include: {
      author: { select: { id: true, name: true, email: true } },
      categories: true,
    },
  });

  if (!blog) return { error: "Blog not found." };

  return { success: true, blog };
}

export async function handleListBlogs(args: unknown) {
  const parsed = listBlogsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: `Invalid arguments: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    };
  }

  const { session_token, page, pageSize, status } = parsed.data;

  try {
    verifySession(session_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
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
    success: true,
    blogs,
    meta: {
      total,
      page,
      pages: Math.ceil(total / pageSize),
      pageSize,
    },
  };
}
