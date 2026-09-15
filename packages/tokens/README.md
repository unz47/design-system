# @frost-ui/tokens

Aurora Design System(Frost / Silver Witch's Garden)のデザイントークン。値の正は [unz47/design-system](https://github.com/unz47/design-system) の `packages/tokens/src` にある DTCG JSON で、このパッケージはその生成物を配布する。

## 入っているもの

| import | 内容 |
|---|---|
| `@frost-ui/tokens/theme.css` | Tailwind v4 用。`@theme inline` で `--aurora-*` を `bg-*` / `text-*` / `rounded-*` などのユーティリティに橋渡しする。`variables.css` を内包 |
| `@frost-ui/tokens/variables.css` | 生の CSS 変数。`:root` が dark、`[data-theme="light"]` が light |
| `@frost-ui/tokens` | JS オブジェクト(`tokens`)。`StyleSheet` や SVG など CSS 変数が使えない場所向け |
| `@frost-ui/tokens/native/preset` | NativeWind(Tailwind 3.4)用 preset |
| `@frost-ui/tokens/native/global.css` | React Native 用の変数定義 |
| `@frost-ui/tokens/figma` | Figma Plugin API 用の変数ペイロード |

## 使い方(Web / Tailwind v4)

```css
@import "tailwindcss";
@import "@frost-ui/tokens/theme.css";
```

dark がデフォルト。light にするときは `<html data-theme="light">` を付ける。

## ライセンス

MIT
