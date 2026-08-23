---
name: component-authoring
description: Aurora design system — how to author a component in packages/ui (established with Button/Card/Badge in Phase 2)
---

# コンポーネントの標準形

`packages/ui/src/components/<name>/` に3ファイル:

```
button/
├── button.variants.ts   # cva定義のみ。React非依存 → RSCからも import できる
├── button.tsx           # "use client"(インタラクションがあれば)。ref forward + props spread
└── index.ts             # named export
```

`*.variants.ts` をReact非依存に分離するのは、`buttonVariants` だけをServer Componentから使えるようにするため。

## 規律

1. **クラス文字列に生値を書かない**(`#7DF9C4`, `p-[13px]`)。トークン由来のユーティリティか、`--aurora-*` 変数を参照する`[var(--aurora-...)]`のarbitrary valueのみ使う。arbitrary valueを書きたくなったらトークン不足のサイン。
2. **`cn()` = `twMerge(clsx(...))`**。`className` は必ず最後にマージし、消費者が上書きできるようにする。
3. **variant名はsemantic**(`primary`/`danger`)であって色名(`mint`/`violet`)ではない。
4. Base UIコンポーネント(Menu.Trigger等)から自作コンポーネントを差し込む場合は `render` prop を使う(RadixのasChild相当は存在しない)。自作コンポーネント自身は「refをforwardし、受け取ったpropsをDOMノードにそのまま展開する」ことだけ保証すればよい。

## Tailwindユーティリティが自動生成されないトークンに注意

`packages/tokens` の `@theme inline` ブリッジは `color` / `space` / `radius` / `text`(font-sizeのみ)/ `motion.easing` にしか対応していない。以下は名前付きTailwindユーティリティが**生成されない**ため、`[var(--aurora-...)]` のarbitrary value構文で直接参照すること:

- `control.height.*`(control-height-sm等) → `h-[var(--aurora-control-height-md)]`
- `motion.duration.*` → `duration-[var(--aurora-motion-duration-fast)]`
- `opacity.*` → `opacity-[var(--aurora-opacity-disabled)]`
- typographyの `weight`/`line-height`/`tracking`/`family`(`size`だけは`--text-*`経由で使える可能性があるが未検証。現状はTailwind標準の`text-sm`/`font-medium`等で近似している)

新しいコンポーネントでこれ以外の「効かないはずのユーティリティ」を見つけたら、このリストに追記する。

## 実例

`src/components/button/`, `src/components/card/`, `src/components/badge/` を参照。
