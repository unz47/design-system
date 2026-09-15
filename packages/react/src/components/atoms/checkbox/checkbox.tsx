import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "../../../lib/cn";
import { checkboxIndicatorVariants, checkboxVariants } from "./checkbox.variants";

export type CheckboxProps = BaseCheckbox.Root.Props;

// アイコンはインラインSVG。1コンポーネントのために lucide-react を依存に足すと
// 消費側のバンドルに効くため、Tier 0のアイコン規約が決まるまでは持ち込まない。
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root className={cn(checkboxVariants(), className)} {...props}>
      <BaseCheckbox.Indicator className={checkboxIndicatorVariants()}>
        {props.indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
