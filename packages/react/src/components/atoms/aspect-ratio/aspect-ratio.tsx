import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { aspectRatioVariants } from "./aspect-ratio.variants";

export interface AspectRatioProps extends ComponentPropsWithRef<"div"> {
  /** 幅 / 高さ。16 / 9 のように書く */
  ratio?: number;
}

// Base UI に等価物は無い。CSS の aspect-ratio で足りるため、パディングハックを
// 使っていた時代のライブラリ実装を持ち込む理由が無い。
export function AspectRatio({ className, ratio = 1, style, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn(aspectRatioVariants(), className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  );
}
