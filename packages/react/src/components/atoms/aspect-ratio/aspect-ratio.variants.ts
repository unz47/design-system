import { cva } from "class-variance-authority";

export const aspectRatioVariants = cva("relative w-full overflow-hidden [&>*]:size-full [&>*]:object-cover");
