// Turns the two fully-resolved token trees (dark / light) into the six
// distributable outputs listed in PROJECT_PLAN.md §2. Style Dictionary itself
// only resolves references (json/nested); this module owns the actual
// per-platform text generation, since cross-theme merging (dark + light in
// one variables.css) doesn't fit a single Style Dictionary format function.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function kebab(str) {
  return String(str)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** Walk a resolved token tree, yielding [cssNameParts[], leafValue] for every
 *  leaf. A "leaf" is anything that isn't a plain object of further tokens:
 *  strings, numbers, arrays (cubicBezier, shadow layers), typography objects.
 */
function isLeaf(value) {
  if (Array.isArray(value)) return true;
  if (value === null || typeof value !== "object") return true;
  // a typography composite has these exact keys; treat as a leaf we special-case
  if ("fontFamily" in value && "fontSize" in value) return true;
  return false;
}

function* walk(tree, prefix = []) {
  for (const [key, value] of Object.entries(tree)) {
    const nextPrefix = [...prefix, kebab(key)];
    if (isLeaf(value)) {
      yield [nextPrefix, value];
    } else {
      yield* walk(value, nextPrefix);
    }
  }
}

function cubicBezierToCss(arr) {
  return `cubic-bezier(${arr.join(", ")})`;
}

function shadowLayerToCss(layer) {
  return `${layer.offsetX} ${layer.offsetY} ${layer.blur} ${layer.spread} ${layer.color}`;
}

function shadowToCss(value) {
  const layers = Array.isArray(value) ? value : [value];
  return layers.map(shadowLayerToCss).join(", ");
}

