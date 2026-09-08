import { cva } from "class-variance-authority";
import { overlayBackdrop, overlaySurface, overlayTransition } from "../../../lib/overlay";

export const alertDialogBackdropVariants = cva(overlayBackdrop);

export const alertDialogPopupVariants = cva(
  `fixed left-1/2 top-1/2 z-modal w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-sp-lg ${overlaySurface} ${overlayTransition}`,
);

export const alertDialogTitleVariants = cva("text-lg font-semibold text-text-primary");
export const alertDialogDescriptionVariants = cva("mt-sp-2xs text-sm text-text-secondary");
export const alertDialogActionsVariants = cva("mt-sp-lg flex justify-end gap-sp-sm");
