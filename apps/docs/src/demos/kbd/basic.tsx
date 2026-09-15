import { Kbd } from "@frost-ui/react";

export default function Basic() {
  return (
    <p className="flex items-center gap-sp-2xs text-sm text-text-secondary">
      検索を開く <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    </p>
  );
}
