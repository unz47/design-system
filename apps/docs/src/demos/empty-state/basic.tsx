import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@frost-ui/react";

export default function Basic() {
  return (
    <EmptyState>
      <EmptyStateMedia className="text-4xl">❄</EmptyStateMedia>
      <EmptyStateTitle>まだ何もありません</EmptyStateTitle>
      <EmptyStateDescription>
        最初のコンポーネントを追加すると、ここに一覧が表示されます。
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button size="sm">追加する</Button>
        <Button size="sm" variant="ghost">ドキュメントを読む</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
