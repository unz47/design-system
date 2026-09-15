import { Skeleton } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm items-center gap-sp-md">
      <Skeleton shape="circle" className="size-10" />
      <div className="flex-1">
        <Skeleton shape="text" className="w-2/3" />
        <Skeleton shape="text" className="mt-sp-2xs w-full" />
      </div>
    </div>
  );
}
