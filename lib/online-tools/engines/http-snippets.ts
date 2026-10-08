// HTTP request builder: URL/query syncing, header resolution and code
// snippets for cURL, fetch, Axios, Python requests, Node.js, HTTPie and
// PowerShell. Each target gets its own quoting so pasted values with quotes,
// newlines, `$` or non-ASCII text survive intact.

export type KV = { enabled: boolean; key: string; value: string };
export type BodyType = 'none' | 'json' | 'form' | 'text' | 'multipart';
export type AuthType = 'none' | 'bearer' | 'basic';

export type RequestSpec = {
  method: string;
  url: string;
  params: KV[];
  headers: KV[];
  bodyType: BodyType;
  /** Raw body for json/text. */
  body: string;
  /** Fields for form/multipart. */
  fields: KV[];
  auth: { type: AuthType; token: string; username: string; password: string };
};

export const METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export const SNIPPET_TARGETS = [
  { id: 'curl', label: 'cURL' },
  { id: 'fetch', label: 'JavaScript fetch' },
  { id: 'axios', label: 'Axios' },
  { id: 'python', label: 'Python requests' },
  { id: 'node', label: 'Node.js fetch' },
  { id: 'httpie', label: 'HTTPie' },
  { id: 'powershell', label: 'PowerShell' },
] as const;
export type SnippetTarget = (typeof SNIPPET_TARGETS)[number]['id'];

// ---------------------------------------------------------------- quoting

/** POSIX shell single quotes: the only character to handle is `'` itself. */
export function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/** Single-quoted JavaScript string literal. */
export function jsString(s: string): string {
  let out = "'";
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (ch === '\\') out += '\\\\';
    else if (ch === "'") out += "\\'";
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (c < 0x20 || c === 0x7f || c === 0x2028 || c === 0x2029)
      out += `\\u${c.toString(16).padStart(4, '0')}`;
    else out += ch;
  }
  return out + "'";
}

/** Python 3 repr() of a str: prefers single quotes, like the interpreter. */
export function pyString(s: string): string {
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = q;
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (ch === '\\') out += '\\\\';
    else if (ch === q) out += `\\${q}`;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (c < 0x20 || c === 0x7f)
      out += `\\x${c.toString(16).padStart(2, '0')}`;
    else out += ch;
  }
  return out + q;
}

/** PowerShell single-quoted string: `'` is doubled, nothing else expands. */
export function psString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

/** A JSON value written as a Python literal (True/False/None). */
export function pyLiteral(value: unknown, indent = 0): string {
  const pad = (n: number) => '    '.repeat(n);
  if (value === null) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return pyString(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((v) => `${pad(indent + 1)}${pyLiteral(v, indent + 1)},`).join('\n')}\n${pad(indent)}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return '{}';
    return `{\n${entries.map(([k, v]) => `${pad(indent + 1)}${pyString(k)}: ${pyLiteral(v, indent + 1)},`).join('\n')}\n${pad(indent)}}`;
  }
  return 'None';
}

/** A JSON value written as a JavaScript literal with single-quoted strings. */
export function jsLiteral(value: unknown, indent = 0): string {
  const pad = (n: number) => '  '.repeat(n);
  if (value === null || typeof value === 'boolean' || typeof value === 'number')
    return String(value);
  if (typeof value === 'string') return jsString(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((v) => `${pad(indent + 1)}${jsLiteral(v, indent + 1)},`).join('\n')}\n${pad(indent)}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return '{}';
    return `{\n${entries.map(([k, v]) => `${pad(indent + 1)}${jsKey(k)}: ${jsLiteral(v, indent + 1)},`).join('\n')}\n${pad(indent)}}`;
  }
  return 'null';
}

function jsKey(k: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : jsString(k);
}

// ------------------------------------------------------------ URL & query

export function validateUrl(url: string): string | null {
  if (!url.trim()) return 'Enter a URL, e.g. https://api.example.com/users';
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return 'That isn’t a complete URL — include the scheme, e.g. https://api.example.com/users';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
    return 'Only http:// and https:// URLs are supported.';
  return null;
}

/** Splits a URL into the part before `?`, its decoded query pairs and the `#hash`. */
export function splitUrl(url: string): {
  base: string;
  params: KV[];
  hash: string;
} {
  const hashAt = url.indexOf('#');
  const hash = hashAt >= 0 ? url.slice(hashAt) : '';
  const noHash = hashAt >= 0 ? url.slice(0, hashAt) : url;
  const q = noHash.indexOf('?');
  if (q < 0) return { base: noHash, params: [], hash };
  const params: KV[] = [];
  for (const part of noHash.slice(q + 1).split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const rawKey = eq >= 0 ? part.slice(0, eq) : part;
    const rawValue = eq >= 0 ? part.slice(eq + 1) : '';
    params.push({
      enabled: true,
      key: safeDecode(rawKey),
      value: safeDecode(rawValue),
    });
  }
  return { base: noHash.slice(0, q), params, hash };
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch {
    // A stray % isn't valid encoding; keep the text as typed.
    return s;
  }
}

