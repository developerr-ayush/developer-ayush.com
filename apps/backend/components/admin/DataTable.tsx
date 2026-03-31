import { ReactNode } from "react";

interface Column {
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  children: ReactNode;
  /** Shown when there are no rows */
  emptyState?: ReactNode;
  /** Whether to show empty state (pass `rows.length === 0`) */
  isEmpty?: boolean;
}

/**
 * Styled table container used across all admin list pages.
 * Wraps a <tbody> of <tr> children in a consistent dark-themed table.
 */
export function DataTable({ columns, children, emptyState, isEmpty }: DataTableProps) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  {emptyState ?? (
                    <p className="text-slate-500 text-sm">No items found.</p>
                  )}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Standard table cell */
export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 text-slate-300 ${className ?? ""}`}>
      {children}
    </td>
  );
}

/** Table row with hover state */
export function Tr({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`hover:bg-white/[0.02] transition-colors ${className ?? ""}`}
    >
      {children}
    </tr>
  );
}
