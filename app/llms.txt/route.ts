import BLOG_POSTS_DATA from '@/data/blog-posts-data';
import { publishedGuides } from '@/lib/blog/guides';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
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

> Emojar is a collection of free, privacy-friendly online tools that run entirely in the web browser — image and PDF converters, developer utilities, text tools, color tools, calculators, unit converters, generators and date/time tools. Files and text are processed on the user's device and are never uploaded. Emojar also offers ${EMOJI_COUNT_LABEL} emojis to search, copy and paste.

- [All online tools](${SITE_URL}/online-tool)
- [Emoji search & copy](${SITE_URL}/emoji)
- [Blog](${SITE_URL}/blog)
- [FAQ](${SITE_URL}/faq)
- [About](${SITE_URL}/about)

${sections.join('\n\n')}

## Emoji

- [Emoji search & copy](${SITE_URL}/emoji): search ${EMOJI_COUNT_LABEL} emojis by name, keyword or character and copy them in one click.
- [Emoji categories](${SITE_URL}/categories): the ten Unicode emoji groups, from Smileys & Emotion to Flags.
- [Emojis A–Z](${SITE_URL}/collection/alphabet): every emoji sorted by its official name.
- [Emojis with details](${SITE_URL}/collection/detail): names, codepoints and Unicode versions in one list.
- [Letter-shaped emojis](${SITE_URL}/table/emoji-alphabet-shaped): look-alike emojis and regional indicator letters for A–Z.
- [Holiday & event collections](${SITE_URL}/emoji-collections/events): ready-made emoji sets for holidays and occasions.
- [Emoji tools](${SITE_URL}/emoji-tools): emoji to PNG, Emoji Kitchen, favicon, watermark, social card, colour palette and Unicode inspector.
- [Emoji games](${SITE_URL}/games): free browser games such as Emoji Wordle, 2048, Snake and Guess the Flag.

## Articles

${Object.entries(BLOG_POSTS_DATA)
  .sort(([, a], [, b]) => b.date.localeCompare(a.date))
  .map(
    ([slug, p]) => `- [${p.title}](${SITE_URL}/blog/${slug}): ${p.description}`,
  )
  .join('\n')}

## Guides

${publishedGuides()
  .map((g) => `- [${g.title}](${SITE_URL}/blog/${g.slug}): ${g.description}`)
  .join('\n')}
`;

  return new Response(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
