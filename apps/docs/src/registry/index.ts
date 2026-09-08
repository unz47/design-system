import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface DemoEntry {
  id: string;
  title: string;
  /** path relative to apps/docs/src/demos, used by DemoFrame to read the source */
  file: string;
  Component: ComponentType;
}

export interface PropDef {
  name: string;
  /** Rendered verbatim. Union literals here are checked against the component's
   *  *.variants.ts by registry/__tests__/coverage.test.ts, so keep them exact. */
  type: string;
  default?: string;
  description: string;
}

export interface ApiGroup {
  /** Exported name the props belong to (Button, Card, ...) */
  name: string;
  /** DOM element the component renders, for "…に加えて素のprops全部が使える" */
  element: string;
  props: PropDef[];
}

export interface SubcomponentDef {
  name: string;
  element: string;
  description: string;
}

export interface RegistryEntry {
  name: string;
  atomic: "atom" | "molecule" | "organism";
  demos: DemoEntry[];
  api: ApiGroup[];
  subcomponents?: SubcomponentDef[];
}

/** Every component forwards className through cn(), so the row is identical
 *  everywhere — kept in one place instead of repeated per entry. */
const classNameProp: PropDef = {
  name: "className",
  type: "string",
  description: "twMerge で最後にマージされる。同じプロパティのユーティリティは常にこちらが勝つ",
};

