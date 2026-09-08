# Aurora Design Tokens — 詳細仕様

`PROJECT_PLAN.md`の「2. トークン」を実装する際の具体的な値をここにまとめる。アーキテクチャ(3層モデル・Style Dictionaryの設定・出力形式)は`PROJECT_PLAN.md`側を参照し、このファイルは**値そのもの**の仕様源とする。

決定日: 2026-08-22

---

## フォント

| トークン | 値 | 用途 |
|---|---|---|
| `font.sans` | Geist Sans(フォールバック: ui-sans-serif, system-ui) | UI全般 |
| `font.mono` | Geist Mono(フォールバック: ui-monospace, SFMono-Regular) | コードブロック |

Vercel製。ニュートラルで幾何学的、開発者向けUIの定番。Next.jsなら`next/font`で組み込み可能。

太さ: `regular 400` / `medium 500` / `semibold 600` / `bold 700`

## タイポグラフィスケール

| トークン | サイズ | 行間 | 太さ | 字間 | 用途 |
|---|---|---|---|---|---|
| `text.display` | 48px | 1.1 | 600 | -0.02em | ヒーロー見出し |
| `text.title` | 32px | 1.2 | 600 | -0.01em | ページタイトル |
| `text.heading` | 24px | 1.3 | 600 | -0.01em | セクション見出し |
| `text.body-lg` | 18px | 1.6 | 400 | 0 | リード文 |
| `text.body` | 16px | 1.6 | 400 | 0 | 本文(デフォルト) |
| `text.body-sm` | 14px | 1.5 | 400 | 0 | 補助文 |
| `text.label` | 14px | 1.4 | 500 | 0 | ボタン・フォームラベル |
| `text.caption` | 12px | 1.4 | 400 | 0.01em | キャプション・メタ情報 |
| `text.code` | 14px | 1.6 | 400 | 0 | コードブロック(Geist Mono) |

## 余白(padding/margin共通の space スケール)

4pxグリッド。細かい調整がしやすい業界標準(Tailwindと同じ刻み)。

| トークン | 値 |
|---|---|
| `space.3xs` | 2px |
| `space.2xs` | 4px |
| `space.xs` | 8px |
| `space.sm` | 12px |
| `space.md` | 16px |
| `space.lg` | 24px |
| `space.xl` | 32px |
| `space.2xl` | 48px |
| `space.3xl` | 64px |

## 角丸(border radius)

役割ベースで3段階 + 特殊枠1つ。個別コンポーネントごとに値を決め直さず、「これは何の役割か」で自動的に決まるようにする。

| トークン | 値 | 適用対象 |
|---|---|---|
| `radius.control` | 8px | Button / Input / Badge / Checkbox / Tag など操作系の小さい部品 |
| `radius.surface` | 12px | Card / Popover / Menu / Tooltip など面を持つ部品 |
| `radius.overlay` | 16px | Dialog / Sheet / AlertDialog など画面を大きく占有する部品 |
| `radius.full` | 9999px | Avatar / Switch / 丸いIconButton / Pill型Badge(サイズに関わらず常に最大限丸くする特殊値。`50%`は正方形要素でのみ同じ結果になるが、長方形では歪むため不採用) |

## border width

| トークン | 値 | 用途 |
|---|---|---|
| `border.width.default` | 1px | 通常の枠線 |
| `border.width.thick` | 2px | 強調・フォーカスリング |

## shadow / elevation

ダーク基調では黒い影が背景に沈んで見えないため、**影 + 微妙な明るい縁取り**を組み合わせる。

| トークン | 用途 | 構成 |
|---|---|---|
| `elevation.1` | Card | 弱い影 + 上端にごく薄い光の線(白4%、1px) |
| `elevation.2` | Popover / Menu | 中程度の影 + 白6%の縁取り |
| `elevation.3` | Dialog / Sheet | 強めの影 + 白8%の縁取り |
| `elevation.accent-glow` | フォーカスリング等 | accent色をにじませる |

**shadowはsemantic層でdark/lightを分ける**(2026-09-08実装)。下地が`#0A0C14`のdarkと`#EEF2F7`のlightでは、同じ影がまったく違って見えるため。ソースは`src/semantic/shadow.{dark,light}.json`(primitiveではない)。

