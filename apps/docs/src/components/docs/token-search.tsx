"use client";

import { Badge, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toggle, ToggleGroup } from "@frost-ui/react";
import { useMemo, useState } from "react";
import type { TokenRow } from "@/lib/tokens";

export function TokenSearch({ rows, groups }: { rows: TokenRow[]; groups: string[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (selected.length > 0 && !selected.includes(row.group)) return false;
      if (!q) return true;
      return (
        row.path.toLowerCase().includes(q) ||
        row.cssVar.toLowerCase().includes(q) ||
        row.value.toLowerCase().includes(q)
      );
    });
  }, [rows, query, selected]);

  return (
    <div>
      <div className="flex flex-col gap-sp-sm">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="トークン名 / CSS変数 / 値で絞り込む"
          className="max-w-sm"
          aria-label="トークンを検索"
        />
        <div className="overflow-x-auto">
          <ToggleGroup value={selected} onValueChange={setSelected}>
            {groups.map((group) => (
              <Toggle key={group} value={group} size="sm">
                {group}
              </Toggle>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <p className="mt-sp-md text-sm text-text-muted">
        {filtered.length} / {rows.length} 件
      </p>

      <div className="mt-sp-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>トークン</TableHead>
              <TableHead>グループ</TableHead>
              <TableHead>CSS変数</TableHead>
              <TableHead>値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.path}>
                <TableCell className="whitespace-nowrap font-medium text-text-primary">{row.path}</TableCell>
                <TableCell>
                  <Badge>{row.group}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <code className="text-xs text-accent-default">{row.cssVar}</code>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <code className="text-xs">{row.value}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
