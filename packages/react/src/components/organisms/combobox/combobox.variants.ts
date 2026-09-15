import { cva } from "class-variance-authority";
import { overlayItem, overlaySurface, overlayTransition } from "../../../lib/overlay";

// 入力欄は Input と同じ見た目にする(control.height を共有しているので自動で揃う)。
export const comboboxInputVariants = cva(
  "w-full rounded-control border border-border-default bg-bg-surface text-sm text-text-primary " +
    "h-[var(--aurora-control-height-md)] px-[var(--aurora-control-field-padding-x)] " +
    "placeholder:text-text-muted " +
    "transition-[border-color,box-shadow] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:border-accent-default focus-visible:ring-2 focus-visible:ring-focus-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
);

export const comboboxPopupVariants = cva(
  `z-dropdown max-h-64 min-w-[var(--anchor-width)] overflow-y-auto p-sp-3xs ${overlaySurface} ${overlayTransition}`,
);

export const comboboxItemVariants = cva(`${overlayItem} justify-between data-selected:text-text-primary`);
export const comboboxEmptyVariants = cva("px-sp-sm py-sp-md text-center text-sm text-text-muted");
