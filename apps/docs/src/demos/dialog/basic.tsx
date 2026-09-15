import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@frost-ui/react";

export default function Basic() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" />}>設定を開く</DialogTrigger>
      <DialogContent>
        <DialogTitle>表示設定</DialogTitle>
        <DialogDescription>この端末にのみ保存されます。</DialogDescription>
        <div className="mt-sp-lg flex justify-end gap-sp-sm">
          <DialogClose render={<Button variant="ghost" size="sm" />}>閉じる</DialogClose>
          <DialogClose render={<Button size="sm" />}>保存</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
