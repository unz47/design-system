import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface PatternEntry {
  name: string;
  /** 一覧とページ冒頭に出す一行 */
  summary: string;
  /** src/patterns からの相対パス。ソース表示に使う */
  file: string;
  Component: ComponentType;
}

// patterns は「コンポーネントの組み合わせ方」のレシピ。packages/react には
// 入れず(アプリごとに違いすぎる)、コピペできる形でここに置く。
export const patterns = {
  "login-form": {
    name: "ログインフォーム",
    summary: "Card + Input + Checkbox + Alert。検証エラーと送信中の状態まで含む。",
    file: "login-form.tsx",
    Component: dynamic(() => import("../patterns/login-form")),
  },
  settings: {
    name: "設定画面",
    summary: "Tabs で束ね、1行1設定で並べる。Switch / RadioGroup / Select の使い分け。",
    file: "settings.tsx",
    Component: dynamic(() => import("../patterns/settings")),
  },
  "data-table": {
    name: "DataTable",
    summary: "Table にソートと絞り込みを足したもの。0件時は EmptyState に切り替える。",
    file: "data-table.tsx",
    Component: dynamic(() => import("../patterns/data-table")),
  },
} as const satisfies Record<string, PatternEntry>;

export type PatternSlug = keyof typeof patterns;

export function getPatternSlugs(): PatternSlug[] {
  return Object.keys(patterns) as PatternSlug[];
}
