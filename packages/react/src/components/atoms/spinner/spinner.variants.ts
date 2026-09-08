import { cva, type VariantProps } from "class-variance-authority";

// 色は currentColor。置かれた場所の文字色をそのまま使うので、Button の中でも
// Alert の中でも追加の指定なしに馴染む。
export const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent " +
    "motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "size-[var(--aurora-icon-sm)]",
        md: "size-[var(--aurora-icon-md)]",
        lg: "size-[var(--aurora-icon-lg)]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
