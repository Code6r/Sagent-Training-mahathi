import { HTMLAttributes } from "react";
import { cn } from "@utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "warning" | "neutral";
}

const Badge = ({ className, variant = "neutral", ...props }: BadgeProps) => {
  const variants: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700",
    info: "bg-sky-50 text-sky-700",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-slate-100 text-slate-700"
  };

  return (
    <div
      className={cn(
        "badge-pill border border-transparent",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;