function hexToChannels(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Flatten a resolved tree into cssVarName -> raw value, expanding
 *  typography composites and cubicBezier/shadow arrays into CSS-ready strings.
 *  color leaves are returned as-is (hex) so callers can also derive channel form.
 */
function flatten(tree) {
  const out = [];
  for (const [pathParts, value] of walk(tree)) {
    if (Array.isArray(value) && typeof value[0] === "number") {
      // cubicBezier
      out.push([pathParts, cubicBezierToCss(value)]);
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      // fontFamily stack
      out.push([pathParts, value.join(", ")]);
    } else if (Array.isArray(value)) {
      // shadow (array of layers)
      out.push([pathParts, shadowToCss(value)]);
    } else if (value && typeof value === "object" && "fontFamily" in value) {
      out.push([[...pathParts, "family"], Array.isArray(value.fontFamily) ? value.fontFamily.join(", ") : value.fontFamily]);
      out.push([[...pathParts, "size"], value.fontSize]);
      out.push([[...pathParts, "weight"], String(value.fontWeight)]);
      out.push([[...pathParts, "line-height"], value.lineHeight]);
      out.push([[...pathParts, "tracking"], value.letterSpacing]);
    } else if (value && typeof value === "object" && "color" in value && "offsetX" in value) {
      out.push([pathParts, shadowLayerToCss(value)]);
    } else {
      out.push([pathParts, value]);
    }
  }
  return out;
}

function isColorPath(pathParts) {
  return pathParts[0] === "color";
}

// ---------------------------------------------------------------------------
// 1+2. css/variables.css + css/theme.css
// ---------------------------------------------------------------------------

// Single-segment group -> Tailwind v4 theme namespace.
const TW4_NAMESPACE = {
  color: "color",
  space: "spacing",
  radius: "radius",
  text: "text",
};

// Two-segment prefix -> Tailwind v4 theme namespace (checked before the
// single-segment table). Only `motion.easing.*` has a real TW4 namespace
// (`--ease-*`); `motion.duration.*` has no named-scale equivalent, so
// components reference `--aurora-motion-duration-*` directly instead.
const TW4_NAMESPACE_2SEG = {
  "motion.easing": "ease",
};

function buildCssOutputs(darkTree, lightTree) {
  const darkFlat = flatten(darkTree);
  const lightFlat = flatten(lightTree);

  const rootLines = [];
  const lightLines = [];
  const themeInlineLines = [];
  const seenThemeVars = new Set();

  for (const [pathParts, value] of darkFlat) {
    const varName = `--aurora-${pathParts.join("-")}`;
    rootLines.push(`  ${varName}: ${value};`);
  }
  for (const [pathParts, value] of lightFlat) {
    const varName = `--aurora-${pathParts.join("-")}`;
    lightLines.push(`  ${varName}: ${value};`);
  }

  // @theme inline bridge — only for the Tailwind v4 namespaces we actually use
  for (const [pathParts] of darkFlat) {
    const auroraVar = `--aurora-${pathParts.join("-")}`;
    const twoSegKey = `${pathParts[0]}.${pathParts[1]}`;
    const ns2 = TW4_NAMESPACE_2SEG[twoSegKey];
    const [group, ...rest] = pathParts;
    let twVar;
    if (ns2) {
      twVar = `--${ns2}-${pathParts.slice(2).join("-")}`;
    } else {
      const ns = TW4_NAMESPACE[group];
      if (!ns) continue;
      twVar = `--${ns}-${rest.join("-")}`;
    }
    if (seenThemeVars.has(twVar)) continue;
    seenThemeVars.add(twVar);
    themeInlineLines.push(`  ${twVar}: var(${auroraVar});`);
  }

  const variablesCss = `/* Generated by packages/tokens — do not edit by hand. */\n:root {\n  color-scheme: dark;\n${rootLines.join("\n")}\n}\n\n[data-theme="light"] {\n  color-scheme: light;\n${lightLines.join("\n")}\n}\n`;

  const themeCss = `/* Generated by packages/tokens — do not edit by hand. */\n@import "./variables.css";\n\n@theme inline {\n${themeInlineLines.join("\n")}\n}\n\n@utility z-dropdown { z-index: var(--aurora-z-dropdown); }\n@utility z-sticky   { z-index: var(--aurora-z-sticky); }\n@utility z-overlay  { z-index: var(--aurora-z-overlay); }\n@utility z-modal    { z-index: var(--aurora-z-modal); }\n@utility z-popover  { z-index: var(--aurora-z-popover); }\n@utility z-toast    { z-index: var(--aurora-z-toast); }\n@utility z-tooltip  { z-index: var(--aurora-z-tooltip); }\n`;

  return { variablesCss, themeCss };
}

// ---------------------------------------------------------------------------
// 3+4. native/preset.js + native/global.css (NativeWind v4, Tailwind 3.4)
// ---------------------------------------------------------------------------

/** Recreate the nested `theme.extend.colors` shape Tailwind v3 expects from
 *  a flat list of color leaves, using the `rgb(var(--color-x) / <alpha-value>)`
 *  trick so opacity modifiers keep working (see expense-tracker/mobile).
 */
function buildNativeOutputs(darkTree) {
  const darkFlat = flatten(darkTree).filter(([p]) => isColorPath(p));

  const channelVarLines = [];
  const nestedColors = {};

  for (const [pathParts, hex] of darkFlat) {
    const [, ...rest] = pathParts; // drop leading "color"
    const varSuffix = rest.join("-");
    const channels = hexToChannels(hex);
    if (!channels) continue;
    channelVarLines.push(`    --color-${varSuffix}: ${channels};`);

    // build nested object: bg-base -> { bg: { base: fn } }
    let node = nestedColors;
    for (let i = 0; i < rest.length - 1; i++) {
      node[rest[i]] ??= {};
      node = node[rest[i]];
    }
    node[rest[rest.length - 1]] = `__COLOR__${varSuffix}`;
  }

  function serialize(node, indent = 2) {
    const pad = " ".repeat(indent);
    const entries = Object.entries(node).map(([k, v]) => {
      const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      if (typeof v === "string" && v.startsWith("__COLOR__")) {
        const suffix = v.replace("__COLOR__", "");
        return `${pad}${key}: c("${suffix}"),`;
      }
      return `${pad}${key}: {\n${serialize(v, indent + 2)}\n${pad}},`;
    });
    return entries.join("\n");
  }

  const presetJs = `// Generated by packages/tokens — do not edit by hand.
// NativeWind v4 / Tailwind 3.4 preset. Colors use rgb(var(--x) / <alpha-value>)
// so opacity modifiers (bg-accent-default/20) keep working. See
// expense-tracker/mobile/tailwind.config.js for the pattern this follows.
const c = (name) => \`rgb(var(--color-\${name}) / <alpha-value>)\`;

module.exports = {
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
${serialize(nestedColors)}
      },
    },
  },
};
`;

  const globalCss = `/* Generated by packages/tokens — do not edit by hand. */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${channelVarLines.join("\n")}
  }
}
`;

  return { presetJs, globalCss };
}

// ---------------------------------------------------------------------------
// 5. js/index — plain TS object export (StyleSheet / react-native-svg use)
// ---------------------------------------------------------------------------

function buildJsOutputs(darkTree) {
  const js = `// Generated by packages/tokens — do not edit by hand.
export const tokens = ${JSON.stringify(darkTree, null, 2)};
export default tokens;
`;
  const dts = `// Generated by packages/tokens — do not edit by hand.
export declare const tokens: Record<string, unknown>;
export default tokens;
`;
  return { js, dts };
}

// ---------------------------------------------------------------------------
// 6. figma/variables.json — Plugin API payload
// ---------------------------------------------------------------------------

function toFigmaRgba(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: 1,
  };
}

