"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, ExternalLink, Layers, Mail, MessageSquareQuote, Package } from "lucide-react";
import type { Product } from "./products.config";
import { ApiExplorer } from "./ApiExplorer";
import { cn } from "@/lib/utils";

const ICONS = {
  BookOpen,
  MessageSquare: MessageSquareQuote,
  ShoppingBag: Package,
  Mail,
  Layers,
} as const;

export function ProductCard({ product }: { product: Product }) {
  const [docsOpen, setDocsOpen] = useState(false);
  const uid = useId();
  const Icon = ICONS[product.iconName];

  return (
    <article className="card flex flex-col" aria-labelledby={`${uid}-title`}>
      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-start justify-between">
          <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface-2">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="chip chip-ok chip-dot">live</span>
        </div>

        <div>
          <h3 id={`${uid}-title`} className="text-[15px] font-semibold tracking-tight">
            {product.name}
          </h3>
          <p className="mono mt-0.5 text-[11.5px] text-muted">{product.domain.replace("https://", "")}</p>
        </div>

        <p className="text-[13.5px] text-muted">{product.description}</p>

        <ul className="flex flex-wrap gap-1.5">
          {product.highlights.map((h) => (
            <li key={h} className="chip">
              {h}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pt-1">
          <a href={product.domain} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            <ExternalLink className="size-3.5" aria-hidden="true" /> Open site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href={product.adminPath} className="btn btn-sm btn-ghost">
            Admin
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <button
          type="button"
          onClick={() => setDocsOpen(!docsOpen)}
          aria-expanded={docsOpen}
          aria-controls={`${uid}-docs`}
          className="flex w-full items-center justify-between px-5 py-3.5 text-[13px] font-medium hover:bg-surface-2"
        >
          <span>
            API reference <span className="mono ml-1.5 text-xs font-normal text-muted">{product.endpoints.length} endpoints</span>
          </span>
          <ChevronDown className={cn("size-4 text-muted transition-transform", docsOpen && "rotate-180")} aria-hidden="true" />
        </button>
        {docsOpen ? (
          <div id={`${uid}-docs`} className="px-3 pb-3">
            <ApiExplorer endpoints={product.endpoints} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
