// Subnet / CIDR maths (IPv4 and IPv6), chmod permissions, a structural
// JSON diff, a robots.txt matcher and bot detection for user agents.

import { ToolInputError } from './data';

/* ------------------------------------------------------------------ */
/* IPv4                                                                 */
/* ------------------------------------------------------------------ */

export function parseIPv4(s: string): number {
  const parts = s.trim().split('.');
  if (parts.length !== 4)
    throw new ToolInputError(`“${s}” is not an IPv4 address.`);
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p) || Number(p) > 255)
      throw new ToolInputError(
        `“${s}” is not an IPv4 address (each part is 0–255).`,
      );
    n = n * 256 + Number(p);
  }
  return n;
}

export const formatIPv4 = (n: number) =>
  [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join('.');

const maskFromPrefix = (p: number) => (p === 0 ? 0 : 2 ** 32 - 2 ** (32 - p));

/** Prefix length from a dotted mask; throws if the mask isn't contiguous. */
export function prefixFromMask(mask: string): number {
  const n = parseIPv4(mask);
  for (let p = 0; p <= 32; p++) if (maskFromPrefix(p) === n) return p;
  throw new ToolInputError(
    `${mask} is not a valid subnet mask (the 1-bits must be contiguous).`,
  );
}

export type IPv4Subnet = {
  address: string;
  prefix: number;
  network: string;
  broadcast: string;
  mask: string;
  wildcard: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: string;
  scope: string;
  binaryMask: string;
  binaryAddress: string;
};

const toBin = (n: number) =>
  formatIPv4(n)
    .split('.')
    .map((o) => Number(o).toString(2).padStart(8, '0'))
    .join('.');

export function ipv4Scope(n: number): string {
  const in4 = (net: string, p: number) =>
    Math.floor(n / 2 ** (32 - p)) ===
    Math.floor(parseIPv4(net) / 2 ** (32 - p));
  if (in4('10.0.0.0', 8) || in4('172.16.0.0', 12) || in4('192.168.0.0', 16))
    return 'Private (RFC 1918)';
  if (in4('127.0.0.0', 8)) return 'Loopback';
  if (in4('169.254.0.0', 16)) return 'Link-local';
  if (in4('100.64.0.0', 10)) return 'Carrier-grade NAT (RFC 6598)';
  if (in4('224.0.0.0', 4)) return 'Multicast';
  if (in4('0.0.0.0', 8)) return '“This network”';
  if (in4('192.0.2.0', 24) || in4('198.51.100.0', 24) || in4('203.0.113.0', 24))
    return 'Documentation (TEST-NET)';
  if (in4('240.0.0.0', 4)) return 'Reserved';
  return 'Public';
}

/** Parses "192.168.1.10/24", "192.168.1.10 255.255.255.0" or a bare IP (/32). */
export function parseCidr(input: string): { ip: number; prefix: number } {
  const s = input.trim();
  const m = /^([\d.]+)\s*(?:\/\s*(\d{1,2})|\s+([\d.]+))?$/.exec(s);
  if (!m) throw new ToolInputError('Enter an address like 192.168.1.0/24.');
  const ip = parseIPv4(m[1]);
  const prefix =
    m[2] !== undefined ? Number(m[2]) : m[3] ? prefixFromMask(m[3]) : 32;
  if (prefix > 32) throw new ToolInputError('An IPv4 prefix is 0–32.');
  return { ip, prefix };
}

export function ipv4Subnet(input: string): IPv4Subnet {
  const { ip, prefix } = parseCidr(input);
  const size = 2 ** (32 - prefix);
  const network = Math.floor(ip / size) * size;
  const broadcast = network + size - 1;
  const mask = maskFromPrefix(prefix);
  // /31 (RFC 3021 point-to-point) and /32 have no network/broadcast reserve.
  const usable = prefix >= 31 ? size : size - 2;
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  const o1 = Math.floor(ip / 2 ** 24);
  const ipClass =
    o1 < 128
      ? 'A'
      : o1 < 192
        ? 'B'
        : o1 < 224
          ? 'C'
          : o1 < 240
            ? 'D (multicast)'
            : 'E (reserved)';
  return {
    address: formatIPv4(ip),
    prefix,
    network: formatIPv4(network),
    broadcast: formatIPv4(broadcast),
    mask: formatIPv4(mask),
    wildcard: formatIPv4(2 ** 32 - 1 - mask),
    firstHost: formatIPv4(first),
    lastHost: formatIPv4(last),
    totalAddresses: size,
    usableHosts: usable,
    ipClass,
    scope: ipv4Scope(ip),
    binaryMask: toBin(mask),
    binaryAddress: toBin(ip),
  };
}

/** Splits a network into equal subnets of `newPrefix` (max 256 listed). */
export function splitSubnet(input: string, newPrefix: number, limit = 256) {
  const { ip, prefix } = parseCidr(input);
  if (newPrefix < prefix || newPrefix > 32)
    throw new ToolInputError(`Choose a prefix between /${prefix} and /32.`);
  const size = 2 ** (32 - prefix);
  const network = Math.floor(ip / size) * size;
  const sub = 2 ** (32 - newPrefix);
  const count = 2 ** (newPrefix - prefix);
  const list: string[] = [];
  for (let i = 0; i < Math.min(count, limit); i++)
    list.push(`${formatIPv4(network + i * sub)}/${newPrefix}`);
  return { count, list };
}

/* ------------------------------------------------------------------ */
/* IPv6                                                                 */
/* ------------------------------------------------------------------ */

export function parseIPv6(s: string): bigint {
  let str = s
    .trim()
    .replace(/^\[|\]$/g, '')
    .split('%')[0];
  // Embedded IPv4 (::ffff:192.0.2.1)
  const v4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(str);
  if (v4) {
    const n = parseIPv4(v4[1]);
    str =
      str.slice(0, -v4[1].length) +
      `${Math.floor(n / 65536).toString(16)}:${(n % 65536).toString(16)}`;
  }
  const halves = str.split('::');
  if (halves.length > 2)
    throw new ToolInputError(`“${s}” is not an IPv6 address.`);
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const fill = 8 - head.length - tail.length;
  if ((halves.length === 1 && fill !== 0) || fill < 0)
    throw new ToolInputError(`“${s}” is not an IPv6 address.`);
  const groups = [
    ...head,
    ...Array(halves.length === 2 ? fill : 0).fill('0'),
    ...tail,
  ];
  let n = BigInt(0);
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(g))
      throw new ToolInputError(`“${s}” is not an IPv6 address.`);
    n = (n << BigInt(16)) + BigInt(parseInt(g, 16));
  }
  return n;
}

