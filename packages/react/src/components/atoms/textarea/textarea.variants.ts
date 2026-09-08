import { cva, type VariantProps } from "class-variance-authority";

// 高さは rows 属性に任せ、size variant は持たせない(Input と違い
// control.height の3段階が意味を持たないため)。
export const textareaVariants = cva(
  "w-full rounded-control border border-border-default bg-bg-surface text-sm text-text-primary " +
    "px-[var(--aurora-control-field-padding-x)] py-sp-xs " +
    "placeholder:text-text-muted " +
    "transition-[border-color,box-shadow] duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "outline-none focus-visible:border-accent-default focus-visible:ring-2 focus-visible:ring-focus-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base " +
    "aria-invalid:border-status-danger-solid aria-invalid:focus-visible:ring-status-danger-solid " +
    "disabled:pointer-events-none disabled:opacity-[var(--aurora-opacity-disabled)]",
  {
    variants: {
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        both: "resize",
      },
    },
    defaultVariants: { resize: "vertical" },
  },
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
