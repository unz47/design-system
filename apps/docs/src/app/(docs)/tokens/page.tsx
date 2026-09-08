import { getTokenGroups, getTokenRows } from "@/lib/tokens";
import { TokenSearch } from "@/components/docs/token-search";

export const metadata = { title: "Tokens — Aurora" };

// 全トークンの一覧。検索と絞り込みだけがクライアント側の仕事で、
// 行そのものはサーバーで作って渡す。
export default function TokensPage() {
  return (
    <div>
      <h1 className="text-title-size font-semibold text-text-primary">Tokens</h1>
      <p className="mt-sp-md max-w-prose text-text-secondary">
        生成された全トークン。名前・CSS変数・値のどれでも検索できる。値は dark テーマのもの。
      </p>
      <div className="mt-sp-lg">
        <TokenSearch rows={getTokenRows()} groups={getTokenGroups()} />
      </div>
    </div>
  );
}