/** RFC 5952 canonical form: lowercase, zeros dropped, longest zero run → "::". */
export function formatIPv6(n: bigint): string {
  const groups: number[] = [];
  for (let i = 7; i >= 0; i--)
    groups.push(Number((n >> BigInt(i * 16)) & BigInt(0xffff)));
  let best = { start: -1, len: 0 };
  for (let i = 0; i < 8; ) {
    if (groups[i] !== 0) {
      i++;
      continue;
    }
    let j = i;
    while (j < 8 && groups[j] === 0) j++;
    if (j - i > best.len && j - i > 1) best = { start: i, len: j - i };
    i = j;
  }
  const hex = groups.map((g) => g.toString(16));
  if (best.start < 0) return hex.join(':');
  const left = hex.slice(0, best.start).join(':');
  const right = hex.slice(best.start + best.len).join(':');
  return `${left}::${right}`;
}

export function ipv6Subnet(input: string) {
  const m = /^(.+?)(?:\/(\d{1,3}))?$/.exec(input.trim());
  if (!m) throw new ToolInputError('Enter an address like 2001:db8::/64.');
  const ip = parseIPv6(m[1]);
  const prefix = m[2] !== undefined ? Number(m[2]) : 128;
  if (prefix > 128) throw new ToolInputError('An IPv6 prefix is 0–128.');
  const hostBits = BigInt(128 - prefix);
  const all = (BigInt(1) << BigInt(128)) - BigInt(1);
  const hostMask = (BigInt(1) << hostBits) - BigInt(1);
  const network = ip & (all ^ hostMask);
  const last = network | hostMask;
  return {
    address: formatIPv6(ip),
    prefix,
    network: `${formatIPv6(network)}/${prefix}`,
    first: formatIPv6(network),
    last: formatIPv6(last),
    total: BigInt(1) << hostBits,
    expanded: Array.from({ length: 8 }, (_, i) =>
      Number((ip >> BigInt((7 - i) * 16)) & BigInt(0xffff))
        .toString(16)
        .padStart(4, '0'),
    ).join(':'),
  };
}

/* ------------------------------------------------------------------ */
/* chmod                                                                */
/* ------------------------------------------------------------------ */

export type Perms = {
  special: number; // setuid 4, setgid 2, sticky 1
  owner: number;
  group: number;
  others: number;
};

