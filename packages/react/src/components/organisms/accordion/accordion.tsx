import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "../../../lib/cn";
import {
  accordionItemVariants,
  accordionPanelInnerVariants,
  accordionPanelVariants,
  accordionTriggerVariants,
  accordionVariants,
} from "./accordion.variants";

export type AccordionProps = BaseAccordion.Root.Props;

export function Accordion({ className, ...props }: AccordionProps) {
  return <BaseAccordion.Root className={cn(accordionVariants(), className)} {...props} />;
}

export type AccordionItemProps = BaseAccordion.Item.Props;

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <BaseAccordion.Item className={cn(accordionItemVariants(), className)} {...props} />;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-text-muted" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type AccordionTriggerProps = BaseAccordion.Trigger.Props;

// Header(h3)は Base UI が要求するので中で描く。見出しレベルを変えたい場合は
// Base UI の Accordion.Header を直接使う。
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger className={cn(accordionTriggerVariants(), className)} {...props}>
        {children}
        <ChevronIcon />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export type AccordionPanelProps = BaseAccordion.Panel.Props;

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel className={cn(accordionPanelVariants(), className)} {...props}>
      <div className={accordionPanelInnerVariants()}>{children}</div>
    </BaseAccordion.Panel>
  );
}
