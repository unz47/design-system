"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unz47/ui";

export default function VerificationPage() {
  function toggleTheme() {
    const root = document.documentElement;
    root.setAttribute("data-theme", root.getAttribute("data-theme") === "light" ? "dark" : "light");
  }

  return (
    <main className="mx-auto max-w-content p-xl">
      <h1 className="text-display-size font-display-weight text-text-primary">
        Phase 2 検証ページ
      </h1>
      <p className="mt-md text-text-secondary">
        @unz47/ui から Button / Card / Badge が実際にimportされ、transpilePackagesと@sourceが効いていることを確認する。
      </p>

      <Card className="mt-xl">
        <CardHeader>
          <CardTitle>Aurora デザインシステム</CardTitle>
          <CardDescription>Frost / Silver Witch&apos;s Garden</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-md">
          <div className="flex flex-wrap items-center gap-md">
            <Button variant="primary">保存する</Button>
            <Button variant="secondary">キャンセル</Button>
            <Button variant="ghost">詳細</Button>
            <Button variant="danger">削除</Button>
          </div>
          <div className="flex flex-wrap items-center gap-sm">
            <Badge>default</Badge>
            <Badge variant="accent">accent</Badge>
            <Badge variant="success">success</Badge>
            <Badge variant="danger">danger</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="info">info</Badge>
          </div>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-xl rounded-control border border-border-strong px-lg py-sm text-text-secondary"
      >
        data-theme を切り替える
      </button>
    </main>
  );
}
