"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  blog: "Blog",
  categories: "Categories",
  upload: "Upload",
  products: "Products",
  slang: "Slang",
  users: "Users",
  new: "New",
  pending: "Pending",
  logout: "Sign out",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((seg, i) => ({
    href: "/" + parts.slice(0, i + 1).join("/"),
    label: LABELS[seg] ?? "Edit",
  }));

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li
              key={c.href}
              className={`flex min-w-0 items-center gap-1.5 ${last ? "" : "hidden sm:flex"} ${i < crumbs.length - 2 ? "hidden md:flex" : ""}`}
            >
              {i > 0 ? <ChevronRight className="size-3.5 shrink-0 text-muted" aria-hidden="true" /> : null}
              {last ? (
                <span aria-current="page" className="truncate font-medium">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="truncate text-muted hover:text-ink">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
