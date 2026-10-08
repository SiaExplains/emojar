import { describe, expect, it } from 'vitest';
import {
  basicAuthValue,
  buildUrl,
  encodeForm,
  generateSnippet,
  jsString,
  mergeParams,
  psString,
  pyLiteral,
  pyString,
  requestWarnings,
  resolveHeaders,
  shellQuote,
  splitUrl,
  validateUrl,
  type RequestSpec,
} from './http-snippets';

const spec = (over: Partial<RequestSpec> = {}): RequestSpec => ({
  method: 'GET',
  url: 'https://api.example.com/users',
  params: [],
  headers: [],
  bodyType: 'none',
  body: '',
  fields: [],
  auth: { type: 'none', token: '', username: '', password: '' },
  ...over,
});
const kv = (key: string, value: string, enabled = true) => ({
  key,
  value,
  enabled,
});

describe('quoting', () => {
  const tricky = `it's "quoted" $HOME \`cmd\` \\ é 🎉\nline2`;

  it('shell-quotes with the close-escape-reopen trick', () => {
    expect(shellQuote("it's")).toBe(`'it'\\''s'`);
    expect(shellQuote('$HOME `x`')).toBe(`'$HOME \`x\`'`);
    expect(shellQuote('')).toBe("''");
  });

  it('writes JavaScript strings that evaluate back to the input', () => {
    const lit = jsString(tricky + ' \u0001');
    expect(lit.startsWith("'")).toBe(true);
    expect(lit).not.toContain('\n');
    expect(new Function(`return ${lit}`)()).toBe(tricky + ' \u0001');
  });

  it('mimics Python repr()', () => {
    expect(pyString('abc')).toBe("'abc'");
    expect(pyString("it's")).toBe(`"it's"`);
    expect(pyString(`it's "x"`)).toBe(`'it\\'s "x"'`);
    expect(pyString('a\nb\t\u0001\\')).toBe("'a\\nb\\t\\x01\\\\'");
    expect(pyString('é 🎉 $x')).toBe("'é 🎉 $x'");
  });

  it('doubles quotes for PowerShell', () => {
    expect(psString("it's $x")).toBe("'it''s $x'");
  });

  it('writes Python literals for JSON values', () => {
    expect(pyLiteral({ a: true, b: null, c: [1, 'x'] })).toBe(
      "{\n    'a': True,\n    'b': None,\n    'c': [\n        1,\n        'x',\n    ],\n}",
    );
    expect(pyLiteral([])).toBe('[]');
  });
});

describe('URLs and query params', () => {
  it('validates with the URL API', () => {
    expect(validateUrl('https://example.com/a?b=1')).toBeNull();
    expect(validateUrl('example.com')).toMatch(/scheme/);
    expect(validateUrl('ftp://example.com')).toMatch(/http/);
    expect(validateUrl('')).toMatch(/Enter a URL/);
  });

  it('splits and decodes the query string', () => {
    expect(splitUrl('https://x.io/s?q=a+b&tag=%C3%A9&flag#top')).toEqual({
      base: 'https://x.io/s',
      params: [kv('q', 'a b'), kv('tag', 'é'), kv('flag', '')],
      hash: '#top',
    });
    expect(splitUrl('https://x.io/?bad=%E0%A4%A').params[0].value).toBe(
      '%E0%A4%A',
    );
    expect(splitUrl('https://x.io').params).toEqual([]);
  });

  it('rebuilds the URL from enabled params only', () => {
    expect(
      buildUrl(
        'https://x.io/s',
        [kv('q', 'a b&c'), kv('off', '1', false), kv('', 'x'), kv('t', 'é')],
        '#h',
      ),
    ).toBe('https://x.io/s?q=a%20b%26c&t=%C3%A9#h');
    expect(buildUrl('https://x.io/s', [])).toBe('https://x.io/s');
  });

  it('keeps disabled rows when the URL is edited', () => {
    const existing = [kv('a', '1'), kv('debug', 'true', false)];
    const fromUrl = splitUrl('https://x.io/?a=2&b=3').params;
    expect(mergeParams(fromUrl, existing)).toEqual([
      kv('a', '2'),
      kv('b', '3'),
      kv('debug', 'true', false),
    ]);
  });

  it('form-encodes fields', () => {
    expect(
      encodeForm([
        kv('name', 'Ada Lovelace'),
        kv('x', 'a&b=c'),
        kv('o', '1', false),
      ]),
    ).toBe('name=Ada+Lovelace&x=a%26b%3Dc');
    expect(encodeForm([])).toBe('');
  });
});

