import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "../../../lib/cn";
import {
  avatarFallbackVariants,
  avatarImageVariants,
  avatarVariants,
  type AvatarVariants,
} from "./avatar.variants";

export interface AvatarProps extends BaseAvatar.Root.Props, AvatarVariants {
  src?: string;
  alt?: string;
  /** 画像が無い/読めないときに出す文字。イニシャル2文字程度 */
  fallback?: React.ReactNode;
}

// Image は Base UI が読み込み状態を見て出し分ける。src を渡さなければ
// 最初から Fallback だけが描画される。
export function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root className={cn(avatarVariants({ size }), className)} {...props}>
      {src ? <BaseAvatar.Image src={src} alt={alt} className={avatarImageVariants()} /> : null}
      <BaseAvatar.Fallback className={avatarFallbackVariants()}>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
