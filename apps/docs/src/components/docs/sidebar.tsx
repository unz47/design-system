import Link from "next/link";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { getSlugs, registry } from "@/registry";

export function Sidebar() {
  const slugs = getSlugs();

  return (
    <nav className="w-56 shrink-0 border-r border-border-subtle p-sp-lg">
      <Link href="/" className="block text-sm font-semibold text-text-primary">
        Aurora
      </Link>

      <p className="mt-sp-lg text-xs uppercase tracking-wide text-text-muted">Foundations</p>
      <ul className="mt-sp-xs flex flex-col gap-sp-3xs">
        <li>
          <Link href="/foundations/colors" className="block rounded-control px-sp-xs py-sp-3xs text-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary">
            Colors
          </Link>
        </li>
      </ul>

      <p className="mt-sp-lg text-xs uppercase tracking-wide text-text-muted">Components</p>
      <ul className="mt-sp-xs flex flex-col gap-sp-3xs">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={`/components/${slug}`}
              className="flex items-center justify-between rounded-control px-sp-xs py-sp-3xs text-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary"
            >
              <span>{registry[slug].name}</span>
              <span className="text-xs text-text-muted">{registry[slug].atomic}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-sp-xl">
        <ThemeToggle />
      </div>
    </nav>
  );
}
