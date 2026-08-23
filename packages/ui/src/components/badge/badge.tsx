import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";
import { badgeVariants, type BadgeVariants } from "./badge.variants";

export interface BadgeProps
  extends ComponentPropsWithRef<"span">,
    BadgeVariants {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
