import { cva, type VariantProps } from "class-variance-authority";
import { overlayBackdrop } from "../../../lib/overlay";

export const sheetBackdropVariants = cva(overlayBackdrop);

// 画面端に貼り付く面。角丸は「内側になる辺」だけに付ける。
// スライドインは translate で、Base UI の data-starting-style / data-ending-style
// が付く間だけ画面外に置く。
export const sheetPopupVariants = cva(
  "fixed z-modal flex flex-col border-border-default bg-bg-surface text-text-primary " +
    "shadow-elevation-3 outline-none " +
    "transition-transform duration-[var(--aurora-motion-duration-normal)] ease-standard " +
    "motion-reduce:transition-none",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-full max-w-sm border-l rounded-l-overlay " +
          "data-starting-style:translate-x-full data-ending-style:translate-x-full",
        left:
          "inset-y-0 left-0 h-full w-full max-w-sm border-r rounded-r-overlay " +
          "data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
        bottom:
          "inset-x-0 bottom-0 max-h-[80vh] w-full border-t rounded-t-overlay " +
          "data-starting-style:translate-y-full data-ending-style:translate-y-full",
        top:
          "inset-x-0 top-0 max-h-[80vh] w-full border-b rounded-b-overlay " +
          "data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export const sheetHeaderVariants = cva("flex flex-col gap-sp-2xs border-b border-border-subtle p-sp-lg");
export const sheetBodyVariants = cva("flex-1 overflow-y-auto p-sp-lg");
export const sheetTitleVariants = cva("text-lg font-semibold text-text-primary");
export const sheetDescriptionVariants = cva("text-sm text-text-secondary");

export type SheetVariants = VariantProps<typeof sheetPopupVariants>;
