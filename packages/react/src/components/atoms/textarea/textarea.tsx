import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { textareaVariants, type TextareaVariants } from "./textarea.variants";

export interface TextareaProps
  extends ComponentPropsWithRef<"textarea">,
    TextareaVariants {}

export function Textarea({ className, resize, ...props }: TextareaProps) {
  return <textarea className={cn(textareaVariants({ resize }), className)} {...props} />;
}
