// Marketing and structured-data helpers: UTM links, FAQPage and Article
// JSON-LD generation, and a local JSON-LD inspector. Pure functions — nothing
// here fetches a URL or a remote @context.

import { validateJson } from './data';

/* ------------------------------------------------------------------ */
/* UTM links                                                            */
/* ------------------------------------------------------------------ */

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmFields = Record<UtmKey, string>;

export type UtmResult =
  | { ok: true; url: string; replaced: UtmKey[]; warnings: string[] }
  | { ok: false; error: string };

/** Parses a destination, adding https:// when the scheme is missing. */
export function parseDestination(input: string): URL | null {
  const raw = input.trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname.includes('.') && u.hostname !== 'localhost') return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * Adds UTM parameters to a URL. Existing non-UTM parameters and the #fragment
 * are kept in place; a UTM key that is already present is replaced by the new
 * value (and reported), and empty fields leave an existing value alone.
 */
export function buildUtmUrl(destination: string, f: UtmFields): UtmResult {
  if (!destination.trim())
    return { ok: false, error: 'Enter the page URL you want to track.' };
  const url = parseDestination(destination);
  if (!url)
    return {
      ok: false,
      error:
        'That doesn’t look like a web address. Use a full URL such as https://example.com/page.',
    };
  const required: [UtmKey, string][] = [
    ['utm_source', 'Campaign source'],
    ['utm_medium', 'Campaign medium'],
    ['utm_campaign', 'Campaign name'],
  ];
  for (const [k, label] of required)
    if (!f[k].trim() && !url.searchParams.get(k))
      return { ok: false, error: `${label} is required.` };

  const replaced: UtmKey[] = [];
  const warnings: string[] = [];
  for (const k of UTM_KEYS) {
    const v = f[k].trim();
    if (!v) continue;
    const had = url.searchParams.getAll(k);
    if (had.length && !(had.length === 1 && had[0] === v)) replaced.push(k);
    url.searchParams.set(k, v);
    if (/[A-Z]/.test(v))
      warnings.push(
        `${k} contains capital letters. Analytics tools treat “${v}” and “${v.toLowerCase()}” as different values, so lowercase is safer.`,
      );
    if (/\s/.test(v))
      warnings.push(
        `${k} contains spaces. They are encoded as “+”; dashes or underscores are easier to read in reports.`,
      );
  }
  return { ok: true, url: url.toString(), replaced, warnings };
}

/* ------------------------------------------------------------------ */
/* FAQPage JSON-LD                                                      */
/* ------------------------------------------------------------------ */

export type FaqPair = { question: string; answer: string };

export type SchemaResult =
  | { ok: true; json: string; warnings: string[] }
  | { ok: false; error: string };

/** The full `<script type="application/ld+json">` tag for a JSON-LD object. */
export function scriptTag(json: string): string {
  // "</" inside a string would end the script element early.
  return `<script type="application/ld+json">\n${json.replace(/<\//g, '<\\/')}\n</script>`;
}

export function faqSchema(pairs: FaqPair[]): SchemaResult {
  const filled = pairs
    .map((p) => ({ question: p.question.trim(), answer: p.answer.trim() }))
    .filter((p) => p.question || p.answer);
  if (!filled.length)
    return { ok: false, error: 'Add at least one question and answer.' };
  const half = filled.findIndex((p) => !p.question || !p.answer);
  if (half !== -1)
    return {
      ok: false,
      error: `Pair ${half + 1} needs both a question and an answer.`,
    };
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const p of filled) {
    const k = p.question.toLowerCase();
    if (seen.has(k)) warnings.push(`“${p.question}” is listed twice.`);
    seen.add(k);
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filled.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
  return { ok: true, json: JSON.stringify(data, null, 2), warnings };
}

/* ------------------------------------------------------------------ */
/* Article / BlogPosting JSON-LD                                        */
/* ------------------------------------------------------------------ */

export type ArticleInput = {
  type: 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description: string;
  url: string;
  images: string;
  authorName: string;
  authorType: 'Person' | 'Organization';
  authorUrl: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified: string;
};

/** Accepts YYYY-MM-DD or YYYY-MM-DDTHH:MM[:SS][Z|±HH:MM]; checks the calendar. */
export function isIsoDateTime(s: string): boolean {
  const m =
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/.exec(
      s,
    );
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  if (mo < 1 || mo > 12 || d < 1 || d > dim) return false;
  if (
    m[4] &&
    (Number(m[4]) > 23 || Number(m[5]) > 59 || Number(m[6] ?? 0) > 59)
  )
    return false;
  return true;
}

const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

