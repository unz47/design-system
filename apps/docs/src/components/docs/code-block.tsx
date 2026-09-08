import { codeToHtml } from "shiki";

export async function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  // Both themes are baked into the same markup: the default theme's colors go
  // in the inline `color:`, the other one in a `--shiki-light` custom property
  // that globals.css swaps in under [data-theme="light"]. That keeps this a
  // pure RSC — no client JS re-highlights on theme change.
  const html = await codeToHtml(code, {
    lang,
    themes: { dark: "github-dark", light: "github-light" },
    defaultColor: "dark",
  });

  return (
    <div
      className="overflow-x-auto rounded-surface border border-border-default bg-bg-raised p-sp-md text-sm [&_pre]:!bg-transparent"
      // shiki produces sanitized, self-generated markup from our own source files (not user input)
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
