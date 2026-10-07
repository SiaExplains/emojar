import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  TOOLS,
  categoryPath,
  toolPath,
  variantPath,
} from '../online-tools/registry';
import { GUIDE_SCHEDULE } from './guide-schedule';
import {
  allGuides,
  isPublished,
  parseGuide,
  publishedGuides,
  wordCount,
} from './guides';
import { extractFaq, renderMarkdown } from './render';

const guides = allGuides();

const KNOWN_URLS = new Set<string>([
  '/online-tool',
  '/faq',
  '/emoji',
  '/blog',
  '/contact',
  '/games',
  ...CATEGORIES.map((c) => categoryPath(c.slug)),
  ...TOOLS.flatMap((t) => [
    toolPath(t),
    ...(t.variants ?? []).map((v) => variantPath(t, v)),
  ]),
]);

const STATIC_BLOG_SLUGS = fs
  .readdirSync(path.join(process.cwd(), 'app', 'blog'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('['))
  .map((d) => d.name);

/** Body text outside fenced code blocks. */
const prose = (md: string) => md.replace(/```[\s\S]*?```/g, '');

describe('tool guides', () => {
  it('parses every guide file strictly', () => {
    const dir = path.join(process.cwd(), 'content', 'guides');
    const errors: string[] = [];
    for (const f of fs
      .readdirSync(dir)
      .filter((x) => x.endsWith('.md') && x !== 'README.md')) {
      try {
        parseGuide(f, fs.readFileSync(path.join(dir, f), 'utf8'));
      } catch (e) {
        errors.push(
          `${f}: ${e instanceof Error ? e.message.split('\n')[0] : e}`,
        );
      }
    }
    expect(errors).toEqual([]);
  });

  it('has exactly one guide per online tool (plus non-tool posts)', () => {
    const byTool = new Map(
      guides.filter((g) => g.tool).map((g) => [g.tool, g]),
    );
    const missing = TOOLS.filter((t) => !byTool.has(t.slug)).map((t) => t.slug);
    expect(missing, 'tools without a guide').toEqual([]);
    for (const g of guides) {
      if (!g.tool) continue;
      expect(
        TOOLS.some((t) => t.slug === g.tool),
        `${g.key} → unknown tool ${g.tool}`,
      ).toBe(true);
      expect(g.key, 'file name must equal the tool slug').toBe(g.tool);
    }
  });

  it('schedules every guide exactly once', () => {
    const keys = guides.map((g) => g.key).sort();
    expect(Object.keys(GUIDE_SCHEDULE).sort()).toEqual(keys);
    for (const d of Object.values(GUIDE_SCHEDULE))
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('uses unique, valid slugs', () => {
    const slugs = guides.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s, s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(
        STATIC_BLOG_SLUGS,
        `slug ${s} collides with an existing post`,
      ).not.toContain(s);
    }
  });

  it('has search-friendly titles and descriptions', () => {
    const titles = new Set<string>();
    for (const g of guides) {
      expect(g.title.length, `${g.key} title`).toBeLessThanOrEqual(70);
      expect(
        g.description.length,
        `${g.key} description`,
      ).toBeGreaterThanOrEqual(100);
      expect(g.description.length, `${g.key} description`).toBeLessThanOrEqual(
        170,
      );
      expect(titles.has(g.title), `duplicate title ${g.title}`).toBe(false);
      titles.add(g.title);
      expect(g.tags.length, `${g.key} tags`).toBeGreaterThanOrEqual(2);
    }
  });

  it('has substantial bodies without an H1', () => {
    for (const g of guides) {
      expect(wordCount(g.body), `${g.key} word count`).toBeGreaterThanOrEqual(
        600,
      );
      expect(prose(g.body), `${g.key} has an H1`).not.toMatch(/^#\s/m);
      expect(prose(g.body), `${g.key} has no ## headings`).toMatch(/^##\s/m);
    }
  });

  it('links only to pages that exist', () => {
    const bad: string[] = [];
    for (const g of guides) {
      for (const m of g.body.matchAll(/\]\((\/[^)\s#?]*)[^)]*\)/g)) {
        const url = m[1].replace(/\/$/, '') || '/';
        if (!KNOWN_URLS.has(url)) bad.push(`${g.key}: ${m[1]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('does not repeat paragraphs across posts', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const g of guides) {
      for (const p of prose(g.body).split(/\n\s*\n/)) {
        const norm = p.replace(/\s+/g, ' ').trim().toLowerCase();
        if (norm.length < 160 || norm.startsWith('|')) continue;
        const other = seen.get(norm);
        if (other && other !== g.key)
          dupes.push(`${g.key} ↔ ${other}: ${norm.slice(0, 60)}…`);
        seen.set(norm, g.key);
      }
    }
    expect(dupes).toEqual([]);
  });

  it('renders Markdown and extracts FAQs', () => {
    const html = renderMarkdown(
      '## Hello world\n\nSee [docs](https://example.com) and [tool](/online-tool).',
    );
    expect(html).toContain('<h2 id="hello-world">Hello world</h2>');
    expect(html).toContain('target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('<a href="/online-tool">tool</a>');
    expect(
      extractFaq(
        '## FAQ\n\n### Is it free?\n\nYes, **always**.\n\n### Second?\n\nAnswer [two](/x).\n',
      ),
    ).toEqual([
      { q: 'Is it free?', a: 'Yes, always.' },
      { q: 'Second?', a: 'Answer two.' },
    ]);
  });

  it('publishes by date', () => {
    expect(
      isPublished(
        { publishDate: '2026-10-07' },
        new Date('2026-10-07T00:00:00Z'),
      ),
    ).toBe(true);
    expect(
      isPublished(
        { publishDate: '2026-10-08' },
        new Date('2026-10-07T23:59:59Z'),
      ),
    ).toBe(false);
    const launch = publishedGuides(new Date('2026-10-07T12:00:00Z'));
    expect(launch.length).toBe(5);
    expect(publishedGuides(new Date('2027-01-01T00:00:00Z')).length).toBe(
      guides.length,
    );
  });
});
