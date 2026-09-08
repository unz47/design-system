# Aurora Design System — PROJECT_PLAN

このドキュメントが本プロジェクトの唯一の仕様源(single source of truth)。実装は自分の手で行う。各フェーズの完了条件を満たしたらチェックを入れて次に進む。

## Context

新しいアプリを作るたびに配色・タイポ・コンポーネントの見た目を毎回ゼロから決め直している(「デザインガチャ」)。これを一度で終わらせるため、自分専用のデザインシステムを作る。狙いは3つ同時:

1. **実用** — 自分のWebアプリ / Expoアプリで実際に使うトークン + コンポーネント
2. **Figma** — 同じトークンを反映したFigmaライブラリ
3. **ポートフォリオ** — ドキュメントサイト自体を作品として公開する

リポジトリ: `github.com/unz47/design-system`(public)、`~/ghq/github.com/unz47/design-system`

## 確定済みの決定事項

| 項目 | 決定 |
|---|---|
| Webスタック | Next.js App Router |
| ドキュメント | 自作サイト(Storybook不採用 — ポートフォリオとして見せるため) |
| デザイン方針 | 「真冬の銀の魔女の庭(雪原)」= Frost / Silver。コンポーネント自体はミニマル、ヒーロー/背景でThree.js・シェーダーを使う。当初の「生成アート寄り2色グラデーション」から変更(理由は下記テーマ節) |
| パレット | bg `#0A0C14` / text `#EEF2F7` / accent(frost) `#9BDCF0` / accent-alt(plum、稀にのみ使用) `#6B4C7A`。ダーク基調、彩度を抑えた銀のニュートラルが主役 |
| v1スコープ | フルセット(20個以上) |
| ヘッドレスUI | **Base UI**(`@base-ui/react`)。Radixは不採用 |
| フォント | **Geist Sans + Geist Mono**(Vercel製) |
| 角丸 | 役割ベース3段階: control 8px / surface 12px / overlay 16px + full 9999px |
| エフェクト | metallic(銀の合金風グラデーション) / frost(霜ガラス、backdrop-filter) / glow(発光) / grain(粒状ノイズ)を`effect.*`トークンとして管理。シェーダー(GLSL)とは分離(`TOKENS.md`参照) |
| トークン詳細仕様 | 数値は全て [`TOKENS.md`](./TOKENS.md) に集約(色・タイポ・余白・角丸・shadow・motion・z-index・icon・opacity・breakpoints・effect) |
| トークンの正 | コード(Git)。DTCG形式JSON → Style Dictionary → 各プラットフォーム。Figmaは生成物 |
| RN展開 | コンポーネントもRN版を作る(トークン共有だけで終わらせない) |
| デプロイ | 未定 — Phase 6で判断 |

## 環境

Node `v24.16.0` / pnpm `10.30.1` / npmスコープ `@frost-ui`(2026-08-30変更、詳細は11章) / `gh` 認証済み(unz47)

## 既存21リポから引き継ぐ規約

- pnpm固定、Turborepo v2(`tasks` schema)、`packages/*` + `apps/*`
- Next 16 / React 19 / TS strict / Tailwind v4 CSS-first
- モバイルは Expo + NativeWind v4 + Tailwind 3.4(`nekase`, `expense-tracker/mobile`, `Recipe-Book/mobile` が参考実装)
- shadcn/ui + cva + clsx + tailwind-merge + lucide-react(既存リポはRadix、本プロジェクトはBase UIに変更 — 下記参照)
- ESLint 9 flat config、Prettier/Biomeなし。`"verify": "tsc --noEmit && eslint"` が完了ゲート
- ドキュメントは日本語。`CLAUDE.md` + `PROJECT_PLAN.md` + `.claude/skills/*/SKILL.md`

### なぜRadixではなくBase UIか(2026-08-22決定)

既存21リポ(`expense-tracker`など)はRadix UIを使っているが、本プロジェクトは**意図的にBase UIを選ぶ**。理由:

1. **shadcn/uiが2026年7月にデフォルトプリミティブをRadixからBase UIに切り替えた。** Base UIはMUIチーム(中身は元Radixの開発者)が作った後継で、2025年12月に安定版v1.0。
2. **Tier 4の最大リスク(Combobox/multi-select)が解消する。** RadixはWorkOS買収後、複雑系コンポーネントの更新が鈍化しているが、Base UIはCombobox/multi-selectをネイティブ実装している。
3. **AIコーディングツールとの相性。** v0.dev/Cursor/Claude Code/Lovable/BoltはいずれもshadcnUI形式(プレーンなTSXファイルとしてリポジトリに存在)をデフォルト出力にしており、この流れはBase UI移行後も続く。`packages/react`をソース配布(tsupでバンドルしない)方針にしているのと相性が良い。Base UI自体も公式`llms.txt`とコミュニティMCPサーバーを持ち、AI支援での実装がしやすい。

**API上の違い(実装時に注意)**: RadixはSlot + `asChild` prop で合成するが、Base UIは **`render` prop**(要素またはレンダー関数を渡す)で合成する。`asChild`もSlotコンポーネントも存在しない。

```tsx
// Base UIの合成パターン(RadixのasChildに相当)
<Menu.Trigger render={<MyButton size="md" />}>Open menu</Menu.Trigger>

// 状態を使う場合はレンダー関数
<Switch.Thumb render={(props, state) => <span {...props}>{state.checked ? "on" : "off"}</span>} />
```

パッケージは単一(`@base-ui/react`)で、コンポーネントごとにサブパス importする: `import { Popover } from "@base-ui/react/popover"`。各コンポーネントは `.Root` / `.Trigger` / `.Portal` / `.Popup` のようなドット記法のサブパーツで構成される(Radixの個別コンポーネント構成と考え方は近い)。

