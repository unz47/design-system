import { Textarea } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-sm">
      <Textarea rows={4} placeholder="このリリースで変わったこと" />
      <Textarea rows={3} resize="none" placeholder="リサイズ不可" />
    </div>
  );
}
