import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-2xs rounded-full px-sm py-3xs text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-bg-raised text-text-secondary border border-border-default",
        accent: "bg-accent-default text-on-accent",
        success: "bg-status-success-subtle-bg text-status-success-solid border border-status-success-border",
        danger: "bg-status-danger-subtle-bg text-status-danger-solid border border-status-danger-border",
        warning: "bg-status-warning-subtle-bg text-status-warning-solid border border-status-warning-border",
        info: "bg-status-info-subtle-bg text-status-info-solid border border-status-info-border",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
