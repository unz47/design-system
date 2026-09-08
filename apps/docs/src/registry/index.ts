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
} as const satisfies Record<string, RegistryEntry>;

export type ComponentSlug = keyof typeof registry;

export function getSlugs(): ComponentSlug[] {
  return Object.keys(registry) as ComponentSlug[];
}
