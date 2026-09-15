import { cva } from "class-variance-authority";
import { overlayItem, overlaySurface, overlayTransition } from "../../../lib/overlay";

export const menuPopupVariants = cva(
  `z-dropdown min-w-40 p-sp-3xs ${overlaySurface} ${overlayTransition}`,
);

export const menuItemVariants = cva(overlayItem);
export const menuGroupLabelVariants = cva("px-sp-sm py-sp-3xs text-xs font-medium text-text-muted");
export const menuSeparatorVariants = cva("my-sp-3xs h-px bg-border-subtle");
