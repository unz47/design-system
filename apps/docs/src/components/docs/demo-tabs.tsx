"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@frost-ui/react";

function CopyButton({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (insecure origin / permission) — leave the label alone
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="コードをコピー"
      className="mr-sp-sm rounded-control px-sp-xs py-sp-3xs text-xs text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      {copied ? "コピーしました" : "コピー"}
    </button>
  );
}

export function DemoTabs({
  preview,
  code,
  source,
}: {
  preview: ReactNode;
  code: ReactNode;
  source: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="overflow-hidden rounded-overlay border border-border-default">
      <div className="flex items-center border-b border-border-default">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-sp-md py-sp-sm text-sm font-medium",
              tab === t ? "text-text-primary border-b-2 border-accent-default" : "text-text-secondary",
            )}
          >
            {t === "preview" ? "プレビュー" : "コード"}
          </button>
        ))}
        <div className="ml-auto">{tab === "code" ? <CopyButton source={source} /> : null}</div>
      </div>
      <div className={cn("p-sp-lg", tab !== "preview" && "hidden")}>{preview}</div>
      <div className={cn(tab !== "code" && "hidden")}>{code}</div>
    </div>
  );
}
