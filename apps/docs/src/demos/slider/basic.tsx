import { Slider } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex max-w-sm flex-col gap-sp-xl">
      <Slider defaultValue={40} />
      <Slider defaultValue={[20, 70]} />
      <Slider defaultValue={60} disabled />
    </div>
  );
}
