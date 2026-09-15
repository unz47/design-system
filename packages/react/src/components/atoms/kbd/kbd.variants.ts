import { cva } from "class-variance-authority";

export const kbdVariants = cva(
  "inline-flex min-w-[var(--aurora-icon-lg)] items-center justify-center gap-sp-3xs " +
    "rounded-control border border-border-default bg-bg-raised px-sp-2xs py-sp-3xs " +
    "font-mono text-xs text-text-secondary",
);
