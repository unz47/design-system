import { Button, Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@frost-ui/react";

export default function Basic() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" size="sm" />}>詳細</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle className="text-sm font-medium text-text-primary">トークンの出所</PopoverTitle>
        <PopoverDescription className="mt-sp-2xs text-sm text-text-secondary">
          この色は semantic の accent.default を参照している。
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
