import { Avatar } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex items-center gap-sp-md">
      <Avatar size="sm" fallback="AU" />
      <Avatar size="md" fallback="AU" />
      <Avatar size="lg" fallback="AU" />
    </div>
  );
}
