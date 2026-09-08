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
 *  `steps` is the full ordered list of step names, lightest first.
 *  Missing steps are interpolated in L (and C) between their nearest known neighbours,
 *  holding hue fixed at the anchor's hue.
 *
 *  `darkStep` / `lightStep` control how far each extrapolated step travels in L
 *  past the outermost anchor. frost overrides `darkStep` because its light-theme
 *  steps have to clear WCAG AA against a near-white background (see TOKENS.md).
 */
function buildRamp(name, steps, known, { darkStep = 0.09, lightStep = 0.06 } = {}) {
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
      l = Math.max(0.06, before.l - darkStep * t);
      c = Math.max(0, before.c - 0.01 * t);
    } else {
      // extrapolate lighter, taper chroma multiplicatively — a subtractive
      // taper wipes out neutral's very small chroma entirely and turns the
      // lightest steps into flat greys instead of silver.
      const t = after.idx - i;
      l = Math.min(0.98, after.l + lightStep * t);
      c = Math.max(0, after.c * 0.75 ** t);
    }
    result[step] = formatHex({ mode: "oklch", l, c, h: hue });
  }
  return result;
}

// ---- neutral: the 9 already-approved values keep their exact hex, but sit on a
// 13-step scale so the light theme has real steps to work with. The dark theme
// only ever needed the 100 + 400..950 half of the ramp; light needs bg (3) +
// border (3) at or above #EEF2F7, which is why 0/50/200/300 exist. Step 0 is
// pure white so light-theme elevation can travel toward the light source the
// same way dark-theme elevation travels toward #1A1E2D. See TOKENS.md.
const neutral = buildRamp(
  "neutral",
  ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "850", "900", "950"],
  {
    "0": "#FFFFFF", // light bg.raised / on-accent
    "100": "#EEF2F7", // dark text.primary / light bg.base
    "400": "#9CA6BC", // dark text.secondary / light border.strong
    "500": "#5C6478", // dark text.muted / light text.muted
    "600": "#454C63", // dark border.strong
    "700": "#2C3244", // dark border.default / light text.secondary
    "800": "#1E2230", // dark border.subtle
    "850": "#1A1E2D", // dark bg.raised
    "900": "#12141F", // dark bg.surface
    "950": "#0A0C14", // dark bg.base / light text.primary
  },
);

// ---- frost (accent): 8 steps, 3 already approved. 700/800 are extrapolated
// darker than any approved value because the light theme needs a frost that
// carries white text at 4.5:1 and a focus ring that clears 3:1 on near-white.
const frost = buildRamp(
  "frost",
  ["100", "200", "300", "400", "500", "600", "700", "800"],
  {
    "200": "#D4F1FA", // dark accent.glow / light accent.glow
    "400": "#9BDCF0", // dark accent (default)
    "600": "#6BB8D6", // dark accent.dim / light accent.dim
  },
  { darkStep: 0.112 },
);

// ---- plum (accent-alt): 4 steps, 1 already approved. Rare use, never gradient.
const plum = buildRamp("plum", ["300", "400", "500", "600"], {
  "500": "#6B4C7A",
});

// ---- status colors: 6 named steps each (solid = approved anchor).
// The `solid` / `subtle-bg` / `border` trio is tuned for the dark theme — a
// bright solid on a very dark tinted background. The light theme inverts that
// relationship, so it gets its own trio rather than reusing values that only
// read correctly on #0A0C14. `solid-strong` sits at L 0.47, which is dark
// enough both to be read on `subtle-bg-light` and to carry white text as a
// filled button background.
function statusRamp(hex) {
  const anchor = toOklch(hex);
  const hue = anchor.h ?? 0;
  const c = anchor.c ?? 0;
  return {
    solid: hex,
    "subtle-bg": formatHex({ mode: "oklch", l: 0.2, c: Math.min(c, 0.06), h: hue }),
    border: formatHex({ mode: "oklch", l: 0.34, c: Math.min(c, 0.1), h: hue }),
    "solid-strong": formatHex({ mode: "oklch", l: 0.47, c: Math.min(c, 0.16), h: hue }),
    "subtle-bg-light": formatHex({ mode: "oklch", l: 0.96, c: Math.min(c, 0.05), h: hue }),
    "border-light": formatHex({ mode: "oklch", l: 0.84, c: Math.min(c, 0.08), h: hue }),
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
