import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "../../../lib/cn";
import {
  selectIconVariants,
  selectItemVariants,
  selectPopupVariants,
  selectTriggerVariants,
} from "./select.variants";

export const Select = BaseSelect.Root;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type SelectTriggerProps = BaseSelect.Trigger.Props;

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger className={cn(selectTriggerVariants(), className)} {...props}>
      {children}
      <BaseSelect.Icon className={selectIconVariants()}>
        <ChevronIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export type SelectContentProps = BaseSelect.Popup.Props;

// min-w に --anchor-width を使うと、開いたリストがトリガと同じ幅から始まる。
// Base UI が Positioner 上でこの変数を出している。
export function SelectContent({ className, children, ...props }: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={6} className="z-dropdown">
        <BaseSelect.Popup className={cn(selectPopupVariants(), className)} {...props}>
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectItemProps = BaseSelect.Item.Props;

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item className={cn(selectItemVariants(), className)} {...props}>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="text-accent-default">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}
