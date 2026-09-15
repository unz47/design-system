import { cva, type VariantProps } from "class-variance-authority";

// 不正値は prop ではなく aria-invalid で表現する。支援技術に伝わる状態と
// 見た目が必ず一致し、消費者が状態を二重に持たなくて済む。
export const inputVariants = cva(
  "w-full rounded-control border border-border-default bg-bg-surface text-sm text-text-primary " +
    "px-[var(--aurora-control-field-padding-x)] " +
    "placeholder:text-text-muted " +
    "transition-[border-color,box-shadow] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:border-accent-default focus-visible:ring-2 focus-visible:ring-focus-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base " +
    "aria-invalid:border-status-danger-solid aria-invalid:focus-visible:ring-status-danger-solid " +
    "disabled:pointer-events-none disabled:opacity-[var(--aurora-opacity-disabled)]",
  {
    variants: {
      size: {
        sm: "h-[var(--aurora-control-height-sm)]",
        md: "h-[var(--aurora-control-height-md)]",
        lg: "h-[var(--aurora-control-height-lg)]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
