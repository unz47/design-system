import { cva } from "class-variance-authority";

export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center rounded-surface border border-dashed border-border-default " +
    "px-sp-lg py-sp-2xl text-center",
);

export const emptyStateMediaVariants = cva("mb-sp-md text-text-muted");
export const emptyStateTitleVariants = cva("font-medium text-text-primary");
export const emptyStateDescriptionVariants = cva("mt-sp-2xs max-w-prose text-sm text-text-secondary");
export const emptyStateActionsVariants = cva("mt-sp-lg flex items-center gap-sp-sm");
