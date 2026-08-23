// Aurora tokens build. See PROJECT_PLAN.md §2 and TOKENS.md for the design.
//
// Pipeline:
//   1. generate-colors.mjs computes the OKLCH-derived primitive color ramps
//      and writes src/primitive/color.json (checked in, not hand-edited).
//   2. Style Dictionary resolves the full DTCG token graph twice — once with
//      semantic/color.dark.json, once with semantic/color.light.json — and
//      dumps each fully-resolved tree via the built-in json/nested format.
//      (Cross-theme merging doesn't fit a single SD format function, so the
//      dark/light merge happens in step 3 instead of inside Style Dictionary.)
//   3. sd/emit.mjs turns the two resolved trees into the six distributable
//      outputs under dist/.

import StyleDictionary from "style-dictionary";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emitAll } from "./sd/emit.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.join(__dirname, "sd", ".cache");
const distDir = path.join(__dirname, "dist");

await import("./sd/generate-colors.mjs");

async function resolveTheme(themeFile, outFile) {
  const sd = new StyleDictionary({
    source: [
      "src/primitive/**/*.json",
      `src/semantic/${themeFile}`,
      "src/component/**/*.json",
    ],
    platforms: {
      json: {
        transformGroup: "js",
        buildPath: `${path.relative(__dirname, cacheDir)}/`,
        files: [{ destination: outFile, format: "json/nested" }],
      },
    },
  });
  await sd.buildAllPlatforms();
  return JSON.parse(await readFile(path.join(cacheDir, outFile), "utf8"));
}

const darkTree = await resolveTheme("color.dark.json", "dark.json");
const lightTree = await resolveTheme("color.light.json", "light.json");

const written = await emitAll({ darkTree, lightTree, distDir });

await rm(cacheDir, { recursive: true, force: true });

console.log(`Aurora tokens built:\n${written.map((f) => `  dist/${f}`).join("\n")}`);
