"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { createContext, useContext, type ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import {
  sheetBackdropVariants,
  sheetBodyVariants,
  sheetDescriptionVariants,
  sheetHeaderVariants,
  sheetPopupVariants,
  sheetTitleVariants,
  type SheetVariants,
} from "./sheet.variants";

// 計画では「Dialog土台」としていたが、Base UI 1.8 には Drawer(スワイプで閉じる
// 挙動つき)があるのでそちらを土台にする。モバイルで指で閉じられるのは
// Dialog を自前で滑らせても得られない。

type Side = NonNullable<SheetVariants["side"]>;

// swipeDirection は Root、辺のスタイルは Popup と、同じ「どちら側から出るか」が
// 2箇所に必要になる。消費者に2回書かせないため Root で受けて context で配る。
const SheetSideContext = createContext<Side>("right");

const SWIPE_BY_SIDE = {
  right: "right",
  left: "left",
  bottom: "down",
  top: "up",
} as const;

export interface SheetProps extends Omit<BaseDrawer.Root.Props, "swipeDirection"> {
  /** どの辺から出すか。スワイプで閉じる向きもこれに追従する */
  side?: Side;
}

export function Sheet({ side = "right", ...props }: SheetProps) {
  return (
    <SheetSideContext.Provider value={side}>
      <BaseDrawer.Root swipeDirection={SWIPE_BY_SIDE[side]} {...props} />
    </SheetSideContext.Provider>
  );
}

export const SheetTrigger = BaseDrawer.Trigger;
export const SheetClose = BaseDrawer.Close;

export type SheetContentProps = BaseDrawer.Popup.Props;

export function SheetContent({ className, children, ...props }: SheetContentProps) {
  const side = useContext(SheetSideContext);

  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className={sheetBackdropVariants()} />
      {/* Viewport は省略できない。無いとスワイプで閉じる挙動とタッチの
          スクロールロックが効かなくなる(Base UI が実行時に警告を出す)。 */}
      <BaseDrawer.Viewport>
        <BaseDrawer.Popup className={cn(sheetPopupVariants({ side }), className)} {...props}>
          {children}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export type SheetHeaderProps = ComponentPropsWithRef<"div">;

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return <div className={cn(sheetHeaderVariants(), className)} {...props} />;
}

export type SheetBodyProps = ComponentPropsWithRef<"div">;

export function SheetBody({ className, ...props }: SheetBodyProps) {
  return <div className={cn(sheetBodyVariants(), className)} {...props} />;
}

export type SheetTitleProps = BaseDrawer.Title.Props;

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return <BaseDrawer.Title className={cn(sheetTitleVariants(), className)} {...props} />;
}

export type SheetDescriptionProps = BaseDrawer.Description.Props;

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <BaseDrawer.Description className={cn(sheetDescriptionVariants(), className)} {...props} />
  );
}
