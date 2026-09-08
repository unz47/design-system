import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { labelVariants } from "./label.variants";

export type LabelProps = ComponentPropsWithRef<"label">;

// Base UI の Field.Label は Field.Root の文脈を必要とするので、単独で使える
// 素の <label> をここに置く。Field と組む場合は Base UI 側を直接使う。
export function Label({ className, ...props }: LabelProps) {
  return <label className={cn(labelVariants(), className)} {...props} />;
}
