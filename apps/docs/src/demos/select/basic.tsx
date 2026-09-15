import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@frost-ui/react";

// SelectItem に書いたラベルは Value には伝わらない。トリガに表示名を出すには
// Root に items(値 → ラベルの対応)を渡す必要がある。
const THEMES = {
  dark: "ダーク",
  light: "ライト",
  system: "システムに合わせる",
};

export default function Basic() {
  return (
    <div className="max-w-xs">
      <Select defaultValue="dark" items={THEMES}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(THEMES).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
