import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "../../../lib/cn";
import {
  tabsListVariants,
  tabsPanelVariants,
  tabsTabVariants,
  tabsVariants,
} from "./tabs.variants";

export type TabsProps = BaseTabs.Root.Props;

export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root className={cn(tabsVariants(), className)} {...props} />;
}

export type TabsListProps = BaseTabs.List.Props;

export function TabsList({ className, ...props }: TabsListProps) {
  return <BaseTabs.List className={cn(tabsListVariants(), className)} {...props} />;
}

export type TabsTabProps = BaseTabs.Tab.Props;

// 選択中の下線は Tab 自身の border-b で描く。Base UI の Indicator(滑る下線)は
// 位置計算が入るぶん重いので、必要になった時点で足す。
export function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <BaseTabs.Tab
      className={cn(tabsTabVariants(), "data-selected:border-accent-default", className)}
      {...props}
    />
  );
}

export type TabsPanelProps = BaseTabs.Panel.Props;

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel className={cn(tabsPanelVariants(), className)} {...props} />;
}
