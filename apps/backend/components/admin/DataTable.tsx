/* eslint-disable react/prop-types -- props are typed with TypeScript */
import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Card-like container that also scrolls horizontally if a table ever overflows. */
export function TableCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("card table-scroll", className)}>{children}</div>;
}

export function DataTable({
  caption,
  children,
  className,
}: {
  caption: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={cn("rt", className)}>
      <caption className="sr-only">{caption}</caption>
      {children}
    </table>
  );
}

export function Th({
  children,
  className,
  sort,
  srOnly,
}: {
  children: React.ReactNode;
  className?: string;
  /** When provided the header becomes a sort link */
  sort?: { href: string; direction: "asc" | "desc" | null };
  srOnly?: boolean;
}) {
  const ariaSort = sort ? (sort.direction === "asc" ? "ascending" : sort.direction === "desc" ? "descending" : "none") : undefined;
  return (
    <th scope="col" aria-sort={ariaSort} className={className}>
      {sort ? (
        <Link
          href={sort.href}
          className={cn("inline-flex items-center gap-1 rounded hover:text-ink", sort.direction && "text-ink")}
          prefetch={false}
        >
          {children}
          {sort.direction === "asc" ? (
            <ArrowUp className="size-3" aria-hidden="true" />
          ) : sort.direction === "desc" ? (
            <ArrowDown className="size-3" aria-hidden="true" />
          ) : (
            <ChevronsUpDown className="size-3 opacity-50" aria-hidden="true" />
          )}
        </Link>
      ) : srOnly ? (
        <span className="sr-only">{children}</span>
      ) : (
        children
      )}
    </th>
  );
}

export function Td({
  children,
  label,
  className,
  primary,
  actions,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  /** Column name, shown as the field label when the row stacks on mobile */
  label?: string;
  primary?: boolean;
  actions?: boolean;
}) {
  return (
    <td
      data-label={label ?? ""}
      className={cn(primary && "rt-primary", actions && "rt-actions", className)}
      {...rest}
    >
      {children}
    </td>
  );
}

export const Tr = (props: React.ComponentProps<"tr"> & { active?: boolean; selected?: boolean }) => {
  const { active, selected, ...rest } = props;
  return <tr data-active={active || undefined} data-selected={selected || undefined} {...rest} />;
};
