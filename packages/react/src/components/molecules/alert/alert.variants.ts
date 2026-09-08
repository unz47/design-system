import { cva, type VariantProps } from "class-variance-authority";

// status系は Badge と同じ subtle-bg + border + solid の組み合わせ。
// dark/light で3つとも参照先が入れ替わるので、ここでの記述は1つで済む。
export const alertVariants = cva(
  "flex gap-sp-sm rounded-surface border p-sp-md text-sm",
  {
    variants: {
      variant: {
        default: "border-border-default bg-bg-surface text-text-secondary",
        success: "border-status-success-border bg-status-success-subtle-bg text-status-success-solid",
        danger: "border-status-danger-border bg-status-danger-subtle-bg text-status-danger-solid",
        warning: "border-status-warning-border bg-status-warning-subtle-bg text-status-warning-solid",
        info: "border-status-info-border bg-status-info-subtle-bg text-status-info-solid",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const alertTitleVariants = cva("font-medium text-text-primary");
export const alertDescriptionVariants = cva("mt-sp-3xs leading-6");

export type AlertVariants = VariantProps<typeof alertVariants>;
