import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-2xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

    const variants: Record<string, string> = {
      primary:
        "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft hover:shadow-lg hover:-translate-y-0.5",
      outline:
        "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50",
      ghost:
        "bg-transparent text-slate-700 hover:bg-primary-50 hover:text-primary-700"
    };

    const sizes: Record<string, string> = {
      sm: "h-9 px-3 text-xs",
      md: "h-11 px-4 text-sm",
      lg: "h-12 px-5 text-base",
      icon: "h-10 w-10"
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

