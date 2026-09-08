import { cva } from "class-variance-authority";

// 横スクロールは親のラッパーが持つ。table 自体に overflow を効かせても
// ヘッダ行が固定できず、ページ全体が横に伸びる。
export const tableWrapperVariants = cva(
  "w-full overflow-x-auto rounded-surface border border-border-default",
);
export const tableVariants = cva("w-full border-collapse text-sm");
export const tableHeaderVariants = cva("border-b border-border-default bg-bg-surface");
export const tableBodyVariants = cva("");
export const tableFooterVariants = cva("border-t border-border-default bg-bg-surface font-medium");
export const tableRowVariants = cva(
  "border-b border-border-subtle last:border-b-0 " +
    "transition-colors duration-[var(--aurora-motion-duration-fast)] ease-standard " +
    "hover:bg-bg-raised data-selected:bg-bg-raised",
);
export const tableHeadVariants = cva(
  "whitespace-nowrap px-sp-md py-sp-xs text-left font-medium text-text-secondary",
);
export const tableCellVariants = cva("px-sp-md py-sp-xs align-top text-text-secondary");
export const tableCaptionVariants = cva("mt-sp-sm text-xs text-text-muted");
