import { publishedGuides } from '@/lib/blog/guides';
import {
  CATEGORIES,
  SITE_URL,
  categoryPath,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';

// Markdown index of the site for AI assistants (llms.txt convention),
// generated from the tool registry so it never goes stale.
export const revalidate = 86400;

export function GET() {
  const sections = CATEGORIES.map((c) => {
    const lines = toolsInCategory(c.slug).map(
      (t) => `- [${t.name}](${SITE_URL}${toolPath(t)}): ${t.shortDescription}`,
    );
    return `## [${c.name}](${SITE_URL}${categoryPath(c.slug)})\n\n${c.intro}\n\n${lines.join('\n')}`;
  });

  const body = `# Emojar

> Emojar is a collection of free, privacy-friendly online tools that run entirely in the web browser — image and PDF converters, developer utilities, text tools, color tools, calculators, unit converters, generators and date/time tools. Files and text are processed on the user's device and are never uploaded. Emojar also offers 3,790 emojis to search, copy and paste.

- [All online tools](${SITE_URL}/online-tool)
- [Emoji search & copy](${SITE_URL}/emoji)
- [Blog](${SITE_URL}/blog)
- [FAQ](${SITE_URL}/faq)
- [About](${SITE_URL}/about)

${sections.join('\n\n')}

## Guides

${publishedGuides()
  .map((g) => `- [${g.title}](${SITE_URL}/blog/${g.slug}): ${g.description}`)
  .join('\n')}
`;

  return new Response(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
