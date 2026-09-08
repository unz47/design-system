import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { skeletonVariants, type SkeletonVariants } from "./skeleton.variants";

export interface SkeletonProps
  extends ComponentPropsWithRef<"div">,
    SkeletonVariants {}

// aria-hidden 固定。読み込み中であることは、この箱ではなく
// 中身を差し替える側(aria-busy を持つコンテナ)が伝えるべきもの。
export function Skeleton({ className, shape, ...props }: SkeletonProps) {
  return <div aria-hidden className={cn(skeletonVariants({ shape }), className)} {...props} />;
}