function buildFigmaVariables(darkTree, lightTree) {
  const darkColors = flatten(darkTree).filter(([p]) => isColorPath(p));
  const lightColors = new Map(flatten(lightTree).filter(([p]) => isColorPath(p)).map(([p, v]) => [p.join("/"), v]));

  const semanticVars = [];
  const primitiveVars = [];

  for (const [pathParts, hex] of darkColors) {
    const rgba = toFigmaRgba(hex);
    if (!rgba) continue;
    const name = pathParts.slice(1).join("/"); // drop leading "color"
    const isSemantic = ["bg", "border", "text", "accent", "accent-alt", "on-accent", "focus-ring", "status"].includes(pathParts[1]);
    if (isSemantic) {
      const lightHex = lightColors.get(pathParts.join("/"));
      const lightRgba = lightHex ? toFigmaRgba(lightHex) : rgba;
      semanticVars.push({
        name,
        type: "COLOR",
        values: { Dark: rgba, Light: lightRgba },
      });
    } else {
      primitiveVars.push({ name, type: "COLOR", values: { Value: rgba } });
    }
  }

  return {
    collections: [
      { name: "primitive", modes: ["Value"], variables: primitiveVars },
      { name: "semantic", modes: ["Dark", "Light"], variables: semanticVars },
    ],
  };
}

// ---------------------------------------------------------------------------

export async function emitAll({ darkTree, lightTree, distDir }) {
  const { variablesCss, themeCss } = buildCssOutputs(darkTree, lightTree);
  const { presetJs, globalCss } = buildNativeOutputs(darkTree);
  const { js, dts } = buildJsOutputs(darkTree);
  const figma = buildFigmaVariables(darkTree, lightTree);

  const writes = [
    ["css/variables.css", variablesCss],
    ["css/theme.css", themeCss],
    ["native/preset.js", presetJs],
    ["native/global.css", globalCss],
    ["js/index.js", js],
    ["js/index.d.ts", dts],
    ["figma/variables.json", JSON.stringify(figma, null, 2) + "\n"],
  ];

  for (const [rel] of writes) {
    await mkdir(path.join(distDir, path.dirname(rel)), { recursive: true });
  }
  await Promise.all(writes.map(([rel, content]) => writeFile(path.join(distDir, rel), content)));

  return writes.map(([rel]) => rel);
}
