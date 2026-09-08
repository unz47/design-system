import { cva } from "class-variance-authority";

export const tabsVariants = cva("w-full");
export const tabsListVariants = cva("relative flex items-center gap-sp-md border-b border-border-subtle");
export const tabsTabVariants = cva(
  "relative -mb-px border-b-2 border-transparent py-sp-xs text-sm font-medium text-text-secondary " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none hover:text-text-primary " +
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-selected:text-text-primary " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);
export const tabsPanelVariants = cva("pt-sp-md outline-none");
