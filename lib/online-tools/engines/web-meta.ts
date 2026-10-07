// Builders for the meta-tag / Open Graph generator and the robots.txt
// generator. Output is escaped so pasted values can't break the markup.

export const attr = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export type MetaInput = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite: string;
  themeColor: string;
  robots: string;
  canonical: boolean;
};

export function buildMetaTags(m: MetaInput): string {
  const lines: string[] = [];
  const meta = (k: 'name' | 'property', key: string, value: string) => {
    if (value.trim())
      lines.push(`<meta ${k}="${key}" content="${attr(value.trim())}" />`);
  };
  if (m.title.trim()) lines.push(`<title>${attr(m.title.trim())}</title>`);
  meta('name', 'description', m.description);
  if (m.robots && m.robots !== 'index, follow')
    meta('name', 'robots', m.robots);
  if (m.canonical && m.url.trim())
    lines.push(`<link rel="canonical" href="${attr(m.url.trim())}" />`);
  if (m.themeColor.trim()) meta('name', 'theme-color', m.themeColor);
  lines.push('');
  lines.push('<!-- Open Graph (Facebook, LinkedIn, WhatsApp, Slack…) -->');
  meta('property', 'og:type', m.type || 'website');
  meta('property', 'og:title', m.title);
  meta('property', 'og:description', m.description);
  meta('property', 'og:url', m.url);
  meta('property', 'og:site_name', m.siteName);
  meta('property', 'og:locale', m.locale);
  meta('property', 'og:image', m.image);
  meta('property', 'og:image:alt', m.imageAlt);
  lines.push('');
  lines.push('<!-- X / Twitter -->');
  meta('name', 'twitter:card', m.twitterCard);
  meta(
    'name',
    'twitter:site',
    m.twitterSite ? `@${m.twitterSite.replace(/^@/, '')}` : '',
  );
  meta('name', 'twitter:title', m.title);
  meta('name', 'twitter:description', m.description);
  meta('name', 'twitter:image', m.image);
  meta('name', 'twitter:image:alt', m.imageAlt);
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Pixel-ish width checks as search engines truncate by width, not chars. */
export const META_LIMITS = {
  title: { ideal: 60, max: 70 },
  description: { ideal: 155, max: 170 },
};

export type RobotsRule = {
  agent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: string;
};

export function buildRobotsTxt(
  rules: RobotsRule[],
  sitemaps: string[],
): string {
  const out: string[] = [];
  for (const r of rules) {
    const agents = r.agent
      .split(/[,\n]/)
      .map((a) => a.trim())
      .filter(Boolean);
    if (!agents.length) continue;
    for (const a of agents) out.push(`User-agent: ${a}`);
    const allow = r.allow.map((p) => p.trim()).filter(Boolean);
    const disallow = r.disallow.map((p) => p.trim());
    for (const p of allow) out.push(`Allow: ${p}`);
    const real = disallow.filter(Boolean);
    if (real.length) for (const p of real) out.push(`Disallow: ${p}`);
    else if (!allow.length) out.push('Disallow:');
    if (r.crawlDelay?.trim()) out.push(`Crawl-delay: ${r.crawlDelay.trim()}`);
    out.push('');
  }
  for (const s of sitemaps.map((x) => x.trim()).filter(Boolean))
    out.push(`Sitemap: ${s}`);
  return out.join('\n').trim() + '\n';
}
