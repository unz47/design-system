import { cva, type VariantProps } from "class-variance-authority";

// base: フォーカスリング・トランジションはここに集約
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-xs whitespace-nowrap text-sm font-medium " +
    "transition-[background-color,border-color,color,filter] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-[var(--aurora-opacity-disabled)]",
  {
    variants: {
      variant: {
        primary: "bg-accent-default text-on-accent hover:brightness-110",
        secondary:
          "bg-bg-raised text-text-primary border border-border-default hover:border-border-strong",
        ghost: "text-text-secondary hover:bg-bg-raised hover:text-text-primary",
        danger: "bg-status-danger-solid text-on-accent hover:brightness-110",
      },
      size: {
        sm: "h-[var(--aurora-control-height-sm)] px-sm rounded-control",
        md: "h-[var(--aurora-control-height-md)] px-md rounded-control",
        lg: "h-[var(--aurora-control-height-lg)] px-lg rounded-control",
        icon: "size-[var(--aurora-control-height-md)] rounded-control",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
