import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import {
  alertDescriptionVariants,
  alertTitleVariants,
  alertVariants,
  type AlertVariants,
} from "./alert.variants";

export interface AlertProps extends ComponentPropsWithRef<"div">, AlertVariants {}

// role は消費者が決める。ページ読み込み時から出ている注記は role なし、
// 操作の結果として現れるものだけ role="alert" にすべきで、
// 常に role="alert" を付けると読み込みのたびに読み上げが割り込む。
export function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}

export type AlertTitleProps = ComponentPropsWithRef<"p">;

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return <p className={cn(alertTitleVariants(), className)} {...props} />;
}

export type AlertDescriptionProps = ComponentPropsWithRef<"div">;

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <div className={cn(alertDescriptionVariants(), className)} {...props} />;
}
