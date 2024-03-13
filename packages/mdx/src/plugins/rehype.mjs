import { slugifyWithCounter } from "@sindresorhus/slugify";
import { toString } from "mdast-util-to-string";
import { mdxAnnotations } from "mdx-annotations";
import shiki from "shiki";
import { visit } from "unist-util-visit";

const rehypeParseCodeBlocks = () => (tree) => {
  visit(tree, "element", (node, _nodeIndex, parentNode) => {
    if (node.tagName === "code" && node.properties.className) {
      parentNode.properties.language = node.properties.className[0]?.replace(
        /^language-/,
        "",
      );
    }
  });
};

let highlighter;

const rehypeShiki = () => async (tree) => {
  highlighter =
    highlighter ?? (await shiki.getHighlighter({ theme: "css-variables" }));

  visit(tree, "element", (node) => {
    if (node.tagName === "pre" && node.children[0]?.tagName === "code") {
      let codeNode = node.children[0];
      let textNode = codeNode.children[0];

      node.properties.code = textNode.value;

      if (node.properties.language) {
        let tokens = highlighter.codeToThemedTokens(
          textNode.value,
          node.properties.language,
        );

        textNode.value = shiki.renderToHtml(tokens, {
          elements: {
            pre: ({ children }) => children,
            code: ({ children }) => children,
            line: ({ children }) => `<span>${children}</span>`,
          },
        });
      }
    }
  });
};

const rehypeSlugify = () => (tree) => {
  let slugify = slugifyWithCounter();
  visit(tree, "element", (node) => {
    if (node.tagName === "h2" && !node.properties.id) {
      node.properties.id = slugify(toString(node));
    }
  });
};

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
];
