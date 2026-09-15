# Changesets

`@frost-ui/tokens` と `@frost-ui/react` のバージョン管理と CHANGELOG 生成に使う。

- 公開対象を変更したら `pnpm changeset` で変更セット(このフォルダの `.md`)を追加してコミットする
- main にマージされると `release.yml` が「Version Packages」PR を作る。それをマージすると npm に公開される
- `docs` / `@frost-ui/tsconfig` / `@frost-ui/eslint-config` は公開しない(`private` または `ignore`)
- 2 パッケージは `linked` なので同じバージョン番号で揃う
