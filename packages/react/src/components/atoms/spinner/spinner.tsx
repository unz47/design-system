import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { spinnerVariants, type SpinnerVariants } from "./spinner.variants";

export interface SpinnerProps
  extends ComponentPropsWithRef<"span">,
    SpinnerVariants {
  /** スクリーンリーダーに読ませる文言。視覚的には出ない */
  label?: string;
}

export function Spinner({ className, size, label = "読み込み中", ...props }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center" {...props}>
      <span className={cn(spinnerVariants({ size }), className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
