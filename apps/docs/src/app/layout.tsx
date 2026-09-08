import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurora Design System",
};

// Runs before first paint so a stored light theme doesn't flash dark first.
// Kept in sync with THEME_STORAGE_KEY in components/docs/theme-toggle.tsx.
const themeBootstrap = `try{if(localStorage.getItem("aurora-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: the bootstrap script stamps data-theme on <html>
  // before React hydrates, which is by definition an attribute the server
  // render can't know about. Scoped to this one element.
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="bg-bg-base text-text-primary">{children}</body>
    </html>
  );
}
