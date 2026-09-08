import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-title-size font-semibold text-text-primary" {...props} />,
    h2: (props) => (
      <h2 className="mt-sp-xl text-heading-size font-semibold text-text-primary" {...props} />
    ),
    h3: (props) => (
      <h3 className="mt-sp-lg text-lg font-semibold text-text-primary" {...props} />
    ),
    p: (props) => <p className="mt-sp-md leading-6 text-text-secondary" {...props} />,
    ul: (props) => <ul className="mt-sp-md list-disc pl-sp-lg text-text-secondary" {...props} />,
    li: (props) => <li className="mt-sp-3xs leading-6" {...props} />,
    strong: (props) => <strong className="font-semibold text-text-primary" {...props} />,
    a: (props) => (
      <a
        className="text-accent-default underline underline-offset-2 hover:text-accent-dim"
        {...props}
      />
    ),
    // Fenced blocks in prose are plain (shiki runs only in DemoFrame's CodeBlock),
    // so `pre` owns the surface and the nested `code` must drop the inline chip
    // styling it gets on its own.
    pre: (props) => (
      <pre
        className="mt-sp-md overflow-x-auto rounded-surface border border-border-default bg-bg-raised p-sp-md text-sm text-text-primary [&_code]:bg-transparent [&_code]:p-0"
        {...props}
      />
    ),
    code: (props) => (
      <code className="rounded-control bg-bg-raised px-sp-2xs py-sp-3xs text-sm text-text-primary" {...props} />
    ),
    ...components,
  };
}
