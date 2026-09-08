import { tokens } from "@frost-ui/tokens";

export const metadata = { title: "Colors — Aurora" };

type ColorTree = {
  neutral: Record<string, string>;
  frost: Record<string, string>;
  plum: Record<string, string>;
  success: Record<string, string>;
  danger: Record<string, string>;
  warning: Record<string, string>;
  info: Record<string, string>;
  bg: Record<string, string>;
  border: Record<string, string>;
  text: Record<string, string>;
  accent: Record<string, string>;
  "accent-alt": Record<string, string>;
  "on-accent": string;
  "focus-ring": string;
  status: Record<string, Record<string, string>>;
};

const PRIMITIVE_RAMPS = [
  { key: "neutral", label: "neutral(銀のニュートラル)" },
  { key: "frost", label: "frost(唯一のアクセント)" },
  { key: "plum", label: "plum(稀にしか使わない気配)" },
  { key: "success", label: "success" },
  { key: "danger", label: "danger" },
  { key: "warning", label: "warning" },
  { key: "info", label: "info" },
] as const;

const SEMANTIC_GROUPS = [
  { key: "bg", label: "Surface" },
  { key: "border", label: "Border" },
  { key: "text", label: "Text" },
  { key: "accent", label: "Accent" },
] as const;

function Ramp({ label, scale }: { label: string; scale: Record<string, string> }) {
  const steps = Object.entries(scale);
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <div className="mt-sp-2xs flex overflow-hidden rounded-control border border-border-default">
        {steps.map(([step, hex]) => (
          <div key={step} className="group relative h-12 flex-1" style={{ background: hex }} title={`${step} · ${hex}`}>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-bg-base/80 px-sp-3xs py-sp-3xs text-[10px] text-text-primary group-hover:block">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Semantic swatches are painted with the CSS variable rather than a hex from
 *  the JS export: the JS export only carries the dark tree, so a hex here would
 *  keep showing dark values after the theme toggle flips to light. */
function SemanticSwatch({ name }: { name: string }) {
  const cssVar = `--aurora-color-${name.replace(/\./g, "-")}`;
  return (
    <div className="flex items-center gap-sp-sm rounded-control border border-border-default p-sp-2xs">
      <div
        className="size-8 shrink-0 rounded-control border border-border-subtle"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-text-primary">{name}</p>
        <p className="truncate text-xs text-text-muted">{cssVar}</p>
      </div>
    </div>
  );
}

export default function ColorsPage() {
  const color = (tokens as { color: ColorTree }).color;

  return (
    <div>
      <h1 className="text-title-size font-semibold text-text-primary">Colors</h1>
      <p className="mt-sp-md max-w-prose text-text-secondary">
        値は手書きせず、<code className="rounded-control bg-bg-raised px-sp-2xs py-sp-3xs text-sm">@frost-ui/tokens</code> の生成結果からそのまま描画している。実際にコンポーネントが使うのは下の
        <strong className="text-text-primary">Semantic</strong>(役割)で、その下地になっている
        <strong className="text-text-primary">Primitiveランプ</strong>は普段は意識しなくてよい。
      </p>

      <h2 className="mt-sp-xl text-heading-size font-semibold text-text-primary">Semantic</h2>
      <div className="mt-sp-md grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-sp-md">
        {SEMANTIC_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="text-xs font-medium text-text-secondary">{group.label}</p>
            <div className="mt-sp-2xs flex flex-col gap-sp-2xs">
              {Object.keys(color[group.key]).map((name) => (
                <SemanticSwatch key={name} name={`${group.key}.${name}`} />
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="text-xs font-medium text-text-secondary">Status</p>
          <div className="mt-sp-2xs flex flex-col gap-sp-2xs">
            {Object.keys(color.status).map((name) => (
              <SemanticSwatch key={name} name={`status.${name}.solid`} />
            ))}
          </div>
        </div>
      </div>

      <h2 className="mt-sp-xl text-heading-size font-semibold text-text-primary">Primitiveランプ</h2>
      <div className="mt-sp-md flex flex-col gap-sp-lg">
        {PRIMITIVE_RAMPS.map((ramp) => (
          <Ramp key={ramp.key} label={ramp.label} scale={color[ramp.key]} />
        ))}
      </div>
    </div>
  );
}
