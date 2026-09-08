import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@frost-ui/react";

export default function Basic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 max-w-sm items-center justify-center rounded-surface border border-dashed border-border-default text-sm text-text-muted">
        この中で右クリック
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>切り取り</ContextMenuItem>
        <ContextMenuItem>コピー</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>貼り付け</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
