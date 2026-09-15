import { Button } from "@frost-ui/react";

export default function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-sp-md">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}
