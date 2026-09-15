import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { inputVariants, type InputVariants } from "./input.variants";

// `size` は <input> のネイティブ属性(文字数)と名前が衝突するので、そちらを外して
// cva 側の size を採用する。ネイティブの size を使いたい場面は実質無い。
export interface InputProps
  extends Omit<ComponentPropsWithRef<"input">, "size">,
    InputVariants {}

export function Input({ className, size, ...props }: InputProps) {
  return <input className={cn(inputVariants({ size }), className)} {...props} />;
}