/** Percent-encodes a query component, leaving common safe characters readable. */
export function encodeQueryPart(s: string): string {
  return encodeURIComponent(s).replace(/%2C/g, ',').replace(/%3A/g, ':');
}

/** Rebuilds the URL from its base, the enabled params and the hash. */
export function buildUrl(base: string, params: KV[], hash = ''): string {
  const query = params
    .filter((p) => p.enabled && p.key)
    .map((p) => `${encodeQueryPart(p.key)}=${encodeQueryPart(p.value)}`)
    .join('&');
  return `${base}${query ? `?${query}` : ''}${hash}`;
}

/**
 * The params table after the user edits the URL: the URL's pairs (in URL
 * order) followed by the disabled rows, which never appear in the URL and
 * would otherwise be lost.
 */
export function mergeParams(fromUrl: KV[], existing: KV[]): KV[] {
  return [...fromUrl, ...existing.filter((p) => !p.enabled)];
}

// ---------------------------------------------------------------- headers

export function encodeForm(fields: KV[]): string {
  const sp = new URLSearchParams();
  for (const f of fields) if (f.enabled && f.key) sp.append(f.key, f.value);
  return sp.toString();
}

/** UTF-8 safe base64 of "user:password" for Basic auth. */
export function basicAuthValue(username: string, password: string): string {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return `Basic ${btoa(bin)}`;
}

const DEFAULT_TYPES: Record<BodyType, string | null> = {
  none: null,
  json: 'application/json',
  form: 'application/x-www-form-urlencoded',
  text: 'text/plain; charset=utf-8',
  // The client generates the boundary, so never hard-code this one.
  multipart: null,
};

export function hasBody(spec: RequestSpec): boolean {
  return (
    spec.bodyType !== 'none' && spec.method !== 'GET' && spec.method !== 'HEAD'
  );
}

const hasHeader = (list: [string, string][], name: string) =>
  list.some(([k]) => k.toLowerCase() === name.toLowerCase());

/** Final header list: user headers, then auth and an automatic Content-Type. */
export function resolveHeaders(spec: RequestSpec): [string, string][] {
  const out: [string, string][] = spec.headers
    .filter((h) => h.enabled && h.key.trim())
    .map((h) => [h.key.trim(), h.value]);
  if (spec.bodyType === 'multipart' && hasBody(spec))
    // A hand-written multipart Content-Type lacks the boundary and breaks the request.
    for (let i = out.length - 1; i >= 0; i--)
      if (out[i][0].toLowerCase() === 'content-type') out.splice(i, 1);
  if (!hasHeader(out, 'authorization')) {
    if (spec.auth.type === 'bearer' && spec.auth.token)
      out.push(['Authorization', `Bearer ${spec.auth.token}`]);
    if (
      spec.auth.type === 'basic' &&
      (spec.auth.username || spec.auth.password)
    )
      out.push([
        'Authorization',
        basicAuthValue(spec.auth.username, spec.auth.password),
      ]);
  }
  const auto = hasBody(spec) ? DEFAULT_TYPES[spec.bodyType] : null;
  if (auto && !hasHeader(out, 'content-type')) out.push(['Content-Type', auto]);
  return out;
}

/** Problems worth flagging next to the form. */
export function requestWarnings(spec: RequestSpec): string[] {
  const w: string[] = [];
  if (spec.bodyType !== 'none' && !hasBody(spec))
    w.push(
      `${spec.method} requests can’t have a body in fetch — the body is left out of the code.`,
    );
  for (const h of spec.headers)
    if (h.enabled && h.key.trim()) {
      if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(h.key.trim()))
        w.push(
          `Header name “${h.key}” contains characters that aren’t allowed.`,
        );
      if (/[\r\n]/.test(h.value))
        w.push(`Header “${h.key}” has a line break in its value.`);
    }
  if (
    spec.auth.type !== 'none' &&
    spec.headers.some(
      (h) => h.enabled && h.key.trim().toLowerCase() === 'authorization',
    )
  )
    w.push('An Authorization header is set, so the auth helper is ignored.');
  if (spec.bodyType === 'json' && hasBody(spec) && spec.body.trim()) {
    try {
      JSON.parse(spec.body);
    } catch {
      w.push('The JSON body isn’t valid JSON — it’s sent as written.');
    }
  }
  return w;
}

// --------------------------------------------------------------- snippets

type Built = {
  url: string;
  method: string;
  headers: [string, string][];
  body: BodyType;
  raw: string;
  json: { ok: true; value: unknown } | { ok: false };
  fields: [string, string][];
};

