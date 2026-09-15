import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  "inline-flex size-5 shrink-0 items-center justify-center rounded-control border border-border-default " +
    "bg-bg-surface text-on-accent " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-checked:border-accent-default data-checked:bg-accent-default " +
    "data-indeterminate:border-accent-default data-indeterminate:bg-accent-default " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);

export const checkboxIndicatorVariants = cva("flex items-center justify-center");
