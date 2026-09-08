import { Tabs, TabsList, TabsPanel, TabsTab } from "@frost-ui/react";

export default function Basic() {
  return (
    <Tabs defaultValue="web" className="max-w-md">
      <TabsList>
        <TabsTab value="web">Web</TabsTab>
        <TabsTab value="native">Expo</TabsTab>
        <TabsTab value="figma" disabled>Figma</TabsTab>
      </TabsList>
      <TabsPanel value="web">
        <p className="text-sm text-text-secondary">Tailwind v4 の @theme inline 経由でトークンが効く。</p>
      </TabsPanel>
      <TabsPanel value="native">
        <p className="text-sm text-text-secondary">NativeWind v4 + Tailwind 3.4 preset を使う。</p>
      </TabsPanel>
      <TabsPanel value="figma">
        <p className="text-sm text-text-secondary">Phase 6 で対応する。</p>
      </TabsPanel>
    </Tabs>
  );
}