function prepare(spec: RequestSpec): Built {
  const { base, params, hash } = splitUrl(spec.url.trim());
  // The table is the source of truth for the query string.
  const url = buildUrl(base, spec.params.length ? spec.params : params, hash);
  const body = hasBody(spec) ? spec.bodyType : 'none';
  let json: Built['json'] = { ok: false };
  if (body === 'json')
    try {
      json = { ok: true, value: JSON.parse(spec.body) as unknown };
    } catch {
      json = { ok: false };
    }
  return {
    url,
    method: spec.method.toUpperCase(),
    headers: resolveHeaders(spec),
    body,
    raw: spec.body,
    json,
    fields: spec.fields
      .filter((f) => f.enabled && f.key)
      .map((f) => [f.key, f.value]),
  };
}

/** Body text for targets that send a plain string. */
function bodyText(b: Built): string {
  if (b.body === 'form')
    return encodeForm(
      b.fields.map(([key, value]) => ({ enabled: true, key, value })),
    );
  if (b.body === 'json' && b.json.ok) return JSON.stringify(b.json.value);
  return b.raw;
}

function curl(b: Built): string {
  const lines: string[] = [];
  const method =
    b.method === 'GET' || (b.method === 'POST' && b.body !== 'none')
      ? ''
      : b.method === 'HEAD'
        ? '--head '
        : `-X ${b.method} `;
  lines.push(`curl ${method}${shellQuote(b.url)}`);
  for (const [k, v] of b.headers) lines.push(`-H ${shellQuote(`${k}: ${v}`)}`);
  if (b.body === 'multipart')
    // --form-string never treats a leading @ or < as a file to upload.
    for (const [k, v] of b.fields)
      lines.push(`--form-string ${shellQuote(`${k}=${v}`)}`);
  else if (b.body !== 'none')
    lines.push(`--data-raw ${shellQuote(bodyText(b))}`);
  return lines.join(' \\\n  ');
}

function jsHeaders(headers: [string, string][], indent: string): string {
  if (!headers.length) return '{}';
  return `{\n${headers.map(([k, v]) => `${indent}  ${jsString(k)}: ${jsString(v)},`).join('\n')}\n${indent}}`;
}

function jsPairs(fields: [string, string][], indent: string): string {
  return `[\n${fields.map(([k, v]) => `${indent}  [${jsString(k)}, ${jsString(v)}],`).join('\n')}\n${indent}]`;
}

/** Shared by fetch, Axios and Node: statements to run before the request, plus the body expression. */
function jsBody(
  b: Built,
  indent: string,
): { pre: string; expr: string | null; axios: string | null } {
  if (b.body === 'none') return { pre: '', expr: null, axios: null };
  if (b.body === 'multipart') {
    const appends = b.fields
      .map(([k, v]) => `form.append(${jsString(k)}, ${jsString(v)});`)
      .join('\n');
    return {
      pre: `const form = new FormData();\n${appends ? `${appends}\n` : ''}\n`,
      expr: 'form',
      axios: 'form',
    };
  }
  if (b.body === 'form') {
    const expr = `new URLSearchParams(${jsPairs(b.fields, indent)})`;
    return { pre: '', expr, axios: expr };
  }
  if (b.body === 'json' && b.json.ok) {
    const lit = jsLiteral(b.json.value, indent.length / 2);
    return { pre: '', expr: `JSON.stringify(${lit})`, axios: lit };
  }
  const s = jsString(b.raw);
  return { pre: '', expr: s, axios: s };
}

function fetchSnippet(b: Built, node: boolean): string {
  const { pre, expr } = jsBody(b, '  ');
  const opts: string[] = [];
  if (b.method !== 'GET') opts.push(`  method: ${jsString(b.method)},`);
  if (b.headers.length) opts.push(`  headers: ${jsHeaders(b.headers, '  ')},`);
  if (expr) opts.push(`  body: ${expr},`);
  const call = opts.length
    ? `fetch(${jsString(b.url)}, {\n${opts.join('\n')}\n})`
    : `fetch(${jsString(b.url)})`;
  const head = node
    ? '// Node.js 18+ has fetch built in. Save as request.mjs and run: node request.mjs\n\n'
    : '';
  const read =
    b.method === 'HEAD'
      ? 'console.log(response.status, Object.fromEntries(response.headers));'
      : 'const text = await response.text();\nconsole.log(response.status, text);';
  return `${head}${pre}const response = await ${call};\n${read}`;
}

