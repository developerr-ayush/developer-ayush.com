import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Label + control + hint/error wrapper. The control must use the same `id`
 * and spread `fieldA11y(id, error, hint)` so the error is announced.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  aside,
  className,
  children,
}: {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          ) : null}
        </label>
        {aside ? <span className="text-xs text-muted">{aside}</span> : null}
      </div>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <p id={`${id}-error`} aria-live="polite" className={cn("text-xs text-danger", !error && "hidden")}>
        {error}
      </p>
    </div>
  );
}

export function fieldA11y(id: string, error?: string, hint?: React.ReactNode) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}
