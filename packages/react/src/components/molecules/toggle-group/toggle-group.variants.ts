import { cva } from "class-variance-authority";

// 隣り合うボタンの枠線を重ねて1本にするため、外側で枠を持ち内側は角丸を落とす。
export const toggleGroupVariants = cva(
  "inline-flex items-center rounded-control border border-border-default p-sp-3xs gap-sp-3xs " +
    "data-[orientation=vertical]:flex-col",
);
