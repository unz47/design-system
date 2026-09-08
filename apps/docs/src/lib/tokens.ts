import { tokens } from "@frost-ui/tokens";

export interface TokenRow {
  /** ドット区切りのトークンパス(例: space.md) */
  path: string;
  /** 対応する CSS 変数名 */
  cssVar: string;
  /** 解決済みの値。dark テーマの値 */
  value: string;
  /** 先頭のグループ(color / space / text ...) */
  group: string;
}

function kebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** タイポグラフィのような複合トークンは、葉ではなくオブジェクトのまま来る。
 *  packages/tokens/sd/emit.mjs の flatten と同じ判定にしておく。 */
function isLeaf(value: unknown): boolean {
  if (Array.isArray(value)) return true;
  if (value === null || typeof value !== "object") return true;
  const obj = value as Record<string, unknown>;
  if ("fontFamily" in obj && "fontSize" in obj) return true;
  if ("color" in obj && "offsetX" in obj) return true;
  return false;
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (typeof value[0] === "number") return `cubic-bezier(${value.join(", ")})`;
    if (typeof value[0] === "string") return value.join(", ");
    return JSON.stringify(value);
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("fontFamily" in obj) {
      return `${String(obj.fontSize)} / ${String(obj.lineHeight)} · ${String(obj.fontWeight)}`;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

function* walk(node: unknown, path: string[] = []): Generator<TokenRow> {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const next = [...path, kebab(key)];
    if (isLeaf(value)) {
      yield {
        path: next.join("."),
        cssVar: `--aurora-${next.join("-")}`,
        value: formatValue(value),
        group: next[0]!,
      };
    } else {
      yield* walk(value, next);
    }
  }
}

/** 全トークンを平坦な行として返す。ページ側は表示するだけで、
 *  値の一覧をどこにも手書きしない(PROJECT_PLAN §5)。 */
export function getTokenRows(): TokenRow[] {
  return [...walk(tokens)];
}

export function getTokenGroups(): string[] {
  return [...new Set(getTokenRows().map((row) => row.group))];
}

/** foundations の各ページが扱うグループ。colors だけは専用ページがある。 */
export const FOUNDATION_PAGES = {
  typography: { title: "Typography", groups: ["text", "font-family", "font-weight"] },
  spacing: { title: "Spacing", groups: ["space", "container"] },
  radius: { title: "Radius", groups: ["radius", "border-width"] },
  elevation: { title: "Elevation", groups: ["shadow", "z"] },
  motion: { title: "Motion", groups: ["motion"] },
  icons: { title: "Icons", groups: ["icon"] },
} as const;

export type FoundationSlug = keyof typeof FOUNDATION_PAGES;
