// src/lib/utils/textConverter.tsx
import { slug } from "github-slugger";
import { marked } from "marked";
import { createElement } from "react";
import type { JSX } from "react";

marked.setOptions({
  gfm: true,
  async: false,
});

type MarkdownTag = keyof JSX.IntrinsicElements;

// slugify
export const slugify = (content?: string | null): string | null => {
  if (!content) return null;
  return slug(content);
};

// markdownify
export const markdownify = (
  content?: string | null,
  tag: MarkdownTag = "span",
  className?: string,
): JSX.Element | null => {
  if (!content) return null;

  const inlineResult = marked.parseInline(content, { async: false });
  const blockResult = marked.parse(content, { async: false });

  // marked typings can be string | Promise<string>
  const inlineHtml = typeof inlineResult === "string" ? inlineResult : "";
  const blockHtml = typeof blockResult === "string" ? blockResult : "";

  const html = tag === "div" ? blockHtml : inlineHtml;

  return createElement(tag, {
    className,
    dangerouslySetInnerHTML: { __html: html },
  });
};

// humanize
export const humanize = (content?: string | null): string | null => {
  if (!content) return null;

  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, (m) => m.toUpperCase());
};

// plainify
export const plainify = (content?: string | null): string | null => {
  if (!content) return null;

  const parsed = marked.parseInline(String(content), { async: false });
  const mdParsed = typeof parsed === "string" ? parsed : "";

  const filterBrackets = mdParsed.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  return htmlEntityDecoder(filterSpaces);
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string): string => {
  const entityList: Record<string, string> = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };

  return htmlWithEntities.replace(
    /(&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity) => entityList[entity] ?? entity,
  );
};