export const registry = {
  button: {
    name: "Button",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "button/basic.tsx", Component: dynamic(() => import("../demos/button/basic")) },
      { id: "variants", title: "バリアント", file: "button/variants.tsx", Component: dynamic(() => import("../demos/button/variants")) },
      { id: "sizes", title: "サイズ", file: "button/sizes.tsx", Component: dynamic(() => import("../demos/button/sizes")) },
    ],
    api: [
      {
        name: "Button",
        element: "button",
        props: [
          {
            name: "variant",
            type: `"primary" | "secondary" | "ghost" | "danger"`,
            default: `"primary"`,
            description: "役割ベースの見た目。色名ではなく役割で選ぶ",
          },
          {
            name: "size",
            type: `"sm" | "md" | "lg" | "icon"`,
            default: `"md"`,
            description: "高さは control.height トークン。icon は正方形",
          },
          classNameProp,
        ],
      },
    ],
  },
  card: {
    name: "Card",
    atomic: "molecule",
    demos: [
      { id: "basic", title: "基本", file: "card/basic.tsx", Component: dynamic(() => import("../demos/card/basic")) },
    ],
    api: [
      {
        name: "Card",
        element: "div",
        props: [classNameProp],
      },
    ],
    subcomponents: [
      { name: "CardHeader", element: "div", description: "タイトルと説明をまとめる。上部のpaddingを持つ" },
      { name: "CardTitle", element: "h3", description: "見出し。階層が合わない場合は className ではなく素の h タグを使う" },
      { name: "CardDescription", element: "p", description: "タイトルに続く補足。text.secondary" },
      { name: "CardContent", element: "div", description: "本文。CardHeader と縦に並ぶ想定でpadding-topを持たない" },
      { name: "CardFooter", element: "div", description: "アクション行。中身は横並び" },
    ],
  },
  badge: {
    name: "Badge",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "badge/basic.tsx", Component: dynamic(() => import("../demos/badge/basic")) },
    ],
    api: [
      {
        name: "Badge",
        element: "span",
        props: [
          {
            name: "variant",
            type: `"default" | "accent" | "success" | "danger" | "warning" | "info"`,
            default: `"default"`,
            description: "status系は subtle-bg + solid の組み合わせでコントラストを確保している",
          },
          classNameProp,
        ],
      },
    ],
  },
  input: {
    name: "Input",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "input/basic.tsx", Component: dynamic(() => import("../demos/input/basic")) },
      { id: "sizes", title: "サイズ", file: "input/sizes.tsx", Component: dynamic(() => import("../demos/input/sizes")) },
    ],
    api: [
      {
        name: "Input",
        element: "input",
        props: [
          {
            name: "size",
            type: `"sm" | "md" | "lg"`,
            default: `"md"`,
            description: "control.height トークン。ネイティブの size 属性(文字数)は型から外してある",
          },
          {
            name: "aria-invalid",
            type: "boolean",
            description: "不正値の表現。専用のpropは用意していない — 枠線とフォーカスリングが danger 色になる",
          },
          classNameProp,
        ],
      },
    ],
  },
  textarea: {
    name: "Textarea",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "textarea/basic.tsx", Component: dynamic(() => import("../demos/textarea/basic")) },
    ],
    api: [
      {
        name: "Textarea",
        element: "textarea",
        props: [
          {
            name: "resize",
            type: `"none" | "vertical" | "both"`,
            default: `"vertical"`,
            description: "伸縮方向。高さ自体は rows 属性で決める(size variantは持たない)",
          },
          classNameProp,
        ],
      },
    ],
  },
  skeleton: {
    name: "Skeleton",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "skeleton/basic.tsx", Component: dynamic(() => import("../demos/skeleton/basic")) },
    ],
    api: [
      {
        name: "Skeleton",
        element: "div",
        props: [
          {
            name: "shape",
            type: `"block" | "text" | "circle"`,
            default: `"block"`,
            description: "text は行の高さだけ固定する。実寸は className で指定する",
          },
          classNameProp,
        ],
      },
    ],
  },
  kbd: {
    name: "Kbd",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "kbd/basic.tsx", Component: dynamic(() => import("../demos/kbd/basic")) },
    ],
    api: [
      {
        name: "Kbd",
        element: "kbd",
        props: [classNameProp],
      },
    ],
  },
  spinner: {
    name: "Spinner",
    atomic: "atom",
    demos: [
      { id: "basic", title: "基本", file: "spinner/basic.tsx", Component: dynamic(() => import("../demos/spinner/basic")) },
    ],
    api: [
      {
        name: "Spinner",
        element: "span",
        props: [
          {
            name: "size",
            type: `"sm" | "md" | "lg"`,
            default: `"md"`,
            description: "icon.sm / icon.md / icon.lg トークンに対応",
          },
          {
            name: "label",
            type: "string",
            default: `"読み込み中"`,
            description: "スクリーンリーダー向けの文言。視覚的には出ない。空にしない",
          },
          classNameProp,
        ],
      },
    ],
  },
  alert: {
    name: "Alert",
    atomic: "molecule",
    demos: [
      { id: "basic", title: "基本", file: "alert/basic.tsx", Component: dynamic(() => import("../demos/alert/basic")) },
      { id: "variants", title: "バリアント", file: "alert/variants.tsx", Component: dynamic(() => import("../demos/alert/variants")) },
    ],
    api: [
      {
        name: "Alert",
        element: "div",
        props: [
          {
            name: "variant",
            type: `"default" | "success" | "danger" | "warning" | "info"`,
            default: `"default"`,
            description: "Badge と同じ subtle-bg + border + solid の組み合わせ",
          },
          {
            name: "role",
            type: "string",
            description: `自動では付けない。操作の結果として現れたものにだけ role="alert" を付ける`,
          },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "AlertTitle", element: "p", description: "1行の見出し。text.primary" },
      { name: "AlertDescription", element: "div", description: "本文。任意。Title だけでも成立する" },
    ],
  },
  "empty-state": {
    name: "EmptyState",
    atomic: "molecule",
    demos: [
      { id: "basic", title: "基本", file: "empty-state/basic.tsx", Component: dynamic(() => import("../demos/empty-state/basic")) },
    ],
    api: [
      {
        name: "EmptyState",
        element: "div",
        props: [classNameProp],
      },
    ],
    subcomponents: [
      { name: "EmptyStateMedia", element: "div", description: "アイコン/イラストの置き場。常に aria-hidden" },
      { name: "EmptyStateTitle", element: "p", description: "「何が無いのか」を1行で" },
      { name: "EmptyStateDescription", element: "p", description: "補足。max-w-prose で行長を抑えている" },
      { name: "EmptyStateActions", element: "div", description: "次にとれる行動。置くものが無いならEmptyStateではない" },
    ],
  },
} as const satisfies Record<string, RegistryEntry>;

export type ComponentSlug = keyof typeof registry;

export function getSlugs(): ComponentSlug[] {
  return Object.keys(registry) as ComponentSlug[];
}
