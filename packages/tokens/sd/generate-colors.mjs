// Frost / Silver Witch's Garden — primitive color ramp generator.
// Known, already-approved hex values are used verbatim at their anchor step;
// only the missing steps in each ramp are computed via OKLCH interpolation.
// See TOKENS.md "色 — Frost / Silver Witch's Garden" for the design rationale.

import { formatHex, converter } from "culori";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toOklch = converter("oklch");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(__dirname, "..", "src", "primitive", "color.json");

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Build a hue-locked OKLCH ramp. `known` maps step -> hex (verbatim, unmodified).
 *  `steps` is the full ordered list of step names, darkest first.
 *  Missing steps are interpolated in L (and C) between their nearest known neighbours,
 *  holding hue fixed at the anchor's hue.
 */
function buildRamp(name, steps, known) {
  const knownEntries = Object.entries(known).map(([step, hex]) => {
    const idx = steps.indexOf(step);
    if (idx === -1) throw new Error(`${name}: unknown step "${step}"`);
    const c = toOklch(hex);
    return { idx, hex, l: c.l, c: c.c ?? 0, h: c.h ?? 0 };
  });
  knownEntries.sort((a, b) => a.idx - b.idx);

  // hue is held constant across the whole ramp — take it from the most saturated known step
  const hue = knownEntries.reduce((max, e) => (e.c > max.c ? e : max), knownEntries[0]).h;

  const result = {};
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (known[step]) {
      result[step] = known[step];
      continue;
    }
    // find bracketing known entries
    const before = [...knownEntries].reverse().find((e) => e.idx < i);
    const after = knownEntries.find((e) => e.idx > i);
    let l, c;
    if (before && after) {
      const t = (i - before.idx) / (after.idx - before.idx);
      l = lerp(before.l, after.l, t);
      c = lerp(before.c, after.c, t);
    } else if (before) {
      // extrapolate darker, taper chroma per Hallmark dark-mode recipe
      const t = i - before.idx;
      l = Math.max(0.06, before.l - 0.09 * t);
      c = Math.max(0, before.c - 0.01 * t);
    } else {
      // extrapolate lighter, taper chroma
      const t = after.idx - i;
      l = Math.min(0.98, after.l + 0.06 * t);
      c = Math.max(0, after.c - 0.015 * t);
    }
    result[step] = formatHex({ mode: "oklch", l, c, h: hue });
  }
  return result;
}

// ---- neutral: the 9 already-approved values, ordered darkest -> lightest,
// plus one extra computed step (950) darker than bg.base for headroom.
const neutral = buildRamp(
  "neutral",
  ["100", "200", "300", "400", "500", "600", "700", "800", "900", "950"],
  {
    "900": "#0A0C14", // bg.base
    "800": "#12141F", // bg.surface
    "700": "#1A1E2D", // bg.raised
    "600": "#1E2230", // border.subtle
    "500": "#2C3244", // border.default
    "400": "#454C63", // border.strong
    "300": "#5C6478", // text.muted
    "200": "#9CA6BC", // text.secondary
    "100": "#EEF2F7", // text.primary
  },
);

// ---- frost (accent): 6 steps, 3 already approved.
const frost = buildRamp("frost", ["100", "200", "300", "400", "500", "600"], {
  "200": "#D4F1FA", // accent.glow
  "400": "#9BDCF0", // accent (default)
  "600": "#6BB8D6", // accent.dim
});

// ---- plum (accent-alt): 4 steps, 1 already approved. Rare use, never gradient.
const plum = buildRamp("plum", ["300", "400", "500", "600"], {
  "500": "#6B4C7A",
});

// ---- status colors: 3 named steps each (solid = approved anchor).
function statusRamp(hex) {
  const anchor = toOklch(hex);
  const hue = anchor.h ?? 0;
  return {
    solid: hex,
    "subtle-bg": formatHex({ mode: "oklch", l: 0.2, c: Math.min(anchor.c ?? 0, 0.06), h: hue }),
    border: formatHex({ mode: "oklch", l: 0.34, c: Math.min(anchor.c ?? 0, 0.1), h: hue }),
  };
}

const success = statusRamp("#7FE8B8");
const danger = statusRamp("#E85D6B");
const warning = statusRamp("#E8C468");
const info = statusRamp("#7BC4E8");

function toDtcg(scale) {
  return Object.fromEntries(
    Object.entries(scale).map(([step, hex]) => [step, { $type: "color", $value: hex }]),
  );
}

const doc = {
  color: {
    neutral: toDtcg(neutral),
    frost: toDtcg(frost),
    plum: toDtcg(plum),
    success: toDtcg(success),
    danger: toDtcg(danger),
    warning: toDtcg(warning),
    info: toDtcg(info),
  },
};

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(doc, null, 2) + "\n");
console.log(`wrote ${path.relative(process.cwd(), outFile)}`);
