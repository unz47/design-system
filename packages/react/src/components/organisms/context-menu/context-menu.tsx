import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cn } from "../../../lib/cn";
import {
  contextMenuItemVariants,
  contextMenuPopupVariants,
  contextMenuSeparatorVariants,
} from "./context-menu.variants";

// Menu との違いは開き方だけ(右クリック / 長押し)。見た目は同じ面を使う。
export const ContextMenu = BaseContextMenu.Root;
export const ContextMenuTrigger = BaseContextMenu.Trigger;
export const ContextMenuGroup = BaseContextMenu.Group;

export type ContextMenuContentProps = BaseContextMenu.Popup.Props;

export function ContextMenuContent({ className, children, ...props }: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-dropdown">
        <BaseContextMenu.Popup className={cn(contextMenuPopupVariants(), className)} {...props}>
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

export type ContextMenuItemProps = BaseContextMenu.Item.Props;

export function ContextMenuItem({ className, ...props }: ContextMenuItemProps) {
  return <BaseContextMenu.Item className={cn(contextMenuItemVariants(), className)} {...props} />;
}

export type ContextMenuSeparatorProps = BaseContextMenu.Separator.Props;

export function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <BaseContextMenu.Separator className={cn(contextMenuSeparatorVariants(), className)} {...props} />
  );
}
