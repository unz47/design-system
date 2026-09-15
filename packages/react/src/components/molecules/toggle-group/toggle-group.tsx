import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "../../../lib/cn";
import { toggleGroupVariants } from "./toggle-group.variants";

export type ToggleGroupProps = BaseToggleGroup.Props;

// 中身には atoms/toggle の Toggle をそのまま並べる。押下状態の管理は
// Base UI の Group 側が持つので、Toggle は何も変えなくてよい。
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return <BaseToggleGroup className={cn(toggleGroupVariants(), className)} {...props} />;
}
