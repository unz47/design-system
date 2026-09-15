// use_figma に渡す本体(render.mjs が先頭に `const PAYLOAD = {...};` を付ける)。
// PAYLOAD = { collection: { name, modes }, variables: [...] }(dist/figma/variables.json の1コレクション分)
//
// 名前一致で更新・無ければ作成。Figma側にしか無い変数は消さない(audit ステップで警告する)。
// 途中で失敗しても、同じPAYLOADで流し直せば続きから揃う。

const { collection: spec, variables } = PAYLOAD;

let collections = await figma.variables.getLocalVariableCollectionsAsync();
let coll = collections.find((c) => c.name === spec.name);
const createdCollection = !coll;
if (!coll) coll = figma.variables.createVariableCollection(spec.name);

const addedModes = [];
spec.modes.forEach((name, i) => {
  if (coll.modes.some((m) => m.name === name)) return;
  // 新規コレクションの既定モード "Mode 1" は1つ目のモードに改名する
  if (i === 0 && coll.modes.length === 1 && coll.modes[0].name === "Mode 1") {
    coll.renameMode(coll.modes[0].modeId, name);
  } else {
    addedModes.push(coll.addMode(name));
  }
});
const modeId = Object.fromEntries(coll.modes.map((m) => [m.name, m.modeId]));

collections = await figma.variables.getLocalVariableCollectionsAsync();
const collName = Object.fromEntries(collections.map((c) => [c.id, c.name]));
const byKey = new Map(
  (await figma.variables.getLocalVariablesAsync()).map((v) => [`${collName[v.variableCollectionId]}:${v.name}`, v]),
);

const created = [];
const updated = [];
for (const def of variables) {
  const key = `${spec.name}:${def.name}`;
  let v = byKey.get(key);
  if (v && v.resolvedType !== def.type) {
    throw new Error(`型が違う: ${key} は Figma では ${v.resolvedType}、コードでは ${def.type}。手で消してから流し直す`);
  }
  if (v) {
    updated.push(v.id);
  } else {
    v = figma.variables.createVariable(def.name, coll, def.type);
    byKey.set(key, v);
    created.push(v.id);
  }
  v.scopes = def.scopes;
  v.setVariableCodeSyntax("WEB", def.codeSyntax.WEB);
  for (const [mode, value] of Object.entries(def.values)) {
    if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
      const target = byKey.get(`${value.collection}:${value.name}`);
      if (!target) throw new Error(`参照先が無い: ${value.collection}:${value.name}(先に ${value.collection} を同期する)`);
      v.setValueForMode(modeId[mode], figma.variables.createVariableAlias(target));
    } else {
      v.setValueForMode(modeId[mode], value);
    }
  }
}

return {
  collection: { id: coll.id, name: coll.name, created: createdCollection, modes: coll.modes.map((m) => m.name), addedModes },
  createdVariableIds: created,
  updatedVariableIds: updated,
  counts: { created: created.length, updated: updated.length },
};
