import { cva } from "class-variance-authority";

export const radioGroupVariants = cva(
  "flex flex-col gap-sp-sm data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:gap-sp-lg",
);

export const radioVariants = cva(
  "inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border-default " +
    "bg-bg-surface " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-checked:border-accent-default " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);

export const radioIndicatorVariants = cva("size-2.5 rounded-full bg-accent-default");