---

## テーマ: Aurora — 「Frost / Silver Witch's Garden」

CSS変数プレフィクス `--aurora-*`。

### なぜ配色を変更したか(2026-08-22)

当初はmint(`#7DF9C4`)+ violet(`#A855F7`)の2色グラデーションを軸にしていたが、Hallmarkスキルの`anti-patterns.md`が名指しする**「The purple-gradient hero」(AI生成の最も分かりやすい特徴)にviolet(色相300-320°)が抵触する**ことが判明し変更。「真冬の銀の魔女の庭(雪原)」をイメージし、**2色グラデーションをやめてニュートラル自体を銀に寄せ、唯一の発光アクセントとして氷の水色を使う**構成にした。詳しい経緯・全パレット・primitiveランプの段階数は [`TOKENS.md`](./TOKENS.md) を参照。

```
bg.base       #0A0C14   bg.surface    #12141F   bg.raised     #1A1E2D
border.subtle #1E2230   border.default#2C3244   border.strong #454C63
text.primary  #EEF2F7   text.secondary#9CA6BC   text.muted    #5C6478
accent(frost) #9BDCF0   accent.dim    #6BB8D6   accent.glow   #D4F1FA
accent.alt(plum、稀にのみ使用、グラデーション化しない) #6B4C7A
success #7FE8B8  danger #E85D6B  warning #E8C468  info #7BC4E8
```

lightモードもv1で作る(Figma Variablesのmodeを2つ持たせるため。後付けは高コスト)。docsサイト自体はdark固定でよい。

フォント・タイポグラフィスケール・余白・角丸・border width・shadow/elevation・motion・z-index・icon size・opacity・breakpoints/container width・effectの具体的な値は [`TOKENS.md`](./TOKENS.md) を参照。色のprimitiveランプ(段階数はファミリーごとに異なる、`TOKENS.md`参照)のみ、Phase 1でスクリプト生成する方針だけ決定済みで正確な値は未確定。

---

## 1. モノレポ構成

```
design-system/
├── pnpm-workspace.yaml / turbo.json / eslint.config.mjs
├── .nvmrc (24.16.0) / .changeset/
├── CLAUDE.md / AGENTS.md / PROJECT_PLAN.md / README.md
├── .claude/skills/{coding,design,token,component-authoring,figma-sync}-*/SKILL.md
├── .github/workflows/{ci,release}.yml
├── packages/
│   ├── tsconfig/          @frost-ui/tsconfig       base / react-library / next / react-native
│   ├── eslint-config/     @frost-ui/eslint-config  base / react / next
│   ├── tokens/            @frost-ui/tokens         ★唯一の真実の源
│   ├── react/             @frost-ui/react          Web React(ソース配布)
│   └── react-native/      @frost-ui/react-native   Expo / RN
└── apps/
    └── docs/              Next.js App Router
```

---

## 2. トークン (`packages/tokens`)

`style-dictionary@^5`(ESM、DTCG `$value`/`$type` ネイティブ対応)。

### 3層モデル

```
primitive  color.frost.400 = #9BDCF0       値そのもの
    ↓
semantic   color.accent.default            役割。dark/lightで参照先が変わる
    ↓
component  button.primary.bg               コンポーネント固有
```

- `src/primitive/{color,dimension,radius,typography,motion,shadow,zIndex}.json`
- `src/semantic/{color.dark,color.light,space,radius,text,elevation,motion}.json`
- `src/component/{button,input,card,overlay,table}.json`

dark/lightは同じトークンパスで別ファイルに持ち、Style Dictionaryをテーマごとに2回走らせて1ファイルに合成する。Tokens Studioの `$extensions` には依存しない。

各JSONに入れる実際の値(フォント・タイポスケール・space・radius・border width・shadow・motion・z-index・icon size・opacity・breakpoints)は [`TOKENS.md`](./TOKENS.md) を参照。色のprimitiveランプのみ未確定(生成方法は`TOKENS.md`に記載)。

### 命名は Tailwind v4 の名前空間に従属させる

v4は `--color-*` / `--spacing-*` / `--radius-*` / `--text-*` / `--shadow-*` / `--ease-*` しかthemeとして認識しない。`space.*`→`--spacing-*`、`text.*.size`→`--text-*`、`elevation.*`→`--shadow-*` にマップする。`z.*` は名前空間が無いので `@utility z-modal {...}` を手書き。

### 出力(`dist/`、gitにcommitする)

| 出力 | 用途 |
|---|---|
| `css/variables.css` | 生の値。`:root`(dark) + `[data-theme="light"]` |
| `css/theme.css` | `@theme inline` でTailwindに橋渡し |
| `native/preset.js` | NativeWind用 TW3 preset |
| `native/global.css` | RN用。チャンネル3値の `:root` / `.dark` |
| `js/index.ts` + `.d.ts` | `StyleSheet` / `react-native-svg` 用のTSオブジェクト |
| `figma/variables.json` | Figma Plugin API用ペイロード |
| `shiki/aurora.json` | docsのコードブロック用テーマ |

**`@theme` ではなく `@theme inline` が必須。** 素の `@theme` は宣言時点で値を `:root` にコピーするため、`[data-theme="light"]` で `--aurora-*` を書き換えてもユーティリティが追従しない。2モード持つ設計システムでは `inline` でないとテーマ切替が成立しない。

Web側はTW v4が `color-mix()` で不透明度を処理するのでhexのままでよい。**RN側(TW 3.4)は `<alpha-value>` プレースホルダのためチャンネル3値が必須** — ここが分岐点。`expense-tracker/mobile/tailwind.config.js` の `rgb(var(--color-x) / <alpha-value>)` パターンをそのまま自動生成する。

