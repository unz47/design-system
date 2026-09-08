import { notFound } from "next/navigation";
import { DemoFrame } from "@/components/docs/demo-frame";
import { PropsTable, SubcomponentsTable } from "@/components/docs/props-table";
import { getSlugs, registry, type ComponentSlug } from "@/registry";

// 静的な対応表。テンプレートリテラルの動的importにするとTurbopackが
// content/ 以下を全部バンドルに巻き込むので、1行ずつ書く。
const content: Record<ComponentSlug, () => Promise<{ default: React.ComponentType }>> = {
  button: () => import("../../../../../content/components/button.mdx"),
  card: () => import("../../../../../content/components/card.mdx"),
  badge: () => import("../../../../../content/components/badge.mdx"),
  input: () => import("../../../../../content/components/input.mdx"),
  textarea: () => import("../../../../../content/components/textarea.mdx"),
  skeleton: () => import("../../../../../content/components/skeleton.mdx"),
  kbd: () => import("../../../../../content/components/kbd.mdx"),
  spinner: () => import("../../../../../content/components/spinner.mdx"),
  alert: () => import("../../../../../content/components/alert.mdx"),
  "empty-state": () => import("../../../../../content/components/empty-state.mdx"),
};

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in registry)) return {};
  return { title: `${registry[slug as ComponentSlug].name} — Aurora` };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in registry)) notFound();

  const entry = registry[slug as ComponentSlug];
  const Content = (await content[slug as ComponentSlug]()).default;

  return (
    <div>
      <div className="flex items-baseline gap-sp-sm">
        <h1 className="text-title-size font-semibold text-text-primary">{entry.name}</h1>
        <span className="text-xs text-text-muted">{entry.atomic}</span>
      </div>

      <div className="mt-sp-md">
        <Content />
      </div>

      <div className="mt-sp-xl flex flex-col gap-sp-lg">
        {entry.demos.map((demo) => (
          <div key={demo.id}>
            <h2 className="text-sm font-medium text-text-secondary">{demo.title}</h2>
            <div className="mt-sp-xs">
              <DemoFrame demo={demo} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-sp-xl text-heading-size font-semibold text-text-primary">API</h2>
      <div className="mt-sp-md flex flex-col gap-sp-lg">
        {entry.api.map((group) => (
          <PropsTable key={group.name} group={group} />
        ))}
        {"subcomponents" in entry && entry.subcomponents.length > 0 ? (
          <SubcomponentsTable subcomponents={entry.subcomponents} />
        ) : null}
      </div>
    </div>
  );
}
