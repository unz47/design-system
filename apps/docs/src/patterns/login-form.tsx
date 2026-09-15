"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Spinner,
} from "@frost-ui/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid = email.length > 0 && !email.includes("@");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (emailInvalid) return;
    setSubmitting(true);
    setError(null);
    // ここは本来のサインイン処理。レシピなので失敗した体で止める。
    setTimeout(() => {
      setSubmitting(false);
      setError("メールアドレスまたはパスワードが正しくありません。");
    }, 900);
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Aurora にサインイン</CardTitle>
          <CardDescription>トークンとコンポーネントを同期します。</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-sp-md">
          {/* 送信の結果として出るものなので role="alert" を付ける */}
          {error ? (
            <Alert variant="danger" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-sp-2xs">
            <Label htmlFor="login-email">メールアドレス</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? "login-email-error" : undefined}
            />
            {emailInvalid ? (
              <p id="login-email-error" className="text-xs text-status-danger-solid">
                メールアドレスの形式で入力してください。
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-sp-2xs">
            <Label htmlFor="login-password">パスワード</Label>
            <Input id="login-password" type="password" autoComplete="current-password" />
          </div>

          <div className="flex items-center gap-sp-xs">
            <Checkbox id="login-remember" defaultChecked />
            <Label htmlFor="login-remember">この端末で次回から省略する</Label>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-sp-md pt-sp-md">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Spinner size="sm" label="サインインしています" /> : null}
            サインイン
          </Button>
          <Separator />
          <Button type="button" variant="ghost" size="sm" className="w-full">
            パスワードをお忘れですか
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