| トークン | dark | light |
|---|---|---|
| `elevation-1` | `0 1px 2px rgba(0,0,0,.4)` + 白4%の上端線 | `0 1px 2px rgba(10,12,20,.06)` + `0 1px 3px rgba(10,12,20,.04)` |
| `elevation-2` | `0 4px 12px rgba(0,0,0,.5)` + 白6%の縁 | `0 4px 12px rgba(10,12,20,.10)` + 影色4%の縁 |
| `elevation-3` | `0 12px 32px rgba(0,0,0,.6)` + 白8%の縁 | `0 12px 32px rgba(10,12,20,.16)` + 影色6%の縁 |
| `accent-glow` | `rgba(155,220,240,.3)` を32pxにじませる | `rgba(57,113,134,.35)`(lightのaccentは`frost.800`のため) |

- **白い縁取りはdark専用の手法**。lightでは背景より明るい線が引けないので使わない(`contract.test.ts`で検査)
- 影の色はlightでも黒ではなく`neutral.950`のRGB(`10, 12, 20`)を使う。パレットに合わせて影をわずかに寒色に寄せるため
- Tailwind側は`--shadow-*`名前空間にブリッジ済みなので、`shadow-elevation-1`のような**名前付きユーティリティが使える**(arbitrary valueは不要)

## motion

| トークン | 値 | 用途 |
|---|---|---|
| `motion.duration.fast` | 120ms | ホバー、小さい状態変化 |
| `motion.duration.normal` | 200ms | 開閉アニメーション(Dialog, Menu) |
| `motion.duration.slow` | 320ms | 大きい要素の変化 |
| `motion.easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) | 汎用 |
| `motion.easing.entrance` | cubic-bezier(0, 0, 0.2, 1) | 出現(ease-out) |
| `motion.easing.exit` | cubic-bezier(0.4, 0, 1, 1) | 消失(ease-in) |
| `motion.easing.spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 生成アート寄りの遊びのあるバウンス(演出用途に限定して使う) |

## z-index

| トークン | 値 |
|---|---|
| `z.dropdown` | 1000 |
| `z.sticky` | 1100 |
| `z.overlay` | 1200(モーダル背景のscrim) |
| `z.modal` | 1300 |
| `z.popover` | 1400 |
| `z.toast` | 1500 |
| `z.tooltip` | 1600 |

Tailwind v4に`z-*`の名前空間は無いため、`@utility z-modal { z-index: var(--aurora-z-modal); }`のように手書きユーティリティで対応する(`PROJECT_PLAN.md` 2章参照)。

## icon size

lucide-reactのデフォルトは24px・ストローク幅2だが、Auroraのミニマルな方向性に合わせてストロークをやや細くする。

| トークン | 値 |
|---|---|
| `icon.xs` | 14px |
| `icon.sm` | 16px |
| `icon.md` | 20px |
| `icon.lg` | 24px |
| `icon.xl` | 32px |
| `icon.stroke-width` | 1.5 |

## opacity

| トークン | 値 | 用途 |
|---|---|---|
| `opacity.disabled` | 0.5 | disabled状態の要素 |
| `opacity.hover-overlay` | 0.08 | hover時に重ねる背景 |
| `opacity.pressed-overlay` | 0.12 | active/pressed時に重ねる背景 |
| `opacity.backdrop` | 0.72 | モーダル背景のscrim |

## breakpoints / container width

Breakpointsは再発明せず、Tailwind v4のデフォルトをそのまま採用:

`sm 640px / md 768px / lg 1024px / xl 1280px / 2xl 1536px`

| トークン | 値 | 用途 |
|---|---|---|
| `container.prose` | 720px | ドキュメントの本文最大幅 |
| `container.content` | 1024px | 通常のページコンテンツ幅 |
| `container.wide` | 1280px | 幅広レイアウト(コンポーネント一覧グリッド等) |

## 色 — 「Frost / Silver Witch's Garden」(2026-08-22 本決定)

### 経緯(なぜmint+violetから変更したか)

当初のmint(`#7DF9C4`)+ violet(`#A855F7`)のグラデーション案は、**Hallmarkスキルの`anti-patterns.md`で名指しされている「The purple-gradient hero」(AI生成の最も分かりやすい特徴)に抵触する**ことが判明した。violetの色相(300-320°付近)がまさに「AIっぽい紫」の範囲に入るため。

再検討の結果、「真冬の銀の魔女の庭(雪原)」をイメージした方向に変更。**2色を混ぜたグラデーションを主役にするのをやめ、ニュートラル自体を銀(彩度を落とした青灰色)に寄せ、唯一の発光アクセントとして氷の水色を使う**構成にした。テーマ名「Aurora」自体は据え置き(オーロラ=極夜に光るものというコンセプトは維持)。

### 確定パレット

