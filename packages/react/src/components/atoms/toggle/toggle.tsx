import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "../../../lib/cn";
import { toggleVariants, type ToggleVariants } from "./toggle.variants";

export interface ToggleProps extends BaseToggle.Props, ToggleVariants {}

export function Toggle({ className, size, ...props }: ToggleProps) {
  return <BaseToggle className={cn(toggleVariants({ size }), className)} {...props} />;
}