### 自作が必要なもの

**transform 5個**: `color/rgb-channels`(hex→`"11 13 16"`) / `color/figma-rgba`(→0-1 RGBA) / `name/aurora-css` / `name/tw-namespace` / `name/figma-slash`
**format 5個**: `tailwind/v4-theme` / `tailwind/v3-preset` / `css/vars-multi-theme` / `css/vars-channels` / `figma/variables`

### `exports`

```json
{ ".": "./dist/js/index.js", "./theme.css": "...", "./variables.css": "...",
  "./native/preset": "...", "./native/global.css": "...", "./figma": "..." }
```

---

## 3. Webコンポーネント (`packages/react`)

### ビルド戦略: tsupを使わず、TSソースをそのまま配布する

```json
{ "exports": { ".": "./src/index.ts", "./*": "./src/components/*/index.ts",
               "./styles.css": "./src/styles/ui.css" },
  "files": ["src"] }
```
消費側は `transpilePackages: ["@frost-ui/react"]` + `@source "../../node_modules/@frost-ui/react/src"`。

理由: (1) `"use client"` の保全が無料になる — esbuildはバンドル時にディレクティブを落とす事故が典型的で、Base UI系は全てclientなので事故率が高い。(2) 消費者が自分のNextアプリだけ。(3) Tailwindのクラス検出がソース走査で単純。(4) turboの依存グラフが `tokens#build` だけになる。

トレードオフ: Next以外(素のVite)から使うには設定が要る。外部公開需要が出たらtsupを足す。

### 1コンポーネントの標準形

```
button/
├── button.variants.ts   # cva定義のみ。React非依存 → RSCからも import できる
├── button.tsx           # "use client"。Base UIのrender propで合成対応。React 19なのでforwardRef不要
└── index.ts
```

`*.variants.ts` をReact非依存に分離するのは、`buttonVariants` だけをServer Componentから使えるようにするため。最初から徹底する。

Base UIコンポーネント(Menu.Trigger, Dialog.Trigger等)から `Button` を差し込む場合は `render` prop を使う。RadixのSlot/asChildに相当するものはBase UIには無いので、`Button` 自身が「refをforwardし、受け取ったpropsをDOMノードにそのまま展開する」ことだけ保証すればよい:

```tsx
// 消費側: Menu.Trigger に自作Buttonを差し込む
<Menu.Trigger render={<Button variant="secondary" />}>開く</Menu.Trigger>
```

規律3点(`component-authoring` skillに記載):
- クラス文字列に生値(`#9BDCF0`, `p-[13px]`)を書かない。arbitrary valueを書きたくなったらトークン不足のサイン
- `cn()` = `twMerge(clsx(...))`。`className` は必ず最後にマージ
- variant名はsemantic(`primary`/`danger`)であって色名(`mint`/`violet`)ではない

### component層トークンの線引き

CSS変数にするのは複数コンポーネントで共有される寸法だけ: `--aurora-control-height-{sm,md,lg}`(Button/Input/Selectトリガの高さを揃える)、`--aurora-overlay-radius`、`--aurora-field-padding-x`。`bg-accent hover:bg-accent-glow` のような役割割り当てはcvaに直接書く。全部を変数化すると数百個になって読めなくなる。

### コンポーネント一覧(ビルド順=Tier、Base UIへの依存度で分類)

- **Tier 0 — 基盤**: `cn()`, `VisuallyHidden`, lucideのsize/stroke規約(Base UIには`asChild`/Slotが無いため再輸出は不要)
- **Tier 1 — cvaのみ(10)**: Button / Badge / Card(6サブ) / Input / Textarea / Skeleton / Kbd / Spinner / Alert / EmptyState
- **Tier 2 — Base UI単純(11)**: Label / Separator / Checkbox / Switch / RadioGroup / Slider / Progress / Avatar / AspectRatio / Toggle+ToggleGroup / ScrollArea(すべて `@base-ui/react/*` のサブパスからimport)
- **Tier 3 — Base UIオーバーレイ(10)**: Tooltip / Accordion / Tabs / Dialog / AlertDialog / Sheet(Dialog土台) / Popover / Menu(DropdownMenu相当) / ContextMenu / Select — Base UIは `Combobox` をネイティブ提供するため、Selectの検索付き版はcmdkに頼らずCombobox一本化を検討
- **Tier 4 — 複合(工数の山)**: Toast(sonner。Base UIにもToastはあるが v1 では実績のあるsonnerを優先) / Command(cmdk) / Combobox(Base UIネイティブ。Radix前提だった「Command+Popoverの自作合成」は不要になった) / Table(TanStack Table)
- **v1.1に逃がす**: Calendar(react-day-picker) / DatePicker / Form(RHF+zod) / Pagination / Breadcrumb

**v1受け入れ = Tier 0–3(31個) + Tier 4の4つ = 35個。**

`Table` は `packages/react` には見た目プリミティブ + `useDataTable` フックまで。ソート/フィルタ付き `DataTable` は docs の `patterns/` にコピペ可能なレシピとして置く(shadcn/ui と同じ分け方)。

### Atomic Design階層(フォルダ構成、2026-08-23決定)

Tierは「Base UIへの依存度」という実装上の軸で、ビルド順を決めるためのもの。これとは別に、**フォルダ構成はAtomic Designの階層で物理的に分ける**(`packages/react/src/components/{atoms,molecules,organisms}/<name>/`)。Tierと階層は別軸なので対応表として管理する:

