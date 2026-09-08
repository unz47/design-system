// PROJECT_PLAN.md §9「リグレッション防止」で計画されている契約テスト。
// dist/ の生成物(コミット対象)を直接検証する — ビルドロジックを再実装しない。
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensRoot = path.resolve(here, "../..");
const distDir = path.join(tokensRoot, "dist");
const srcDir = path.join(tokensRoot, "src");

function extractBlock(css: string, selectorIndex: number): string {
  const openIdx = css.indexOf("{", selectorIndex);
  let depth = 0;
  for (let i = openIdx; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(openIdx + 1, i);
    }
  }
  throw new Error("unbalanced braces while scanning CSS block");
}

function extractVarNames(block: string): Set<string> {
  const names = new Set<string>();
  const re = /--([a-zA-Z0-9-]+)\s*:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) names.add(m[1]);
  return names;
}

function extractVarEntries(block: string): Map<string, string> {
  const entries = new Map<string, string>();
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) entries.set(m[1], m[2].trim());
  return entries;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

const variablesCss = readFileSync(path.join(distDir, "css/variables.css"), "utf8");
const darkBlock = extractBlock(variablesCss, variablesCss.indexOf(":root"));
const lightBlock = extractBlock(variablesCss, variablesCss.indexOf('[data-theme="light"]'));
const darkEntries = extractVarEntries(darkBlock);
const lightEntries = extractVarEntries(lightBlock);

describe("dark/light テーマの整合性", () => {
  it("同じ変数名の集合を持つ(片方にしか無い変数が無い)", () => {
    const darkNames = [...extractVarNames(darkBlock)].sort();
    const lightNames = [...extractVarNames(lightBlock)].sort();
    expect(lightNames).toEqual(darkNames);
  });
});

describe("参照解決", () => {
  it("全ての $value が解決されている(未解決の {ref} が残っていない)", () => {
    for (const [name, value] of [...darkEntries, ...lightEntries]) {
      expect(value, `--${name} が未解決の参照を含む: ${value}`).not.toMatch(/\{[^}]*\}/);
    }
  });
});

describe("component層の参照先", () => {
  const SEMANTIC_COLOR_KEYS = ["bg", "border", "text", "accent", "accent-alt", "on-accent", "focus-ring", "status"];
  const componentDir = path.join(srcDir, "component");
  const componentFiles = readdirSync(componentDir).filter((f) => f.endsWith(".json"));

  it("component層のcolor参照はsemantic(bg/border/text/accent/status等)経由のみで、primitiveランプを直接参照しない", () => {
    for (const file of componentFiles) {
      const raw = readFileSync(path.join(componentDir, file), "utf8");
      const refs = [...raw.matchAll(/\{color\.([a-zA-Z0-9-]+)[^}]*\}/g)].map((m) => m[1]);
      for (const topKey of refs) {
        expect(
          SEMANTIC_COLOR_KEYS.includes(topKey),
          `${file} が primitive color ramp "${topKey}" を直接参照している(semantic経由にすること)`,
        ).toBe(true);
      }
    }
  });
});

