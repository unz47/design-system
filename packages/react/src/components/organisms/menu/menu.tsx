import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "../../../lib/cn";
import {
  menuGroupLabelVariants,
  menuItemVariants,
  menuPopupVariants,
  menuSeparatorVariants,
} from "./menu.variants";

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuGroup = BaseMenu.Group;
export const MenuSubmenu = BaseMenu.SubmenuRoot;

export interface MenuContentProps extends BaseMenu.Popup.Props {
  side?: BaseMenu.Positioner.Props["side"];
  align?: BaseMenu.Positioner.Props["align"];
  sideOffset?: BaseMenu.Positioner.Props["sideOffset"];
}

export function MenuContent({
  className,
  side,
  align,
  sideOffset = 6,
  children,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} className="z-dropdown">
        <BaseMenu.Popup className={cn(menuPopupVariants(), className)} {...props}>
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export type MenuItemProps = BaseMenu.Item.Props;

export function MenuItem({ className, ...props }: MenuItemProps) {
  return <BaseMenu.Item className={cn(menuItemVariants(), className)} {...props} />;
}

export type MenuSubmenuTriggerProps = BaseMenu.SubmenuTrigger.Props;

export function MenuSubmenuTrigger({ className, ...props }: MenuSubmenuTriggerProps) {
  return <BaseMenu.SubmenuTrigger className={cn(menuItemVariants(), className)} {...props} />;
}

export type MenuGroupLabelProps = BaseMenu.GroupLabel.Props;

export function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel className={cn(menuGroupLabelVariants(), className)} {...props} />;
}

export type MenuSeparatorProps = BaseMenu.Separator.Props;

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator className={cn(menuSeparatorVariants(), className)} {...props} />;
}
