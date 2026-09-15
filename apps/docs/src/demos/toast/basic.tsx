"use client";

import { Button, ToastProvider, ToastViewport, useToast } from "@frost-ui/react";

function Trigger() {
  const toast = useToast();

  return (
    <div className="flex gap-sp-sm">
      <Button
        size="sm"
        onClick={() => toast.add({ title: "保存しました", description: "変更は自動で同期されます。" })}
      >
        通知を出す
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => toast.add({ title: "同期に失敗しました", priority: "high", timeout: 0 })}
      >
        消えない通知
      </Button>
    </div>
  );
}

export default function Basic() {
  return (
    <ToastProvider>
      <Trigger />
      <ToastViewport />
    </ToastProvider>
  );
}
