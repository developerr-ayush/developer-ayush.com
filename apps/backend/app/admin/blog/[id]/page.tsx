import { db } from "../../../../lib/db";
import { notFound } from "next/navigation";
import BlogForm from "../blog-form";
import { auth } from "../../../../auth";
import ApprovalActions from "../approval-actions";
import DeleteButton from "../delete-button";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
/* eslint-disable  @typescript-eslint/no-explicit-any */

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return <div className="text-slate-400 p-6">Not authenticated</div>;
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  try {
    const blog = await db.blog.findUnique({
      where: { id },
      include: {
        categories: true,
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!blog) notFound();

    const isAuthor = blog.author.email === session.user.email;
    if (!isAuthor && !isAdmin) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-5">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Permission Denied</h2>
          <p className="text-sm text-slate-400">You don&apos;t have permission to edit this blog post.</p>
        </div>
      );
    }

    const showApprovalActions = isAdmin && !isAuthor && blog.author.role === "USER";

    return (
      <div className="space-y-6">
        {/* Back */}
        <Link href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Posts
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
            <p className="mt-1 text-sm text-slate-400 truncate max-w-xl">{blog.title}</p>
          </div>
          <DeleteButton blogId={blog.id} authorEmail={blog.author.email} />
        </div>

        {/* Approval actions */}
        {showApprovalActions && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <ApprovalActions blog={blog} />
          </div>
        )}

        {/* Form card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          <BlogForm blog={blog as any} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return <div className="text-slate-400 p-6">Error loading blog post</div>;
  }
}
