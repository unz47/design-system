// PROJECT_PLAN.md §9「リグレッション防止」で計画されているcoverage test。
// packages/react の実装ディレクトリを正として、registry・MDX・demoが
// 追従できているかを突き合わせる(逆に registry 側の孤児エントリも検出する)。
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getSlugs, registry, type PropDef } from "../index";

const docsRoot = path.resolve(import.meta.dirname, "../../..");
const reactComponentsDir = path.resolve(docsRoot, "../../packages/react/src/components");
const contentDir = path.join(docsRoot, "content/components");
const demosDir = path.join(docsRoot, "src/demos");

const ATOMIC_LEVELS = ["atoms", "molecules", "organisms"] as const;

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");
}

// <atomic>/<name>/index.ts のうち、フォルダ名と大文字小文字違いだけで一致する
// export(= そのコンポーネントの主要export)を持つものだけを「1エントリ = 1 registry slug」とみなす。
// Card配下の CardHeader 等のサブパーツは対象外になる。
type Component = { slug: string; atomic: (typeof ATOMIC_LEVELS)[number] };

function discoverComponents(): Component[] {
  const found: Component[] = [];
  for (const atomic of ATOMIC_LEVELS) {
    const dir = path.join(reactComponentsDir, atomic);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      const indexFile = path.join(dir, name.name, "index.ts");
      if (!existsSync(indexFile)) continue;
      found.push({ slug: name.name, atomic });
    }
  }
  return found;
}

const components = discoverComponents();

describe("packages/react の実装 → registry", () => {
  it.each(components)("$slug ($atomic) がregistryに登録され、階層(atomic)が一致する", ({ slug, atomic }) => {
    expect(slug in registry, `registry に "${slug}" が無い(packages/react/src/components/${atomic}/${slug}/ が未登録)`).toBe(true);
    const entry = registry[slug as keyof typeof registry];
    expect(entry.atomic, `registryの atomic("${entry.atomic}") と実際の配置("${atomic}")が食い違っている`).toBe(
      atomic === "atoms" ? "atom" : atomic === "molecules" ? "molecule" : "organism",
    );
    expect(entry.name, `registryのnameがPascalCaseの想定と食い違っている`).toBe(toPascalCase(slug));
  });

  it.each(components)("$slug のMDXコンテンツが存在する(content/components/$slug.mdx)", ({ slug }) => {
    expect(existsSync(path.join(contentDir, `${slug}.mdx`)), `content/components/${slug}.mdx が無い`).toBe(true);
  });

  it.each(components)("$slug に少なくとも1つdemoがある", ({ slug }) => {
    const entry = registry[slug as keyof typeof registry];
    expect(entry?.demos.length ?? 0, `registry["${slug}"].demos が空`).toBeGreaterThan(0);
  });

  it.each(components)("$slug にAPI表がある", ({ slug }) => {
    const entry = registry[slug as keyof typeof registry];
    expect(entry?.api.length ?? 0, `registry["${slug}"].api が空(コンポーネントページのAPI表が出ない)`).toBeGreaterThan(0);
    for (const group of entry.api) {
      expect(group.props.length, `registry["${slug}"].api["${group.name}"].props が空`).toBeGreaterThan(0);
    }
  });
});

// API表の variant 値は手書きなので、cva定義から離れていないかを突き合わせる。
// react-docgen 相当の型解析は入れず、*.variants.ts のソース文字列に
// そのキーが実在するかだけを見る安価なドリフト検査。
describe("API表 → cva定義", () => {
  const atomicDir = { atom: "atoms", molecule: "molecules", organism: "organisms" } as const;

  const rows = getSlugs().flatMap((slug) =>
    registry[slug].api.flatMap((group) =>
      (group.props as readonly PropDef[])
        .filter((prop) => prop.type.includes('"'))
        .map((prop) => ({ slug, propName: prop.name, type: prop.type, default: prop.default })),
    ),
  );

  it.each(rows)("$slug の $propName に書かれた値が *.variants.ts に実在する", ({ slug, propName, type }) => {
    const entry = registry[slug];
    const variantsFile = path.join(reactComponentsDir, atomicDir[entry.atomic], slug, `${slug}.variants.ts`);
    expect(existsSync(variantsFile), `${variantsFile} が無い`).toBe(true);
    const source = readFileSync(variantsFile, "utf8");

    const literals = [...type.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
    expect(literals.length, `${slug}.${propName} の型にユニオン値が無い`).toBeGreaterThan(0);
    for (const literal of literals) {
      expect(
        new RegExp(`\\b${literal}\\b\\s*:`).test(source),
        `${slug}.${propName} の "${literal}" が ${slug}.variants.ts に存在しない(API表がcva定義から乖離している)`,
      ).toBe(true);
    }
  });

  it.each(rows.filter((row) => row.default))("$slug の $propName の初期値が defaultVariants と一致する", ({ slug, propName, default: def }) => {
    const entry = registry[slug];
    const variantsFile = path.join(reactComponentsDir, atomicDir[entry.atomic], slug, `${slug}.variants.ts`);
    const source = readFileSync(variantsFile, "utf8");
    const defaults = /defaultVariants:\s*\{([^}]*)\}/.exec(source)?.[1] ?? "";
    const actual = new RegExp(`${propName}:\\s*"([^"]+)"`).exec(defaults)?.[1];
    expect(actual, `${slug}.variants.ts の defaultVariants に ${propName} が無い`).toBeDefined();
    expect(`"${actual}"`, `API表の初期値と defaultVariants が食い違っている`).toBe(def);
  });
});

describe("registry → 実体", () => {
  const slugs = getSlugs();

  it.each(slugs)("registryの \"%s\" に対応する実装ディレクトリが存在する", (slug) => {
    const entry = registry[slug];
    const dirName = entry.atomic === "atom" ? "atoms" : entry.atomic === "molecule" ? "molecules" : "organisms";
    const componentDir = path.join(reactComponentsDir, dirName, slug);
    expect(existsSync(componentDir), `${componentDir} が存在しない(registryに孤児エントリがある)`).toBe(true);
  });

  it.each(slugs)("\"%s\" の全demoファイルが実在する", (slug) => {
    const entry = registry[slug];
    for (const demo of entry.demos) {
      const demoFile = path.join(demosDir, demo.file);
      expect(existsSync(demoFile), `demo "${demo.id}" のファイル ${demoFile} が存在しない`).toBe(true);
    }
  });
});
