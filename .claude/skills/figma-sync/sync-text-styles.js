// use_figma に渡す本体(render.mjs が先頭に `const PAYLOAD = {...};` を付ける)。
// PAYLOAD = { textStyles: [...] }(dist/figma/variables.json の textStyles)
//
// 名前一致で更新・無ければ作成。fontFamily / fontWeight はprimitive変数にbindする。
// primitive の同期が先に済んでいること。

const fonts = new Map(PAYLOAD.textStyles.map((s) => [`${s.fontFamily}/${s.fontStyle}`, { family: s.fontFamily, style: s.fontStyle }]));
await Promise.all([...fonts.values()].map((f) => figma.loadFontAsync(f)));

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const primitive = collections.find((c) => c.name === "primitive");
if (!primitive) throw new Error("primitive コレクションが無い。先に変数を同期する");
const primitiveVars = new Map(
  (await figma.variables.getLocalVariablesAsync())
    .filter((v) => v.variableCollectionId === primitive.id)
    .map((v) => [v.name, v]),
);

const existing = await figma.getLocalTextStylesAsync();
const created = [];
const updated = [];
for (const def of PAYLOAD.textStyles) {
  let style = existing.find((s) => s.name === def.name);
  if (style) {
    updated.push(style.id);
  } else {
    style = figma.createTextStyle();
    style.name = def.name;
    created.push(style.id);
  }
  style.fontName = { family: def.fontFamily, style: def.fontStyle };
  style.fontSize = def.fontSize;
  style.lineHeight = def.lineHeight;
  style.letterSpacing = def.letterSpacing;
  for (const [field, name] of Object.entries(def.bindings)) {
    if (!name) continue;
    const variable = primitiveVars.get(name);
    if (!variable) throw new Error(`${def.name} の ${field} のbind先 primitive:${name} が無い`);
    style.setBoundVariable(field, variable);
  }
}

return { createdStyleIds: created, updatedStyleIds: updated, counts: { created: created.length, updated: updated.length } };
