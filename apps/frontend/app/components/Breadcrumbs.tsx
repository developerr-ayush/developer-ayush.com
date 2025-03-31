"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

type BreadcrumbsProps = {
  title?: string;
  className?: string;
};

type BreadcrumbItem = {
  name: string;
  href: string;
};

export default function Breadcrumbs({
  title,
  className = "",
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumb items
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Remove any query parameters
    const asPathWithoutQuery = pathname.split("?")[0];

    // Split path into segments
    const segments = asPathWithoutQuery?.split("/").filter((v) => v.length > 0);
    if (!segments) return [{ name: "Home", href: "/" }];
    // Exit if no segments
    if (!segments.length) return [{ name: "Home", href: "/" }];

    // Build breadcrumb items
    const crumblist = segments.map((segment, index) => {
      const segmentName = segment
        .replace(/-/g, " ")
        .replace(/^(.)|\s+(.)/g, (match) => match.toUpperCase());

      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return { name: segmentName, href: path } as BreadcrumbItem;
    });

    // Add Home at the beginning
    return [{ name: "Home", href: "/" }, ...crumblist];
  };

  const breadcrumbs = generateBreadcrumbs();

  // Update last breadcrumb if title is provided
  if (title && breadcrumbs.length > 0) {
    const lastItem = breadcrumbs[breadcrumbs.length - 1];
    if (lastItem) {
      breadcrumbs[breadcrumbs.length - 1] = {
        name: title,
        href: lastItem.href,
      };
    }
  }

  // Don't render if we only have 1 breadcrumb
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`text-sm mb-4 ${className}`}>
      <ol className="flex items-center flex-wrap">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <Fragment key={idx}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="font-medium text-foreground/80"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-foreground/60 hover:text-sky-500 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className="mx-2 text-foreground/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
