import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frost-ui/react"],
  pageExtensions: ["ts", "tsx", "mdx"],
};

// Turbopack's MDX loader requires JSON-serializable options, so plugins are
// referenced by package name here rather than imported function references.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
