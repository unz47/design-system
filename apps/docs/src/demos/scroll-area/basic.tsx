import { ScrollArea } from "@frost-ui/react";

export default function Basic() {
  return (
    <ScrollArea className="h-40 max-w-sm rounded-surface border border-border-default">
      <div className="flex flex-col gap-sp-xs p-sp-md text-sm text-text-secondary">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>スクロールする行 {i + 1}</p>
        ))}
      </div>
    </ScrollArea>
  );
}
