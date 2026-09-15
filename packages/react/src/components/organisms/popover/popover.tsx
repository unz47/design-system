import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "../../../lib/cn";
import { popoverPopupVariants } from "./popover.variants";

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;
export const PopoverTitle = BasePopover.Title;
export const PopoverDescription = BasePopover.Description;

// Positioner の配置propsは PopoverContent がそのまま受けて Positioner に流す。
// Portal + Positioner + Popup の3階層を書かせない。
export interface PopoverContentProps extends BasePopover.Popup.Props {
  side?: BasePopover.Positioner.Props["side"];
  align?: BasePopover.Positioner.Props["align"];
  sideOffset?: BasePopover.Positioner.Props["sideOffset"];
  alignOffset?: BasePopover.Positioner.Props["alignOffset"];
}

export function PopoverContent({
  className,
  side,
  align,
  sideOffset = 8,
  alignOffset,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-popover"
      >
        <BasePopover.Popup className={cn(popoverPopupVariants(), className)} {...props}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
