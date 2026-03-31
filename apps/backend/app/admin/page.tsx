import Link from "next/link";
import { auth } from "../../auth";
import { db } from "../../lib/db";
import { StatCard } from "../../components/admin/StatCard";
import {
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Users,
  Clock,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";

async function getDashboardStats() {
  const [
    totalBlogs,
    publishedBlogs,
    totalProducts,
    publishedProducts,
    totalSlangs,
    pendingSlangs,
    totalUsers,
  ] = await Promise.all([
    db.blog.count(),
    db.blog.count({ where: { status: "published" } }),
    db.product.count(),
    db.product.count({ where: { status: "published" } }),
    db.slangTerm.count(),
    db.slangTerm.count({ where: { status: "pending" } }),
    db.user.count(),
  ]);

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs: totalBlogs - publishedBlogs,
    totalProducts,
    publishedProducts,
    totalSlangs,
    pendingSlangs,
    totalUsers,
  };
}

const QUICK_LINKS = [
  {
    label: "Blog Posts",
    description: "Write and manage your blog content",
    href: "/admin/blog",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    cta: "New Post",
    ctaHref: "/admin/blog/new",
  },
  {
    label: "Categories",
    description: "Organise blog posts by topic",
    href: "/admin/categories",
    icon: Tag,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    cta: "Manage",
    ctaHref: "/admin/categories",
  },
  {
    label: "Products",
    description: "Manage product listings and affiliates",
    href: "/admin/products",
    icon: ShoppingBag,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    cta: "Add Product",
    ctaHref: "/admin/products/new",
  },
  {
    label: "Slangs",
    description: "Moderate community-submitted slang terms",
    href: "/admin/slang",
    icon: MessageSquare,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    cta: "Review Pending",
    ctaHref: "/admin/slang/pending",
  },
  {
    label: "Users",
    description: "Manage admin and author accounts",
    href: "/admin/users",
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    cta: "Add User",
    ctaHref: "/admin/users/new",
  },
] as const;

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getDashboardStats();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-10">
      {/* Hero greeting */}
      <div className="space-y-1">
        <p className="text-sm text-slate-500">
          {greeting},{" "}
          <span className="text-slate-300 font-medium">
            {session?.user?.name ?? "Admin"}
          </span>
        </p>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm">
          Here&apos;s a summary of all your products.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Blog Posts"
          value={stats.totalBlogs}
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
          description={`${stats.publishedBlogs} published · ${stats.draftBlogs} drafts`}
        />
        <StatCard
          label="Products"
          value={stats.totalProducts}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="emerald"
          description={`${stats.publishedProducts} published`}
        />
        <StatCard
          label="Slang Terms"
          value={stats.totalSlangs}
          icon={<MessageSquare className="w-5 h-5" />}
          color="violet"
          description={
            stats.pendingSlangs > 0
              ? `${stats.pendingSlangs} pending review`
              : "All approved"
          }
        />
        <StatCard
          label="Users"
          value={stats.totalUsers}
          icon={<Users className="w-5 h-5" />}
          color="amber"
          description="Admin & author accounts"
        />
      </div>

      {/* Pending review alert */}
      {stats.pendingSlangs > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                {stats.pendingSlangs} slang term
                {stats.pendingSlangs !== 1 ? "s" : ""} pending review
              </p>
              <p className="text-xs text-amber-400/70">
                Community submissions are waiting for your approval
              </p>
            </div>
          </div>
          <Link
            href="/admin/slang/pending"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-semibold rounded-xl transition-all"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Feature sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Features
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {QUICK_LINKS.map((link) => (
            <div
              key={link.href}
              className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${link.bg}`}>
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{link.label}</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {link.description}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={link.href}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
                <span className="text-slate-700">·</span>
                <Link
                  href={link.ctaHref}
                  className={`text-xs font-semibold transition-colors flex items-center gap-1 ${link.color}`}
                >
                  {link.cta} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
