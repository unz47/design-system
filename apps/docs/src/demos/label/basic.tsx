import { Input, Label } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-2xs">
      <Label htmlFor="demo-email">メールアドレス</Label>
      <Input id="demo-email" type="email" placeholder="you@example.com" />
    </div>
  );
}
