import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-surface border border-border-default bg-bg-surface text-text-primary shadow-[var(--aurora-shadow-elevation-1)]",
);

export const cardHeaderVariants = cva("flex flex-col gap-2xs p-lg");
export const cardTitleVariants = cva("text-lg font-semibold leading-none tracking-tight");
export const cardDescriptionVariants = cva("text-sm text-text-secondary");
export const cardContentVariants = cva("p-lg pt-0");
export const cardFooterVariants = cva("flex items-center p-lg pt-0");
