import {
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@frost-ui/react";

export default function Basic() {
  return (
    <div className="flex gap-sp-sm">
      <Sheet>
        <SheetTrigger render={<Button variant="secondary" size="sm" />}>右から</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>フィルタ</SheetTitle>
            <SheetDescription>スワイプでも閉じられる。</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p className="text-sm text-text-secondary">ここに絞り込みの入力が並ぶ。</p>
            <SheetClose render={<Button size="sm" className="mt-sp-lg" />}>閉じる</SheetClose>
          </SheetBody>
        </SheetContent>
      </Sheet>

      <Sheet side="bottom">
        <SheetTrigger render={<Button variant="secondary" size="sm" />}>下から</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>共有</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <p className="text-sm text-text-secondary">モバイルではこちらが自然。</p>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}
