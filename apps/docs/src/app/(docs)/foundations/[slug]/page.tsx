import { notFound } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@frost-ui/react";
import { FOUNDATION_PAGES, getTokenRows, type FoundationSlug } from "@/lib/tokens";

export function generateStaticParams() {
  return Object.keys(FOUNDATION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in FOUNDATION_PAGES)) return {};
  return { title: `${FOUNDATION_PAGES[slug as FoundationSlug].title} — Aurora` };
}

/** そのトークンが「見て分かる」ものなら、値の横に実物を出す。
 *  数値だけ並べても、8px と 12px の差は読み取れない。 */
function Preview({ path, value }: { path: string; value: string }) {
  const group = path.split(".")[0];

  if (group === "space" || group === "icon") {
    return <div className="h-4 bg-accent-default" style={{ width: value }} />;
  }
  if (group === "radius") {
    return <div className="size-10 border border-border-strong bg-bg-raised" style={{ borderRadius: value }} />;
  }
  if (group === "border-width") {
    return <div className="w-10 border-t border-border-strong" style={{ borderTopWidth: value }} />;
  }
  if (group === "shadow") {
    return <div className="size-10 rounded-surface bg-bg-surface" style={{ boxShadow: `var(--aurora-${path.replace(/\./g, "-")})` }} />;
  }
  if (group === "text") {
    // font ショートハンドに size だけ渡しても無効な宣言として捨てられ、
    // 全部が同じ大きさで並んで「どれも同じ」に見える。個別に指定する。
    const base = `--aurora-${path.replace(/\./g, "-")}`;
    return (
      <span
        className="block truncate text-text-primary"
        style={{
          fontFamily: `var(${base}-family)`,
          fontSize: `var(${base}-size)`,
          fontWeight: `var(${base}-weight)`,
          lineHeight: `var(${base}-line-height)`,
          letterSpacing: `var(${base}-tracking)`,
        }}
      >
        霜の降りる庭 Aa
      </span>
    );
  }
  return null;
}

export default async function FoundationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in FOUNDATION_PAGES)) notFound();

  const page = FOUNDATION_PAGES[slug as FoundationSlug];
  const groups: readonly string[] = page.groups;
  const rows = getTokenRows().filter((row) => groups.includes(row.group));

  return (
    <div>
      <h1 className="text-title-size font-semibold text-text-primary">{page.title}</h1>
      <p className="mt-sp-md max-w-prose text-text-secondary">
        値は <code className="rounded-control bg-bg-raised px-sp-2xs py-sp-3xs text-sm">@frost-ui/tokens</code>{" "}
        の生成結果から描画している。ここに手書きの数値は無い。
      </p>

      <div className="mt-sp-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>トークン</TableHead>
              <TableHead>CSS変数</TableHead>
              <TableHead>値</TableHead>
              <TableHead>見た目</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.path}>
                <TableCell className="whitespace-nowrap font-medium text-text-primary">{row.path}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <code className="text-xs text-accent-default">{row.cssVar}</code>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <code className="text-xs">{row.value}</code>
                </TableCell>
                <TableCell className="w-48 max-w-48 overflow-hidden">
                  <Preview path={row.path} value={row.value} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
