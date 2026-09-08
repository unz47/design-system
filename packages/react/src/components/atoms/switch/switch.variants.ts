import { cva } from "class-variance-authority";

// Base UI は状態を data-checked / data-unchecked / data-disabled 属性で表すので、
// Tailwind の data-* variant でそのまま分岐できる。JSで状態クラスを組み立てない。
export const switchVariants = cva(
  "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border-default p-sp-3xs " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-unchecked:bg-bg-raised data-checked:border-accent-default data-checked:bg-accent-default " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
);

// つまみは text.primary ではなく border.strong。text.primary はテーマで白黒が
// 反転するため、lightだと「白いトラックに黒いつまみ」になってしまう。
// border.strong は両テーマで中間の明度に留まる。
export const switchThumbVariants = cva(
  "block size-4 rounded-full bg-border-strong " +
    "transition-transform duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "data-checked:translate-x-5 data-checked:bg-on-accent",
);
