// use_figma に渡す本体(render.mjs が先頭に `const PAYLOAD = {...};` を付ける)。
// PAYLOAD = { tokensHash, expected: { [collectionName]: string[] } }
//
// 1. `_meta/tokens-hash` をprimitiveコレクションに書く(次回の同期でドリフト判定に使う)
// 2. コードに無いのにFigmaにある変数を列挙する。消さない — 判断は人がする

const META_NAME = "_meta/tokens-hash";

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const primitive = collections.find((c) => c.name === "primitive");
if (!primitive) throw new Error("primitive コレクションが無い。先に変数を同期する");

const allVars = await figma.variables.getLocalVariablesAsync();
let meta = allVars.find((v) => v.variableCollectionId === primitive.id && v.name === META_NAME);
const previousHash = meta ? meta.valuesByMode[primitive.defaultModeId] : null;
if (!meta) meta = figma.variables.createVariable(META_NAME, primitive, "STRING");
meta.scopes = [];
meta.hiddenFromPublishing = true;
meta.setValueForMode(primitive.defaultModeId, PAYLOAD.tokensHash);

const collName = Object.fromEntries(collections.map((c) => [c.id, c.name]));
const figmaOnly = allVars
  .filter((v) => v.name !== META_NAME)
  .filter((v) => !(PAYLOAD.expected[collName[v.variableCollectionId]] ?? []).includes(v.name))
  .map((v) => `${collName[v.variableCollectionId]}:${v.name}`);

return { metaVariableId: meta.id, previousHash, tokensHash: PAYLOAD.tokensHash, figmaOnly };
