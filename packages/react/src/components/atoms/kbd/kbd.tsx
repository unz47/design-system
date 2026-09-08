import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { kbdVariants } from "./kbd.variants";

export type KbdProps = ComponentPropsWithRef<"kbd">;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn(kbdVariants(), className)} {...props} />;
}
