/* eslint-disable react/prop-types -- props are typed with TypeScript */
import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn("field min-h-[84px] resize-y", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";
