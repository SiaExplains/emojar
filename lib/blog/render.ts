// Server-side Markdown rendering for tool guides (trusted, repo-authored content).

import { Marked } from 'marked';

const marked = new Marked({ gfm: true });

marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const t = title ? ` title="${title}"` : '';
      return external
        ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${href}"${t}>${text}</a>`;
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = text
        .replace(/<[^>]+>/g, '')
        .toLowerCase()
        .replace(/&[a-z#0-9]+;/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** FAQ entries from a "## FAQ" section: ### questions followed by answer paragraphs. */
export function extractFaq(md: string): { q: string; a: string }[] {
  const m =
    /^##\s+(?:FAQ|Frequently asked questions)\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/im.exec(
      md,
    );
  if (!m) return [];
  const out: { q: string; a: string }[] = [];
  const parts = m[1].split(/^###\s+/m).slice(1);
  for (const p of parts) {
    const [q, ...rest] = p.split('\n');
    const a = rest
      .join(' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (q.trim() && a) out.push({ q: q.replace(/\*\*/g, '').trim(), a });
  }
  return out;
}
