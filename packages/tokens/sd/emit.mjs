// Turns the two fully-resolved token trees (dark / light) into the six
// distributable outputs listed in PROJECT_PLAN.md §2. Style Dictionary itself
// only resolves references (json/nested); this module owns the actual
// per-platform text generation, since cross-theme merging (dark + light in
// one variables.css) doesn't fit a single Style Dictionary format function.

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
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
  // a single (non-array) shadow layer — without this it would be walked as a
  // group and emitted as --...-color / --...-offset-x / ... instead of one
  // usable box-shadow value.
  if ("color" in value && "offsetX" in value) return true;
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
  container: "container",
  shadow: "shadow",
};

// Tailwind v4 resolves several utilities (max-w, min-w, w, h, ...) by
// falling back through multiple namespaces, e.g. max-w checks
// `--max-width-*`, then `--spacing-*`, then `--container-*` in that order.
// Our `space` keys (3xs..3xl) are spelled exactly like Tailwind's built-in
// named `--container-*` scale, so without a prefix `max-w-sm` would resolve
// to our 12px spacing token instead of Tailwind's 24rem container size.
// Prefixing the bridged key (not the underlying --aurora-* token name) keeps
// `--spacing-sp-sm` out of every scale Tailwind checks before `--container-*`.
const TW4_KEY_PREFIX = {
  space: "sp",
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
      const keyPrefix = TW4_KEY_PREFIX[group];
      const restJoined = keyPrefix ? [keyPrefix, ...rest].join("-") : rest.join("-");
      twVar = `--${ns}-${restJoined}`;
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
// 6. figma/variables.json — Plugin API payload (PROJECT_PLAN.md §6)
// ---------------------------------------------------------------------------
//
// Unlike the other outputs this one is built from the *source* DTCG files, not
// the resolved trees: resolution has already replaced `{color.neutral.950}`
// with a hex, and Figma needs that reference kept so semantic → primitive and
// component → primitive become VARIABLE_ALIAS links in the file.
//
// Every source token must be either given scopes below or listed in
// FIGMA_SKIP. An unclassified token fails the build, so adding a token
// category forces a decision about how it appears in Figma.

// Scopes decide which Figma pickers offer a variable. Longest matching path
// prefix wins. Primitive colors get none, so designers reach for semantic ones.
const FIGMA_SCOPES = {
  primitive: {
    color: [],
    space: ["GAP"],
    icon: ["WIDTH_HEIGHT"],
    container: ["WIDTH_HEIGHT"],
    radius: ["CORNER_RADIUS"],
    borderWidth: ["STROKE_FLOAT"],
    fontFamily: ["FONT_FAMILY"],
    fontWeight: ["FONT_WEIGHT"],
    opacity: ["OPACITY"],
    "effect.frost.blur": ["EFFECT_FLOAT"],
    "effect.glow.blur": ["EFFECT_FLOAT"],
    "effect.glow.opacity": ["OPACITY"],
    "effect.grain.opacity": ["OPACITY"],
  },
  semantic: {
    "color.bg": ["FRAME_FILL", "SHAPE_FILL"],
    "color.border": ["STROKE_COLOR"],
    "color.text": ["TEXT_FILL"],
    "color.accent": ["ALL_FILLS", "STROKE_COLOR"],
    "color.accent-alt": ["ALL_FILLS", "STROKE_COLOR"],
    "color.on-accent": ["TEXT_FILL", "SHAPE_FILL"],
    "color.focus-ring": ["STROKE_COLOR", "EFFECT_COLOR"],
    "color.status": ["ALL_FILLS", "STROKE_COLOR"],
    // shadow layer values; the color of each layer overrides this with EFFECT_COLOR
    shadow: ["EFFECT_FLOAT"],
  },
  component: {
    "control.height": ["WIDTH_HEIGHT"],
    "control.field-padding-x": ["GAP"],
  },
};

// Tokens that intentionally have no Figma variable, with the reason.
const FIGMA_SKIP = {
  z: "Figmaに重なり順の変数は無い",
  motion: "duration / easing はVariablesで持てない",
  text: "typographyの複合値は変数にできないので textStyles に出す",
  "effect.metallic": "グラデーションは変数にできない",
  "effect.frost.saturate": "Figmaにbackdropのsaturate設定が無い",
};

const FIGMA_TYPE = {
  color: "COLOR",
  dimension: "FLOAT",
  fontWeight: "FLOAT",
  number: "FLOAT",
  fontFamily: "STRING",
};

const FONT_STYLE = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" };

const REF = /^\{([^}]+)\}$/;

function lookupPrefix(table, pathParts) {
  for (let i = pathParts.length; i > 0; i--) {
    const key = pathParts.slice(0, i).join(".");
    if (key in table) return table[key];
  }
  return undefined;
}

function* walkSource(tree, prefix = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$") || !node || typeof node !== "object") continue;
    const nextPrefix = [...prefix, key];
    if ("$value" in node) yield [nextPrefix, node];
    else yield* walkSource(node, nextPrefix);
  }
}

