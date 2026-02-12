// src/lib/utils/mdxParser.ts
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export const parseMDX = async (
  content: string,
): Promise<MDXRemoteSerializeResult> => {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
      format: "mdx",
    },
    parseFrontmatter: false,
  });
};
