import { Input } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-sm">
      <Input placeholder="メールアドレス" type="email" />
      <Input placeholder="無効化されている" disabled />
      <Input placeholder="不正な値" aria-invalid defaultValue="not-an-email" />
    </div>
  );
}
