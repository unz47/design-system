import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import {
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateMediaVariants,
  emptyStateTitleVariants,
  emptyStateVariants,
} from "./empty-state.variants";

export type EmptyStateProps = ComponentPropsWithRef<"div">;

export function EmptyState({ className, ...props }: EmptyStateProps) {
  return <div className={cn(emptyStateVariants(), className)} {...props} />;
}

export type EmptyStateMediaProps = ComponentPropsWithRef<"div">;

// アイコンやイラストの置き場。装飾なので支援技術からは隠す。
export function EmptyStateMedia({ className, ...props }: EmptyStateMediaProps) {
  return <div aria-hidden className={cn(emptyStateMediaVariants(), className)} {...props} />;
}

export type EmptyStateTitleProps = ComponentPropsWithRef<"p">;

export function EmptyStateTitle({ className, ...props }: EmptyStateTitleProps) {
  return <p className={cn(emptyStateTitleVariants(), className)} {...props} />;
}

export type EmptyStateDescriptionProps = ComponentPropsWithRef<"p">;

export function EmptyStateDescription({ className, ...props }: EmptyStateDescriptionProps) {
  return <p className={cn(emptyStateDescriptionVariants(), className)} {...props} />;
}

export type EmptyStateActionsProps = ComponentPropsWithRef<"div">;

export function EmptyStateActions({ className, ...props }: EmptyStateActionsProps) {
  return <div className={cn(emptyStateActionsVariants(), className)} {...props} />;
}
