import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Maps onto the shared `.btn` patterns defined in globals.css. */
export const buttonVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-primary",
      secondary: "",
      ghost: "btn-ghost",
      danger: "btn-danger",
      "danger-solid": "btn-danger-solid",
    },
    size: {
      default: "",
      sm: "btn-sm",
      icon: "btn-icon",
      "icon-sm": "btn-icon btn-sm",
    },
  },
  defaultVariants: { variant: "secondary", size: "default" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
);
Button.displayName = "Button";
