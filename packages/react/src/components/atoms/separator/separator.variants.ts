import { cva } from "class-variance-authority";

// orientation は Base UI が data-orientation で出すので、そこで分岐する。
export const separatorVariants = cva(
  "shrink-0 bg-border-subtle " +
    "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full " +
    "data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
);
