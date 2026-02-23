import { SelectHTMLAttributes } from "react";
import { cn } from "@utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = ({ className, ...props }: SelectProps) => (
  <select
    className={cn(
      "h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
      className
    )}
    {...props}
  />
);

export default Select;

