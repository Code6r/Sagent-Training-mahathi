import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition-all placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;

