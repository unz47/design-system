import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@frost-ui/react";

export default function Basic() {
  return (
    <TooltipProvider>
      <div className="flex gap-sp-md">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="sm" />}>上に出る</TooltipTrigger>
          <TooltipContent side="top">保存されていない変更があります</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="sm" />}>右に出る</TooltipTrigger>
          <TooltipContent side="right">⌘S で保存</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
