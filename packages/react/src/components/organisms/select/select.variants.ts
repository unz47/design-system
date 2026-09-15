import { cva } from "class-variance-authority";
import { overlayItem, overlaySurface, overlayTransition } from "../../../lib/overlay";

// トリガは Input と同じ高さ・枠線にする(control.height で自動的に揃う)。
export const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-sp-sm rounded-control border border-border-default " +
    "bg-bg-surface px-[var(--aurora-control-field-padding-x)] text-sm text-text-primary " +
    "h-[var(--aurora-control-height-md)] " +
    "transition-[border-color,box-shadow] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:border-accent-default focus-visible:ring-2 focus-visible:ring-focus-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);

export const selectPopupVariants = cva(
  `z-dropdown min-w-[var(--anchor-width)] p-sp-3xs ${overlaySurface} ${overlayTransition}`,
);

export const selectItemVariants = cva(`${overlayItem} justify-between data-selected:text-text-primary`);
export const selectIconVariants = cva("text-text-muted");
