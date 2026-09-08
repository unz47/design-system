"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

/** Key shared with the inline bootstrap script in app/layout.tsx. */
export const THEME_STORAGE_KEY = "aurora-theme";

/** The <html data-theme> attribute is the single source of truth — the inline
 *  bootstrap script sets it before first paint, so reading it here (rather than
 *  keeping a separate useState) means the button can never disagree with the
 *  CSS that's actually applied. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** dark is the default (:root in variables.css), so SSR always renders dark. */
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  // The attribute only exists for light — matching how packages/tokens emits
  // variables.css (:root = dark, [data-theme="light"] = light).
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private mode / storage disabled — the toggle still works for this session
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`テーマを${theme === "dark" ? "light" : "dark"}に切り替える`}
      className="flex w-full items-center justify-between rounded-control border border-border-default px-sp-xs py-sp-3xs text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
    >
      <span>Theme</span>
      <span className="text-xs text-text-muted">{theme}</span>
    </button>
  );
}
