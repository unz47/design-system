---
name: component-authoring
description: Aurora design system — how to author a component in packages/react (established with Button/Card/Badge in Phase 2)
---

# コンポーネントの標準形

`packages/react/src/components/<atomic>/<name>/` に3ファイル。`<atomic>` は `atoms` / `molecules` / `organisms` で、どれに属するかは `PROJECT_PLAN.md` の対応表で決める:

```
atoms/button/
├── button.variants.ts   # cva定義のみ。React非依存 → RSCからも import できる
├── button.tsx           # "use client"(インタラクションがあれば)。ref forward + props spread
└── index.ts             # named export
```

`*.variants.ts` をReact非依存に分離するのは、`buttonVariants` だけをServer Componentから使えるようにするため。

**フックもイベントハンドラも持たないなら `"use client"` は付けない。** propsをDOMに展開するだけのコンポーネント(Input/Alert/Skeleton等)はServer Componentからも使えるほうが良い。`onChange`を渡す側のファイルがclientになるだけで足りる。

最後に3箇所を必ず更新する。忘れると `apps/docs` の coverage テストが落ちる:

1. `packages/react/src/index.ts` のbarrel(階層ごとにアルファベット順)
2. `apps/docs/src/registry/index.ts`(demo + `api` 表。`api` は `*.variants.ts` と照合される)
3. `apps/docs/content/components/<slug>.mdx` と `apps/docs/src/demos/<slug>/*.tsx`、`(docs)/components/[slug]/page.tsx` の `content` 対応表

## 規律

1. **クラス文字列に生値を書かない**(`#7DF9C4`, `p-[13px]`)。トークン由来のユーティリティか、`--aurora-*` 変数を参照する`[var(--aurora-...)]`のarbitrary valueのみ使う。arbitrary valueを書きたくなったらトークン不足のサイン。
2. **`cn()` = `twMerge(clsx(...))`**。`className` は必ず最後にマージし、消費者が上書きできるようにする。
3. **variant名はsemantic**(`primary`/`danger`)であって色名(`mint`/`violet`)ではない。
4. Base UIコンポーネント(Menu.Trigger等)から自作コンポーネントを差し込む場合は `render` prop を使う(RadixのasChild相当は存在しない)。自作コンポーネント自身は「refをforwardし、受け取ったpropsをDOMノードにそのまま展開する」ことだけ保証すればよい。

## Tailwindユーティリティが自動生成されないトークンに注意

`packages/tokens` の `@theme inline` ブリッジは `color` / `space` / `radius` / `text`(font-sizeのみ)/ `shadow` / `motion.easing` にしか対応していない。以下は名前付きTailwindユーティリティが**生成されない**ため、`[var(--aurora-...)]` のarbitrary value構文で直接参照すること:

- `control.height.*`(control-height-sm等) → `h-[var(--aurora-control-height-md)]`
- `control.field-padding-x` → `px-[var(--aurora-control-field-padding-x)]`
- `icon.*` → `size-[var(--aurora-icon-md)]`
- `motion.duration.*` → `duration-[var(--aurora-motion-duration-fast)]`
- `opacity.*` → `opacity-[var(--aurora-opacity-disabled)]`
- typographyの `weight`/`line-height`/`tracking`/`family`(`size`だけは`--text-*`経由で使える可能性があるが未検証。現状はTailwind標準の`text-sm`/`font-medium`等で近似している)

新しいコンポーネントでこれ以外の「効かないはずのユーティリティ」を見つけたら、このリストに追記する。

逆に、**影は `shadow-elevation-1` / `shadow-elevation-2` / `shadow-elevation-3` / `shadow-accent-glow` という名前付きユーティリティで書く**(2026-09-08にブリッジ追加)。`shadow-[var(--aurora-shadow-...)]` と書く必要はない。影の値はdark/lightで別物なので、生の`box-shadow`を手書きすると必ずどちらかのテーマで壊れる。

`container.*` は `--container-*` にブリッジ済みなので `max-w-content` / `max-w-prose` がそのまま使える。

## Phase 4で決まった作法

