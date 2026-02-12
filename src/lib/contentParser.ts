// src/lib/contentParser.ts
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { parseMDX } from "./utils/mdxParser";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

type Frontmatter = {
  draft?: boolean;
  layout?: string;
  date?: string | number | Date;
  url?: string;
  [key: string]: unknown;
};

type ParsedPage = {
  frontmatter: Frontmatter;
  content: string;
  mdxContent: MDXRemoteSerializeResult;
};

type SinglePage = {
  frontmatter: Frontmatter;
  slug: string;
  content: string;
};

const DEFAULT_404_MD = `---
title: Not Found
layout: 404
---
Page not found.
`;

const CONTENT_DIR_CANDIDATES = [
  path.join(process.cwd(), "content"),
  path.join(process.cwd(), "src", "content"),
];

const toAbs = (p: string) =>
  path.isAbsolute(p) ? p : path.join(process.cwd(), p);

const readIfExists = (absPath: string): string | null => {
  if (!fs.existsSync(absPath)) return null;
  return fs.readFileSync(absPath, "utf-8");
};

const normalizeContentRelativePath = (p: string): string => {
  // "content/_index.md" -> "_index.md"
  // "src/content/_index.md" -> "_index.md"
  return p
    .replace(/^src[\\/]/, "")
    .replace(/^content[\\/]/, "")
    .replace(/^\/+/, "");
};

const readContentFile = (requestedPath: string): string | null => {
  // 1) try direct absolute/relative as-is
  const direct = readIfExists(toAbs(requestedPath));
  if (direct !== null) return direct;

  // 2) try from known content dirs
  const rel = normalizeContentRelativePath(requestedPath);
  for (const base of CONTENT_DIR_CANDIDATES) {
    const hit = readIfExists(path.join(base, rel));
    if (hit !== null) return hit;
  }

  return null;
};

const getNotFoundMatter = () => {
  const raw =
    readContentFile("content/404.md") ??
    readContentFile("src/content/404.md") ??
    DEFAULT_404_MD;

  return matter<Frontmatter>(raw);
};

const resolveFolderAbs = (folder: string): string | null => {
  const direct = toAbs(folder);
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) return direct;

  const rel = normalizeContentRelativePath(folder);
  for (const base of CONTENT_DIR_CANDIDATES) {
    const candidate = path.join(base, rel);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }

  return null;
};

const isPublishedByDate = (value: Frontmatter["date"]): boolean => {
  if (value === undefined || value === null || value === "") return true;
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d <= new Date();
};

// get index page data, ex: _index.md
export const getListPage = async (filePath: string): Promise<ParsedPage> => {
  const notFoundParsed = getNotFoundMatter();

  let frontmatter: Frontmatter = notFoundParsed.data;
  let content = notFoundParsed.content;

  const raw = readContentFile(filePath);
  if (raw !== null) {
    const parsed = matter<Frontmatter>(raw);
    frontmatter = parsed.data;
    content = parsed.content;
  }

  const mdxContent = await parseMDX(content);
  return { frontmatter, content, mdxContent };
};

// get all single pages, ex: blog/post.md
export const getSinglePage = (folder: string): SinglePage[] => {
  const folderAbs = resolveFolderAbs(folder);
  if (!folderAbs) return [];

  const files = fs.readdirSync(folderAbs);

  const singlePages = files
    .filter((file) => /\.mdx?$/.test(file)) // .md and .mdx
    .filter((file) => !file.startsWith("_"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(folderAbs, filename), "utf-8");
      const parsed = matter<Frontmatter>(raw);
      const slugBase = filename.replace(/\.mdx?$/, "");

      const frontmatter = parsed.data;
      const url =
        typeof frontmatter.url === "string" && frontmatter.url.length > 0
          ? frontmatter.url.replace(/^\/|\/$/g, "")
          : slugBase;

      return {
        frontmatter,
        slug: url,
        content: parsed.content,
      };
    });

  return singlePages
    .filter(
      (page) => !page.frontmatter.draft && page.frontmatter.layout !== "404",
    )
    .filter((page) => isPublishedByDate(page.frontmatter.date));
};

// get regular page data, ex: about.md
export const getRegularPage = async (slug: string): Promise<ParsedPage> => {
  const publishedPages = getSinglePage("content");
  const page = publishedPages.find((p) => p.slug === slug);

  const notFoundParsed = getNotFoundMatter();

  const content = page ? page.content : notFoundParsed.content;
  const frontmatter = page ? page.frontmatter : notFoundParsed.data;

  const mdxContent = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};
