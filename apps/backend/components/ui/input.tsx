/* eslint-disable react/prop-types -- props are typed with TypeScript */
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input ref={ref} type={type} className={cn("field", className)} {...props} />
  )
);
Input.displayName = "Input";
