# CLAUDE.md

このリポジトリで作業する際の運用ルール。詳細な設計・フェーズ計画は [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) を参照(唯一の仕様源)。

## 役割分担

- **足場(config類)**: `package.json` / `turbo.json` / `tsconfig` / `eslint.config` / ビルド設定の配線は Claude が作成してよい。
- **中身**: コンポーネントの実装・variant設計・生成アート・トークンの値決めなど「面白い部分」はユーザーが書く。Claudeは相談・レビュー・調査に回る。
- 各フェーズを始める前に `PROJECT_PLAN.md` の該当セクションと完了条件を確認する。

## 完了ゲート

各パッケージは以下のscriptsを持つこと:

```json
{ "typecheck": "tsc --noEmit", "lint": "eslint", "verify": "tsc --noEmit && eslint" }
```

ルートでは `pnpm verify`(= `turbo verify`)が緑であることが「完了」の定義。

## 規約

- パッケージマネージャは **pnpm 固定**(`packageManager` フィールドでピン留め済み)。
- ESLint 9 flat config。Prettier/Biomeは使わない。
- ドキュメント・コミットメッセージは日本語。
- `packages/tokens/dist/` は生成物だがgit管理する(`pnpm tokens:check` でドリフト検査するため)。