```
bg.base        #0A0C14   bg.surface     #12141F   bg.raised      #1A1E2D
border.subtle  #1E2230   border.default #2C3244   border.strong  #454C63
text.primary   #EEF2F7   text.secondary #9CA6BC   text.muted     #5C6478

accent(frost)      #9BDCF0   accent.dim  #6BB8D6   accent.glow  #D4F1FA
accent.alt(plum)   #6B4C7A   ※庭に稀に現れる気配。グラデーションには使わない

success #7FE8B8(霜の下の若葉)   danger #E85D6B(凍傷のような深紅)
warning #E8C468(冬の弱い陽光)   info   #7BC4E8(氷片の青、accentより彩度低め)
```

ステータス色も従来の汎用的な原色(緑/赤/黄/青)から、世界観に合わせて彩度を落とし寒色寄りに統一。ただし`info`は`accent`と混同しないよう彩度・色相をわずかにずらしている(隣接して使われる場面が少ないため実用上は問題ない想定、Phase 1のWCAG検証で最終確認)。

`gradient.aurora`(旧: mint→violetの135degグラデーション)は**廃止**。特別な質感が欲しい場面は上記の`effect.metallic`(銀の合金風グラデーション)を使う。

lightモードのsemanticマッピング(2026-09-08確定、`src/semantic/color.light.json`):

```
bg.base        neutral.100 #EEF2F7   bg.surface     neutral.50 #F7F8FB   bg.raised      neutral.0 #FFFFFF
border.subtle  neutral.200 #D4D7E3   border.default neutral.300 #B8BECF  border.strong  neutral.400 #9CA6BC
text.primary   neutral.950 #0A0C14   text.secondary neutral.700 #2C3244  text.muted     neutral.500 #5C6478

accent         frost.800 #397186     accent.dim  frost.600 #6BB8D6      accent.glow  frost.200 #D4F1FA
on-accent      neutral.0 #FFFFFF     focus-ring  frost.800 #397186
status.*       solid-strong / subtle-bg-light / border-light(下記の段階数の表を参照)
```

darkでは`accent`が発光する側(明るい水色)だが、lightでは白文字を乗せる必要があるため`accent`は濃い側(`frost.800`)に、`accent.glow`はhover背景などに使う淡い側に振っている。`accent.dim`は「主張を弱めたaccent」という役割は共通だが、darkでは暗い方向・lightでは明るい方向にずれる。

### primitiveランプの段階数

| 色ファミリー | 段階数 | 理由 |
|---|---|---|
| `neutral`(bg/border/textの元、銀の階調) | 13段階(`0` / `50` / `100` / `200` / `300` / `400` / `500` / `600` / `700` / `800` / `850` / `900` / `950`) | dark/light両方のbg・border・text(各3階調)をこれ1本で賄うため、ここだけ多めに必要 |
| `frost`(accent) | 8段階(`100`〜`800`) | dark用に`200`/`400`/`600`、light用に白文字が乗る濃さの`700`/`800`が要る |
| `plum`(accent-alt、稀にしか使わない) | 4段階 | グラデーションを組まないので6段階も不要。用途が限定的なため少なめ |
| `success` / `danger` / `warning` / `info` | 各6段階(dark用 `solid` / `subtle-bg` / `border` + light用 `solid-strong` / `subtle-bg-light` / `border-light`) | 「濃淡のグラデーション」ではなく「用途別の値」。ただしdarkの3値はlightで役割が反転するため、lightは別の3値を持つ |

合計 **13 + 8 + 4 + 6×4 = 49個**。

- 色空間: OKLCH(知覚的に均等なランプを作れるため、Tailwind v4やRadix Colorsと同じ考え方)
- 生成方法: 各基準色をランプ内の特定ステップに固定(アンカー)し、そこから明度・彩度を補間して他のステップを生成する
- アンカー(`packages/tokens/sd/generate-colors.mjs`、承認済みhexはそのまま使い、間のステップだけ計算する):
  - neutral: `#EEF2F7`→`100`、`#9CA6BC`→`400`、`#5C6478`→`500`、`#454C63`→`600`、`#2C3244`→`700`、`#1E2230`→`800`、`#1A1E2D`→`850`、`#12141F`→`900`、`#0A0C14`→`950`。`0`は純白(`#FFFFFF`)固定、`50`/`200`/`300`は補間
  - frost(accent): `#D4F1FA`→`200`、`#9BDCF0`→`400`、`#6BB8D6`→`600`。`700`/`800`は暗い側に外挿(step幅0.112)
  - plum(accent-alt): `#6B4C7A` → 500付近
  - success/danger/warning/info: それぞれ「solid」ステップに`#7FE8B8` / `#E85D6B` / `#E8C468` / `#7BC4E8`を配置。`solid-strong`はL=0.47固定(pale背景上で読め、かつ白文字を乗せられる濃さ)
