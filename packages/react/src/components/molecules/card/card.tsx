import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import {
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
} from "./card.variants";

export type CardProps = ComponentPropsWithRef<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn(cardVariants(), className)} {...props} />;
}

export type CardHeaderProps = ComponentPropsWithRef<"div">;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn(cardHeaderVariants(), className)} {...props} />;
}

export type CardTitleProps = ComponentPropsWithRef<"h3">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn(cardTitleVariants(), className)} {...props} />;
}

export type CardDescriptionProps = ComponentPropsWithRef<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn(cardDescriptionVariants(), className)} {...props} />;
}

export type CardContentProps = ComponentPropsWithRef<"div">;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn(cardContentVariants(), className)} {...props} />;
}

export type CardFooterProps = ComponentPropsWithRef<"div">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn(cardFooterVariants(), className)} {...props} />;
}
