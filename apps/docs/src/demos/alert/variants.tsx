import { Alert, AlertTitle } from "@frost-ui/react";

export default function Variants() {
  return (
    <div className="flex flex-col gap-sp-sm">
      <Alert variant="default"><AlertTitle>default</AlertTitle></Alert>
      <Alert variant="success"><AlertTitle>success</AlertTitle></Alert>
      <Alert variant="danger"><AlertTitle>danger</AlertTitle></Alert>
      <Alert variant="warning"><AlertTitle>warning</AlertTitle></Alert>
      <Alert variant="info"><AlertTitle>info</AlertTitle></Alert>
    </div>
  );
}
