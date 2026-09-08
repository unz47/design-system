// オーバーレイ系(Dialog / Popover / Menu / Select / Tooltip / Sheet)が共有する
// 「浮いている面」の見た目。同じ面を7箇所に書き写すとテーマ変更のたびにズレるので、
// ここに1本化する。React非依存なので variants.ts からそのまま import できる。

/** 開閉アニメーション。Base UI が data-starting-style / data-ending-style を
 *  付ける間だけ縮小+透明にする(CSSトランジションで補間される)。 */
export const overlayTransition =
  "transition-[opacity,transform] duration-[var(--aurora-motion-duration-normal)] ease-standard " +
  "data-starting-style:opacity-0 data-starting-style:scale-95 " +
  "data-ending-style:opacity-0 data-ending-style:scale-95 " +
  "motion-reduce:transition-none";

/** 浮いている面そのもの。elevation-3 は dark/light で別の影になる。 */
export const overlaySurface =
  "rounded-overlay border border-border-default bg-bg-surface text-text-primary shadow-elevation-3 " +
  "outline-none";

/** 背後を覆う幕。opacity.backdrop トークンを使う。
 *
 *  不透明度は「色のアルファ」ではなく**要素の opacity** で当てている。
 *  `bg-bg-base/[var(--aurora-opacity-backdrop)]` は color-mix() に展開されるが、
 *  トークンの値が単位なしの `0.72` なので color-mix がパーセントを要求して解決に失敗し、
 *  幕が完全に透明になる(背景がまったく暗くならない)。 */
export const overlayBackdrop =
  "fixed inset-0 z-overlay bg-bg-base opacity-[var(--aurora-opacity-backdrop)] " +
  "transition-opacity duration-[var(--aurora-motion-duration-normal)] ease-standard " +
  "data-starting-style:opacity-0 data-ending-style:opacity-0 " +
  "motion-reduce:transition-none";

/** メニュー/セレクトの項目。data-highlighted はキーボード移動でも付く。 */
export const overlayItem =
  "flex cursor-default select-none items-center gap-sp-xs rounded-control px-sp-sm py-sp-2xs text-sm " +
  "text-text-secondary outline-none " +
  "data-highlighted:bg-bg-raised data-highlighted:text-text-primary " +
  "data-disabled:pointer-events-none data-disabled:opacity-[var(--aurora-opacity-disabled)]";
