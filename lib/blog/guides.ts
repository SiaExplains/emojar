// Tool guide blog posts: Markdown files in content/guides, published on the
// dates in ./guide-schedule.ts. Server-only (reads the file system).

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { GUIDE_SCHEDULE } from './guide-schedule';

export type Guide = {
  /** File name without .md — also the key in GUIDE_SCHEDULE. */
  key: string;
  slug: string;
  /** Tool slug, or null for posts that are not about a single tool. */
  tool: string | null;
  title: string;
  description: string;
  tags: string[];
  body: string;
  publishDate: string;
};

const DIR = path.join(process.cwd(), 'content', 'guides');

let cache: Guide[] | null = null;

export function parseGuide(file: string, raw: string): Guide {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error('missing frontmatter');
  const fm = parse(m[1]) as Partial<Guide>;
  const key = file.replace(/\.md$/, '');
  const publishDate = GUIDE_SCHEDULE[key];
  if (!publishDate) throw new Error('no publish date in guide-schedule.ts');
  if (!fm.slug || !fm.title || !fm.description)
    throw new Error('slug, title and description are required');
  return {
    key,
    slug: String(fm.slug),
    tool: fm.tool ? String(fm.tool) : null,
    title: String(fm.title),
    description: String(fm.description),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    body: m[2].trim(),
    publishDate,
  };
}

/** All guides, published or not, sorted by publish date (newest first). */
export function allGuides(): Guide[] {
  if (cache) return cache;
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md');
  const guides: Guide[] = [];
  for (const file of files) {
    try {
      guides.push(
        parseGuide(file, fs.readFileSync(path.join(DIR, file), 'utf8')),
      );
    } catch (e) {
      // One malformed file must not take down every page that lists guides;
      // lib/blog/guides.test.ts is the strict gate before anything ships.
      console.error(
        `Skipping guide ${file}:`,
        e instanceof Error ? e.message : e,
      );
    }
  }
  cache = guides.sort(
    (a, b) =>
      b.publishDate.localeCompare(a.publishDate) ||
      a.title.localeCompare(b.title),
  );
  return cache;
}

/** UTC calendar date "YYYY-MM-DD" — posts go live at 00:00 UTC on their date. */
export function today(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isPublished(
  g: Pick<Guide, 'publishDate'>,
  now = new Date(),
): boolean {
  return g.publishDate <= today(now);
}

export function publishedGuides(now = new Date()): Guide[] {
  return allGuides().filter((g) => isPublished(g, now));
}

export function guideBySlug(slug: string): Guide | undefined {
  return allGuides().find((g) => g.slug === slug);
}

export function guideForTool(
  tool: string,
  now = new Date(),
): Guide | undefined {
  const g = allGuides().find((x) => x.tool === tool);
  return g && isPublished(g, now) ? g : undefined;
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
