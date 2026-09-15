import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-content p-sp-xl">
      <p className="text-xs uppercase tracking-wide text-text-muted">Aurora</p>
      <h1 className="mt-sp-xs text-display-size font-semibold text-text-primary">
        Frost / Silver Witch&apos;s Garden
      </h1>
      <p className="mt-sp-md max-w-prose text-text-secondary">
        個人用デザインシステム。トークンをコードで一元管理し、Web / Expo / Figma に配布する。
      </p>

      <div className="mt-sp-xl flex gap-sp-md">
        <Link
          href="/components"
          className="rounded-control bg-accent-default px-sp-lg py-sp-sm text-sm font-medium text-on-accent"
        >
          コンポーネントを見る
        </Link>
        <Link
          href="/foundations/colors"
          className="rounded-control border border-border-strong px-sp-lg py-sp-sm text-sm font-medium text-text-secondary"
        >
          Colors
        </Link>
      </div>
    </main>
  );
}
