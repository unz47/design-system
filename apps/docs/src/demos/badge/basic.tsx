import { Badge } from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex flex-wrap items-center gap-sp-sm">
      <Badge>default</Badge>
      <Badge variant="accent">accent</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="danger">danger</Badge>
      <Badge variant="warning">warning</Badge>
      <Badge variant="info">info</Badge>
    </div>
  );
}
