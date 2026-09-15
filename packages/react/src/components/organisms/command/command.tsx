"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "../../../lib/cn";
import {
  commandBackdropVariants,
  commandEmptyVariants,
  commandGroupLabelVariants,
  commandInputVariants,
  commandItemVariants,
  commandListVariants,
  commandPopupVariants,
} from "./command.variants";

// 計画では cmdk を使う想定だったが、cmdk は内部で Radix に依存しており
// 「Radixは不採用」という方針と衝突する。Base UI の Combobox が絞り込みと
// キーボード操作を持っているので、それを画面中央のパネルとして出すだけで足りる。
//
// Combobox との違いは器だけ: Combobox は入力欄に紐づく候補リスト、
// Command は画面全体を覆うパレット。中身の仕組みは同じ。

// Value はコマンドの識別子。多くは string なので既定をそれにしておく。
export type CommandProps<Value = string> = BaseCombobox.Root.Props<Value>;

export function Command<Value = string>(props: CommandProps<Value>) {
  return <BaseCombobox.Root modal {...props} />;
}

export type CommandInputProps = BaseCombobox.Input.Props;

export function CommandInput({ className, ...props }: CommandInputProps) {
  return <BaseCombobox.Input className={cn(commandInputVariants(), className)} {...props} />;
}

export type CommandContentProps = BaseCombobox.Popup.Props;

export function CommandContent({ className, children, ...props }: CommandContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Backdrop className={commandBackdropVariants()} />
      <BaseCombobox.Positioner className="z-modal">
        <BaseCombobox.Popup className={cn(commandPopupVariants(), className)} {...props}>
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export type CommandListProps = BaseCombobox.List.Props;

export function CommandList({ className, ...props }: CommandListProps) {
  return <BaseCombobox.List className={cn(commandListVariants(), className)} {...props} />;
}

export type CommandItemProps = BaseCombobox.Item.Props;

export function CommandItem({ className, ...props }: CommandItemProps) {
  return <BaseCombobox.Item className={cn(commandItemVariants(), className)} {...props} />;
}

export const CommandGroup = BaseCombobox.Group;

export type CommandGroupLabelProps = BaseCombobox.GroupLabel.Props;

export function CommandGroupLabel({ className, ...props }: CommandGroupLabelProps) {
  return <BaseCombobox.GroupLabel className={cn(commandGroupLabelVariants(), className)} {...props} />;
}

export type CommandEmptyProps = BaseCombobox.Empty.Props;

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return <BaseCombobox.Empty className={cn(commandEmptyVariants(), className)} {...props} />;
}
