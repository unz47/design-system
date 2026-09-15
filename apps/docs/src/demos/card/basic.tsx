import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@frost-ui/react";

export default function Basic() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Aurora デザインシステム</CardTitle>
        <CardDescription>Frost / Silver Witch&apos;s Garden</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">
          トークンをコードで一元管理し、Web / Expo / Figma に配布する。
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">詳細を見る</Button>
      </CardFooter>
    </Card>
  );
}