| Atomic階層 | 該当コンポーネント |
|---|---|
| **atoms**(それ以上分解できない単一部品) | Button, Badge, Input, Textarea, Skeleton, Kbd, Spinner, Label, Separator, Checkbox, Switch, Slider, Progress, Avatar, AspectRatio, Toggle, **ScrollArea**(2026-09-08追加。内部にscrollbar/thumbを持つが、それらは独立したatomではなく「スクロールできる領域」という単一の機能なのでatom) |
| **molecules**(atomsを組み合わせた小さな単位) | Card(6サブ), Alert, EmptyState, RadioGroup, ToggleGroup, Pagination, Breadcrumb |
| **organisms**(複数のmolecules/atomsからなる複雑な単位) | Accordion, Tabs, Dialog, AlertDialog, Sheet, Menu(DropdownMenu), ContextMenu, Select, **Tooltip**, **Popover**(2026-09-08にmoleculesから移動), Toast, Command, Combobox, Table, Calendar, DatePicker, Form |

**判断基準(2026-09-08追記)**: Base UI の **Portal / Positioner を伴う**(= DOMツリーの外に描画され、位置計算とフォーカス管理が要る)ものは organism とする。Tooltip / Popover は見た目こそ小さいが、必要な機構は Dialog と同じ。当初 molecules に置いていたのは「見た目の大きさ」で分類していたため。
| **templates/pages相当** | `packages/react`には含めない。docsサイトの `patterns/`(ログインフォーム・ダッシュボード等の組み合わせ例)がこれに相当する |

`packages/react`の`exports`はこの階層をそのままサブパスにする: `"./atoms/*"` / `"./molecules/*"` / `"./organisms/*"`(ルートの`src/index.ts`は全階層をまとめて再輸出するbarrel)。

Button/Badge → `atoms/`、Card → `molecules/` は実装済み(Phase 2)。新しいコンポーネントを追加する際は、まずこの表でどの階層に属するか判断してからフォルダを作る。判断に迷うものが出たら、この表に追記して基準を明文化する。

---

## 4. RNコンポーネント (`packages/react-native`)

Base UI(Web専用のヘッドレスライブラリ)にRN等価物は存在しない。Dialog/Popover/Menu/Select のフォーカストラップ・ポータル・a11yはRN側でゼロから書くことになる。したがって「35個を2プラットフォームに1:1移植」は追わず、RNで意味のあるものだけを、RNの作法で作る。

### A. 1:1移植する(15個) — cvaベース、ヘッドレスライブラリ不要

Button / Badge / Card / Input / Textarea / Skeleton / Spinner / Alert / EmptyState / Label / Separator / Switch / Checkbox / RadioGroup / Progress

見た目8割・振る舞い2割の層。NativeWindクラスがそのまま効くので、Web版の `*.variants.ts` を**共有できる**(cvaはプラットフォーム非依存)。

### B. RNネイティブに置き換える(6個) — 同名APIだが中身は別

| Web | RN実装 |
|---|---|
| `Dialog` / `AlertDialog` | RN `Modal` + backdrop |
| `Sheet` | `@gorhom/bottom-sheet` または `@expo/ui` |
| `Select` / `Combobox` | BottomSheet + FlatList |
| `DatePicker` | `@expo/ui` の `DateTimePicker`(OSネイティブピッカー) |
| `Tooltip` | 省略(モバイルにホバーが無い) — 代わりに `HelperText` |
| `Table` | `FlatList` + 横スクロール。`DataTable` は作らない |

### C. RN専用(3個)

`SafeAreaScaffold` / `TabBar`(expo-router連携) / `PressableRow`(設定画面の行)

**合計 約24個。** Web35個と揃わないのは意図的。

注意: NativeWind v4の `content` グロブは `node_modules` を走査しないので、消費側Expoアプリに `"../../node_modules/@frost-ui/react-native/src/**/*.tsx"` を追加する必要がある。README冒頭に明記する。

---

## 5. ドキュメントサイト (`apps/docs`)

### ルーティング

```
/                        ★ 生成アートのヒーロー。ポートフォリオの顔
/(docs)/foundations/[slug]   colors / typography / spacing / radius / elevation / motion / icons
/(docs)/components/[slug]    ★ 本体。プレビュー + コード + API表
/(docs)/patterns/[slug]      ログインフォーム / ダッシュボード / 設定画面
/(docs)/tokens               全トークンの検索可能な表
/playground                  propsパネルでvariantを触れる
/about                       設計判断・技術選定の解説 ← ポートフォリオの中身
/changelog
```

### ライブプレビュー: MDX + デモレジストリのハイブリッド

- 散文(日本語)は `content/components/button.mdx`、`@next/mdx` でビルド時コンパイル
- デモ本体は `src/demos/button/basic.tsx` の実ファイル。`src/registry/index.ts` が索引
- ソース表示はRSCで `fs.readFileSync`(`?raw` loaderやTurbopackの `rules` に依存しない)
- ハイライトは `shiki` の `codeToHast` をRSCで実行(ランタイムJSゼロ)
- デモにiframeは使わない(ポータル・フォーカストラップが壊れる)。`isolate` + `@container` でスコープ

MDXプラグインは `remark-gfm` + `rehype-slug` の2つに絞る。

### 生成アートは `apps/docs/src/art/` に閉じ込める

`packages/react` の依存に `three` が入った瞬間、消費アプリのバンドルが肥大化して設計システムとして失格になる。完全に切り離す。

- `/`(トップ)のみ `FrostField` — r3f + shaderMaterial で銀の粒子(neutralランプ)がゆっくり降る/漂うcurl-noiseフィールドに、`accent(frost) #9BDCF0` のほのかな発光を混ぜる。2色グラデーションのフローフィールドではなく「雪原に降る霜」のイメージ。`postprocessing` の Bloom を薄く。`next/dynamic` + `ssr: false` + 静的な銀グラデ画像フォールバックでLCPをブロックしない
- 各セクション見出しは `noise-veil`(Canvas2D、軽量)。threeを使わない
- `prefers-reduced-motion: reduce` で必ず静止画に落とす
- シェーダーの色は`@frost-ui/tokens`からJSでimportして使う(一方向の依存。`TOKENS.md`「エフェクトとシェーダーの境界」参照)
- バージョンは `Portfolio-Remake` を踏襲(r3f ^9.5 / drei ^10.7 / three ^0.183)

