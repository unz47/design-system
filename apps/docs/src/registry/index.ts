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
  /** Rendered verbatim. For `source: "cva"` (the default) union literals here are
   *  checked against the component's *.variants.ts by
   *  registry/__tests__/coverage.test.ts, so keep them exact. */
  type: string;
  default?: string;
  description: string;
  /** Where the prop comes from. "cva" (default) = ours, and the only kind the
   *  drift check applies to — Base UI / native props are already guaranteed by
   *  the props type extending theirs, so a text match would add nothing. */
  source?: "cva" | "base-ui" | "native";
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
            source: "native",
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
            source: "native",
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
  label: {
    name: "Label",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "label/basic.tsx", Component: dynamic(() => import("../demos/label/basic")) }],
    api: [{ name: "Label", element: "label", props: [classNameProp] }],
  },
  separator: {
    name: "Separator",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "separator/basic.tsx", Component: dynamic(() => import("../demos/separator/basic")) }],
    api: [
      {
        name: "Separator",
        element: "div",
        props: [
          {
            source: "base-ui",
            name: "orientation",
            type: `"horizontal" | "vertical"`,
            description: "縦向きは親の高さを受けて伸びる。高さのある行の中で使う",
          },
          classNameProp,
        ],
      },
    ],
  },
  checkbox: {
    name: "Checkbox",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "checkbox/basic.tsx", Component: dynamic(() => import("../demos/checkbox/basic")) }],
    api: [
      {
        name: "Checkbox",
        element: "button",
        props: [
          { source: "base-ui", name: "checked / defaultChecked", type: "boolean", description: "制御 / 非制御。Base UI が内部で input を描画する" },
          { source: "base-ui", name: "indeterminate", type: "boolean", description: "「一部だけ選択」の第3状態" },
          { source: "base-ui", name: "onCheckedChange", type: "(checked: boolean) => void", description: "変更通知" },
          classNameProp,
        ],
      },
    ],
  },
  switch: {
    name: "Switch",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "switch/basic.tsx", Component: dynamic(() => import("../demos/switch/basic")) }],
    api: [
      {
        name: "Switch",
        element: "button",
        props: [
          { source: "base-ui", name: "checked / defaultChecked", type: "boolean", description: "制御 / 非制御" },
          { source: "base-ui", name: "onCheckedChange", type: "(checked: boolean) => void", description: "変更通知" },
          { name: "thumbClassName", type: "string", description: "つまみ側に当てる。className はトラックが受ける" },
          classNameProp,
        ],
      },
    ],
  },
  slider: {
    name: "Slider",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "slider/basic.tsx", Component: dynamic(() => import("../demos/slider/basic")) }],
    api: [
      {
        name: "Slider",
        element: "div",
        props: [
          { source: "base-ui", name: "value / defaultValue", type: "number | number[]", description: "配列を渡すと範囲スライダーになり、つまみが値の数だけ増える" },
          { source: "base-ui", name: "min / max / step", type: "number", description: "既定は 0 / 100 / 1" },
          classNameProp,
        ],
      },
    ],
  },
  progress: {
    name: "Progress",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "progress/basic.tsx", Component: dynamic(() => import("../demos/progress/basic")) }],
    api: [
      {
        name: "Progress",
        element: "div",
        props: [
          { source: "base-ui", name: "value", type: "number | null", description: "必須。null を渡すと不確定(indeterminate)になる — 省略はできない" },
          { source: "base-ui", name: "max", type: "number", description: "既定は 100" },
          classNameProp,
        ],
      },
    ],
  },
  avatar: {
    name: "Avatar",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "avatar/basic.tsx", Component: dynamic(() => import("../demos/avatar/basic")) }],
    api: [
      {
        name: "Avatar",
        element: "span",
        props: [
          { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "32 / 40 / 48px" },
          { name: "src", type: "string", description: "省略すると最初から fallback だけを描画する" },
          { name: "fallback", type: "ReactNode", description: "画像が無い/読めないときの中身。イニシャル2文字程度" },
          classNameProp,
        ],
      },
    ],
  },
  "aspect-ratio": {
    name: "AspectRatio",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "aspect-ratio/basic.tsx", Component: dynamic(() => import("../demos/aspect-ratio/basic")) }],
    api: [
      {
        name: "AspectRatio",
        element: "div",
        props: [
          { name: "ratio", type: "number", default: "1", description: "16 / 9 のように式で書く。子には size-full と object-cover が当たる" },
          classNameProp,
        ],
      },
    ],
  },
  toggle: {
    name: "Toggle",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "toggle/basic.tsx", Component: dynamic(() => import("../demos/toggle/basic")) }],
    api: [
      {
        name: "Toggle",
        element: "button",
        props: [
          { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Button と同じ control.height" },
          { source: "base-ui", name: "pressed / defaultPressed", type: "boolean", description: "押下状態。Base UI が aria-pressed も出す" },
          { source: "base-ui", name: "value", type: "string", description: "ToggleGroup の中で使うときの識別子" },
          classNameProp,
        ],
      },
    ],
  },
  "scroll-area": {
    name: "ScrollArea",
    atomic: "atom",
    demos: [{ id: "basic", title: "基本", file: "scroll-area/basic.tsx", Component: dynamic(() => import("../demos/scroll-area/basic")) }],
    api: [
      {
        name: "ScrollArea",
        element: "div",
        props: [
          { name: "horizontal", type: "boolean", description: "横スクロールバーも出す。既定は縦のみ" },
          classNameProp,
        ],
      },
    ],
  },
  "radio-group": {
    name: "RadioGroup",
    atomic: "molecule",
    demos: [{ id: "basic", title: "基本", file: "radio-group/basic.tsx", Component: dynamic(() => import("../demos/radio-group/basic")) }],
    api: [
      {
        name: "RadioGroup",
        element: "div",
        props: [
          { source: "base-ui", name: "value / defaultValue", type: "string", description: "選択中の Radio の value" },
          { source: "base-ui", name: "onValueChange", type: "(value: string) => void", description: "変更通知" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "Radio", element: "button", description: "選択肢1つ。value 必須。Label と htmlFor で結ぶ" },
    ],
  },
  "toggle-group": {
    name: "ToggleGroup",
    atomic: "molecule",
    demos: [{ id: "basic", title: "基本", file: "toggle-group/basic.tsx", Component: dynamic(() => import("../demos/toggle-group/basic")) }],
    api: [
      {
        name: "ToggleGroup",
        element: "div",
        props: [
          { source: "base-ui", name: "value / defaultValue", type: "string[]", description: "押下中の Toggle の value の配列" },
          { source: "base-ui", name: "toggleMultiple", type: "boolean", description: "false にすると排他選択になる" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "Toggle", element: "button", description: "atoms/toggle をそのまま並べる。Group 用に変える点は無い" },
    ],
  },
  dialog: {
    name: "Dialog",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "dialog/basic.tsx", Component: dynamic(() => import("../demos/dialog/basic")) },
    ],
    api: [
      {
        name: "DialogContent",
        element: "div",
        props: [
          { source: "base-ui", name: "open / defaultOpen", type: "boolean", description: "Dialog(Root)に渡す。制御 / 非制御" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "DialogTrigger", element: "button", description: "render prop で自作Buttonを差し込む" },
      { name: "DialogTitle", element: "h2", description: "Base UI が aria-labelledby を自動で結ぶ" },
      { name: "DialogDescription", element: "p", description: "aria-describedby も自動" },
      { name: "DialogClose", element: "button", description: "閉じるボタン。render prop 可" },
    ],
  },
  "alert-dialog": {
    name: "AlertDialog",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "alert-dialog/basic.tsx", Component: dynamic(() => import("../demos/alert-dialog/basic")) },
    ],
    api: [
      {
        name: "AlertDialogContent",
        element: "div",
        props: [
          { source: "base-ui", name: "open / defaultOpen", type: "boolean", description: "AlertDialog(Root)に渡す" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "AlertDialogTitle", element: "h2", description: "「本当に〜しますか?」" },
      { name: "AlertDialogDescription", element: "p", description: "取り返しがつかない点を書く" },
      { name: "AlertDialogActions", element: "div", description: "キャンセル / 実行を右寄せで並べる行" },
      { name: "AlertDialogClose", element: "button", description: "背景クリックとEscapeで閉じないので、必ず置く" },
    ],
  },
  sheet: {
    name: "Sheet",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "sheet/basic.tsx", Component: dynamic(() => import("../demos/sheet/basic")) },
    ],
    api: [
      {
        name: "Sheet",
        element: "div",
        props: [
          { name: "side", type: `"right" | "left" | "top" | "bottom"`, default: `"right"`, description: "出る辺とスワイプで閉じる向きの両方を決める" },
          { source: "base-ui", name: "open / defaultOpen", type: "boolean", description: "制御 / 非制御" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "SheetContent", element: "div", description: "Portal + Backdrop + Popup を畳んだもの" },
      { name: "SheetHeader", element: "div", description: "固定。スクロールしない" },
      { name: "SheetBody", element: "div", description: "ここだけが縦スクロールする" },
      { name: "SheetTitle", element: "h2", description: "見出し" },
      { name: "SheetDescription", element: "p", description: "補足" },
    ],
  },
  popover: {
    name: "Popover",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "popover/basic.tsx", Component: dynamic(() => import("../demos/popover/basic")) },
    ],
    api: [
      {
        name: "PopoverContent",
        element: "div",
        props: [
          { source: "base-ui", name: "side / align / sideOffset", type: `"top" | "right" | "bottom" | "left"` + " ほか", description: "Positioner にそのまま流す配置指定" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "PopoverTrigger", element: "button", description: "クリックで開く。render prop 可" },
      { name: "PopoverTitle", element: "h2", description: "任意" },
      { name: "PopoverDescription", element: "p", description: "任意" },
      { name: "PopoverClose", element: "button", description: "任意" },
    ],
  },
  tooltip: {
    name: "Tooltip",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "tooltip/basic.tsx", Component: dynamic(() => import("../demos/tooltip/basic")) },
    ],
    api: [
      {
        name: "TooltipContent",
        element: "div",
        props: [
          { source: "base-ui", name: "side / align / sideOffset", type: `"top" | "right" | "bottom" | "left"` + " ほか", description: "Positioner にそのまま流す配置指定" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "TooltipProvider", element: "—", description: "アプリのルートに1つ。遅延を共有する" },
      { name: "TooltipTrigger", element: "button", description: "ホバー/フォーカスで開く" },
    ],
  },
  menu: {
    name: "Menu",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "menu/basic.tsx", Component: dynamic(() => import("../demos/menu/basic")) },
    ],
    api: [
      {
        name: "MenuContent",
        element: "div",
        props: [
          { source: "base-ui", name: "side / align / sideOffset", type: `"top" | "right" | "bottom" | "left"` + " ほか", description: "Positioner にそのまま流す配置指定" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "MenuTrigger", element: "button", description: "render prop 可" },
      { name: "MenuItem", element: "div", description: "data-highlighted はホバーでもキーボードでも付く" },
      { name: "MenuGroup", element: "div", description: "GroupLabel と項目をまとめる" },
      { name: "MenuGroupLabel", element: "div", description: "グループ見出し" },
      { name: "MenuSeparator", element: "div", description: "区切り線" },
      { name: "MenuSubmenu / MenuSubmenuTrigger", element: "div", description: "入れ子メニュー" },
    ],
  },
  "context-menu": {
    name: "ContextMenu",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "context-menu/basic.tsx", Component: dynamic(() => import("../demos/context-menu/basic")) },
    ],
    api: [
      {
        name: "ContextMenuContent",
        element: "div",
        props: [
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "ContextMenuTrigger", element: "div", description: "右クリックを受ける領域そのもの。className で範囲を持たせる" },
      { name: "ContextMenuItem", element: "div", description: "Menu と同じ見た目" },
      { name: "ContextMenuSeparator", element: "div", description: "区切り線" },
    ],
  },
  select: {
    name: "Select",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "select/basic.tsx", Component: dynamic(() => import("../demos/select/basic")) },
    ],
    api: [
      {
        name: "Select",
        element: "div",
        props: [
          { source: "base-ui", name: "value / defaultValue", type: "unknown", description: "選択中の値" },
          { source: "base-ui", name: "items", type: "Record<string, ReactNode>", description: "値 → 表示名の対応。渡さないとトリガに生の値が出る" },
          { source: "base-ui", name: "onValueChange", type: "(value) => void", description: "変更通知" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "SelectTrigger", element: "button", description: "Input と同じ高さ・枠線。矢印アイコンは内蔵" },
      { name: "SelectValue", element: "span", description: "選択中の表示" },
      { name: "SelectContent", element: "div", description: "リスト。最小幅が --anchor-width でトリガに揃う" },
      { name: "SelectItem", element: "div", description: "value 必須。選択中はチェックが出る" },
    ],
  },
  accordion: {
    name: "Accordion",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "accordion/basic.tsx", Component: dynamic(() => import("../demos/accordion/basic")) },
    ],
    api: [
      {
        name: "Accordion",
        element: "div",
        props: [
          { source: "base-ui", name: "openMultiple", type: "boolean", description: "複数同時に開けるか" },
          { source: "base-ui", name: "value / defaultValue", type: "unknown[]", description: "開いている Item" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "AccordionItem", element: "div", description: "1項目" },
      { name: "AccordionTrigger", element: "button", description: "中で Accordion.Header(h3)を描く" },
      { name: "AccordionPanel", element: "div", description: "--accordion-panel-height へ height を補間する" },
    ],
  },
  tabs: {
    name: "Tabs",
    atomic: "organism",
    demos: [
      { id: "basic", title: "基本", file: "tabs/basic.tsx", Component: dynamic(() => import("../demos/tabs/basic")) },
    ],
    api: [
      {
        name: "Tabs",
        element: "div",
        props: [
          { source: "base-ui", name: "value / defaultValue", type: "unknown", description: "選択中のタブ" },
          { source: "base-ui", name: "orientation", type: `"horizontal" | "vertical"`, description: "キーボード移動の向きも変わる" },
          classNameProp,
        ],
      },
    ],
    subcomponents: [
      { name: "TabsList", element: "div", description: "タブの並び" },
      { name: "TabsTab", element: "button", description: "value 必須。選択中は border-b が accent になる" },
      { name: "TabsPanel", element: "div", description: "value が一致するものが表示される" },
    ],
  },
} as const satisfies Record<string, RegistryEntry>;

export type ComponentSlug = keyof typeof registry;

export function getSlugs(): ComponentSlug[] {
  return Object.keys(registry) as ComponentSlug[];
}
