import { cva, type VariantProps } from "class-variance-authority";

export const avatarVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full " +
    "bg-bg-raised align-middle text-text-secondary",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const avatarImageVariants = cva("size-full object-cover");
export const avatarFallbackVariants = cva("font-medium");

export type AvatarVariants = VariantProps<typeof avatarVariants>;