---

## 6. Figma連携

Figma Variablesの双方向同期は存在しない。REST APIの書き込みはEnterpriseのみ。**Plugin API経由の一方向push**が現実解。

```
packages/tokens/src/**/*.json  (SoT)
  → pnpm tokens → dist/figma/variables.json
  → Claude Code + figma-use / figma-generate-library skill (use_figma で Plugin API 実行)
  → Figma File "Aurora Design System"
       Collection: primitive (1 mode)
       Collection: semantic  (2 modes: Dark/Light)  ← primitive への VARIABLE_ALIAS
       Collection: component (1 mode)               ← semantic への VARIABLE_ALIAS
```

- Figma変数名は `/` 区切りなので `name/figma-slash` transform が別途要る
- 色は0–1 RGBAを要求するので `color/figma-rgba` transform
- `scopes` と `codeSyntax` を `$extensions` から拾って設定する
- 同期は idempotent: 名前一致で更新、新規のみ作成、コード側に無い変数は削除せず警告リストに出す
- CLIは作らない(Plugin APIはサンドボックス内でしか動かずCIから叩けない)。手順は `.claude/skills/figma-sync/SKILL.md` に書く
- ドリフト検知: トークンソースのSHAを `_meta/tokens-hash` 変数としてFigmaに書き込み、次回比較。「Figma上でVariablesを手編集しない」を規律として明記

---

## 7. ビルド / CI

```json
{ "tasks": {
    "build":     { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**", "!.next/cache/**"] },
    "typecheck": { "dependsOn": ["^build"] },
    "lint":      { "dependsOn": ["^build"] },
    "verify":    { "dependsOn": ["^build", "typecheck", "lint"] },
    "dev":       { "cache": false, "persistent": true, "dependsOn": ["^build"] },
    "clean":     { "cache": false } } }
```

`@frost-ui/react` と `ui-native` は `build` を持たない(ソース配布)ので、依存グラフの実質的な辺は `tokens#build` だけ。

CI(`.github/workflows/ci.yml`): `pnpm install --frozen-lockfile` → `pnpm verify` → `pnpm build` → `pnpm tokens:check`

`tokens:check` = `pnpm tokens && git diff --exit-code -- packages/tokens/dist`。`dist/` をcommitする運用にし、手編集されたら落ちるようにする。

リリース: changesets。`linked: [["@frost-ui/tokens", "@frost-ui/react", "@frost-ui/react-native"]]` でバージョンを揃える。

デプロイは未定 — Phase 6で判断。docsは実質全て静的なので `output: "export"` → S3+CloudFront(`magic-cercle` のOIDCワークフローが良いテンプレート)も、Amplify(`tech-blog` と同じ手順)も選べる。Amplifyの場合はモノレポで `appRoot` がcwdになる罠があり、コンソール側で `AMPLIFY_MONOREPO_APP_ROOT` の設定も必須。

---

## 8. フェーズ実行計画

各フェーズの完了は `pnpm verify` が緑 **かつ** 下記の受け入れ条件を満たすこと。

### Phase 0 — 足場
- [x] `pnpm-workspace.yaml` / `turbo.json` / `tsconfig.base.json`(2026-08-31、`packages/tsconfig/base.json`に統合し削除。理由は下記「実装メモ」) / `eslint.config.mjs` / `.nvmrc` / `.gitignore`
- [x] `packages/tsconfig` / `packages/eslint-config`
- [x] `CLAUDE.md` / `AGENTS.md` / `README.md`
- [x] `gh repo create unz47/design-system --public`
- [x] `pnpm install && pnpm verify` が空のワークスペースで緑であることを確認
- **完了**: 空のワークスペースで `pnpm install && pnpm verify` が緑。GitHubにpush済み
- **Phase 0 完了(2026-08-23)**: `pnpm verify` exit code 0(config専用パッケージのみのため実行タスク0件だが正常終了)。コミット・push済み

**実装メモ(2026-08-31、Phase 3中に発覚)**: ルート直下の `tsconfig.base.json` を `packages/tsconfig/base.json` が `"../../tsconfig.base.json"` と相対パスで参照する構成だったが、pnpmのシンボリックリンク(`packages/tokens/node_modules/@frost-ui/tsconfig` → 実体は `packages/tsconfig`)越しにこの相対extendsを解決しようとすると、vitestのoxcベーストランスフォームがシンボリックリンクをrealpathせずに見かけ上のパスから相対解決してしまい `tsconfig not found` で失敗する(`tsc`自体はrealpathするため問題なかった)。ルートの `tsconfig.base.json` を使っていたのは `packages/tsconfig/base.json` だけだったため、内容を `packages/tsconfig/base.json` に直接統合してシンボリックリンクを跨ぐ相対extendsを解消し、ルートの `tsconfig.base.json` は削除した。

### Phase 1 — トークン垂直スライス ★最重要
- [x] primitiveはcolor全量(neutral10+frost6+plum4+status4×3=32個、OKLCH生成)+他カテゴリ全量、semanticはdark/light全項目、component層は構造だけ(control height/field padding)
- [x] transform/format(実装上はStyle Dictionaryのjson/nestedで解決 → `sd/emit.mjs`が6出力に書き出すハイブリッド構成。詳細は下記「実装メモ」)
- **完了**:
  1. [x] `pnpm tokens`(= `packages/tokens`の`build`)で全6出力が生成される
  2. [x] 検証用の最小Nextページ(`apps/docs`)で `bg-bg-base` `text-text-primary` 等が効き、`pnpm build`のCSS出力で`[data-theme=light]`ブロックの値切り替わりを確認済み
  3. [ ] **スキップ(2026-08-23、ユーザー判断)**: `nekase`への一時的なリンク検証は今回見送り。RN側の実機検証はPhase 2以降に持ち越す
