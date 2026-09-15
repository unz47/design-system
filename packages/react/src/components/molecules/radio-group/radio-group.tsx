import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "../../../lib/cn";
import {
  radioGroupVariants,
  radioIndicatorVariants,
  radioVariants,
} from "./radio-group.variants";

export type RadioGroupProps = BaseRadioGroup.Props;

// 選択肢は消費者が並べるので、Group は合成形のまま残す(Switch のように
// 1つに畳めない)。Radio 単体は Root + Indicator を畳んである。
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <BaseRadioGroup className={cn(radioGroupVariants(), className)} {...props} />;
}

export type RadioProps = BaseRadio.Root.Props;

export function Radio({ className, ...props }: RadioProps) {
  return (
    <BaseRadio.Root className={cn(radioVariants(), className)} {...props}>
      <BaseRadio.Indicator className={radioIndicatorVariants()} />
    </BaseRadio.Root>
  );
}
