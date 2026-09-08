import { cva } from "class-variance-authority";
import { overlaySurface, overlayTransition } from "../../../lib/overlay";

export const popoverPopupVariants = cva(
  `z-popover w-72 p-sp-md ${overlaySurface} ${overlayTransition}`,
);

export const popoverArrowVariants = cva("fill-bg-surface stroke-border-default");
