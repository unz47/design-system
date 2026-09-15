// コンポーネント/ドキュメントを組む use_figma スクリプトの先頭に貼る補助関数。
// 変数とテキストスタイルは名前で引く(IDはファイルごとに違うため)。生の値は書かず、必ずここ経由で紐付ける。

const VARS = new Map((await figma.variables.getLocalVariablesAsync()).map((x) => [x.name, x]));
const STYLES = new Map((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]));
await Promise.all([...STYLES.values()].map((s) => figma.loadFontAsync(s.fontName)));

const $v = (name) => {
  const found = VARS.get(name);
  if (!found) throw new Error(`variable not found: ${name}`);
  return found;
};
const $paint = (name) =>
  figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", $v(name));
const $fill = (node, name) => {
  node.fills = name ? [$paint(name)] : [];
};
const $stroke = (node, name, width = "border-width/default") => {
  node.strokes = [$paint(name)];
  node.setBoundVariable("strokeWeight", $v(width));
};
const $radius = (node, name) => {
  for (const k of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) node.setBoundVariable(k, $v(name));
};
const $pad = (node, x, y = x) => {
  if (x) for (const k of ["paddingLeft", "paddingRight"]) node.setBoundVariable(k, $v(x));
  if (y) for (const k of ["paddingTop", "paddingBottom"]) node.setBoundVariable(k, $v(y));
};
const $gap = (node, name) => node.setBoundVariable("itemSpacing", $v(name));
const $text = async (chars, style, color, name = "label") => {
  const t = figma.createText();
  t.name = name;
  await t.setTextStyleIdAsync(STYLES.get(style).id);
  t.characters = chars;
  if (color) $fill(t, color);
  return t;
};
