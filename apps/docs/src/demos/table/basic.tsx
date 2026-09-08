import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@frost-ui/react";

const ROWS = [
  { name: "Button", tier: "Tier 1", atomic: "atom" },
  { name: "Card", tier: "Tier 1", atomic: "molecule" },
  { name: "Dialog", tier: "Tier 3", atomic: "organism" },
];

export default function Basic() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>コンポーネント</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>階層</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium text-text-primary">{row.name}</TableCell>
            <TableCell>{row.tier}</TableCell>
            <TableCell>
              <Badge>{row.atomic}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
