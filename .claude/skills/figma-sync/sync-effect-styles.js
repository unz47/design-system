// use_figma に渡す本体(render.mjs が先頭に `const PAYLOAD = {...};` を付ける)。
// PAYLOAD = { effectStyles: [{ name, layers: [{ color, "offset-x", "offset-y", blur, spread }] }] }
//
// 影の各層の値は semantic の変数(Dark / Light)に紐付ける。スタイル自体はモードを持てないが、
// 紐付けた変数が使う側のモードで解決されるので、影もテーマに追従する。
// semantic の同期(影の層の変数を含む)が先に済んでいること。

const FIELD = { color: "color", "offset-x": "offsetX", "offset-y": "offsetY", blur: "radius", spread: "spread" };

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const semantic = collections.find((c) => c.name === "semantic");
if (!semantic) throw new Error("semantic コレクションが無い。先に変数を同期する");
const vars = new Map(
  (await figma.variables.getLocalVariablesAsync())
    .filter((v) => v.variableCollectionId === semantic.id)
    .map((v) => [v.name, v]),
);

const existing = await figma.getLocalEffectStylesAsync();
const created = [];
const updated = [];
for (const def of PAYLOAD.effectStyles) {
  let style = existing.find((s) => s.name === def.name);
  if (style) {
    updated.push(style.id);
  } else {
    style = figma.createEffectStyle();
    style.name = def.name;
    created.push(style.id);
  }
  style.effects = def.layers.map((layer) => {
    let effect = {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0 },
      offset: { x: 0, y: 0 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    };
    for (const [key, field] of Object.entries(FIELD)) {
      const variable = vars.get(layer[key]);
      if (!variable) throw new Error(`${def.name} の ${key} の紐付け先 semantic:${layer[key]} が無い`);
      effect = figma.variables.setBoundVariableForEffect(effect, field, variable);
    }
    return effect;
  });
}

return { createdStyleIds: created, updatedStyleIds: updated, counts: { created: created.length, updated: updated.length } };
