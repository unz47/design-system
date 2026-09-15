import { Progress } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-md">
      <Progress value={30} />
      <Progress value={80} />
      <Progress value={null} />
    </div>
  );
}
