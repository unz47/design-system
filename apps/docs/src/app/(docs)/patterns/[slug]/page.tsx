import { notFound } from "next/navigation";
import { DemoFrame } from "@/components/docs/demo-frame";
import { getPatternSlugs, patterns, type PatternSlug } from "@/registry/patterns";

const content: Record<PatternSlug, () => Promise<{ default: React.ComponentType }>> = {
  "login-form": () => import("../../../../../content/patterns/login-form.mdx"),
  settings: () => import("../../../../../content/patterns/settings.mdx"),
  "data-table": () => import("../../../../../content/patterns/data-table.mdx"),
};

export function generateStaticParams() {
  return getPatternSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in patterns)) return {};
  return { title: `${patterns[slug as PatternSlug].name} — Aurora` };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in patterns)) notFound();

  const entry = patterns[slug as PatternSlug];
  const Content = (await content[slug as PatternSlug]()).default;

  return (
    <div>
      <h1 className="text-title-size font-semibold text-text-primary">{entry.name}</h1>
      <p className="mt-sp-xs text-text-secondary">{entry.summary}</p>

      <div className="mt-sp-md">
        <Content />
      </div>

      <div className="mt-sp-xl">
        <DemoFrame
          demo={{ id: slug, title: entry.name, file: entry.file, Component: entry.Component }}
          root="src/patterns"
        />
      </div>
    </div>
  );
}
