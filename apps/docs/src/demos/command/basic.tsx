"use client";

import {
  Button,
  Command,
  CommandContent,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
} from "@frost-ui/react";
import { useState } from "react";

const ACTIONS = ["新しいトークンを追加", "テーマを切り替える", "ドキュメントを開く", "Figmaに同期"];

export default function Basic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        パレットを開く <Kbd className="ml-sp-xs">⌘K</Kbd>
      </Button>

      <Command items={ACTIONS} open={open} onOpenChange={setOpen}>
        <CommandContent>
          <CommandInput placeholder="操作を検索…" />
          <CommandEmpty>該当する操作がありません</CommandEmpty>
          <CommandList>
            {(item: string) => (
              <CommandItem key={item} value={item}>
                {item}
              </CommandItem>
            )}
          </CommandList>
        </CommandContent>
      </Command>
    </>
  );
}
