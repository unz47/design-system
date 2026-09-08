import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@frost-ui/react";

export default function Basic() {
  return (
    <Accordion className="max-w-md">
      <AccordionItem>
        <AccordionTrigger>トークンはどこが正なのか</AccordionTrigger>
        <AccordionPanel>
          コード(Git)が正。Figma は生成物で、Plugin API 経由の一方向pushで同期する。
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>なぜ Radix ではなく Base UI なのか</AccordionTrigger>
        <AccordionPanel>
          shadcn/ui がデフォルトプリミティブを切り替えたこと、Combobox がネイティブ実装されていることが理由。
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
