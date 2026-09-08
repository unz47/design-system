import { Checkbox, Label } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex flex-col gap-sp-sm">
      <div className="flex items-center gap-sp-xs">
        <Checkbox id="c1" defaultChecked />
        <Label htmlFor="c1">ダークテーマを使う</Label>
      </div>
      <div className="flex items-center gap-sp-xs">
        <Checkbox id="c2" indeterminate />
        <Label htmlFor="c2">一部だけ選択されている</Label>
      </div>
      <div className="flex items-center gap-sp-xs">
        <Checkbox id="c3" disabled />
        <Label htmlFor="c3">無効</Label>
      </div>
    </div>
  );
}
