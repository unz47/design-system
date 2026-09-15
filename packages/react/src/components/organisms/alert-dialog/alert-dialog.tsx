import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "../../../lib/cn";
import {
  alertDialogActionsVariants,
  alertDialogBackdropVariants,
  alertDialogDescriptionVariants,
  alertDialogPopupVariants,
  alertDialogTitleVariants,
} from "./alert-dialog.variants";

// Dialog との違いは見た目ではなく挙動。Base UI 側で背景クリック・Escape での
// 自動クローズが無効になっているので、こちらで何かを足す必要はない。
export const AlertDialog = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;
export const AlertDialogClose = BaseAlertDialog.Close;

export type AlertDialogContentProps = BaseAlertDialog.Popup.Props;

export function AlertDialogContent({ className, children, ...props }: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={alertDialogBackdropVariants()} />
      <BaseAlertDialog.Popup className={cn(alertDialogPopupVariants(), className)} {...props}>
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  );
}

export type AlertDialogTitleProps = BaseAlertDialog.Title.Props;

export function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return <BaseAlertDialog.Title className={cn(alertDialogTitleVariants(), className)} {...props} />;
}

export type AlertDialogDescriptionProps = BaseAlertDialog.Description.Props;

export function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <BaseAlertDialog.Description
      className={cn(alertDialogDescriptionVariants(), className)}
      {...props}
    />
  );
}

export type AlertDialogActionsProps = React.ComponentPropsWithRef<"div">;

// 「キャンセル / 実行」を右寄せで並べる行。破壊的操作の確認が主用途なので、
// この並びを毎回書かせない。
export function AlertDialogActions({ className, ...props }: AlertDialogActionsProps) {
  return <div className={cn(alertDialogActionsVariants(), className)} {...props} />;
}
