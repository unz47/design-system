"use client";

import {
  Button,
  Label,
  Radio,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@frost-ui/react";

const DENSITY = { comfortable: "ゆったり", compact: "詰める" };

/** 設定の1行。ラベルと説明を左、操作を右に置く形をここで固定する。 */
function Row({
  htmlFor,
  title,
  description,
  children,
}: {
  htmlFor?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-sp-lg py-sp-md">
      <div className="min-w-0">
        <Label htmlFor={htmlFor}>{title}</Label>
        {description ? <p className="mt-sp-3xs text-sm text-text-secondary">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  return (
    <Tabs defaultValue="appearance" className="mx-auto w-full max-w-2xl">
      <TabsList>
        <TabsTab value="appearance">外観</TabsTab>
        <TabsTab value="notifications">通知</TabsTab>
      </TabsList>

      <TabsPanel value="appearance">
        <div className="divide-y divide-border-subtle">
          <Row title="テーマ" description="この端末にのみ保存されます。">
            <RadioGroup defaultValue="dark" className="flex-row gap-sp-lg">
              <div className="flex items-center gap-sp-xs">
                <Radio value="dark" id="set-dark" />
                <Label htmlFor="set-dark">ダーク</Label>
              </div>
              <div className="flex items-center gap-sp-xs">
                <Radio value="light" id="set-light" />
                <Label htmlFor="set-light">ライト</Label>
              </div>
            </RadioGroup>
          </Row>

          <Row htmlFor="set-density" title="行の高さ" description="一覧の詰まり具合を変えます。">
            <Select defaultValue="comfortable" items={DENSITY}>
              <SelectTrigger id="set-density" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DENSITY).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          <Row htmlFor="set-motion" title="アニメーションを減らす" description="OSの設定より優先されます。">
            <Switch id="set-motion" />
          </Row>
        </div>
      </TabsPanel>

      <TabsPanel value="notifications">
        <div className="divide-y divide-border-subtle">
          <Row htmlFor="set-release" title="リリース通知" description="新しいバージョンが出たときに知らせます。">
            <Switch id="set-release" defaultChecked />
          </Row>
          <Row htmlFor="set-drift" title="トークンのdrift検知" description="Figma とコードがずれたときに知らせます。">
            <Switch id="set-drift" defaultChecked />
          </Row>
        </div>
      </TabsPanel>

      <Separator className="my-sp-lg" />
      <div className="flex justify-end gap-sp-sm">
        <Button variant="ghost" size="sm">元に戻す</Button>
        <Button size="sm">保存</Button>
      </div>
    </Tabs>
  );
}
