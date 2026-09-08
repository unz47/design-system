import Link from "next/link";
import { getSlugs, registry } from "@/registry";

export const metadata = { title: "コンポーネント — Aurora" };

export default function ComponentsIndexPage() {
  const slugs = getSlugs();

  return (
    <div>
      <h1 className="text-title-size font-semibold text-text-primary">コンポーネント</h1>
      <p className="mt-sp-md text-text-secondary">Atomic Designの階層(atom/molecule/organism)ごとに実装を進めている。</p>

      <div className="mt-sp-xl grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-sp-md">
        {slugs.map((slug) => (
          <Link
            key={slug}
            href={`/components/${slug}`}
            className="rounded-surface border border-border-default bg-bg-surface p-sp-lg hover:border-border-strong"
          >
            <p className="text-sm font-medium text-text-primary">{registry[slug].name}</p>
            <p className="mt-sp-3xs text-xs text-text-muted">{registry[slug].atomic}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
