import type { Metadata } from "next";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { PageHeader } from "../../../components/admin/PageHeader";
import CategoriesManager from "./categories-manager";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user) return null;
  const rows = await db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, showInHome: true, _count: { select: { blogs: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Categories"
        description="Group posts by topic. Categories marked “on home” appear on the portfolio's front page."
      />
      <CategoriesManager
        categories={rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, showInHome: r.showInHome, posts: r._count.blogs }))}
      />
    </div>
  );
}
