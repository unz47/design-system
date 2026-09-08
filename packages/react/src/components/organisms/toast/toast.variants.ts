import { cva } from "class-variance-authority";

export const toastViewportVariants = cva(
  "fixed bottom-sp-lg right-sp-lg z-toast flex w-80 flex-col gap-sp-sm outline-none",
);

// 素直に縦に並べる。Base UI は重なり演出用のCSS変数も出すが、
// それに乗ると値の名前に依存するので、まずは崩れない形にしておく。
export const toastRootVariants = cva(
  "relative w-full rounded-surface border border-border-default bg-bg-raised p-sp-md pr-sp-xl " +
    "shadow-elevation-2 outline-none " +
    "transition-[transform,opacity] duration-[var(--aurora-motion-duration-normal)] ease-standard " +
    "data-starting-style:translate-x-full data-starting-style:opacity-0 " +
    "data-ending-style:translate-x-full data-ending-style:opacity-0 " +
    "motion-reduce:transition-none",
);

export const toastTitleVariants = cva("text-sm font-medium text-text-primary");
export const toastDescriptionVariants = cva("mt-sp-3xs text-sm text-text-secondary");
export const toastCloseVariants = cva(
  "absolute right-sp-xs top-sp-xs rounded-control p-sp-3xs text-text-muted outline-none " +
    "hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring",
);
