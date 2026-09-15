import { cva } from "class-variance-authority";
import { overlayBackdrop, overlayItem, overlaySurface, overlayTransition } from "../../../lib/overlay";

export const commandBackdropVariants = cva(overlayBackdrop);

export const commandPopupVariants = cva(
  "fixed left-1/2 top-[15vh] z-modal w-full max-w-lg -translate-x-1/2 overflow-hidden p-0 " +
    `${overlaySurface} ${overlayTransition}`,
);

// コマンドパレットの入力欄は枠を持たない(面の上端そのものが枠になる)。
export const commandInputVariants = cva(
  "w-full border-b border-border-subtle bg-transparent px-sp-md py-sp-sm text-sm " +
    "text-text-primary placeholder:text-text-muted outline-none",
);

export const commandListVariants = cva("max-h-80 overflow-y-auto p-sp-3xs");
export const commandItemVariants = cva(overlayItem);
export const commandGroupLabelVariants = cva("px-sp-sm py-sp-3xs text-xs font-medium text-text-muted");
export const commandEmptyVariants = cva("px-sp-sm py-sp-lg text-center text-sm text-text-muted");
