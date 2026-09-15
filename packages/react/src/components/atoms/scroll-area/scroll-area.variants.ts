import { cva } from "class-variance-authority";

export const scrollAreaVariants = cva("relative overflow-hidden");
export const scrollAreaViewportVariants = cva(
  "size-full overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
);
export const scrollAreaScrollbarVariants = cva(
  "m-sp-3xs flex touch-none justify-center rounded-full bg-bg-raised opacity-0 " +
    "transition-opacity duration-[var(--aurora-motion-duration-normal)] ease-standard " +
    "data-hovering:opacity-100 data-scrolling:opacity-100 " +
    "data-[orientation=vertical]:w-1 data-[orientation=horizontal]:h-1",
);
export const scrollAreaThumbVariants = cva("w-full rounded-full bg-border-strong");
