import { cva } from "class-variance-authority";

export const progressVariants = cva("w-full");
export const progressTrackVariants = cva(
  "block h-2 w-full overflow-hidden rounded-full bg-bg-raised",
);
export const progressIndicatorVariants = cva(
  "block h-full rounded-full bg-accent-default " +
    "transition-[width] duration-[var(--aurora-motion-duration-normal)] ease-standard",
);
