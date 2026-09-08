import { cva } from "class-variance-authority";
import { overlayTransition } from "../../../lib/overlay";

// Tooltip は面ではなく「小さな札」なので overlaySurface を使わない。
// bg.raised + elevation-2 で、Popover より一段軽い見た目にする。
export const tooltipPopupVariants = cva(
  "z-tooltip max-w-xs rounded-control border border-border-default bg-bg-raised " +
    `px-sp-xs py-sp-3xs text-xs text-text-primary shadow-elevation-2 outline-none ${overlayTransition}`,
);
