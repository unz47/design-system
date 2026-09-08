import { Input } from "@frost-ui/react";

export default function Sizes() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-sm">
      <Input size="sm" placeholder="sm — 32px" />
      <Input size="md" placeholder="md — 40px" />
      <Input size="lg" placeholder="lg — 48px" />
    </div>
  );
}
