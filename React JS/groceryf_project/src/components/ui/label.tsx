import { LabelHTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = ({ className, ...props }: LabelProps) => {
  return (
    <label
      className={cn(
        "block text-xs font-medium uppercase tracking-wide text-slate-500",
        className
      )}
      {...props}
    />
  );
};

export default Label;

