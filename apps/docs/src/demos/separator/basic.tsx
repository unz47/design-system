import { Separator } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="max-w-sm">
      <p className="text-sm text-text-secondary">トークン</p>
      <Separator className="my-sp-md" />
      <div className="flex h-5 items-center gap-sp-md text-sm text-text-secondary">
        <span>Web</span>
        <Separator orientation="vertical" />
        <span>Expo</span>
        <Separator orientation="vertical" />
        <span>Figma</span>
      </div>
    </div>
  );
}