export function parseOctalMode(s: string): Perms {
  const t = s.trim().replace(/^0o/i, '');
  if (!/^[0-7]{3,4}$/.test(t))
    throw new ToolInputError('Enter 3 or 4 octal digits, like 755 or 4755.');
  const d = t.padStart(4, '0').split('').map(Number);
  return { special: d[0], owner: d[1], group: d[2], others: d[3] };
}

export const permsToOctal = (p: Perms) =>
  `${p.special ? p.special : ''}${p.owner}${p.group}${p.others}`;

export function permsToSymbolic(p: Perms): string {
  const tri = (v: number, special: boolean, ch: string) =>
    `${v & 4 ? 'r' : '-'}${v & 2 ? 'w' : '-'}${
      special ? (v & 1 ? ch : ch.toUpperCase()) : v & 1 ? 'x' : '-'
    }`;
  return (
    tri(p.owner, !!(p.special & 4), 's') +
    tri(p.group, !!(p.special & 2), 's') +
    tri(p.others, !!(p.special & 1), 't')
  );
}

/** Parses "rwxr-xr-x" (optionally with a leading file-type char). */
export function parseSymbolic(s: string): Perms {
  let t = s.trim();
  if (t.length === 10) t = t.slice(1);
  if (!/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/.test(t))
    throw new ToolInputError('Enter 9 characters like rwxr-xr-x.');
  const tri = (i: number) =>
    (t[i] === 'r' ? 4 : 0) +
    (t[i + 1] === 'w' ? 2 : 0) +
    (/[xst]/.test(t[i + 2]) ? 1 : 0);
  const special =
    (/[sS]/.test(t[2]) ? 4 : 0) +
    (/[sS]/.test(t[5]) ? 2 : 0) +
    (/[tT]/.test(t[8]) ? 1 : 0);
  return { special, owner: tri(0), group: tri(3), others: tri(6) };
}

/* ------------------------------------------------------------------ */
/* JSON diff                                                            */
/* ------------------------------------------------------------------ */

export type JsonChange =
  | { type: 'added'; path: string; value: unknown }
  | { type: 'removed'; path: string; value: unknown }
  | { type: 'changed'; path: string; from: unknown; to: unknown };

const isObj = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const keyPath = (base: string, key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${base}.${key}`
    : `${base}[${JSON.stringify(key)}]`;

const stable = (v: unknown): string =>
  JSON.stringify(v, (_k, val) =>
    isObj(val)
      ? Object.fromEntries(
          Object.keys(val)
            .sort()
            .map((k) => [k, val[k]]),
        )
      : val,
  );

export function diffJson(
  a: unknown,
  b: unknown,
  opts: { ignoreArrayOrder?: boolean } = {},
  path = '$',
  out: JsonChange[] = [],
): JsonChange[] {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (opts.ignoreArrayOrder) {
      const left = a.map(stable);
      const right = b.map(stable);
      const used = new Set<number>();
      a.forEach((v, i) => {
        const j = right.findIndex((r, k) => !used.has(k) && r === left[i]);
        if (j >= 0) used.add(j);
        else out.push({ type: 'removed', path: `${path}[${i}]`, value: v });
      });
      b.forEach((v, j) => {
        if (!used.has(j))
          out.push({ type: 'added', path: `${path}[${j}]`, value: v });
      });
      return out;
    }
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) out.push({ type: 'added', path: p, value: b[i] });
      else if (i >= b.length)
        out.push({ type: 'removed', path: p, value: a[i] });
      else diffJson(a[i], b[i], opts, p, out);
    }
    return out;
  }
  if (isObj(a) && isObj(b)) {
    for (const k of Object.keys(a))
      if (!(k in b))
        out.push({ type: 'removed', path: keyPath(path, k), value: a[k] });
    for (const k of Object.keys(b)) {
      const p = keyPath(path, k);
      if (!(k in a)) out.push({ type: 'added', path: p, value: b[k] });
      else diffJson(a[k], b[k], opts, p, out);
    }
    return out;
  }
  if (stable(a) !== stable(b))
    out.push({ type: 'changed', path, from: a, to: b });
  return out;
}

/* ------------------------------------------------------------------ */
/* robots.txt                                                           */
/* ------------------------------------------------------------------ */

export type RobotsGroup = {
  agents: string[];
  allow: string[];
  disallow: string[];
};

export function parseRobots(txt: string): {
  groups: RobotsGroup[];
  sitemaps: string[];
} {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let cur: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], allow: [], disallow: [] };
        groups.push(cur);
      }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === 'sitemap') sitemaps.push(val);
    else if (cur && key === 'allow' && val) cur.allow.push(val);
    else if (cur && key === 'disallow' && val) cur.disallow.push(val);
  }
  return { groups, sitemaps };
}

function ruleMatches(rule: string, path: string): boolean {
  const anchored = rule.endsWith('$');
  const body = (anchored ? rule.slice(0, -1) : rule)
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`).test(path);
}

