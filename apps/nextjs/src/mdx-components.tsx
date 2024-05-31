import type { MDXComponents } from "mdx/types";
import * as mdxComponents from "@2up/mdx";

export const useMDXComponents = (components: MDXComponents) => ({
  ...components,
  ...mdxComponents,
});
