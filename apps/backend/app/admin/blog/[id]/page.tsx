import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import PostEditor from "../post-editor";
import { EmptyState } from "../../../../components/ui/empty-state";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  const [blog, cats] = await Promise.all([
    db.blog.findUnique({
      where: { id },
      include: {
        categories: { select: { name: true } },
        author: { select: { name: true, email: true, role: true } },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  if (!blog) notFound();

  if (!isAdmin && blog.author.email !== session.user.email) {
    return (
      <EmptyState
        icon={<ShieldAlert className="size-6 text-danger" aria-hidden="true" />}
        title="You can't edit this post"
        description="Only its author or an admin can open it."
        action={
          <Link href="/admin/blog" className="btn">
            Back to posts
          </Link>
        }
      />
    );
  }

  return (
    <PostEditor
      allCategories={cats.map((c) => c.name)}
      post={{
        id: blog.id,
        title: blog.title ?? "",
        slug: blog.slug ?? "",
        description: blog.description ?? "",
        banner: blog.banner ?? "",
        tags: blog.tags ?? "",
        status: blog.status,
        approved: blog.approved,
        content: blog.content,
        categories: blog.categories.map((c) => c.name),
        authorName: blog.author.name,
        authorEmail: blog.author.email,
        authorRole: blog.author.role,
      }}
    />
  );
}