describe('headers', () => {
  it('adds auth and an automatic content type', () => {
    expect(
      resolveHeaders(
        spec({
          method: 'POST',
          bodyType: 'json',
          body: '{}',
          auth: { type: 'bearer', token: 'abc', username: '', password: '' },
        }),
      ),
    ).toEqual([
      ['Authorization', 'Bearer abc'],
      ['Content-Type', 'application/json'],
    ]);
  });

  it('respects a user Content-Type but drops it for multipart', () => {
    const custom = spec({
      method: 'POST',
      bodyType: 'json',
      headers: [kv('content-type', 'application/vnd.api+json')],
    });
    expect(resolveHeaders(custom)).toEqual([
      ['content-type', 'application/vnd.api+json'],
    ]);
    expect(resolveHeaders({ ...custom, bodyType: 'multipart' })).toEqual([]);
  });

  it('encodes Basic auth as UTF-8', () => {
    expect(basicAuthValue('user', 'pass')).toBe('Basic dXNlcjpwYXNz');
    expect(basicAuthValue('josé', 'ü')).toBe('Basic am9zw6k6w7w=');
  });

  it('warns about bodies on GET and bad headers', () => {
    const w = requestWarnings(
      spec({
        bodyType: 'json',
        body: '{bad',
        headers: [kv('Bad Header', 'x'), kv('X-Ok', 'a\nb')],
      }),
    );
    expect(w.join(' ')).toMatch(/GET requests can’t have a body/);
    expect(w.join(' ')).toMatch(/Bad Header/);
    expect(w.join(' ')).toMatch(/line break/);
  });
});

describe('snippets', () => {
  const post = spec({
    method: 'POST',
    url: 'https://api.example.com/items?draft=1',
    params: [kv('draft', '1'), kv('q', "it's $5")],
    headers: [kv('X-Note', "it's")],
    bodyType: 'json',
    body: '{"name":"Ada\'s \\"pen\\"","n":1,"ok":true,"none":null}',
  });

  it('builds cURL with safe quoting', () => {
    const out = generateSnippet(post, 'curl');
    expect(out).toBe(
      [
        `curl 'https://api.example.com/items?draft=1&q=it'\\''s%20%245'`,
        `-H 'X-Note: it'\\''s'`,
        `-H 'Content-Type: application/json'`,
        `--data-raw '{"name":"Ada'\\''s \\"pen\\"","n":1,"ok":true,"none":null}'`,
      ].join(' \\\n  '),
    );
    expect(generateSnippet(spec({ method: 'DELETE' }), 'curl')).toBe(
      "curl -X DELETE 'https://api.example.com/users'",
    );
    expect(generateSnippet(spec({ method: 'HEAD' }), 'curl')).toMatch(
      /^curl --head /,
    );
  });

  it('uses --form-string for multipart so @ is not a file', () => {
    const out = generateSnippet(
      spec({
        method: 'POST',
        bodyType: 'multipart',
        fields: [kv('who', '@me')],
      }),
      'curl',
    );
    expect(out).toContain(`--form-string 'who=@me'`);
    expect(out).not.toContain('Content-Type');
  });

  it('builds fetch with a JSON body literal', () => {
    const out = generateSnippet(post, 'fetch');
    expect(out).toContain("method: 'POST'");
    expect(out).toContain("'X-Note': 'it\\'s'");
    expect(out).toContain("name: 'Ada\\'s \"pen\"'");
    expect(out).toContain('body: JSON.stringify({');
    expect(generateSnippet(spec(), 'fetch')).toBe(
      "const response = await fetch('https://api.example.com/users');\nconst text = await response.text();\nconsole.log(response.status, text);",
    );
  });

  it('builds Axios, Node, Python, HTTPie and PowerShell', () => {
    expect(generateSnippet(post, 'axios')).toMatch(/data: \{\n/);
    expect(generateSnippet(post, 'node')).toMatch(/^\/\/ Node\.js 18\+/);
    const py = generateSnippet(post, 'python');
    expect(py).toContain("'name': 'Ada\\'s \"pen\"'");
    expect(py).toContain("'ok': True");
    expect(py).toContain('requests.post(url, headers=headers, json=payload)');
    expect(generateSnippet(spec({ method: 'PURGE' }), 'python')).toContain(
      "requests.request('PURGE', url)",
    );
    const form = spec({
      method: 'POST',
      bodyType: 'form',
      fields: [kv('a', '1'), kv('b', 'x y')],
    });
    expect(generateSnippet(form, 'python')).toContain(
      "data = [\n    ('a', '1'),\n    ('b', 'x y'),\n]",
    );
    expect(generateSnippet(form, 'httpie')).toBe(
      [
        'http --form POST',
        "'https://api.example.com/users'",
        "'Content-Type:application/x-www-form-urlencoded'",
        "'a=1'",
        "'b=x y'",
      ].join(' \\\n  '),
    );
    const ps = generateSnippet(post, 'powershell');
    expect(ps).toContain("-ContentType 'application/json'");
    expect(ps).toContain("'X-Note' = 'it''s'");
  });

  it('leaves the body out of GET requests', () => {
    const out = generateSnippet(
      spec({ bodyType: 'text', body: 'hello' }),
      'curl',
    );
    expect(out).not.toContain('--data');
  });
});
