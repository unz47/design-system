import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DemoEntry } from "@/registry";
import { CodeBlock } from "./code-block";
import { DemoTabs } from "./demo-tabs";

export async function DemoFrame({ demo }: { demo: DemoEntry }) {
  const source = await readFile(path.join(process.cwd(), "src/demos", demo.file), "utf8");
  const Component = demo.Component;

  return (
    <DemoTabs
      preview={<Component />}
      code={<CodeBlock code={source} />}
      source={source}
    />
  );
}
