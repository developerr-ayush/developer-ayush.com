/* eslint-disable react/prop-types -- props are typed with TypeScript */
import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn("field", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";