export function articleSchema(a: ArticleInput): SchemaResult {
  const headline = a.headline.trim();
  if (!headline) return { ok: false, error: 'A headline is required.' };
  const images = a.images
    .split(/\s*\n\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const [label, v] of [
    ['Page URL', a.url.trim()],
    ['Author URL', a.authorUrl.trim()],
    ['Publisher logo', a.publisherLogo.trim()],
    ...images.map((s, i) => [`Image ${i + 1}`, s] as const),
  ] as const)
    if (v && !isHttpUrl(v))
      return {
        ok: false,
        error: `${label} must be a full http(s) URL such as https://example.com/…`,
      };
  for (const [label, v] of [
    ['Date published', a.datePublished.trim()],
    ['Date modified', a.dateModified.trim()],
  ] as const)
    if (v && !isIsoDateTime(v))
      return {
        ok: false,
        error: `${label} must be an ISO 8601 date such as 2026-10-14 or 2026-10-14T09:30:00+02:00.`,
      };
  const pub = a.datePublished.trim();
  const mod = a.dateModified.trim();
  const warnings: string[] = [];
  if (pub && mod && mod.slice(0, 10) < pub.slice(0, 10))
    warnings.push('The modified date is earlier than the published date.');
  if (headline.length > 110)
    warnings.push(
      `The headline is ${headline.length} characters; keep it short and matching the visible title.`,
    );
  if (!images.length)
    warnings.push(
      'Add at least one image URL — Google uses it for article results.',
    );
  if (!a.authorName.trim()) warnings.push('Add the author’s name.');
  if (!pub) warnings.push('Add the publication date.');

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': a.type,
    headline,
  };
  if (a.description.trim()) data.description = a.description.trim();
  if (a.url.trim())
    data.mainEntityOfPage = { '@type': 'WebPage', '@id': a.url.trim() };
  if (images.length) data.image = images.length === 1 ? images[0] : images;
  if (pub) data.datePublished = pub;
  if (mod) data.dateModified = mod;
  if (a.authorName.trim()) {
    const author: Record<string, string> = {
      '@type': a.authorType,
      name: a.authorName.trim(),
    };
    if (a.authorUrl.trim()) author.url = a.authorUrl.trim();
    data.author = author;
  }
  if (a.publisherName.trim()) {
    const publisher: Record<string, unknown> = {
      '@type': 'Organization',
      name: a.publisherName.trim(),
    };
    if (a.publisherLogo.trim())
      publisher.logo = { '@type': 'ImageObject', url: a.publisherLogo.trim() };
    data.publisher = publisher;
  }
  return { ok: true, json: JSON.stringify(data, null, 2), warnings };
}

/* ------------------------------------------------------------------ */
/* JSON-LD inspector                                                    */
/* ------------------------------------------------------------------ */

export type LdIssue = {
  level: 'error' | 'warning' | 'info';
  /** JSON path such as $[0].author.name */
  path: string;
  message: string;
};

export type LdNode = { path: string; types: string[]; id?: string };

export type LdReport =
  | {
      ok: true;
      value: unknown;
      contexts: string[];
      nodes: LdNode[];
      issues: LdIssue[];
      blocks: number;
    }
  | { ok: false; error: string; line?: number; column?: number };

/** Pulls JSON out of one or more <script type="application/ld+json"> tags. */
export function extractJsonLd(input: string): string[] {
  const re =
    /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi;
  const out: string[] = [];
  for (const m of input.matchAll(re)) out.push(m[1].trim());
  return out;
}

const KNOWN_KEYWORDS = new Set([
  '@context',
  '@type',
  '@id',
  '@graph',
  '@value',
  '@language',
  '@list',
  '@set',
  '@reverse',
  '@base',
  '@vocab',
  '@index',
  '@nest',
  '@included',
  '@direction',
  '@json',
  '@none',
  '@version',
  '@protected',
  '@propagate',
  '@import',
  '@container',
]);

/** Properties Google's documentation lists as required for common types. */
const REQUIRED: Record<string, string[]> = {
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  Article: ['headline'],
  BlogPosting: ['headline'],
  NewsArticle: ['headline'],
  Product: ['name'],
  Offer: ['price', 'priceCurrency'],
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position'],
  Organization: ['name'],
  Person: ['name'],
  Event: ['name', 'startDate', 'location'],
  Recipe: ['name', 'image'],
  HowTo: ['name', 'step'],
  WebSite: ['name', 'url'],
};

const DATE_PROPS = new Set([
  'datePublished',
  'dateModified',
  'dateCreated',
  'startDate',
  'endDate',
  'uploadDate',
  'validFrom',
  'priceValidUntil',
]);

const URL_PROPS = new Set([
  'url',
  'logo',
  'sameAs',
  'contentUrl',
  'thumbnailUrl',
]);

