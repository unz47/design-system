import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "../../../lib/cn";
import {
  dialogBackdropVariants,
  dialogDescriptionVariants,
  dialogPopupVariants,
  dialogTitleVariants,
} from "./dialog.variants";

// Root / Trigger / Close は素通し(状態管理と挙動は Base UI が持つ)。
// Portal + Backdrop + Popup の3階層だけを1つに畳んで DialogContent とする。
export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export type DialogContentProps = BaseDialog.Popup.Props;

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={dialogBackdropVariants()} />
      <BaseDialog.Popup className={cn(dialogPopupVariants(), className)} {...props}>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export type DialogTitleProps = BaseDialog.Title.Props;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <BaseDialog.Title className={cn(dialogTitleVariants(), className)} {...props} />;
}

export type DialogDescriptionProps = BaseDialog.Description.Props;

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <BaseDialog.Description className={cn(dialogDescriptionVariants(), className)} {...props} />
  );
}
