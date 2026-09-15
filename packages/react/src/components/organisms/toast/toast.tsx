"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "../../../lib/cn";
import {
  toastCloseVariants,
  toastDescriptionVariants,
  toastRootVariants,
  toastTitleVariants,
  toastViewportVariants,
} from "./toast.variants";

// 計画では sonner を使う想定だったが、Base UI 1.8 の Toast を採用した。
// 依存を1つ増やさずに済み、開閉の状態属性(data-starting-style 等)も
// 他のオーバーレイと同じ作法で書けるため。sonner 固有のテーマ層を
// トークンに合わせ込む作業も要らない。
export const ToastProvider = BaseToast.Provider;
export const useToast = BaseToast.useToastManager;

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export type ToastViewportProps = BaseToast.Viewport.Props;

// Viewport は「積み上がる場所」。アプリのルートに1つ置く。
export function ToastViewport({ className, ...props }: ToastViewportProps) {
  const { toasts } = BaseToast.useToastManager();

  return (
    <BaseToast.Viewport className={cn(toastViewportVariants(), className)} {...props}>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} className={toastRootVariants()}>
          <BaseToast.Title className={toastTitleVariants()} />
          <BaseToast.Description className={toastDescriptionVariants()} />
          <BaseToast.Close className={toastCloseVariants()} aria-label="閉じる">
            <CloseIcon />
          </BaseToast.Close>
        </BaseToast.Root>
      ))}
    </BaseToast.Viewport>
  );
}
