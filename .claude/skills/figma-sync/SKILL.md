---
name: figma-sync
description: Aurora design system — packages/tokens のトークンを Figma の Variables / Text Styles に一方向pushする手順(PROJECT_PLAN.md §6)
---

# figma-sync

トークンの正はコード(`packages/tokens/src/**/*.json`)。Figmaは生成物で、**Figma上でVariablesを手編集しない**。
Plugin API はFigmaのサンドボックス内でしか動かずCIから叩けないので、CLIは作らず、Claude Code の `use_figma` で流す。

- 同期先: `frost-design`(fileKey `7RkoDxnmhkYY4wH1JGQzAg`)、Proプラン(1コレクション4モードまで)
- 使うスキル: `figma:figma-use`(`use_figma` の前に必須)、`figma:figma-generate-library`

## 構成

| ファイル | 役割 |
|---|---|
| `packages/tokens/sd/emit.mjs` の6章 | ソースJSONから `dist/figma/variables.json` を作る。scopes の表(`FIGMA_SCOPES`)と出さないトークンの表(`FIGMA_SKIP`)もここ |
| `render.mjs` | `variables.json` から1ステップ分の `use_figma` 用スクリプトを組み立てる |
| `sync-variables.js` | 1コレクション分の変数を upsert(名前一致で更新・無ければ作成) |
| `sync-text-styles.js` | テキストスタイルを upsert し、fontFamily / fontWeight をprimitive変数にbind |
| `sync-effect-styles.js` | 影(shadow)のエフェクトスタイルを upsert し、各層の値を semantic 変数に bind |
| `sync-meta.js` | `_meta/tokens-hash` を書き、Figmaにしか無い変数を列挙する |

## 手順

1. `pnpm tokens` で `dist/figma/variables.json` を最新にする
2. 次の順にスクリプトを組み立て、**1つずつ順番に** `use_figma` で流す(並列にしない。エイリアスの参照先を先に作るため順序も守る)

   ```sh
   node .claude/skills/figma-sync/render.mjs primitive color
   node .claude/skills/figma-sync/render.mjs primitive '!color'
   node .claude/skills/figma-sync/render.mjs semantic
   node .claude/skills/figma-sync/render.mjs component
   node .claude/skills/figma-sync/render.mjs text-styles
   node .claude/skills/figma-sync/render.mjs effect-styles
   node .claude/skills/figma-sync/render.mjs meta
   ```

   出力をそのまま `use_figma` の `code` に渡す(1ステップ最大13KB程度で、上限50KBに収まる)。
3. `meta` の戻り値を確認する
   - `previousHash` が前回の `tokensHash` と違う → 前回の同期以降にコードが変わった(今回の同期で追いついた)
   - `figmaOnly` が空でない → コードから消えた、またはFigmaで手で足された変数。**自動では消さない**。人が判断してから消す
4. 検証: コレクションごとの変数数・モード、scopes が空なのは primitive の色と `_meta` だけか、壊れたエイリアスが0か

どのステップも名前一致の upsert なので、途中で失敗しても同じスクリプトを流し直せば続きから揃う。
変数の型を変えた場合だけは upsert できず、スクリプトがエラーで止まる(Figma側の変数を消してから流し直す)。

## 注意(実際に踏んだもの)

- **不透明度はFigmaでは0–100**。Figmaは不透明度に紐付けた変数をパーセントとして読む(0.5を紐付けると0.5%)。`emit.mjs` が `OPACITY` スコープの値だけ100倍して出している。契約テストでも検査している
- Geistのスタイル名は `SemiBold`(スペース無し)。Interの `Semi Bold` とは違う。フォントを足すときは `figma.listAvailableFontsAsync()` で実在を確かめる
- 新しいトークンのカテゴリを足すと、`FIGMA_SCOPES` か `FIGMA_SKIP` に載せるまで `pnpm tokens` が失敗する(Figmaでの扱いを決め忘れないための仕掛け)

## コンポーネント(Tier 1–2、22個)

変数と違いコードからの自動同期は無い。`packages/react` の `*.variants.ts` を見て、`component-kit.js` で1コンポーネント=1ページを組む。

- ページ構成: Cover / Foundations / `--- Atoms` / atoms 17ページ / `--- Molecules` / molecules 5ページ
- 各ページ: 左に説明枠(`<Name> / Documentation`)、右にコンポーネントセット(Dark)、その下に全バリアントを Light モードで並べた `<Name> / Light`
- `component-kit.js` の中身をスクリプト先頭に貼り、`openPage` → `docFrame` → バリアントを作る → `finish` の順。`openPage` はページの中身を全部消して作り直す
- 状態は Default / Disabled のみ(Disabled は `opacity/disabled` を不透明度に紐付け)。hover(brightness)とフォーカスリングは Figma では再現しない
- molecules の中の Button / Toggle / Radio はインスタンス。atoms を作り直すと main component が消えてインスタンスが外れるので、atoms を作り直したら使っている molecules も作り直す

### 注意(実際に踏んだもの)

- `resize()` は auto layout の両軸を FIXED にする。幅だけ決めたいときは直後に `layoutSizingVertical = "HUG"`(または `primaryAxisSizingMode = "AUTO"`)に戻す
- TEXT プロパティを足すと、紐付けた全バリアントの文字がその既定値にそろう。文字が違うバリアント(placeholder など)は紐付けない
- `componentPropertyReferences` は代入でまるごと置き換わる。1つのノードに TEXT と BOOLEAN の両方を紐付けるときは `{ ...node.componentPropertyReferences, visible: key }` のように合わせて渡す(Menu Item のショートカットで、表示の紐付けを足した瞬間に文字の紐付けが消えた)
- テキストスタイルを当てた後の `fontName` / `fontSize` の上書きは可(Badge の 12px Medium、Kbd の 12px Mono など)
- 他ページのコンポーネントは `figma.getNodeByIdAsync(id)` で取れ、そのまま `createInstance()` できる(ページ切り替え不要)

## 影(shadow)

エフェクトスタイル自体はモードを持てないが、効果の各値(color / offsetX / offsetY / radius / spread)は変数に bind できる。
そこで `emit.mjs` が影の各層の値を semantic コレクション(Dark / Light)の変数 `shadow/<name>/<層>/<値>` に展開し、
`sync-effect-styles.js` がスタイル `shadow/<name>` をそれらに bind する。使う側のモードで変数が解決されるので、同じスタイルが Dark では黒い影 + 白い縁、Light では薄い紺の影になる(Figma 上で実測済み)。

- 層の数が dark / light で違うときは、少ない方を透明な層で埋めて同じ数にそろえる
- codeSyntax は層の変数すべてが元の `var(--aurora-shadow-<name>)` を指す

## organisms(Tier 3–4、14個)

- ページは `--- Organisms` の後ろ。オーバーレイの面(overlaySurface)は `bg/surface + border/default + radius/overlay + shadow/elevation-3`
- 項目は Menu ページの **Menu Item**(State × Selected、Label / Shortcut / Show shortcut)を ContextMenu / Select / Combobox / Command で共通に使う
- モーダル系(Command / Dialog / AlertDialog / Sheet)は、幕(`bg/base` × `opacity/backdrop`)の上に置いた使用例をページに置く
- Accordion / Tabs / Table / RadioGroup は、1項目分の部品セット(Accordion Item / Tab / Table Row / Radio)と、それを並べた本体のセットの2つを同じページに置く