function axiosSnippet(b: Built): string {
  const { pre, axios } = jsBody(b, '  ');
  const opts = [
    `  method: ${jsString(b.method.toLowerCase())},`,
    `  url: ${jsString(b.url)},`,
  ];
  if (b.headers.length) opts.push(`  headers: ${jsHeaders(b.headers, '  ')},`);
  if (axios) opts.push(`  data: ${axios},`);
  return `import axios from 'axios';\n\n${pre}const response = await axios({\n${opts.join('\n')}\n});\nconsole.log(response.status, response.data);`;
}

const PY_METHODS = new Set([
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
]);

function pythonSnippet(b: Built): string {
  const lines = ['import requests', '', `url = ${pyString(b.url)}`];
  const args = ['url'];
  if (b.headers.length) {
    lines.push(
      `headers = {\n${b.headers.map(([k, v]) => `    ${pyString(k)}: ${pyString(v)},`).join('\n')}\n}`,
    );
    args.push('headers=headers');
  }
  if (b.body === 'json' && b.json.ok) {
    lines.push(`payload = ${pyLiteral(b.json.value)}`);
    args.push('json=payload');
  } else if (b.body === 'form') {
    lines.push(
      `data = [\n${b.fields.map(([k, v]) => `    (${pyString(k)}, ${pyString(v)}),`).join('\n')}\n]`,
    );
    args.push('data=data');
  } else if (b.body === 'multipart') {
    // (None, value) sends a plain text field rather than a file.
    lines.push(
      `files = [\n${b.fields.map(([k, v]) => `    (${pyString(k)}, (None, ${pyString(v)})),`).join('\n')}\n]`,
    );
    args.push('files=files');
  } else if (b.body !== 'none') {
    lines.push(`data = ${pyString(b.raw)}.encode('utf-8')`);
    args.push('data=data');
  }
  const call = PY_METHODS.has(b.method)
    ? `requests.${b.method.toLowerCase()}(${args.join(', ')})`
    : `requests.request(${pyString(b.method)}, ${args.join(', ')})`;
  lines.push(
    '',
    `response = ${call}`,
    'print(response.status_code)',
    'print(response.text)',
  );
  return lines.join('\n');
}

function httpieSnippet(b: Built): string {
  const flag =
    b.body === 'form'
      ? ' --form'
      : b.body === 'multipart'
        ? ' --multipart'
        : '';
  const parts: string[] = [`http${flag} ${b.method}`, shellQuote(b.url)];
  for (const [k, v] of b.headers) parts.push(shellQuote(`${k}:${v}`));
  if (b.body === 'form' || b.body === 'multipart')
    // `key=value` is a form field in --form/--multipart mode; escape separators in the key.
    for (const [k, v] of b.fields)
      parts.push(shellQuote(`${k.replace(/([=:@\\])/g, '\\$1')}=${v}`));
  // --raw (HTTPie 3.2+) sends the body exactly as written.
  if ((b.body === 'json' || b.body === 'text') && b.raw)
    parts.push(`--raw ${shellQuote(bodyText(b))}`);
  return parts.join(' \\\n  ');
}

function powershellSnippet(b: Built): string {
  const lines: string[] = [];
  const headers = b.headers.filter(([k]) => k.toLowerCase() !== 'content-type');
  const contentType = b.headers.find(
    ([k]) => k.toLowerCase() === 'content-type',
  );
  if (headers.length)
    lines.push(
      `$headers = @{\n${headers.map(([k, v]) => `  ${psString(k)} = ${psString(v)}`).join('\n')}\n}`,
    );
  const method = b.method.charAt(0) + b.method.slice(1).toLowerCase();
  const args = [`-Uri ${psString(b.url)}`, `-Method ${method}`];
  if (headers.length) args.push('-Headers $headers');
  if (b.body === 'multipart') {
    lines.push(
      `$form = @{\n${b.fields.map(([k, v]) => `  ${psString(k)} = ${psString(v)}`).join('\n')}\n}`,
    );
    args.push('-Form $form');
  } else if (b.body !== 'none') {
    lines.push(`$body = ${psString(bodyText(b))}`);
    if (contentType) args.push(`-ContentType ${psString(contentType[1])}`);
    args.push('-Body $body');
  }
  const note =
    b.body === 'multipart' ? '# -Form needs PowerShell 7 or later.\n' : '';
  lines.push(`Invoke-RestMethod ${args.join(' `\n  ')}`);
  return note + lines.join('\n\n');
}

export function generateSnippet(
  spec: RequestSpec,
  target: SnippetTarget,
): string {
  const b = prepare(spec);
  switch (target) {
    case 'curl':
      return curl(b);
    case 'fetch':
      return fetchSnippet(b, false);
    case 'node':
      return fetchSnippet(b, true);
    case 'axios':
      return axiosSnippet(b);
    case 'python':
      return pythonSnippet(b);
    case 'httpie':
      return httpieSnippet(b);
    case 'powershell':
      return powershellSnippet(b);
  }
}
