import { cva, type VariantProps } from "class-variance-authority";

// 押下状態は data-pressed。Button の ghost に近い見た目だが、
// 「今どちらの状態か」を示す必要があるので押下時に面を持たせる。
export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-sp-xs rounded-control text-sm font-medium " +
    "text-text-secondary " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none hover:bg-bg-raised hover:text-text-primary " +
    "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg-base " +
    "data-pressed:bg-bg-raised data-pressed:text-text-primary " +
    "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]",
  {
    variants: {
      size: {
        sm: "h-[var(--aurora-control-height-sm)] px-sp-sm",
        md: "h-[var(--aurora-control-height-md)] px-sp-md",
        lg: "h-[var(--aurora-control-height-lg)] px-sp-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;
