import { Toggle } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex items-center gap-sp-sm">
      <Toggle defaultPressed>太字</Toggle>
      <Toggle>斜体</Toggle>
      <Toggle size="sm">sm</Toggle>
      <Toggle disabled>無効</Toggle>
    </div>
  );
}
