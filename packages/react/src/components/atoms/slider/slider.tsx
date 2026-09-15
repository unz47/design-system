import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "../../../lib/cn";
import {
  sliderControlVariants,
  sliderIndicatorVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  sliderVariants,
} from "./slider.variants";

export type SliderProps = BaseSlider.Root.Props;

// Base UI は Thumb を自動では増やさない。範囲スライダーでは値の数だけ
// <Slider.Thumb index={n} /> を並べる必要があるので、value / defaultValue の
// 形からつまみの数を決める(合成形を畳んだぶん、ここで面倒を見る)。
export function Slider({ className, ...props }: SliderProps) {
  const values = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(values) ? values.length : 1;

  return (
    <BaseSlider.Root className={cn(sliderVariants(), className)} {...props}>
      <BaseSlider.Control className={sliderControlVariants()}>
        <BaseSlider.Track className={sliderTrackVariants()}>
          <BaseSlider.Indicator className={sliderIndicatorVariants()} />
          {Array.from({ length: thumbCount }, (_, index) => (
            <BaseSlider.Thumb key={index} index={index} className={sliderThumbVariants()} />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
