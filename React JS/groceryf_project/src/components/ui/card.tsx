import { HTMLAttributes } from "react";
import { cn } from "@utils/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "glass-panel relative overflow-hidden transition-transform duration-200 hover:-translate-y-1",
      className
    )}
    {...props}
  />
);

export const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4 sm:p-5", className)} {...props} />
);

