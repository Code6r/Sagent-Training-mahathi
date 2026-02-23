import { HTMLAttributes } from "react";
import { cn } from "@utils/cn";

const Spinner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent",
      className
    )}
    {...props}
  />
);

export default Spinner;

