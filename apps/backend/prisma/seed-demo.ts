/**
 * Demo data for local development and screenshots. NOT run by `db:seed`.
 *
 *   ALLOW_DEMO_SEED=1 pnpm --filter backend db:seed:demo
 *
 * Creates three accounts (password: demo-password-123), some categories,
 * posts, products and slang submissions. Safe to re-run: it upserts by
 * unique key and leaves other rows alone.
 */
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const PASSWORD = "demo-password-123";
const LOREM = "The quick brown fox jumps over the lazy dog";

function post(title: string) {
  return JSON.stringify({
    time: Date.now(),
    version: "2.30.8",
    blocks: [
      { id: "a1", type: "paragraph", data: { text: `${LOREM}. ${LOREM}.` } },
      { id: "a2", type: "header", data: { text: "The quick brown fox", level: 2 } },
      { id: "a3", type: "paragraph", data: { text: `${LOREM}, and keeps running past the <b>river</b> and the <a href="https://example.com">old mill</a>.` } },
      { id: "a4", type: "list", data: { style: "unordered", items: ["The quick brown fox", "Jumps over the lazy dog", "And does it again"] } },
      { id: "a5", type: "code", data: { code: "const fox = 'quick';\nconsole.log(fox, 'jumps over the lazy dog');", language: "typescript" } },
      { id: "a6", type: "header", data: { text: "A small table", level: 3 } },
      { id: "a7", type: "table", data: { withHeadings: true, content: [["Animal", "Speed"], ["Fox", "Quick"], ["Dog", "Lazy"]] } },
      { id: "a8", type: "paragraph", data: { text: title } },
    ],
  });
}

async function main() {
  if (process.env.ALLOW_DEMO_SEED !== "1") {
    console.error("Refusing to run: set ALLOW_DEMO_SEED=1 to confirm you want demo data.");
    process.exit(1);
  }
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to run with NODE_ENV=production.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(PASSWORD, 10);
  const mk = (email: string, name: string, role: "SUPER_ADMIN" | "ADMIN" | "USER") =>
    db.user.upsert({ where: { email }, update: {}, create: { email, name, role, password: hash } });
  const owner = await mk("owner@example.com", "Ayush Shah", "SUPER_ADMIN");
  await mk("editor@example.com", "Casey Editor", "ADMIN");
  const writer = await mk("writer@example.com", "Sam Writer", "USER");

  const cats = ["web development", "career", "tools", "finance", "fitness"];
  for (const [i, name] of cats.entries()) {
    await db.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.replace(/ /g, "-"), showInHome: i < 3 },
    });
  }

  const titles = [
    "How the quick brown fox jumps over the lazy dog",
    "Building a calm admin with Next.js and Prisma",
    "Ten notes on writing for developers",
    "Why hairline borders beat drop shadows",
    "A practical guide to caching in the App Router",
    "Editor.js blocks, tables and code samples",
    "Shipping a portfolio redesign without breaking links",
    "Notes on keeping a personal finance spreadsheet",
    "Strength training for people who sit all day",
    "The quick brown fox returns for a second post",
    "Tailwind v4 tokens in a monorepo",
    "Draft: ideas for the next quarter",
    "Archived: an older post about Pages Router",
    "Draft by a writer awaiting approval",
  ];
  for (const [i, title] of titles.entries()) {
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
    const status = i < 7 ? "published" : i === 12 ? "archived" : "draft";
    const byWriter = i === 13 || i === 7;
    await db.blog.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        content: post(title),
        description: `${LOREM}. A short summary for “${title}” that is long enough to look realistic in a list.`,
        status: byWriter ? "draft" : status,
        approved: !byWriter,
        views: Math.floor(Math.random() * 4200),
        tags: "demo, fox, dog",
        authorId: byWriter ? writer.id : owner.id,
        updatedAt: new Date(Date.now() - i * 3600_000 * 7),
        categories: { connect: [{ name: cats[i % cats.length]! }, ...(i % 3 === 0 ? [{ name: cats[(i + 1) % cats.length]! }] : [])] },
      },
    });
  }

  const products = [
    ["Wireless headphones", "audio", "published", 4999, 3999],
    ["Mechanical keyboard", "desk", "published", 7499, null],
    ["USB-C hub", "desk", "draft", 2599, 1999],
    ["Standing desk mat", "desk", "published", 1899, null],
    ["Portable SSD 1TB", "storage", "archived", 8999, 7499],
  ] as const;
  for (const [name, category, status, price, sale] of products) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    await db.product.upsert({
      where: { slug },
      update: {},
      create: { name, slug, category, status, price, salePrice: sale ?? undefined, brand: "Demo Brand", shortDescription: `${LOREM}.`, views: Math.floor(Math.random() * 900), featured: name.startsWith("Wireless") },
    });
  }

  const pending = [
    ["rizzler", "Someone with excellent charm", "Romance"],
    ["mogging", "Outshining someone else", "Behavior"],
    ["aura", "A person's overall vibe or presence", "Emotion"],
    ["glazing", "Excessive praise of someone", "Behavior"],
    ["lock in", "Focus hard on a task", "Lifestyle"],
    ["sigma", "A self-reliant, independent person", "Confidence"],
  ];
  for (const [term, meaning, category] of pending) {
    await db.slangTerm.upsert({
      where: { term: term! },
      update: {},
      create: { term: term!, meaning: meaning!, category: category!, example: `${LOREM} — ${term}.`, status: "pending", submittedBy: "anonymous" },
    });
  }
  await db.slangTerm.upsert({
    where: { term: "touch grass" },
    update: {},
    create: { term: "touch grass", meaning: "Go outside and log off", category: "Lifestyle", status: "rejected", submittedBy: "anonymous" },
  });

  console.log("Demo data ready. Sign in as owner@example.com / " + PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
