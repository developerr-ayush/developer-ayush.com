import * as React from "react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  hint,
  href,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  href?: string;
  tone?: "warn";
}) {
  const body = (
    <>
      <p className="eyebrow">{label}</p>
      <p className={`mono mt-2 text-[28px] font-medium leading-none tracking-tight ${tone === "warn" ? "text-warn" : ""}`}>{value}</p>
      {hint ? <p className="mono mt-2.5 text-xs text-muted">{hint}</p> : null}
    </>
  );
  const cls = "card block p-4";
  return href ? (
    <Link href={href} className={`${cls} transition-colors hover:border-[color-mix(in_srgb,var(--ink)_25%,var(--line))]`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