- [x] `pnpm verify` がワークスペース全体で緑(warning 2件のみ、error 0)

**実装メモ(計画からの差分)**: 当初「5 transform + 5 format をStyle Dictionaryに登録する」としていたが、dark/light2テーマを1つのCSSファイルに合成する処理は単一のSD format関数に収まりにくいため、①Style Dictionaryは`json/nested`でDTCG参照解決のみに使い、②`packages/tokens/sd/emit.mjs`という独立スクリプトが解決済みの2ツリー(dark/light)を受け取って6出力を書き出す、というハイブリッド構成にした。機能的には計画と同じ6出力を満たしている。
`z-index`は命名の都合で primitive JSON 上のキーを`zIndex`ではなく`z`にしている(`--aurora-z-*`と`@utility z-*`の対応を素直にするため)。

**実装メモ(2026-09-08、Phase 3中に発覚 その2)**: shadowがdark専用の値(黒い影 + 白い縁取り)のまま両テーマで共有されていた。semantic層に移して`src/semantic/shadow.{dark,light}.json`に分割。あわせて①Style Dictionaryのテーマ解決を`src/semantic/*.{theme}.json`のglobに変え、色以外もテーマ分割できるようにした ②単層shadow(`accent-glow`)が`--...-color` / `--...-offset-x`のように分解されて使えなくなっていたのを修正 ③`shadow`をTailwindの`--shadow-*`名前空間にブリッジし、`shadow-elevation-1`のような名前付きユーティリティを使えるようにした(Cardのarbitrary valueを置き換え済み)。

**実装メモ(2026-09-08、Phase 3中に発覚)**: `contract.test.ts`のWCAGチェックがlightテーマで4件失敗していた。原因はprimitiveランプがdark前提で、lightのbg/border/accentに使える明るい段・濃い段が存在しなかったこと。neutralを10→13段(`0`=純白を追加)、frostを6→8段(light用の`700`/`800`)、statusを各3→6段(light用の`solid-strong`/`subtle-bg-light`/`border-light`)に拡張して解消した。承認済みhexは全てそのままの値で新しいステップ番号に移しただけで、色そのものは変えていない。詳細と新しいlightマッピング表は[`TOKENS.md`](./TOKENS.md)。

### Phase 2 — Webコンポーネント最初の3つ
- [x] `packages/react` の exports / `cn()` / `ui.css`
- [x] Button(variant: primary/secondary/ghost/danger, size: sm/md/lg/icon)・Card(6サブコンポーネント)・Badge(variant: default/accent/success/danger/warning/info)
- [x] `component-authoring` skillを書く(`.claude/skills/component-authoring/SKILL.md`)
- **完了**: 検証ページ(`apps/docs`)で3つが `@frost-ui/react` からimportされ描画。`transpilePackages` と `@source` が効いている(ビルド後のCSS/HTMLで確認済み)。ワークスペース全体で`pnpm verify`緑(10/10)
- **実装メモ**: `@theme inline`ブリッジは`color`/`space`/`radius`/`text(font-size)`/`motion.easing`のみ対応。`control.height`/`motion.duration`/`opacity`/typography の weight・line-height・tracking はTailwindの名前付きユーティリティが生成されないため、コンポーネント側で`[var(--aurora-...)]`のarbitrary valueを直接参照している(詳細は`component-authoring` skill)

### Phase 3 — docsサイト骨格
- [x] Nextセットアップ、`(docs)` レイアウト、サイドナビ、registry、DemoFrame、shiki、MDX
- [x] 3コンポーネントページが完成形(散文MDX + プレビュー/コード + API表)
- [x] `/foundations/colors` はトークンから自動生成(手書きしない)
- [x] テーマ切替(`data-theme` トグル + localStorage永続化 + FOUCなし)
- **完了(2026-09-08)**: `pnpm dev` でプレビュー/コード切替/コピーが機能(実ブラウザで確認)。`pnpm verify` / `pnpm test` / `pnpm build` すべて緑

**実装メモ**:
- API表は `src/registry/index.ts` に手書きし、`coverage.test.ts` が `*.variants.ts` のソースと突き合わせてドリフトを検出する(variant値の実在チェック + `defaultVariants` との初期値一致)。react-docgen-typescript のような型解析は入れていない
- テーマ切替は `useSyncExternalStore` で `<html data-theme>` を直接購読する。`useState` + `useEffect` で同期する書き方は `react-hooks/set-state-in-effect` で lint エラーになる
- shikiは dark/light 両テーマを同じHTMLに埋め、`[data-theme="light"]` 側でCSS変数を差し替える。**この上書きには `!important` が必須**(shikiがデフォルトテーマの色をインラインstyleに書くため、セレクタでは勝てない)。RSCのままテーマ追従できるので再ハイライトのクライアントJSは不要
- `/patterns` `/playground` `/about` `/changelog`(5章のルーティング表)はPhase 3のスコープ外。未着手

**追記(2026-09-09)**: Phase 4完了後に `/foundations/[slug]`(typography / spacing / radius / elevation / motion / icons)と `/tokens`(全146トークンの検索可能な一覧)を追加した。いずれも `apps/docs/src/lib/tokens.ts` が `@frost-ui/tokens` の生成物を平坦化して渡すだけで、ページ側に手書きの値は無い。`/tokens` の検索UIは自作の Input / ToggleGroup / Table / Badge で組んでいる(docsサイト自体がコンポーネントの実使用例になる)。

