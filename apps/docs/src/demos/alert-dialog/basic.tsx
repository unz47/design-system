import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@frost-ui/react";

export default function Basic() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="danger" />}>プロジェクトを削除</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。トークンとコンポーネントもすべて失われます。
        </AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogClose render={<Button variant="ghost" size="sm" />}>キャンセル</AlertDialogClose>
          <AlertDialogClose render={<Button variant="danger" size="sm" />}>削除する</AlertDialogClose>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  );
}
