import { AspectRatio } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="grid max-w-md grid-cols-2 gap-sp-md">
      <AspectRatio ratio={16 / 9} className="rounded-surface bg-bg-raised">
        <div className="flex items-center justify-center text-xs text-text-muted">16 / 9</div>
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded-surface bg-bg-raised">
        <div className="flex items-center justify-center text-xs text-text-muted">1 / 1</div>
      </AspectRatio>
    </div>
  );
}
