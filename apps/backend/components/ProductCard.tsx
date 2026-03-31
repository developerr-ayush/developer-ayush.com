"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  ShoppingBag,
  Mail,
  Layers,
  ExternalLink,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Dot,
} from "lucide-react";
import type { Product } from "./products.config";
import { ApiExplorer } from "./ApiExplorer";

// ── Icon resolver ───────────────────────────────────────────────
const ICONS = {
  BookOpen,
  MessageSquare,
  ShoppingBag,
  Mail,
  Layers,
} as const;

// ── Color tokens ─────────────────────────────────────────────────
const COLOR_MAP = {
  blue: {
    border: "hover:border-blue-500/50",
    icon: "bg-blue-600 shadow-blue-500/25",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-500",
    link: "text-blue-400 hover:text-blue-300",
    highlight: "text-blue-400",
  },
  violet: {
    border: "hover:border-violet-500/50",
    icon: "bg-violet-600 shadow-violet-500/25",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-500",
    link: "text-violet-400 hover:text-violet-300",
    highlight: "text-violet-400",
  },
  emerald: {
    border: "hover:border-emerald-500/50",
    icon: "bg-emerald-600 shadow-emerald-500/25",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
    link: "text-emerald-400 hover:text-emerald-300",
    highlight: "text-emerald-400",
  },
  amber: {
    border: "hover:border-amber-500/50",
    icon: "bg-amber-600 shadow-amber-500/25",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-500",
    link: "text-amber-400 hover:text-amber-300",
    highlight: "text-amber-400",
  },
  rose: {
    border: "hover:border-rose-500/50",
    icon: "bg-rose-600 shadow-rose-500/25",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-500",
    link: "text-rose-400 hover:text-rose-300",
    highlight: "text-rose-400",
  },
  cyan: {
    border: "hover:border-cyan-500/50",
    icon: "bg-cyan-600 shadow-cyan-500/25",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-500",
    link: "text-cyan-400 hover:text-cyan-300",
    highlight: "text-cyan-400",
  },
} satisfies Record<Product["color"], object>;

// ── ProductCard ──────────────────────────────────────────────────
export function ProductCard({ product }: { product: Product }) {
  const [docsOpen, setDocsOpen] = useState(false);
  const Icon = ICONS[product.iconName];
  const c = COLOR_MAP[product.color];

  return (
    <div
      className={`group flex flex-col bg-gradient-to-b from-slate-900 to-[#03071e] border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 ${c.border}`}
    >
      {/* Card header */}
      <div className="p-7 flex-1">
        {/* Top row: icon + live status */}
        <div className="flex items-start justify-between mb-5">
          <div className={`p-3 rounded-2xl shadow-lg ${c.icon}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${c.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
            Live
          </span>
        </div>

        {/* Title + tagline */}
        <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
        <p className="text-xs text-slate-500 font-mono mb-3">{product.domain.replace("https://", "")}</p>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">{product.description}</p>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-6">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-xs text-slate-400">
              <ChevronRight className={`w-3 h-3 flex-shrink-0 ${c.highlight}`} />
              {h}
            </li>
          ))}
        </ul>

        {/* Action links */}
        <div className="flex items-center gap-3">
          <a
            href={product.domain}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Site
          </a>
          <Dot className="w-4 h-4 text-slate-700" />
          <Link
            href={product.adminPath}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${c.link}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin Panel
          </Link>
        </div>
      </div>

      {/* API Docs toggle */}
      <div className="border-t border-white/5">
        <button
          onClick={() => setDocsOpen(!docsOpen)}
          className="w-full flex items-center justify-between px-7 py-4 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.02] transition-colors"
        >
          <span>
            API Reference —{" "}
            <span className="text-slate-600">
              {product.endpoints.length} endpoint{product.endpoints.length !== 1 ? "s" : ""}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${docsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {docsOpen && (
          <div className="px-5 pb-5 animate-fadeIn">
            <ApiExplorer endpoints={product.endpoints} />
          </div>
        )}
      </div>
    </div>
  );
}
