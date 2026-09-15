import { cva, type VariantProps } from "class-variance-authority";

// motion-reduce で明示的にアニメーションを止める。Tailwind の animate-pulse は
// prefers-reduced-motion を自動では見ない。
export const skeletonVariants = cva(
  "block animate-pulse bg-bg-raised motion-reduce:animate-none",
  {
    variants: {
      shape: {
        block: "rounded-control",
        text: "h-4 rounded-control",
        circle: "rounded-full",
      },
    },
    defaultVariants: { shape: "block" },
  },
);

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;
