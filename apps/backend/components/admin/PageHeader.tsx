import { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Render a custom element instead of the default CTA link */
  ctaSlot?: ReactNode;
  /** Extra content to the right (e.g. filter dropdowns) */
  rightSlot?: ReactNode;
}

/**
 * Shared page header for all admin list pages.
 * Shows a title + optional description on the left, and a CTA or custom slot on the right.
 */
export function PageHeader({
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaSlot,
  rightSlot,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      {/* Left: title + description */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-slate-400">{description}</p>
        )}
      </div>

      {/* Right: CTA or custom slot */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {rightSlot}
        {ctaSlot}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
