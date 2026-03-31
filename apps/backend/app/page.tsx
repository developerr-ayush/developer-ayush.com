"use client";

import Link from "next/link";
import {
  Terminal,
  Activity,
  Server,
  Zap,
  ShieldCheck,
  Cloud,
  Sparkles,
  Upload,
  Globe,
  ArrowRight,
} from "lucide-react";
import { products, platformServices } from "../components/products.config";
import { ProductCard } from "../components/ProductCard";

// ── Platform service icon map ────────────────────────────────────
const SERVICE_ICONS = {
  ShieldCheck,
  Sparkles,
  Upload,
  Globe,
} as const;

// ── Stats ────────────────────────────────────────────────────────
const STATS = [
  { label: "Uptime", value: "99.98%", icon: Server, color: "text-emerald-400" },
  { label: "Avg Latency", value: "~50ms", icon: Zap, color: "text-amber-400" },
  { label: "Live Products", value: `${products.length}`, icon: Activity, color: "text-blue-400" },
  { label: "Hosting", value: "Vercel Edge", icon: Cloud, color: "text-purple-400" },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">

      {/* ── Background ambient glows ─────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/8 blur-[140px] rounded-full" />
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Terminal className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Backend<span className="text-blue-500">Core</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-white transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-white transition-colors"
            >
              Platform
            </button>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <Link
            href="/admin/blog"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 py-20 lg:py-28">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="text-center space-y-7 animate-fadeIn">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            One backend.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Multiple products.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed font-light">
            A unified API backend built with Next.js 15, Prisma &amp; PostgreSQL — powering{" "}
            <strong className="text-slate-300 font-medium">{products.length} live products</strong> across different
            domains with shared auth, AI services, and admin tooling.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 bg-white text-slate-950 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/admin/blog"
              className="px-7 py-3.5 bg-slate-900 text-white border border-white/10 rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-95"
            >
              Admin Dashboard
            </Link>
          </div>
        </section>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="p-6 bg-white/[0.03] border border-white/8 rounded-2xl group hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-slate-900 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* ── Products section ────────────────────────────────────── */}
        <section id="products" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.15em]">
                Product Suite
              </p>
              <h2 className="text-3xl font-bold text-white">What we power</h2>
              <p className="text-slate-400 max-w-lg">
                Each product is independently deployed with its own domain, but shares this single backend for data,
                auth, and AI services.
              </p>
            </div>
            <p className="text-xs text-slate-600 md:text-right max-w-xs">
              To add a new product, update{" "}
              <code className="text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">products.config.ts</code> — it
              auto-appears here and in all admin tools.
            </p>
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Platform Services section ──────────────────────────── */}
        <section id="platform" className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.15em]">
              Shared Infrastructure
            </p>
            <h2 className="text-3xl font-bold text-white">Platform services</h2>
            <p className="text-slate-400 max-w-lg">
              All products share these core platform capabilities. Build on top of them, don&apos;t re-invent them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {platformServices.map((service) => {
              const Icon = SERVICE_ICONS[service.icon as keyof typeof SERVICE_ICONS];
              return (
                <div
                  key={service.name}
                  className="flex gap-4 p-6 bg-white/[0.03] border border-white/8 rounded-2xl hover:border-white/15 transition-all group"
                >
                  <div className="p-2.5 bg-slate-900 rounded-xl h-fit group-hover:scale-110 transition-transform">
                    {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Extension guide callout ─────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-slate-900 to-[#020617] p-10 md:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 pointer-events-none" />
          <div className="relative space-y-5 max-w-2xl">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.15em]">Developer Experience</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to add a new product?</h2>
            <p className="text-slate-400 leading-relaxed">
              The backend is designed to be extended. Create your routes under <code className="text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">/app/api</code>, add an admin page under <code className="text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">/app/admin</code>, and register your product in the config file — the UI, docs, and nav update automatically.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/admin/blog"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Open Dashboard
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#010413]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-400">
              Backend<span className="text-blue-500">Core</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            {products.map((p) => (
              <a
                key={p.id}
                href={p.domain}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-400 transition-colors"
              >
                {p.name}
              </a>
            ))}
          </div>

          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} BackendCore — built with Next.js 15
          </p>
        </div>
      </footer>
    </div>
  );
}

// Disambiguate 'LayoutDashboard' — imported inline so it's available in JSX
import { LayoutDashboard } from "lucide-react";