describe("shadow / elevation", () => {
  const shadowNames = [...darkEntries.keys()].filter((n) => n.startsWith("aurora-shadow-"));

  it("shadowトークンが1本のbox-shadow値として出ている(レイヤーが --...-color / --...-offset-x に分解されていない)", () => {
    expect(shadowNames.length).toBeGreaterThan(0);
    for (const name of shadowNames) {
      expect(
        name,
        `--${name} はshadowの構成要素として分解されている。単層shadowは emit.mjs の isLeaf() で1つのleafとして扱うこと`,
      ).not.toMatch(/-(color|offset-x|offset-y|blur|spread)$/);
      expect(darkEntries.get(name), `--${name} がbox-shadowの形をしていない`).toMatch(/px/);
    }
  });

  it("darkとlightで別の値を持つ(darkの黒い影+白い縁取りをlightに流用していない)", () => {
    for (const name of shadowNames) {
      expect(
        lightEntries.get(name),
        `--${name} がdark/lightで同値。lightの下地は明るいので濃度を変える必要がある(TOKENS.md「shadow / elevation」)`,
      ).not.toBe(darkEntries.get(name));
    }
  });

  it("lightのshadowに白い縁取り(dark専用の手法)が残っていない", () => {
    for (const name of shadowNames) {
      expect(lightEntries.get(name), `--${name} がlightで rgba(255,255,255,…) を使っている`).not.toMatch(
        /rgba\(\s*255\s*,\s*255\s*,\s*255/,
      );
    }
  });
});

describe("Tailwind v4/v3 出力の整合性", () => {
  it("theme.css の --color-* とnative preset.js の色キー集合が一致する", () => {
    const themeCss = readFileSync(path.join(distDir, "css/theme.css"), "utf8");
    const themeInlineBlock = extractBlock(themeCss, themeCss.indexOf("@theme inline"));
    const v4ColorKeys = [...themeInlineBlock.matchAll(/--color-([a-zA-Z0-9-]+)\s*:/g)]
      .map((m) => m[1])
      .sort();

    const presetJs = readFileSync(path.join(distDir, "native/preset.js"), "utf8");
    const v3ColorKeys = [...presetJs.matchAll(/c\("([a-zA-Z0-9-]+)"\)/g)]
      .map((m) => m[1])
      .sort();

    expect(v3ColorKeys).toEqual(v4ColorKeys);
  });
});

describe("WCAG AA コントラスト", () => {
  // 実際にButton/Badgeのvariantが組み合わせて使っているtext×bgペア。
  // type: "text" は4.5:1、"ui"(枠線やフォーカスリングなど非テキスト要素)は3:1。
  const PAIRS: Array<{ fg: string; bg: string; type: "text" | "ui"; label: string }> = [
    { fg: "aurora-color-text-primary", bg: "aurora-color-bg-base", type: "text", label: "text.primary / bg.base" },
    { fg: "aurora-color-text-secondary", bg: "aurora-color-bg-base", type: "text", label: "text.secondary / bg.base" },
    { fg: "aurora-color-text-primary", bg: "aurora-color-bg-surface", type: "text", label: "text.primary / bg.surface" },
    { fg: "aurora-color-text-secondary", bg: "aurora-color-bg-raised", type: "text", label: "text.secondary / bg.raised(badge default)" },
    { fg: "aurora-color-on-accent", bg: "aurora-color-accent-default", type: "text", label: "on-accent / accent.default(primary button/badge)" },
    { fg: "aurora-color-on-accent", bg: "aurora-color-status-danger-solid", type: "text", label: "on-accent / status.danger.solid(danger button)" },
    { fg: "aurora-color-status-success-solid", bg: "aurora-color-status-success-subtle-bg", type: "text", label: "status.success.solid / subtle-bg(success badge)" },
    { fg: "aurora-color-status-danger-solid", bg: "aurora-color-status-danger-subtle-bg", type: "text", label: "status.danger.solid / subtle-bg(danger badge)" },
    { fg: "aurora-color-status-warning-solid", bg: "aurora-color-status-warning-subtle-bg", type: "text", label: "status.warning.solid / subtle-bg(warning badge)" },
    { fg: "aurora-color-status-info-solid", bg: "aurora-color-status-info-subtle-bg", type: "text", label: "status.info.solid / subtle-bg(info badge)" },
    { fg: "aurora-color-accent-default", bg: "aurora-color-bg-base", type: "ui", label: "accent.default(focus ring) / bg.base" },
  ];

  describe.each([
    ["dark", darkEntries],
    ["light", lightEntries],
  ] as const)("%s テーマ", (_themeName, entries) => {
    it.each(PAIRS)("$label が基準を満たす", ({ fg, bg, type }) => {
      const fgHex = entries.get(fg);
      const bgHex = entries.get(bg);
      expect(fgHex, `変数 --${fg} が見つからない`).toBeDefined();
      expect(bgHex, `変数 --${bg} が見つからない`).toBeDefined();

      const ratio = contrastRatio(fgHex as string, bgHex as string);
      const min = type === "text" ? 4.5 : 3.0;
      expect(ratio, `contrast ${ratio.toFixed(2)}:1 (${fgHex} / ${bgHex}) は基準 ${min}:1 未満`).toBeGreaterThanOrEqual(min);
    });
  });
});
