import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DemoEntry } from "@/registry";
import { CodeBlock } from "./code-block";
import { DemoTabs } from "./demo-tabs";

/** `root` は読み取り元のディレクトリ。components のdemoと patterns の
 *  レシピで置き場が違うだけで、見せ方は同じなので使い回す。 */
export async function DemoFrame({ demo, root = "src/demos" }: { demo: DemoEntry; root?: string }) {
  const source = await readFile(path.join(process.cwd(), root, demo.file), "utf8");
  const Component = demo.Component;

  return (
    <DemoTabs
      preview={<Component />}
      code={<CodeBlock code={source} />}
      source={source}
    />
  );
}
