import { cva } from "class-variance-authority";

export const labelVariants = cva(
  "text-sm font-medium text-text-primary select-none " +
    "peer-disabled:opacity-[var(--aurora-opacity-disabled)]",
);
