"use client";

import {
  Badge,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@frost-ui/react";
import { useMemo, useState } from "react";

// packages/react の Table は見た目だけを持つ。ソートと絞り込みは
// 「アプリごとに違う」ので、こうしてレシピ側に置く(PROJECT_PLAN §3)。

interface Row {
  name: string;
  tier: number;
  atomic: "atom" | "molecule" | "organism";
}

const ROWS: Row[] = [
  { name: "Button", tier: 1, atomic: "atom" },
  { name: "Card", tier: 1, atomic: "molecule" },
  { name: "Switch", tier: 2, atomic: "atom" },
  { name: "RadioGroup", tier: 2, atomic: "molecule" },
  { name: "Dialog", tier: 3, atomic: "organism" },
  { name: "Select", tier: 3, atomic: "organism" },
  { name: "Combobox", tier: 4, atomic: "organism" },
];

type SortKey = keyof Row;

export default function DataTable() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "name", asc: true });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((row) => row.name.toLowerCase().includes(q)).sort((a, b) => {
      const diff = String(a[sort.key]).localeCompare(String(b[sort.key]), "ja", { numeric: true });
      return sort.asc ? diff : -diff;
    });
  }, [query, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, asc: !prev.asc } : { key, asc: true }));
  }

  // aria-sort を付けると、支援技術に「今どの列で並んでいるか」が伝わる。
  function ariaSort(key: SortKey) {
    if (sort.key !== key) return "none" as const;
    return sort.asc ? ("ascending" as const) : ("descending" as const);
  }

  return (
    <div className="flex flex-col gap-sp-md">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="コンポーネント名で絞り込む"
        className="max-w-xs"
        aria-label="コンポーネントを絞り込む"
      />

      {rows.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>該当するコンポーネントがありません</EmptyStateTitle>
          <EmptyStateDescription>絞り込みの条件を変えてみてください。</EmptyStateDescription>
        </EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {(["name", "tier", "atomic"] as const).map((key) => (
                <TableHead key={key} aria-sort={ariaSort(key)}>
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className="flex items-center gap-sp-2xs rounded-control outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    {key === "name" ? "名前" : key === "tier" ? "Tier" : "階層"}
                    <span aria-hidden className="text-xs">
                      {sort.key === key ? (sort.asc ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium text-text-primary">{row.name}</TableCell>
                <TableCell>Tier {row.tier}</TableCell>
                <TableCell>
                  <Badge>{row.atomic}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
