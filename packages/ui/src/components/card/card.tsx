import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/cn";
import {
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
} from "./card.variants";

export function Card({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn(cardVariants(), className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn(cardHeaderVariants(), className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<"h3">) {
  return <h3 className={cn(cardTitleVariants(), className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p className={cn(cardDescriptionVariants(), className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn(cardContentVariants(), className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn(cardFooterVariants(), className)} {...props} />;
}
