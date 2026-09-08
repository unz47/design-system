import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../../../lib/cn";
import { switchThumbVariants, switchVariants } from "./switch.variants";

export interface SwitchProps extends BaseSwitch.Root.Props {
  /** つまみ側に当てる className。トラックは className が受ける */
  thumbClassName?: string;
}

// Root + Thumb を1つにまとめる。Thumb を差し替えたい要求は実際には出ないので、
// 消費側が2階層書かされるコストのほうが大きい。
export function Switch({ className, thumbClassName, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root className={cn(switchVariants(), className)} {...props}>
      <BaseSwitch.Thumb className={cn(switchThumbVariants(), thumbClassName)} />
    </BaseSwitch.Root>
  );
}
