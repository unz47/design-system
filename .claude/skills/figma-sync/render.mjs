// dist/figma/variables.json から、use_figma にそのまま渡せるスクリプトを1ステップ分組み立てて標準出力に出す。
// Plugin API はFigmaのサンドボックス内でしか動かないので、ここではコードを組み立てるだけ(実行はClaude Codeの use_figma)。
//
//   node .claude/skills/figma-sync/render.mjs primitive color     # primitiveのうち color/* だけ
//   node .claude/skills/figma-sync/render.mjs primitive !color    # primitiveのうち color/* 以外
//   node .claude/skills/figma-sync/render.mjs semantic
//   node .claude/skills/figma-sync/render.mjs component
//   node .claude/skills/figma-sync/render.mjs text-styles
//   node .claude/skills/figma-sync/render.mjs meta

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const payload = JSON.parse(
  readFileSync(path.resolve(here, "../../../packages/tokens/dist/figma/variables.json"), "utf8"),
);
const [step, filter] = process.argv.slice(2);

function body(file) {
  return readFileSync(path.join(here, file), "utf8");
}

function emit(data, file) {
  process.stdout.write(`const PAYLOAD = ${JSON.stringify(data)};\n\n${body(file)}`);
}

const collection = payload.collections.find((c) => c.name === step);

if (collection) {
  let variables = collection.variables;
  if (filter) {
    const exclude = filter.startsWith("!");
    const groups = filter.replace(/^!/, "").split(",");
    variables = variables.filter((v) => groups.includes(v.name.split("/")[0]) !== exclude);
  }
  emit({ collection: { name: collection.name, modes: collection.modes }, variables }, "sync-variables.js");
} else if (step === "text-styles") {
  emit({ textStyles: payload.textStyles }, "sync-text-styles.js");
} else if (step === "effect-styles") {
  emit({ effectStyles: payload.effectStyles }, "sync-effect-styles.js");
} else if (step === "meta") {
  const expected = Object.fromEntries(payload.collections.map((c) => [c.name, c.variables.map((v) => v.name)]));
  emit({ tokensHash: payload.meta.tokensHash, expected }, "sync-meta.js");
} else {
  console.error(`unknown step: ${step}(primitive / semantic / component / text-styles / meta)`);
  process.exit(1);
}
