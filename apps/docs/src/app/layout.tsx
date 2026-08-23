import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurora tokens — Phase 1 verification",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-bg-base text-text-primary">{children}</body>
    </html>
  );
}
