// コンポーネントページを1回の use_figma で組むためのキット。figma-helpers.js の内容を含む。
// 使い方: このファイルの中身を貼り、続けてコンポーネント固有のコードを書く。
//   const page = await openPage("Button", "atoms");
//   await docFrame(page, "Button", "説明", ["メモ"], "packages/react/src/components/atoms/button");
//   const comps = [...]  // figma.createComponent() で作った各バリアント(名前は "Prop=Value, Prop=Value")
//   const { cs } = await finish(page, "Button", comps, { col: "Size", rows: ["Variant", "State"], texts: { Label: ["label", "Button"] } });

const VARS = new Map((await figma.variables.getLocalVariablesAsync()).map((x) => [x.name, x]));
const STYLES = new Map((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]));
await Promise.all([...STYLES.values()].map((s) => figma.loadFontAsync(s.fontName)));
const SEM = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "semantic");
const LIGHT = SEM.modes.find((m) => m.name === "Light").modeId;

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
const $size = (node, w, h = w) => {
  if (w) node.setBoundVariable("width", $v(w));
  if (h) node.setBoundVariable("height", $v(h));
};
// disabled は要素全体の不透明度(opacity/disabled は Figma 上 0–100)
const $disabled = (node) => node.setBoundVariable("opacity", $v("opacity/disabled"));
const $text = async (chars, style, color, name = "label") => {
  const t = figma.createText();
  t.name = name;
  await t.setTextStyleIdAsync(STYLES.get(style).id);
  t.characters = chars;
  if (color) $fill(t, color);
  return t;
};
const wrapText = (t) => {
  t.textAutoResize = "HEIGHT";
  t.layoutSizingHorizontal = "FILL";
};
// lucide の path を渡す(24x24 viewBox, stroke 2)。線の色は変数に紐付ける
const $icon = (paths, px, color, name = "icon") => {
  const n = figma.createNodeFromSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none"><g stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`,
  );
  n.name = name;
  n.fills = [];
  for (const vec of n.findAll((x) => x.type !== "FRAME" && x.type !== "GROUP" && "strokes" in x)) vec.strokes = [$paint(color)];
  return n;
};
const ICON = {
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  minus: '<path d="M5 12h14"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  inbox:
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};
const $component = (name, layout = "HORIZONTAL") => {
  const c = figma.createComponent();
  c.name = name;
  if (layout) {
    c.layoutMode = layout;
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
  }
  c.fills = [];
  return c;
};

// ページは名前で引く。作り直すときは中身を全部消してから組む(このページはこのスクリプトだけが持つ)
async function openPage(name, section) {
  let page = figma.root.children.find((p) => p.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
    // 区切りページの直前に差し込む。organisms は末尾のまま
    const before = { atoms: "--- Molecules", molecules: "--- Organisms" }[section];
    const index = figma.root.children.findIndex((p) => p.name === before);
    if (index >= 0) figma.root.insertChild(index, page);
  }
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) n.remove();
  return page;
}

async function docFrame(page, title, description, notes = [], source) {
  const d = figma.createAutoLayout("VERTICAL", { name: `${title} / Documentation` });
  page.appendChild(d);
  d.resize(400, 10);
  d.counterAxisSizingMode = "FIXED";
  d.primaryAxisSizingMode = "AUTO";
  d.x = 0;
  d.y = 0;
  $fill(d, "color/bg/base");
  $stroke(d, "color/border/subtle");
  $radius(d, "radius/surface");
  $pad(d, "space/xl");
  $gap(d, "space/md");
  d.appendChild(await $text(title, "title", "color/text/primary", "title"));
  const desc = await $text(description, "body", "color/text/secondary", "description");
  d.appendChild(desc);
  wrapText(desc);
  for (const note of notes) {
    const t = await $text(`• ${note}`, "body-sm", "color/text/muted", "note");
    d.appendChild(t);
    wrapText(t);
  }
  if (source) {
    const s = await $text(source, "caption", "color/accent/dim", "source");
    d.appendChild(s);
    wrapText(s);
  }
  return d;
}

// バリアント名 "A=x, B=y" から、col 軸を列、rows 軸の組を行にしたグリッドに並べる
function layoutGrid(cs, col, rows = []) {
  const P = 32;
  const G = 24;
  const kids = cs.children.map((c) => ({ c, p: Object.fromEntries(c.name.split(", ").map((s) => s.split("="))) }));
  const colVals = col ? [...new Set(kids.map((k) => k.p[col]))] : [null];
  const rowKey = (k) => rows.map((a) => k.p[a]).join("|");
  const rowVals = [...new Set(kids.map(rowKey))];
  const colOf = (k) => (col ? colVals.indexOf(k.p[col]) : 0);
  const colW = colVals.map((_, i) => Math.max(0, ...kids.filter((k) => colOf(k) === i).map((k) => k.c.width)));
  const rowH = rowVals.map((v) => Math.max(0, ...kids.filter((k) => rowKey(k) === v).map((k) => k.c.height)));
  const offset = (sizes, i) => sizes.slice(0, i).reduce((a, b) => a + b + G, 0);
  for (const k of kids) {
    k.c.x = P + offset(colW, colOf(k));
    k.c.y = P + offset(rowH, rowVals.indexOf(rowKey(k)));
  }
  cs.resizeWithoutConstraints(
    P * 2 + colW.reduce((a, b) => a + b, 0) + G * (colW.length - 1),
    P * 2 + rowH.reduce((a, b) => a + b, 0) + G * (rowH.length - 1),
  );
}

async function finish(page, name, comps, { col, rows = [], description, texts = {}, x = 464, y = 0 } = {}) {
  const cs = figma.combineAsVariants(comps, page);
  cs.name = name;
  if (description) cs.description = description;
  $fill(cs, "color/bg/base");
  $stroke(cs, "color/border/subtle");
  $radius(cs, "radius/surface");
  layoutGrid(cs, col, rows);
  cs.x = x;
  cs.y = y;

  const propKeys = {};
  for (const [prop, [nodeName, defaultValue]] of Object.entries(texts)) {
    const key = cs.addComponentProperty(prop, "TEXT", defaultValue);
    for (const c of cs.children) {
      // 既存の紐付け(visible など)を消さないよう合わせて代入する
      for (const t of c.findAll((n) => n.type === "TEXT" && n.name === nodeName)) {
        t.componentPropertyReferences = { ...t.componentPropertyReferences, characters: key };
      }
    }
    propKeys[prop] = key;
  }

  // 同じバリアントを Light モードで並べる確認用の枠
  const pv = figma.createAutoLayout("HORIZONTAL", { name: `${name} / Light` });
  page.appendChild(pv);
  pv.layoutWrap = "WRAP";
  pv.resize(Math.max(cs.width, 320), 10);
  pv.primaryAxisSizingMode = "FIXED";
  pv.counterAxisSizingMode = "AUTO";
  pv.counterAxisAlignItems = "CENTER";
  $fill(pv, "color/bg/base");
  $stroke(pv, "color/border/subtle");
  $radius(pv, "radius/surface");
  $pad(pv, "space/xl");
  $gap(pv, "space/lg");
  pv.setBoundVariable("counterAxisSpacing", $v("space/lg"));
  pv.setExplicitVariableModeForCollection(SEM, LIGHT);
  for (const c of cs.children) pv.appendChild(c.createInstance());
  pv.x = cs.x;
  pv.y = cs.y + cs.height + 48;
  return { cs, pv, propKeys };
}
