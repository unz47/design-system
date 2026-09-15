import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "../../../lib/cn";
import {
  comboboxEmptyVariants,
  comboboxInputVariants,
  comboboxItemVariants,
  comboboxPopupVariants,
} from "./combobox.variants";

// 計画では「Command + Popover の自作合成」を想定していたが、Base UI が
// Combobox をネイティブに持つのでその必要は無い。絞り込みも Base UI 側の仕事。
export const Combobox = BaseCombobox.Root;
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxGroup = BaseCombobox.Group;
export const ComboboxGroupLabel = BaseCombobox.GroupLabel;

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type ComboboxInputProps = BaseCombobox.Input.Props;

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return <BaseCombobox.Input className={cn(comboboxInputVariants(), className)} {...props} />;
}

export type ComboboxContentProps = BaseCombobox.Popup.Props;

export function ComboboxContent({ className, children, ...props }: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={6} className="z-dropdown">
        <BaseCombobox.Popup className={cn(comboboxPopupVariants(), className)} {...props}>
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export type ComboboxItemProps = BaseCombobox.Item.Props;

export function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <BaseCombobox.Item className={cn(comboboxItemVariants(), className)} {...props}>
      {children}
      <BaseCombobox.ItemIndicator className="text-accent-default">
        <CheckIcon />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

export type ComboboxEmptyProps = BaseCombobox.Empty.Props;

// 「該当なし」は必ず出す。空のリストが黙って開くと、絞り込みが効いていないのか
// 候補が無いのか区別できない。
export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return <BaseCombobox.Empty className={cn(comboboxEmptyVariants(), className)} {...props} />;
}

export const ComboboxList = BaseCombobox.List;
