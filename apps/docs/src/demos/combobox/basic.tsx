"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@frost-ui/react";

const COMPONENTS = ["Button", "Card", "Badge", "Input", "Select", "Dialog", "Tooltip", "Table"];

export default function Basic() {
  return (
    <div className="max-w-xs">
      <Combobox items={COMPONENTS}>
        <ComboboxInput placeholder="コンポーネントを探す" />
        <ComboboxContent>
          <ComboboxEmpty>該当なし</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
