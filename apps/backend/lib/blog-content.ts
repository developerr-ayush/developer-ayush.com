import { z } from "zod";

/**
 * Validation for blog `content` coming from outside the admin UI (MCP / AI).
 * The stored format is an Editor.js JSON string; the portfolio renders these block
 * types: header, paragraph, list (nested), table, image, embed, code (+ quote, delimiter).
 */

const text = z.string();

type ListItem = string | { content: string; items?: ListItem[] };
const listItem: z.ZodType<ListItem> = z.lazy(() =>
  z.union([z.string(), z.object({ content: z.string(), items: z.array(listItem).optional() }).passthrough()])
);

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("header"), data: z.object({ text, level: z.number().int().min(1).max(6).default(2) }).passthrough() }),
  z.object({ type: z.literal("paragraph"), data: z.object({ text }).passthrough() }),
  z.object({
    type: z.literal("list"),
    data: z.object({ style: z.enum(["ordered", "unordered"]).default("unordered"), items: z.array(listItem).min(1) }).passthrough(),
  }),
  z.object({
    type: z.literal("table"),
    data: z
      .object({ withHeadings: z.boolean().optional(), content: z.array(z.array(z.string())).min(1) })
      .passthrough(),
  }),
  z.object({
    type: z.literal("image"),
    data: z.object({ file: z.object({ url: z.string().url() }).passthrough(), caption: z.string().optional() }).passthrough(),
  }),
  z.object({
    type: z.literal("code"),
    data: z.object({ code: z.string(), language: z.string().optional() }).passthrough(),
  }),
  z.object({
    type: z.literal("embed"),
    data: z.object({ service: z.string(), source: z.string().url(), embed: z.string().url().optional() }).passthrough(),
  }),
  z.object({ type: z.literal("quote"), data: z.object({ text, caption: z.string().optional() }).passthrough() }),
  z.object({ type: z.literal("delimiter"), data: z.object({}).passthrough() }),
]);

export const ALLOWED_BLOCKS = ["header", "paragraph", "list", "table", "image", "code", "embed", "quote", "delimiter"];

export type ContentResult = { ok: true; json: string; blocks: number } | { ok: false; error: string };

function fromPlainText(raw: string) {
  return raw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const h = /^(#{1,6})\s+(.*)$/.exec(p);
      return h
        ? { type: "header", data: { text: h[2], level: Math.max(2, h[1]!.length) } }
        : { type: "paragraph", data: { text: p.replace(/\n/g, "<br>") } };
    });
}

/** Returns normalised Editor.js JSON (ids, time, version filled in) or a precise, model-readable error. */
export function validateBlogContent(input: string | undefined): ContentResult {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: true, json: "", blocks: 0 };

  let blocks: unknown[];
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    /* not JSON: treat as plain text below */
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && "blocks" in parsed) {
    const b = (parsed as { blocks: unknown }).blocks;
    if (!Array.isArray(b)) return { ok: false, error: "content.blocks must be an array." };
    blocks = b;
  } else if (Array.isArray(parsed)) {
    blocks = parsed;
  } else if (parsed !== null && typeof parsed === "object") {
    return { ok: false, error: `content is JSON but has no "blocks" array. Expected {"blocks":[{"type":"paragraph","data":{"text":"..."}}]}. Allowed types: ${ALLOWED_BLOCKS.join(", ")}.` };
  } else {
    blocks = fromPlainText(raw);
  }

  if (blocks.length === 0) return { ok: false, error: "content has no blocks." };

  const problems: string[] = [];
  const clean = blocks.map((b, i) => {
    const r = blockSchema.safeParse(b);
    if (!r.success) {
      const type = (b as { type?: unknown })?.type;
      const why = ALLOWED_BLOCKS.includes(String(type))
        ? r.error.issues.map((x) => `${x.path.join(".") || "block"}: ${x.message}`).join("; ")
        : `unsupported block type "${String(type)}" (allowed: ${ALLOWED_BLOCKS.join(", ")})`;
      problems.push(`block ${i}: ${why}`);
      return null;
    }
    const id = typeof (b as { id?: unknown }).id === "string" ? (b as { id: string }).id : `b${i + 1}-${Math.random().toString(36).slice(2, 8)}`;
    return { id, ...r.data };
  });

  if (problems.length) {
    return { ok: false, error: `Invalid blog content, nothing was saved. ${problems.slice(0, 6).join(" | ")}${problems.length > 6 ? ` (+${problems.length - 6} more)` : ""}` };
  }
  return { ok: true, json: JSON.stringify({ time: Date.now(), version: "2.30.8", blocks: clean }), blocks: clean.length };
}
