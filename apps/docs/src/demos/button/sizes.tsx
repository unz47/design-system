import { Button } from "@frost-ui/react";

export default function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-sp-md">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
