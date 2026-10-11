// Small, dependency-free SEO helpers shared by pages, layouts and MDX posts.

const SITE = 'https://emojar.com';

/** Share image (Open Graph / Twitter) rendered by /api/og for any page. */
export function ogImage(icon: string, name: string, desc = '') {
  const qs = new URLSearchParams({
    type: 'tool',
    emoji: icon,
    name: name.slice(0, 60),
    desc: desc.slice(0, 120),
  });
  return `${SITE}/api/og?${qs.toString()}`;
}

/** Ready-made `openGraph.images` / `twitter.images` entries for a page. */
export function ogImages(icon: string, name: string, desc = '') {
  const url = ogImage(icon, name, desc);
  return {
    openGraph: [{ url, width: 1200, height: 630, alt: name }],
    twitter: [url],
  };
}

/**
 * Appends the brand (" | Emojar") only when the full title still fits in
 * search results (≤ 65 characters); long titles keep their keywords instead.
 */
export const TITLE_LIMIT = 65;
export function brandedTitle(title: string, brand = 'Emojar') {
  const full = `${title} | ${brand}`;
  return full.length <= TITLE_LIMIT ? full : title;
}

/** Full metadata for a simple page: branded title, canonical, OG, Twitter. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  emoji: string;
}): import('next').Metadata {
  const url = `${SITE}${opts.path}`;
  const images = ogImages(opts.emoji, opts.title, opts.description);
  return {
    title: { absolute: brandedTitle(opts.title) },
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'Emojar',
      type: 'website',
      images: images.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: images.twitter,
    },
    robots: { index: true, follow: true },
  };
}
