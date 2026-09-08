import { cva } from "class-variance-authority";

export const sliderVariants = cva("w-full");
export const sliderControlVariants = cva("flex w-full touch-none items-center py-sp-xs select-none");
export const sliderTrackVariants = cva("h-2 w-full rounded-full bg-bg-raised");
export const sliderIndicatorVariants = cva("rounded-full bg-accent-default");
export const sliderThumbVariants = cva(
  "size-5 rounded-full border-2 border-accent-default bg-bg-base " +
    "transition-[box-shadow] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-dragging:shadow-accent-glow " +
    "data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);