/**
 * Google's rules (RFC 9309): pick the most specific user-agent group, then
 * the longest matching rule wins; on a tie, Allow wins. No match = allowed.
 */
export function robotsAllowed(
  txt: string,
  userAgent: string,
  path: string,
): { allowed: boolean; rule: string | null; group: string } {
  const { groups } = parseRobots(txt);
  const ua = userAgent.toLowerCase();
  let best: RobotsGroup[] = [];
  let bestLen = -1;
  for (const g of groups)
    for (const a of g.agents) {
      const len = a === '*' ? 0 : ua.includes(a) ? a.length : -1;
      if (len > bestLen) {
        bestLen = len;
        best = [g];
      } else if (len === bestLen && len >= 0 && !best.includes(g)) best.push(g);
    }
  if (bestLen < 0) return { allowed: true, rule: null, group: '(none)' };
  const p = path.startsWith('/') ? path : `/${path}`;
  let winner: { allow: boolean; rule: string } | null = null;
  for (const g of best) {
    for (const [list, allow] of [
      [g.allow, true],
      [g.disallow, false],
    ] as const)
      for (const r of list)
        if (ruleMatches(r, p)) {
          if (
            !winner ||
            r.length > winner.rule.length ||
            (r.length === winner.rule.length && allow)
          )
            winner = { allow, rule: r };
        }
  }
  return {
    allowed: winner ? winner.allow : true,
    rule: winner
      ? `${winner.allow ? 'Allow' : 'Disallow'}: ${winner.rule}`
      : null,
    group: best.flatMap((g) => g.agents).join(', '),
  };
}

export const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'PerplexityBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Amazonbot',
  'cohere-ai',
];

/* ------------------------------------------------------------------ */
/* Bots in user agents                                                  */
/* ------------------------------------------------------------------ */

const BOTS: [RegExp, string, string][] = [
  [
    /Googlebot|Google-InspectionTool|GoogleOther/i,
    'Googlebot',
    'Search engine',
  ],
  [/AdsBot-Google|Mediapartners-Google/i, 'Google Ads bot', 'Advertising'],
  [/bingbot|BingPreview/i, 'Bingbot', 'Search engine'],
  [/DuckDuckBot/i, 'DuckDuckBot', 'Search engine'],
  [/YandexBot/i, 'YandexBot', 'Search engine'],
  [/Baiduspider/i, 'Baiduspider', 'Search engine'],
  [/Applebot/i, 'Applebot', 'Search engine'],
  [/GPTBot|ChatGPT-User|OAI-SearchBot/i, 'OpenAI crawler', 'AI crawler'],
  [/ClaudeBot|Claude-Web|anthropic-ai/i, 'Anthropic crawler', 'AI crawler'],
  [/PerplexityBot/i, 'PerplexityBot', 'AI crawler'],
  [/CCBot/i, 'Common Crawl', 'AI / research crawler'],
  [/Bytespider/i, 'Bytespider (ByteDance)', 'AI crawler'],
  [
    /facebookexternalhit|meta-externalagent/i,
    'Facebook / Meta',
    'Link preview',
  ],
  [/Twitterbot/i, 'Twitterbot (X)', 'Link preview'],
  [/LinkedInBot/i, 'LinkedInBot', 'Link preview'],
  [/Slackbot/i, 'Slackbot', 'Link preview'],
  [/Discordbot/i, 'Discordbot', 'Link preview'],
  [/WhatsApp/i, 'WhatsApp', 'Link preview'],
  [/AhrefsBot|SemrushBot|MJ12bot|DotBot/i, 'SEO crawler', 'SEO tool'],
  [/curl\//i, 'curl', 'Command-line client'],
  [/Wget/i, 'Wget', 'Command-line client'],
  [/python-requests|aiohttp|urllib/i, 'Python HTTP client', 'Script'],
  [/node-fetch|axios|undici/i, 'Node.js HTTP client', 'Script'],
  [/Go-http-client/i, 'Go HTTP client', 'Script'],
  [
    /HeadlessChrome|PhantomJS|Puppeteer|Playwright/i,
    'Headless browser',
    'Automation',
  ],
  [/bot\b|crawler|spider|crawl/i, 'Unknown bot', 'Bot'],
];

export function detectBot(ua: string): { name: string; kind: string } | null {
  for (const [re, name, kind] of BOTS) if (re.test(ua)) return { name, kind };
  return null;
}
