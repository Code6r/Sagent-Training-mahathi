import { HTMLAttributes } from "react";
import { cn } from "@utils/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn("animate-pulse rounded-2xl bg-slate-100/80", className)}
    {...props}
  />
);

export default Skeleton;