async function readTokenFiles(dir, match = () => true) {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json") && match(f)).sort();
  return Promise.all(
    files.map(async (f) => {
      const content = await readFile(path.join(dir, f), "utf8");
      return { file: path.join(dir, f), content, tokens: [...walkSource(JSON.parse(content))] };
    }),
  );
}

function toFigmaRgba(hex) {
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(hex);
  if (rgba) {
    const [, r, g, b, a = "1"] = rgba;
    return { r: Number(r) / 255, g: Number(g) / 255, b: Number(b) / 255, a: Number(a) };
  }
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex);
  if (!m) throw new Error(`figma: 色 ${hex} をRGBAに変換できない(#RRGGBB / #RRGGBBAA / rgba() のみ)`);
  const n = parseInt(m[1], 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: m[2] ? parseInt(m[2], 16) / 255 : 1,
  };
}

function pxToNumber(value) {
  const m = /^(-?[\d.]+)px$/.exec(value);
  if (!m) throw new Error(`figma: ${value} はpx単位でないのでFLOATにできない`);
  return Number(m[1]);
}

function emToPercent(value) {
  const m = /^(-?[\d.]+)(em)?$/.exec(value);
  if (!m) throw new Error(`figma: letterSpacing ${value} はem単位でない`);
  return round(Number(m[1]) * 100);
}

function round(n) {
  return Math.round(n * 10000) / 10000;
}

// Figma reads a variable bound to opacity as a percentage, while the tokens
// (and CSS) use 0–1. Verified by binding opacity/disabled (0.5) to a
// rectangle: node.opacity resolved to 0.005.
function toFigmaScale(value, scopes) {
  return scopes.includes("OPACITY") && typeof value === "number" ? round(value * 100) : value;
}

function figmaName(pathParts) {
  return pathParts.map(kebab).join("/");
}

function figmaValue(token, registry) {
  const ref = typeof token.$value === "string" ? REF.exec(token.$value) : null;
  if (ref) {
    const target = registry.get(ref[1]);
    if (!target) throw new Error(`figma: 参照先 {${ref[1]}} がFigma変数になっていない(FIGMA_SKIP に入っていないか確認)`);
    return { type: "VARIABLE_ALIAS", collection: target.collection, name: target.name };
  }
  switch (token.$type) {
    case "color":
      return toFigmaRgba(token.$value);
    case "dimension":
      return pxToNumber(token.$value);
    case "fontFamily":
      return token.$value[0];
    default:
      return token.$value;
  }
}

const SHADOW_FIELDS = [
  ["color", "color"],
  ["offset-x", "offsetX"],
  ["offset-y", "offsetY"],
  ["blur", "blur"],
  ["spread", "spread"],
];
const TRANSPARENT_LAYER = { color: "rgba(0, 0, 0, 0)", offsetX: "0px", offsetY: "0px", blur: "0px", spread: "0px" };

// A shadow is several layers of five values, and a Figma variable can't hold
// a composite. Each layer value becomes its own variable so an Effect Style
// can bind to them; living in the semantic collection, the shadow then
// follows the Dark/Light mode like a color does. A theme with fewer layers is
// padded with a transparent one so both modes bind the same effect list.
function expandShadow(p, byMode) {
  const layers = Object.fromEntries(
    Object.entries(byMode).map(([mode, t]) => [mode, Array.isArray(t.$value) ? t.$value : [t.$value]]),
  );
  const count = Math.max(...Object.values(layers).map((l) => l.length));
  const entries = [];
  for (let i = 0; i < count; i++) {
    for (const [key, field] of SHADOW_FIELDS) {
      const perMode = Object.entries(layers).map(([mode, l]) => [
        mode,
        {
          $type: key === "color" ? "color" : "dimension",
          $value: (l[i] ?? TRANSPARENT_LAYER)[field],
          $scopes: key === "color" ? ["EFFECT_COLOR"] : undefined,
          $cssPath: p,
        },
      ]);
      entries.push([[...p, String(i + 1), key], Object.fromEntries(perMode)]);
    }
  }
  const style = {
    name: figmaName(p),
    layers: Array.from({ length: count }, (_, i) =>
      Object.fromEntries(SHADOW_FIELDS.map(([key]) => [key, figmaName([...p, String(i + 1), key])])),
    ),
  };
  return { entries, style };
}

