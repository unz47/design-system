import { Alert, AlertDescription, AlertTitle } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex flex-col gap-sp-md">
      <Alert>
        <div>
          <AlertTitle>下書きとして保存されています</AlertTitle>
          <AlertDescription>公開するまで他の人には見えません。</AlertDescription>
        </div>
      </Alert>
      <Alert variant="danger" role="alert">
        <div>
          <AlertTitle>保存に失敗しました</AlertTitle>
          <AlertDescription>接続を確認してもう一度お試しください。</AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
