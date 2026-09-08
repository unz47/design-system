import { Label, Switch } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex flex-col gap-sp-sm">
      <div className="flex items-center gap-sp-sm">
        <Switch id="s1" defaultChecked />
        <Label htmlFor="s1">通知を受け取る</Label>
      </div>
      <div className="flex items-center gap-sp-sm">
        <Switch id="s2" />
        <Label htmlFor="s2">ベータ機能を有効にする</Label>
      </div>
      <div className="flex items-center gap-sp-sm">
        <Switch id="s3" disabled defaultChecked />
        <Label htmlFor="s3">管理者によって固定されている</Label>
      </div>
    </div>
  );
}
