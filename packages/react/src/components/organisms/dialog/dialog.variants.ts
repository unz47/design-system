import { cva } from "class-variance-authority";
import { overlayBackdrop, overlaySurface, overlayTransition } from "../../../lib/overlay";

export const dialogBackdropVariants = cva(overlayBackdrop);

export const dialogPopupVariants = cva(
  `fixed left-1/2 top-1/2 z-modal w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-sp-lg ${overlaySurface} ${overlayTransition}`,
);

export const dialogTitleVariants = cva("text-lg font-semibold text-text-primary");
export const dialogDescriptionVariants = cva("mt-sp-2xs text-sm text-text-secondary");
