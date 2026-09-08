import { Sidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-wide">
      <Sidebar />
      <div className="min-w-0 flex-1 p-sp-xl">{children}</div>
    </div>
  );
}