typography のプレビューで `font` ショートハンドに size だけ渡して全部同じ大きさで並んでいた(無効な宣言として捨てられる)。`fontSize` / `fontWeight` / `lineHeight` / `fontFamily` / `letterSpacing` を個別に指定して解消。

### Phase 4 — Webコンポーネント残り
- [x] **Tier 1残り(7個、2026-09-08)**: Input / Textarea / Skeleton / Kbd / Spinner(atoms)、Alert / EmptyState(molecules)。Tier 1は Button / Badge / Card と合わせて10個で完了
- [x] **Tier 2(12個、2026-09-08)**: Label / Separator / Checkbox / Switch / Slider / Progress / Avatar / AspectRatio / Toggle / ScrollArea(atoms)、RadioGroup / ToggleGroup(molecules)
- [x] **Tier 3(オーバーレイ10個、2026-09-08)**: Dialog / AlertDialog / Sheet / Popover / Tooltip / Menu / ContextMenu / Select / Accordion / Tabs(すべて organisms)
- [x] **Tier 4(複合4個、2026-09-09)**: Toast / Command / Combobox / Table
- **完了**: Tier 0–3(31個) + Toast/Command/Combobox/Table

**実装メモ(Tier 4)**: **外部ライブラリを1つも足さずに4つとも実装した**(計画では sonner / cmdk / TanStack Table を想定)。

- **Toast**: sonner ではなく Base UI 1.8 の Toast。依存が増えず、開閉の状態属性も他のオーバーレイと同じ作法で書ける。sonner 固有のテーマ層をトークンに合わせ込む作業も不要
- **Command**: cmdk は内部で Radix に依存しており「Radixは不採用」と衝突する。Base UI の Combobox が絞り込みとキーボード操作を持っているので、それを画面中央のパネルとして出すだけで足りた。Combobox との違いは器だけ
- **Combobox**: Base UI ネイティブ(計画どおり)
- **Table**: 見た目のプリミティブのみ。ソート/ページングを持つ DataTable は docs の `patterns/` に置く方針なので、**TanStack Table は `packages/react` の依存に入れていない**(レシピ側でだけ使う)
- 詰まった点2つ: ①`Toast.Viewport` を `Toast.Portal` で包むとトーストが1つも描画されない(無言で失敗)②Base UI が出すCSS変数名を推測で使った結果、無効な `calc()` になって要素が見えなくなった — 確認していない変数名に乗らないこと

**実装メモ(Tier 3)**: オーバーレイ7種が共有する「浮いている面」を `packages/react/src/lib/overlay.ts` に1本化した(`overlaySurface` / `overlayBackdrop` / `overlayTransition` / `overlayItem`)。Portal + Positioner + Popup の3階層は `*Content` に畳み、配置指定(`side` / `align` / `sideOffset`)だけを表に出している。

- 開閉アニメーションは Base UI の `data-starting-style` / `data-ending-style` を使ったCSSトランジション。JSで動かしていないので `motion-reduce:transition-none` だけで reduced-motion に対応できる
- **Sheet の土台は Dialog ではなく Base UI 1.8 の `Drawer`**。スワイプで閉じる挙動が最初から入っている。`side` が「出る辺」と「スワイプの向き」の両方を決めるが、前者は Popup・後者は Root のpropなので、Root で受けて context で配っている
- 詰まった点3つ(いずれもブラウザで見て発覚): ①`bg-bg-base/[var(--aurora-opacity-backdrop)]` が **無言で完全に透明になる**(color-mix が単位なしの `0.72` を解決できない)→ 要素の `opacity-[var(...)]` に変更 ②`Drawer.Popup` は `Drawer.Viewport` で包まないとスワイプもスクロールロックも効かない ③`Select` は Root に `items`(値→ラベル)を渡さないとトリガに生の値が出る
- Tooltip / Popover の階層を molecules から organisms に移した(判断基準は上記のAtomic Design節)

**実装メモ(Tier 2)**: `@base-ui/react@1.8.0` を `packages/react` の依存に追加。計画時点の想定どおりパッケージ名は `@base-ui/react` で、`@base-ui-components/react`(旧名)は 1.0.0-rc.0 で止まっている。

- 合成形は**畳めるものは畳む**。Switch(Root+Thumb)/ Checkbox(Root+Indicator)/ Progress(Root+Track+Indicator)/ Avatar(Root+Image+Fallback)/ Slider(Control+Track+Indicator+Thumb)/ ScrollArea(Viewport+Scrollbar+Thumb)は1コンポーネントにまとめた。選択肢を消費者が並べる RadioGroup / ToggleGroup だけ合成形のまま残す
- 状態は Base UI の `data-checked` / `data-pressed` / `data-orientation` / `data-dragging` などを Tailwind の `data-*` variant で受ける。JSで状態クラスを組み立てない
- **Label は Base UI を使わない**。`Field.Label` は `Field.Root` の文脈を必要とするため、単独で使える素の `<label>` を置いた。**AspectRatio も Base UI に等価物が無い**ので CSS の `aspect-ratio` で自前実装
- 詰まった点2つ: ①`Progress` の `value` は必須で、`null` を渡したときだけ indeterminate になる(省略不可) ②`Slider` は Thumb を自動で増やさないので、範囲スライダーでは `value`/`defaultValue` の長さぶん `<Slider.Thumb index={n} />` を並べる必要がある。どちらも型チェックとブラウザ確認で発覚した
- チェックマークはインラインSVG。lucide-react はまだ依存に入れていない(Tier 0 のアイコン規約が未決のため)
- API表に `source`(`cva` / `base-ui` / `native`)を追加した。cva由来のものだけドリフト検査の対象にする — Base UI由来のpropはprops型が継承している時点でTypeScriptが保証しているため

