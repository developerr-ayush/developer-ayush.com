import type { Metadata } from "next";
import { db } from "../../../../lib/db";
import PostEditor from "../post-editor";

export const metadata: Metadata = { title: "New post" };
export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const cats = await db.category.findMany({ orderBy: { name: "asc" }, select: { name: true } });
  return <PostEditor allCategories={cats.map((c) => c.name)} />;
}
