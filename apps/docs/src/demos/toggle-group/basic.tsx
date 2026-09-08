import { Toggle, ToggleGroup } from "@frost-ui/react";

export default function Basic() {
  return (
    <ToggleGroup defaultValue={["left"]}>
      <Toggle value="left" size="sm">左</Toggle>
      <Toggle value="center" size="sm">中央</Toggle>
      <Toggle value="right" size="sm">右</Toggle>
    </ToggleGroup>
  );
}