**実装メモ(Tier 1)**: 新規7個はいずれもフック・イベントハンドラを持たないので `"use client"` を付けていない(Server Componentから直接使える)。Phase 2の3個と違い、状態はpropではなくARIA属性で表す方針にした(`aria-invalid` で枠線が danger 色になる / Alert は `role` を自動で付けない)。詳細は `component-authoring` skill の「Phase 4で決まった作法」。

docs側は7個ぶんの registry エントリ・demo・MDX・API表を同時に追加している(coverage テストがこれを強制する)。

### Phase 5 — RNコンポーネント
- [ ] `packages/react-native`。A群15個 → B群6個 → C群3個
- **完了**: `nekase` の1画面が `@frost-ui/react-native` で置き換わって動く

### Phase 6 — アート + Figma + リリース
- [ ] `src/art/aurora-field`(r3f + shader + Bloom)、`/`・`/about`・`patterns` 3本、OG画像
- [ ] Figma Variables 3コレクション + Tier 1–2コンポーネント構築、`figma-sync` skill
- [ ] changesets導入、`0.1.0` publish
- [ ] デプロイ先を決定
- **完了**: トップが見せられる状態(Lighthouse Perf ≥85、A11y 100)。Figmaが公開リンクで見られる。npm経由で既存アプリが動く

---

## 9. 検証

| レイヤー | 手順 | 「動いた」の定義 |
|---|---|---|
| トークン生成 | `pnpm tokens` | 全出力が生成、JSONを手で追える |
| → Web | docs `/foundations/colors` | 色チップが自動生成、手書きhexゼロ |
| テーマ切替 | `data-theme` トグル | 全ページの色が入れ替わる。localStorage永続化 + FOUCなし |
| → RN | `nekase` で `pnpm start` | `bg-accent/20` `rounded-lg` が正しい値。Webと目視一致 |
| 型 / Lint | `pnpm verify` | 全パッケージ緑 |
| RSC境界 | `pnpm --filter docs build` | `"use client"` 欠落のビルドエラーが出ない |
| a11y | 各demoでキーボード操作 | Tab/Esc/矢印が効く。フォーカスリングが `--color-focus-ring` |
| パッケージ消費 | `pnpm pack` → 既存アプリで `pnpm add ./*.tgz` | 外部リポからimportできる |
| Figma | Variablesパネル | 3コレクション、semanticにDark/Light 2mode、エイリアスが繋がっている |

### リグレッション防止(3つだけ作る)

1. `pnpm tokens:check` — CI で再ビルドして `git diff --exit-code`
2. `packages/tokens/src/__tests__/contract.test.ts`(vitest) — semantic必須キーがdark/light両方に存在 / component層がsemantic以外を参照していない / 全 `$value` が解決する / v4出力の `--color-*` 名の集合とv3 presetから導出されるクラス名の集合が一致する / **主要なtext×bg組み合わせがWCAG AA基準(4.5:1、UI部品は3:1)を満たす**(詳細は`TOKENS.md`)
3. `apps/docs/src/registry/__tests__/coverage.test.ts` — exportとregistryのキーを突き合わせ、demo/MDXが無いコンポーネントがあれば落ちる

視覚回帰テスト(Playwright screenshot)はv1ではやらない。

---

## 10. 痛い目を見る3箇所

### 10.1 Tailwind v4 と v3 の二重出力の乖離 ← 最大のリスク

v4は `@theme` の `--color-*` からクラスを自動生成(名前空間固定)、v3は `theme.extend.colors` のネスト構造から生成(`DEFAULT` キーの特殊扱いあり)。フラットなkebab名からv3のネスト構造を復元するロジックが `tailwind-v3-preset.mjs` の実質的な中身になる。

さらにv4が持ちv3が持たない機能(`@utility`、`color-mix()` opacity、`--spacing-*` の動的スケール)があり、「Webで書けるクラスがRNで書けない」ケースが必ず出る。

対策: クロスプラットフォームで使ってよいユーティリティの部分集合を `design-conventions` skillに明記 / contractテストで集合一致を自動検査 / 揃わないと諦める領域(shadow, backdrop-filter, container query)を先に列挙して割り切る。

### 10.2 `"use client"` と RSC境界(ソース配布の裏返し)

`transpilePackages` を忘れた消費アプリで「Unexpected token」等が出る。エラーが原因を指さないので3か月後に必ず30分溶かす。
対策: `packages/react/README.md` 冒頭に消費側セットアップ3行 / `apps/docs/next.config.ts` を参照実装と位置づけてリンク。

### 10.3 RN側の工数が見積もりを超える

B群(Modal/BottomSheet/ネイティブピッカー)は「Web版の移植」ではなく新規実装。特にSelect/ComboboxのBottomSheet + FlatListは1つあたり1.5日かかりうる。
対策: A群15個を先に全部終わらせてから B群に入る。間に合わなければv1.1に落とす。

### その他
- `react-day-picker@9` と React 19 のpeer互換をv1.1着手前に確認
- Amplifyを選ぶ場合、`appRoot` がcwdになるので `cd ../..` が要る

---

## 11. Phase 0 で確定させること

- npmスコープ: `@frost-ui/*`(2026-08-30、`@unz47`から変更。GitHubアカウント/リポジトリ名は `unz47/design-system` のまま。npm registry上に公開パッケージなしを確認済みだが、npmjs.comのユーザー/組織名としての予約状況は未確定)
- リポジトリ名: `design-system`、テーマ名: `Aurora`
