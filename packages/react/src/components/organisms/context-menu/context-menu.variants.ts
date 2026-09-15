import { cva } from "class-variance-authority";
import { overlayItem, overlaySurface, overlayTransition } from "../../../lib/overlay";

export const contextMenuPopupVariants = cva(
  `z-dropdown min-w-40 p-sp-3xs ${overlaySurface} ${overlayTransition}`,
);

export const contextMenuItemVariants = cva(overlayItem);
export const contextMenuSeparatorVariants = cva("my-sp-3xs h-px bg-border-subtle");
