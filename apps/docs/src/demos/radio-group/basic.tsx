import { Label, Radio, RadioGroup } from "@frost-ui/react";

export default function Basic() {
  return (
    <RadioGroup defaultValue="dark">
      <div className="flex items-center gap-sp-xs">
        <Radio value="dark" id="r-dark" />
        <Label htmlFor="r-dark">ダーク</Label>
      </div>
      <div className="flex items-center gap-sp-xs">
        <Radio value="light" id="r-light" />
        <Label htmlFor="r-light">ライト</Label>
      </div>
      <div className="flex items-center gap-sp-xs">
        <Radio value="system" id="r-system" disabled />
        <Label htmlFor="r-system">システムに合わせる(準備中)</Label>
      </div>
    </RadioGroup>
  );
}
