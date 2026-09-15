# @frost-ui/react

Aurora Design System(Frost / Silver Witch's Garden)の React コンポーネント。ヘッドレス層は [Base UI](https://base-ui.com)、スタイルは Tailwind v4 + `@frost-ui/tokens`。

**TypeScript ソースのまま配布している**(ビルド済み JS は無い)。消費側のバンドラでトランスパイルする前提。

## 前提

- React 19
- Tailwind CSS v4
- Next.js の場合は `transpilePackages`

## セットアップ(Next.js App Router)

```ts
// next.config.ts
const nextConfig = { transpilePackages: ["@frost-ui/react"] };
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@frost-ui/tokens/theme.css";
@source "../node_modules/@frost-ui/react/src";
```

`@source` はコンポーネント内のクラス名を Tailwind に拾わせるために必要(パスは `globals.css` からの相対)。

```tsx
import { Button, Card } from "@frost-ui/react";
// またはサブパス
import { Button } from "@frost-ui/react/atoms/button";
```

## コンポーネント

atoms 17 / molecules 5 / organisms 14 の計 36。一覧とデモは docs サイト、または `src/index.ts` を参照。

## 合成(Radix の `asChild` に相当するもの)

Base UI は `render` prop で合成する。

```tsx
<Menu.Trigger render={<Button variant="secondary" />}>開く</Menu.Trigger>
```

## ライセンス

MIT