- ツール: `culori`(npm)などでOKLCH計算を行うスクリプトを`packages/tokens`に用意する。手書きJSONではなく生成JSONにする

#### 段階数を10→13(neutral)/6→8(frost)/3→6(status)に増やした理由(2026-09-08)

当初はdark基調で段階数を絞ったが、lightモードのsemanticを割り当てる段になって**明るい側の段が足りない**ことが判明した(`contract.test.ts`のWCAGチェックが4件失敗)。具体的には:

- neutral: `#EEF2F7`が最も明るい段だったため、lightの`bg.base`/`bg.surface`/`bg.raised`が`#EEF2F7`/`#9CA6BC`/`#5C6478`という中間グレーまで落ちていた
- frost: 最も暗い段が`#6BB8D6`で、lightのprimaryボタン(白文字)もフォーカスリング(白背景上)も基準を満たせなかった
- status: `subtle-bg`(L=0.2)がdark専用の極端に暗い値で、lightでもそのまま使われていた

**lightのelevationは「白に向かって上がる」**(darkが`#1A1E2D`に向かって上がるのと対称)ので、`bg.raised`に純白が要る。これが`neutral.0`を置いた理由。

### 国際規格との整合

- **WCAG コントラスト比を生成スクリプトに組み込む(必須)**。semanticトークンの代表的な組み合わせ(`text.primary`/`text.secondary`/`text.muted` × `bg.base`/`bg.surface`/`bg.raised`、各ステータス色 × 背景)について、通常テキストはAA基準(4.5:1以上)、UI部品・大きい文字は3:1以上を満たすことを自動チェックする。基準を満たさない組み合わせは、そのペアのランプ段階を自動でずらす(またはビルドを失敗させて手動調整を促す)。`contract.test.ts`(`PROJECT_PLAN.md` 9章)にこのチェックを追加する。
- **色空間はv1では sRGB のみ**。OKLCHはDisplay P3の広色域もカバーできる設計だが、P3対応はv1のスコープ外とし、v1.1以降の検討事項とする(理由: 対応ディスプレイが限定的で、今のフェーズでは投資対効果が低い)。

## effect(新設 2026-08-22)

「メタリック」「霜ガラス」のような視覚エフェクトを、色・タイポと同様にトークンとして正式管理する。**シェーダー(GLSL/Three.js)とは明確に分離する**(下記「エフェクトとシェーダーの境界」参照)。

| トークン | 内容 | 用途 |
|---|---|---|
| `effect.metallic` | 銀の合金風グラデーション。斜め角度(135deg)で明暗3〜4stopを繰り返す線形グラデーション。ベースは`neutral`ランプの淡い段〜濃い段を往復させて質感を出す | 特別な瞬間のアクセント(ロゴ、限定的なバッジ)。多用しない |
| `effect.frost` | `backdrop-filter: blur(18px) saturate(120%)` + 半透明の`bg.raised` + `frost`色を22%だけ混ぜた枠線。`aurora-frost-witch-garden.html`の`.frostpane`で実装済み | Dialog / Sheet / Popoverなど「浮いている」要素専用。装飾目的では使わない |
| `effect.glow` | `box-shadow`でaccent色を`color-mix()`により滲ませる(不透明度25〜35%) | フォーカスリング、氷のボタンの発光 |
| `effect.grain` | SVG `feTurbulence`による極薄いノイズテクスチャ(opacity < 0.05) | ヒーロー背景に敷き、フラットな「作り物っぽさ」を消す |

### エフェクトとシェーダーの境界(重要なアーキテクチャ決定)

- **effect(CSSベース)**: `packages/tokens`にトークンとして持ち、`packages/react`のコンポーネントからも使える。バンドルサイズへの影響はごくわずか
- **shader(GLSL/Three.js)**: `PROJECT_PLAN.md` 5章の方針通り、`apps/docs/src/art/`専用のまま変更しない。`packages/react`に`three`を持ち込むとバンドルが肥大化するため
- **依存の向きは一方向**: シェーダーは`@frost-ui/tokens`から色の値をJSでimportして使ってよい(例: curl-noiseフローフィールドの色にaccentを使う)。逆に`packages/tokens`や`packages/react`がシェーダーコードに依存することはない

Style Dictionaryの出力としては、`effect.*`は`css/theme.css`に`--aurora-effect-*`のCSS変数として、`frost`のようなbackdrop-filterを使う効果は再利用可能な`@utility`(Tailwind v4)としても`dist/css/theme.css`に含める。
