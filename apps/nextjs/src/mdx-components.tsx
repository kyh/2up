import type { MDXComponents } from "mdx/types";
import * as mdxComponents from "@init/mdx";

export const useMDXComponents = (components: MDXComponents) => ({
  ...components,
  ...mdxComponents,
});
