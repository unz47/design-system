import { cva } from "class-variance-authority";

export const accordionVariants = cva("w-full border-b border-border-subtle");
export const accordionItemVariants = cva("border-t border-border-subtle");
export const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between gap-sp-sm py-sp-md text-left text-sm font-medium " +
    "text-text-primary outline-none " +
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "[&>svg]:transition-transform [&>svg]:duration-[var(--aurora-motion-duration-fast)] " +
    "data-panel-open:[&>svg]:rotate-180",
);

// パネルの開閉は Base UI が --accordion-panel-height を出すので、
// height をそこへ補間する。max-height での近似は不要。
export const accordionPanelVariants = cva(
  "h-[var(--accordion-panel-height)] overflow-hidden text-sm text-text-secondary " +
    "transition-[height] duration-[var(--aurora-motion-duration-normal)] ease-standard " +
    "data-starting-style:h-0 data-ending-style:h-0 " +
    "motion-reduce:transition-none",
);

export const accordionPanelInnerVariants = cva("pb-sp-md");