- **状態は prop ではなく ARIA 属性で表す。** `invalid` prop は作らず `aria-invalid:` variant で見た目を変える(Input/Textarea)。支援技術に伝わる状態と見た目が必ず一致する
- **`role` を勝手に付けない。** Alert に `role="alert"` を自動で付けると、ページを開くたびに読み上げが割り込む。付けるかどうかは消費者が決める
- **アニメーションには必ず `motion-reduce:animate-none` を添える。** Tailwind の `animate-pulse` / `animate-spin` は `prefers-reduced-motion` を自動では見ない
- **装飾要素は `aria-hidden` を実装側で固定する**(Skeleton、EmptyStateMedia)。意味は必ずテキスト側で伝える
- **ネイティブ属性と variant 名が衝突したら `Omit` で外す。** `<input size>`(文字数)と cva の `size` など

## Base UI を使うコンポーネント(Tier 2以降)

- **合成形は畳めるものは畳む。** Switch(Root+Thumb)や Checkbox(Root+Indicator)のように、内側を差し替える要求が実際には出ないものは1コンポーネントにまとめる。逆に、選択肢を消費者が並べる RadioGroup / ToggleGroup は合成形のまま残す
- **状態は Base UI の data-* 属性を Tailwind の `data-*` variant で受ける**(`data-checked:` / `data-pressed:` / `data-[orientation=vertical]:` / `data-dragging:`)。JSで状態クラスを組み立てない
- **props型は Base UI の型を継承する**(`extends BaseSwitch.Root.Props`)。cvaのvariantだけ足す
- **畳んだぶんの面倒はこちらで見る。** 例: Slider は Thumb を自動で増やさないので、`value`/`defaultValue` の長さぶん `<Slider.Thumb index={n} />` を並べるのはラッパー側の責任
- **Base UI に無いものは無理に探さない。** Label(`Field.Label` は `Field.Root` 必須)や AspectRatio(CSSで足りる)は自前実装でよい
- API表(`apps/docs/src/registry`)では Base UI 由来の prop に `source: "base-ui"` を付ける。cva由来のものだけがドリフト検査の対象になる

## オーバーレイ系(Tier 3)

- **面は `lib/overlay.ts` に1本化してある。** `overlaySurface` / `overlayBackdrop` / `overlayTransition` / `overlayItem` を組み合わせる。同じ「浮いている面」を7箇所に書き写すとテーマ変更のたびにズレる
- **Portal + (Positioner +) Popup は `*Content` に畳む。** 配置指定(`side` / `align` / `sideOffset`)だけを表に出して Positioner へ流す
- **開閉アニメーションはCSSトランジション。** Base UI が `data-starting-style` / `data-ending-style` を付ける間だけ透明・縮小にする。JSでアニメーションを回さないので `motion-reduce:transition-none` 一行で reduced-motion に対応できる
- `Drawer`(Sheet の土台)は **`Drawer.Viewport` で Popup を包まないと** スワイプで閉じる挙動とタッチのスクロールロックが効かない
- `Select` は **Root に `items`(値→ラベル)を渡さないとトリガに生の値が出る**。`SelectItem` の子に書いたラベルは `SelectValue` には伝わらない

### Tier 4 で分かったこと

- `Toast.Viewport` を `Toast.Portal` で包むと**トーストが1つも描画されない**(エラーも警告も出ない)。Viewport は Provider の直下にそのまま置く
- **確かめていないCSS変数名に乗らない。** Base UI が出す `--toast-index` のような変数を推測で使い、無効な `calc()` になって要素が見えなくなった。まず崩れない形で作り、変数名を実物で確認してから演出を足す

### 落とし穴: 不透明度トークンを色のアルファに使わない

`bg-bg-base/[var(--aurora-opacity-backdrop)]` は**動かない**。Tailwind の不透明度修飾子は `color-mix()` に展開されるが、トークンの値が単位なしの `0.72` なので color-mix が解決に失敗し、**エラーも出ないまま完全に透明**になる。要素の不透明度として当てること:

```
✗ bg-bg-base/[var(--aurora-opacity-backdrop)]
○ bg-bg-base opacity-[var(--aurora-opacity-backdrop)]
```

## 実例

`src/components/atoms/button/`(variant + size)、`src/components/atoms/input/`(ARIA連動 + 属性衝突)、`src/components/molecules/card/`(サブコンポーネント分割)を参照。
