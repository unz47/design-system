"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";
import { buttonVariants, type ButtonVariants } from "./button.variants";

export interface ButtonProps
  extends ComponentPropsWithRef<"button">,
    ButtonVariants {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
