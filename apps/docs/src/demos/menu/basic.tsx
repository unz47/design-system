import { Button, Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from "@frost-ui/react";

export default function Basic() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" size="sm" />}>操作</MenuTrigger>
      <MenuContent align="start">
        <MenuGroup>
          <MenuGroupLabel>このページ</MenuGroupLabel>
          <MenuItem>複製する</MenuItem>
          <MenuItem>リンクをコピー</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem disabled>アーカイブ(準備中)</MenuItem>
      </MenuContent>
    </Menu>
  );
}
