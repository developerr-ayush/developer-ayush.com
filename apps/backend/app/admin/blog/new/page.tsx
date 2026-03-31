import BlogForm from "../blog-form";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewBlogPage() {
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
          <h1 className="text-2xl font-bold text-white">Create New Blog Post</h1>
          <p className="mt-1 text-sm text-slate-400">
            Write and publish a new article · changes auto-save as you type
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        <BlogForm />
      </div>
    </div>
  );
}
