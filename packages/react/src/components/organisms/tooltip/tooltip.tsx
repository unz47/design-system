import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../../../lib/cn";
import { tooltipPopupVariants } from "./tooltip.variants";

// Provider はアプリのルートに1つ置く。複数のツールチップの遅延を共有し、
// 2つ目以降が即座に開くようになる。
export const TooltipProvider = BaseTooltip.Provider;
export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export interface TooltipContentProps extends BaseTooltip.Popup.Props {
  side?: BaseTooltip.Positioner.Props["side"];
  align?: BaseTooltip.Positioner.Props["align"];
  sideOffset?: BaseTooltip.Positioner.Props["sideOffset"];
}

export function TooltipContent({
  className,
  side,
  align,
  sideOffset = 6,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="z-tooltip">
        <BaseTooltip.Popup className={cn(tooltipPopupVariants(), className)} {...props}>
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
