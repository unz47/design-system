import { Button, Spinner } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex items-center gap-sp-lg">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Button disabled>
        <Spinner size="sm" label="保存中" />
        保存中
      </Button>
    </div>
  );
}
