import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "../../../lib/cn";
import {
  progressIndicatorVariants,
  progressTrackVariants,
  progressVariants,
} from "./progress.variants";

export type ProgressProps = BaseProgress.Root.Props;

// value を渡さなければ Base UI が indeterminate として扱う。
export function Progress({ className, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root className={cn(progressVariants(), className)} {...props}>
      <BaseProgress.Track className={progressTrackVariants()}>
        <BaseProgress.Indicator className={progressIndicatorVariants()} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
