import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "../../../lib/cn";
import {
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaViewportVariants,
  scrollAreaVariants,
} from "./scroll-area.variants";

export interface ScrollAreaProps extends BaseScrollArea.Root.Props {
  /** 横スクロールバーも出す。既定は縦のみ */
  horizontal?: boolean;
}

// スクロールバーは data-hovering / data-scrolling のときだけ不透明にする。
// 常時表示にすると、ネイティブのオーバーレイスクロールバーと二重に見える。
export function ScrollArea({ className, horizontal, children, ...props }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root className={cn(scrollAreaVariants(), className)} {...props}>
      <BaseScrollArea.Viewport className={scrollAreaViewportVariants()}>
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar orientation="vertical" className={scrollAreaScrollbarVariants()}>
        <BaseScrollArea.Thumb className={scrollAreaThumbVariants()} />
      </BaseScrollArea.Scrollbar>
      {horizontal ? (
        <BaseScrollArea.Scrollbar orientation="horizontal" className={scrollAreaScrollbarVariants()}>
          <BaseScrollArea.Thumb className={scrollAreaThumbVariants()} />
        </BaseScrollArea.Scrollbar>
      ) : null}
    </BaseScrollArea.Root>
  );
}
