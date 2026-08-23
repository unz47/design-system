"use client";

export default function VerificationPage() {
  function toggleTheme() {
    const root = document.documentElement;
    root.setAttribute("data-theme", root.getAttribute("data-theme") === "light" ? "dark" : "light");
  }

  return (
    <main className="mx-auto max-w-content p-xl">
      <h1 className="text-display-size font-display-weight text-text-primary">
        Phase 1 検証ページ
      </h1>
      <p className="mt-md text-text-secondary">
        bg-surface-base / text-text-primary が効いていること、data-theme切替で色が変わることを確認する。
      </p>

      <div className="mt-xl rounded-surface border border-border-default bg-bg-surface p-lg">
        <p className="text-text-primary">bg-bg-surface + border-border-default</p>
        <div className="mt-md rounded-overlay border border-border-strong bg-bg-raised p-lg">
          <p className="text-text-primary">bg-bg-raised(入れ子)</p>
        </div>
      </div>

      <div className="mt-xl flex items-center gap-md">
        <button
          type="button"
          className="rounded-control bg-accent-default px-lg py-sm text-on-accent"
        >
          accent-default ボタン
        </button>
        <span className="rounded-full bg-accent-default/20 px-md py-xs text-accent-default">
          accent-default/20(不透明度)
        </span>
      </div>

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