function buildTextStyles(primitiveTokens, registry) {
  const byPath = new Map(primitiveTokens.map(([p, t]) => [p.join("."), t]));
  const deref = (value) => {
    const ref = typeof value === "string" ? REF.exec(value) : null;
    return ref ? byPath.get(ref[1]).$value : value;
  };
  const bindingOf = (value) => {
    const ref = typeof value === "string" ? REF.exec(value) : null;
    return ref ? registry.get(ref[1])?.name : undefined;
  };

  return primitiveTokens
    .filter(([, t]) => t.$type === "typography")
    .map(([p, t]) => {
      const v = t.$value;
      const weight = deref(v.fontWeight);
      if (!FONT_STYLE[weight]) throw new Error(`figma: fontWeight ${weight} に対応するスタイル名が無い(FONT_STYLE に追加)`);
      return {
        name: figmaName(p.slice(1)),
        fontFamily: deref(v.fontFamily)[0],
        fontStyle: FONT_STYLE[weight],
        fontSize: pxToNumber(v.fontSize),
        lineHeight: { unit: "PERCENT", value: round(Number(v.lineHeight) * 100) },
        letterSpacing: { unit: "PERCENT", value: emToPercent(v.letterSpacing) },
        // text style properties to bind to primitive variables (by name)
        bindings: { fontFamily: bindingOf(v.fontFamily), fontWeight: bindingOf(v.fontWeight) },
      };
    });
}

async function buildFigmaPayload(srcDir) {
  const semanticDir = path.join(srcDir, "semantic");
  const primitiveFiles = await readTokenFiles(path.join(srcDir, "primitive"));
  const darkFiles = await readTokenFiles(semanticDir, (f) => f.endsWith(".dark.json"));
  const lightFiles = await readTokenFiles(semanticDir, (f) => f.endsWith(".light.json"));
  const componentFiles = await readTokenFiles(path.join(srcDir, "component"));

  const tokensOf = (files) => files.flatMap((f) => f.tokens);
  const lightByPath = new Map(tokensOf(lightFiles).map(([p, t]) => [p.join("."), t]));

  const effectStyles = [];
  const semanticEntries = tokensOf(darkFiles).flatMap(([p, t]) => {
    const light = lightByPath.get(p.join("."));
    if (!light) throw new Error(`figma: ${p.join(".")} がlightテーマに無い`);
    const byMode = { Dark: t, Light: light };
    if (t.$type !== "shadow") return [[p, byMode]];
    const { entries, style } = expandShadow(p, byMode);
    effectStyles.push(style);
    return entries;
  });

  const specs = [
    { name: "primitive", modes: ["Value"], entries: tokensOf(primitiveFiles).map(([p, t]) => [p, { Value: t }]) },
    { name: "semantic", modes: ["Dark", "Light"], entries: semanticEntries },
    { name: "component", modes: ["Value"], entries: tokensOf(componentFiles).map(([p, t]) => [p, { Value: t }]) },
  ];

  // Pass 1: decide which tokens become variables and register their names, so
  // aliases can point at any collection regardless of file order.
  const registry = new Map();
  for (const spec of specs) {
    spec.entries = spec.entries.filter(([p]) => {
      if (lookupPrefix(FIGMA_SKIP, p)) return false;
      if (!lookupPrefix(FIGMA_SCOPES[spec.name], p)) {
        throw new Error(
          `figma: ${p.join(".")}(${spec.name})のFigma上の扱いが未定義。emit.mjs の FIGMA_SCOPES か FIGMA_SKIP に追加すること`,
        );
      }
      registry.set(p.join("."), { collection: spec.name, name: figmaName(p) });
      return true;
    });
  }

  // Pass 2: values.
  const collections = specs.map((spec) => ({
    name: spec.name,
    modes: spec.modes,
    variables: spec.entries.map(([p, byMode]) => {
      const { $type, $scopes, $cssPath } = byMode[spec.modes[0]];
      if (!FIGMA_TYPE[$type]) throw new Error(`figma: $type "${$type}"(${p.join(".")})に対応するFigmaの型が無い`);
      const scopes = $scopes ?? lookupPrefix(FIGMA_SCOPES[spec.name], p);
      return {
        name: figmaName(p),
        type: FIGMA_TYPE[$type],
        scopes,
        codeSyntax: { WEB: `var(--aurora-${($cssPath ?? p).map(kebab).join("-")})` },
        values: Object.fromEntries(
          spec.modes.map((mode) => [mode, toFigmaScale(figmaValue(byMode[mode], registry), scopes)]),
        ),
      };
    }),
  }));

  // Written to Figma as `_meta/tokens-hash` so the next sync can tell whether
  // the file is behind the code (PROJECT_PLAN.md §6 drift detection).
  const hash = createHash("sha256");
  for (const f of [...primitiveFiles, ...darkFiles, ...lightFiles, ...componentFiles]) {
    hash.update(path.relative(srcDir, f.file).split(path.sep).join("/"));
    hash.update(f.content);
  }

  return {
    meta: { tokensHash: hash.digest("hex").slice(0, 16) },
    collections,
    textStyles: buildTextStyles(tokensOf(primitiveFiles), registry),
    effectStyles,
  };
}

// ---------------------------------------------------------------------------

export async function emitAll({ darkTree, lightTree, srcDir, distDir }) {
  const { variablesCss, themeCss } = buildCssOutputs(darkTree, lightTree);
  const { presetJs, globalCss } = buildNativeOutputs(darkTree);
  const { js, dts } = buildJsOutputs(darkTree);
  const figma = await buildFigmaPayload(srcDir);

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