export function inspectJsonLd(input: string): LdReport {
  const trimmed = input.trim();
  if (!trimmed)
    return { ok: false, error: 'Paste JSON-LD or an HTML snippet.' };
  let sources = [trimmed];
  if (trimmed.startsWith('<')) {
    sources = extractJsonLd(trimmed);
    if (!sources.length)
      return {
        ok: false,
        error:
          'No <script type="application/ld+json"> block was found in the HTML.',
      };
  }
  const values: unknown[] = [];
  for (const [i, src] of sources.entries()) {
    const r = validateJson(src);
    if (!r.valid)
      return {
        ok: false,
        error: sources.length > 1 ? `Block ${i + 1}: ${r.message}` : r.message,
        line: r.line,
        column: r.column,
      };
    values.push(r.value);
  }
  const value = values.length === 1 ? values[0] : values;
  const issues: LdIssue[] = [];
  const contexts = new Set<string>();
  const nodes: LdNode[] = [];
  const ids = new Map<string, string>();

  const typesOf = (o: Record<string, unknown>) => {
    const t = o['@type'];
    return (Array.isArray(t) ? t : t === undefined ? [] : [t]).map(String);
  };

  const walk = (v: unknown, path: string, depth: number, topLevel: boolean) => {
    if (depth > 64) {
      issues.push({
        level: 'error',
        path,
        message: 'Nesting is too deep to check.',
      });
      return;
    }
    if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, `${path}[${i}]`, depth + 1, topLevel));
      return;
    }
    if (!v || typeof v !== 'object') return;
    const o = v as Record<string, unknown>;
    const ctx = o['@context'];
    if (ctx !== undefined) {
      const list = Array.isArray(ctx) ? ctx : [ctx];
      for (const c of list) {
        if (typeof c === 'string') {
          contexts.add(c);
          if (/^http:\/\/schema\.org\/?$/.test(c))
            issues.push({
              level: 'info',
              path: `${path}["@context"]`,
              message: 'Use https://schema.org rather than http://schema.org.',
            });
        } else if (c && typeof c === 'object')
          contexts.add('(inline context object)');
        else
          issues.push({
            level: 'error',
            path: `${path}["@context"]`,
            message:
              '@context must be a URL string, an object or an array of them.',
          });
      }
    } else if (topLevel && !path.includes('@graph') && depth <= 1)
      issues.push({
        level: 'warning',
        path,
        message:
          'No @context — without it the terms are not linked to Schema.org.',
      });

    const types = typesOf(o);
    if (o['@type'] !== undefined && types.some((t) => !t || t.includes(' ')))
      issues.push({
        level: 'error',
        path: `${path}["@type"]`,
        message: '@type values must be single words such as "Article".',
      });
    const isValue = '@value' in o;
    if (types.length || o['@id'] !== undefined) {
      nodes.push({
        path,
        types,
        id: typeof o['@id'] === 'string' ? o['@id'] : undefined,
      });
    } else if (!isValue && !('@context' in o) && !('@graph' in o) && depth > 0)
      issues.push({
        level: 'info',
        path,
        message:
          'Object without @type — consumers may not know what it describes.',
      });
    if (typeof o['@id'] === 'string') {
      const prev = ids.get(o['@id']);
      if (prev && Object.keys(o).length > 1)
        issues.push({
          level: 'warning',
          path,
          message: `@id "${o['@id']}" is also described at ${prev}; make sure the two agree.`,
        });
      else ids.set(o['@id'], path);
    }
    for (const t of types)
      for (const req of REQUIRED[t] ?? [])
        if (
          o[req] === undefined ||
          o[req] === '' ||
          (Array.isArray(o[req]) && !(o[req] as unknown[]).length)
        )
          issues.push({
            level: 'warning',
            path,
            message: `${t} is missing “${req}”, which Google lists as required.`,
          });

    for (const [k, child] of Object.entries(o)) {
      const p = `${path}${/^[A-Za-z_$][\w$]*$/.test(k) ? `.${k}` : `["${k}"]`}`;
      if (k.startsWith('@') && !KNOWN_KEYWORDS.has(k))
        issues.push({
          level: 'warning',
          path: p,
          message: `“${k}” is not a JSON-LD keyword.`,
        });
      if (
        DATE_PROPS.has(k) &&
        typeof child === 'string' &&
        !isIsoDateTime(child)
      )
        issues.push({
          level: 'warning',
          path: p,
          message: `“${child}” is not an ISO 8601 date (YYYY-MM-DD, optionally with a time).`,
        });
      if (URL_PROPS.has(k)) {
        const list = Array.isArray(child) ? child : [child];
        for (const u of list)
          if (typeof u === 'string' && !/^https?:\/\//i.test(u))
            issues.push({
              level: 'warning',
              path: p,
              message: `“${u}” is not an absolute http(s) URL.`,
            });
      }
      if (
        typeof child === 'string' &&
        child.trim() === '' &&
        !k.startsWith('@')
      )
        issues.push({
          level: 'warning',
          path: p,
          message: 'Empty string value.',
        });
      if (k !== '@context') walk(child, p, depth + 1, false);
    }
  };

  walk(value, '$', 0, true);
  if (!nodes.length)
    issues.push({
      level: 'warning',
      path: '$',
      message:
        'No @type found anywhere — this doesn’t describe any Schema.org entity.',
    });
  return {
    ok: true,
    value,
    contexts: [...contexts],
    nodes,
    issues,
    blocks: sources.length,
  };
}
