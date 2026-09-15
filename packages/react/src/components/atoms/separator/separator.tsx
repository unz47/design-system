import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "../../../lib/cn";
import { separatorVariants } from "./separator.variants";

export type SeparatorProps = BaseSeparator.Props;

export function Separator({ className, ...props }: SeparatorProps) {
  return <BaseSeparator className={cn(separatorVariants(), className)} {...props} />;
}
