import Link from "next/link";
import { showBlog } from "../../../actions/blog";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "./delete-button";
import Image from "next/image";
import { auth } from "../../../auth";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, Td, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Pencil } from "lucide-react";

export default async function BlogAdmin() {
  const blogs = await showBlog();
  const session = await auth();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  const columns = [
    { label: "Post" },
    { label: "Status" },
    { label: "Updated" },
    ...(isAdmin ? [{ label: "Author" }] : []),
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content and publications"
        ctaLabel="New Post"
        ctaHref="/admin/blog/new"
      />

      <DataTable
        columns={columns}
        isEmpty={blogs.length === 0}
        emptyState={
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 font-medium mb-1">No blog posts yet</p>
              <p className="text-sm text-slate-600">Get started by creating your first post</p>
            </div>
            <Link href="/admin/blog/new"
              className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
              Create Post
            </Link>
          </div>
        }
      >
        {blogs.map((blog) => (
          <Tr key={blog.id}>
            {/* Post title + thumbnail */}
            <Td>
              <div className="flex items-center gap-3">
                {blog.banner && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden">
                    <Image src={blog.banner} alt="" width={36} height={36}
                      className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white text-sm">{blog.title}</p>
                  {blog.description && (
                    <p className="text-xs text-slate-500 truncate max-w-xs">{blog.description}</p>
                  )}
                </div>
              </div>
            </Td>

            {/* Status */}
            <Td>
              <div className="flex flex-col gap-1.5">
                <StatusBadge status={blog.status ?? "draft"} dot />
                {blog.status === "draft" && (
                  <StatusBadge
                    status={blog.approved ? "approved" : "pending"}
                    label={blog.approved ? "Approved" : "Needs Review"}
                  />
                )}
              </div>
            </Td>

            {/* Updated */}
            <Td>
              <span className="text-xs text-slate-500">
                {blog.updatedAt
                  ? formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })
                  : "—"}
              </span>
            </Td>

            {/* Author (admin only) */}
            {isAdmin && (
              <Td>
                <StatusBadge status={blog.author.role} label={blog.author.name ?? blog.author.email} />
              </Td>
            )}

            {/* Actions */}
            <Td className="text-right">
              <div className="flex items-center justify-end gap-3">
                <Link href={`/admin/blog/${blog.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                <DeleteButton blogId={blog.id} authorEmail={blog.author.email} />
              </div>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
