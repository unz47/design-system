import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import {
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeadVariants,
  tableHeaderVariants,
  tableRowVariants,
  tableVariants,
  tableWrapperVariants,
} from "./table.variants";

// ここにあるのは見た目のプリミティブだけ。ソート・フィルタ・ページングを
// 持つ DataTable は docs の patterns/ にコピペ可能なレシピとして置く方針
// (PROJECT_PLAN §3)。テーブルの「使い方」はアプリごとに違いすぎる。

export type TableProps = ComponentPropsWithRef<"table">;

export function Table({ className, ...props }: TableProps) {
  return (
    <div className={tableWrapperVariants()}>
      <table className={cn(tableVariants(), className)} {...props} />
    </div>
  );
}

export type TableHeaderProps = ComponentPropsWithRef<"thead">;

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn(tableHeaderVariants(), className)} {...props} />;
}

export type TableBodyProps = ComponentPropsWithRef<"tbody">;

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn(tableBodyVariants(), className)} {...props} />;
}

export type TableFooterProps = ComponentPropsWithRef<"tfoot">;

export function TableFooter({ className, ...props }: TableFooterProps) {
  return <tfoot className={cn(tableFooterVariants(), className)} {...props} />;
}

export type TableRowProps = ComponentPropsWithRef<"tr">;

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn(tableRowVariants(), className)} {...props} />;
}

export type TableHeadProps = ComponentPropsWithRef<"th">;

// scope="col" を既定にする。付け忘れると、スクリーンリーダーがセルと
// 見出しの対応を読み上げられない。
export function TableHead({ className, scope = "col", ...props }: TableHeadProps) {
  return <th scope={scope} className={cn(tableHeadVariants(), className)} {...props} />;
}

export type TableCellProps = ComponentPropsWithRef<"td">;

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn(tableCellVariants(), className)} {...props} />;
}

export type TableCaptionProps = ComponentPropsWithRef<"caption">;

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption className={cn(tableCaptionVariants(), className)} {...props} />;
}
