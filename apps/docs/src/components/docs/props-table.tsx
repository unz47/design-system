import type { ApiGroup, SubcomponentDef } from "@/registry";

/** Wide tables must scroll inside their own container rather than pushing the
 *  page sideways — the docs layout has a fixed sidebar next to it. */
function Scroller({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-surface border border-border-default">{children}</div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="whitespace-nowrap px-sp-md py-sp-xs text-left font-medium text-text-secondary">
      {children}
    </th>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-control bg-bg-raised px-sp-2xs py-sp-3xs text-xs text-text-primary">
      {children}
    </code>
  );
}

export function PropsTable({ group }: { group: ApiGroup }) {
  return (
    <div>
      <p className="text-sm text-text-secondary">
        <Code>{group.name}</Code> — 下記に加えて <Code>{`<${group.element}>`}</Code>{" "}
        の素のpropsがそのまま使える(ref含む)。
      </p>
      <div className="mt-sp-xs">
        <Scroller>
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-border-default bg-bg-surface">
              <tr>
                <Th>Prop</Th>
                <Th>型</Th>
                <Th>初期値</Th>
                <Th>説明</Th>
              </tr>
            </thead>
            <tbody>
              {group.props.map((prop) => (
                <tr key={prop.name} className="border-b border-border-subtle last:border-b-0">
                  <td className="whitespace-nowrap px-sp-md py-sp-xs align-top">
                    <Code>{prop.name}</Code>
                    {prop.source && prop.source !== "cva" ? (
                      <span className="ml-sp-2xs text-[10px] text-text-muted">
                        {prop.source === "base-ui" ? "Base UI" : "native"}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-sp-md py-sp-xs align-top">
                    <code className="text-xs text-accent-default">{prop.type}</code>
                  </td>
                  <td className="whitespace-nowrap px-sp-md py-sp-xs align-top text-text-muted">
                    {prop.default ? <code className="text-xs">{prop.default}</code> : "—"}
                  </td>
                  <td className="px-sp-md py-sp-xs align-top text-text-secondary">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      </div>
    </div>
  );
}

export function SubcomponentsTable({ subcomponents }: { subcomponents: readonly SubcomponentDef[] }) {
  return (
    <Scroller>
      <table className="w-full border-collapse text-sm">
        <thead className="border-b border-border-default bg-bg-surface">
          <tr>
            <Th>サブコンポーネント</Th>
            <Th>要素</Th>
            <Th>役割</Th>
          </tr>
        </thead>
        <tbody>
          {subcomponents.map((sub) => (
            <tr key={sub.name} className="border-b border-border-subtle last:border-b-0">
              <td className="whitespace-nowrap px-sp-md py-sp-xs align-top">
                <Code>{sub.name}</Code>
              </td>
              <td className="whitespace-nowrap px-sp-md py-sp-xs align-top">
                <code className="text-xs text-accent-default">{`<${sub.element}>`}</code>
              </td>
              <td className="px-sp-md py-sp-xs align-top text-text-secondary">{sub.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroller>
  );
}
