import { describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import {
  convertBases,
  decodeEntitiesBasic,
  encodeEntities,
  escapeString,
  jsonToXml,
  parseBigInt,
  unescapeString,
  xmlName,
  type EscapeMode,
} from './dev-tools';
import {
  detectBot,
  diffJson,
  formatIPv6,
  ipv4Subnet,
  ipv6Subnet,
  parseIPv6,
  parseOctalMode,
  parseSymbolic,
  permsToOctal,
  permsToSymbolic,
  prefixFromMask,
  robotsAllowed,
  splitSubnet,
} from './network';
import {
  base32Decode,
  base32Encode,
  hotp,
  parseOtpAuthUri,
  totp,
} from './totp';
import { HTTP_STATUSES, searchStatuses } from './http-status';
import { buildMetaTags, buildRobotsTxt } from './web-meta';

describe('HTML entities', () => {
  it('encodes and decodes', () => {
    expect(encodeEntities('<a href="x">Tom & Jerry</a>', 'minimal')).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&lt;/a&gt;',
    );
    expect(encodeEntities('café ©', 'named')).toBe('caf&eacute; &copy;');
    expect(encodeEntities('é😀', 'numeric')).toBe('&#233;&#128512;');
    expect(encodeEntities('é', 'hex')).toBe('&#xE9;');
    expect(
      decodeEntitiesBasic('&lt;b&gt; &amp;amp; &#233; &#x1F600; &copy;'),
    ).toBe('<b> &amp; é 😀 ©');
    expect(decodeEntitiesBasic('&unknown; &amp')).toBe('&unknown; &');
  });
});

describe('JSON to XML', () => {
  it('converts nested data with arrays and attributes', () => {
    const xml = jsonToXml(
      '{"book":{"@id":"7","title":"Dune & more","tags":["a","b"],"price":9.5,"x":null}}',
    );
    expect(xml).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<book id="7">',
        '  <title>Dune &amp; more</title>',
        '  <tags>a</tags>',
        '  <tags>b</tags>',
        '  <price>9.5</price>',
        '  <x/>',
        '</book>',
      ].join('\n'),
    );
    expect(jsonToXml('[1,2]', { declaration: false })).toBe(
      '<root>\n  <item>1</item>\n  <item>2</item>\n</root>',
    );
    expect(xmlName('2nd key')).toBe('_2nd_key');
    expect(() => jsonToXml('{bad')).toThrow(/Invalid JSON/);
  });
});

describe('string escape', () => {
  const sample = 'He said "hi"\n\tit\'s C:\\path ✓';
  it.each([
    'json',
    'javascript',
    'java',
    'python',
    'sql',
    'csv',
    'regex',
    'shell',
    'xml',
  ] as EscapeMode[])('%s round-trips', (mode) => {
    expect(unescapeString(escapeString(sample, mode), mode)).toBe(sample);
  });
  it('produces the expected forms', () => {
    expect(escapeString('a"b\n', 'json')).toBe('a\\"b\\n');
    expect(escapeString("it's", 'sql')).toBe("it''s");
    expect(escapeString("it's", 'shell')).toBe(`'it'\\''s'`);
    expect(escapeString('a,b', 'csv')).toBe('"a,b"');
    expect(escapeString('1+1=2?', 'regex')).toBe('1\\+1=2\\?');
    expect(unescapeString('\\u00e9\\x41\\n', 'javascript')).toBe('éA\n');
    expect(escapeString('`${x}`', 'javascript')).toBe('\\`\\${x}\\`');
  });
});

describe('number bases', () => {
  it('converts with BigInt and prefixes', () => {
    expect(parseBigInt('0xff', 16)).toBe(BigInt(255));
    expect(parseBigInt('-0b1010', 0)).toBe(BigInt(-10));
    expect(parseBigInt('1_000_000', 10)).toBe(BigInt(1000000));
    expect(convertBases('255', 10, 2)).toBe('11111111');
    expect(convertBases('11111111', 2, 10)).toBe('255');
    expect(convertBases('ff', 16, 10)).toBe('255');
    expect(convertBases('18446744073709551616', 10, 16)).toBe(
      '10000000000000000',
    );
    expect(convertBases('255', 10, 'all', { group: true })).toContain(
      'Binary       0b1111 1111',
    );
    expect(() => parseBigInt('12', 2)).toThrow(/not a valid digit in base 2/);
    expect(convertBases('-42', 10, 'all')).toContain('Hexadecimal  -0x2a');
    expect(convertBases('z', 36, 10)).toBe('35');
  });
});

describe('subnets', () => {
  it('computes IPv4 subnets', () => {
    const s = ipv4Subnet('192.168.1.130/24');
    expect(s).toMatchObject({
      network: '192.168.1.0',
      broadcast: '192.168.1.255',
      mask: '255.255.255.0',
      wildcard: '0.0.0.255',
      firstHost: '192.168.1.1',
      lastHost: '192.168.1.254',
      usableHosts: 254,
      ipClass: 'C',
      scope: 'Private (RFC 1918)',
    });
    expect(ipv4Subnet('10.1.2.3 255.0.0.0')).toMatchObject({
      network: '10.0.0.0',
      usableHosts: 16777214,
    });
    expect(ipv4Subnet('203.0.113.4/31')).toMatchObject({
      usableHosts: 2,
      firstHost: '203.0.113.4',
      lastHost: '203.0.113.5',
    });
    expect(ipv4Subnet('8.8.8.8')).toMatchObject({
      prefix: 32,
      usableHosts: 1,
      scope: 'Public',
    });
    expect(ipv4Subnet('0.0.0.0/0').totalAddresses).toBe(2 ** 32);
    expect(prefixFromMask('255.255.240.0')).toBe(20);
    expect(() => prefixFromMask('255.0.255.0')).toThrow(/contiguous/);
    expect(splitSubnet('192.168.0.0/24', 26).list).toEqual([
      '192.168.0.0/26',
      '192.168.0.64/26',
      '192.168.0.128/26',
      '192.168.0.192/26',
    ]);
  });

  it('computes IPv6 prefixes', () => {
    expect(
      formatIPv6(parseIPv6('2001:0db8:0000:0000:0000:ff00:0042:8329')),
    ).toBe('2001:db8::ff00:42:8329');
    expect(formatIPv6(parseIPv6('::1'))).toBe('::1');
    const s = ipv6Subnet('2001:db8:abcd:12::1/64');
    expect(s.first).toBe('2001:db8:abcd:12::');
    expect(s.last).toBe('2001:db8:abcd:12:ffff:ffff:ffff:ffff');
    expect(s.total).toBe(BigInt(2) ** BigInt(64));
    expect(() => parseIPv6('1::2::3')).toThrow();
  });
});

describe('chmod', () => {
  it('converts octal and symbolic', () => {
    expect(permsToSymbolic(parseOctalMode('755'))).toBe('rwxr-xr-x');
    expect(permsToSymbolic(parseOctalMode('4755'))).toBe('rwsr-xr-x');
    expect(permsToSymbolic(parseOctalMode('1777'))).toBe('rwxrwxrwt');
    expect(permsToSymbolic(parseOctalMode('2644'))).toBe('rw-r-Sr--');
    expect(permsToOctal(parseSymbolic('-rw-r--r--'))).toBe('644');
    expect(permsToOctal(parseSymbolic('rwsr-xr-x'))).toBe('4755');
    expect(() => parseOctalMode('789')).toThrow();
  });
});

describe('JSON diff', () => {
  it('reports paths of changes', () => {
    const a = { name: 'Ada', tags: ['x', 'y'], meta: { v: 1, 'a b': true } };
    const b = { name: 'Ada L.', tags: ['x'], meta: { v: 1 }, extra: null };
    expect(diffJson(a, b)).toEqual([
      { type: 'changed', path: '$.name', from: 'Ada', to: 'Ada L.' },
      { type: 'removed', path: '$.tags[1]', value: 'y' },
      { type: 'removed', path: '$.meta["a b"]', value: true },
      { type: 'added', path: '$.extra', value: null },
    ]);
    expect(diffJson([1, 2, 3], [3, 1, 2], { ignoreArrayOrder: true })).toEqual(
      [],
    );
    expect(diffJson({ a: { x: 1, y: 2 } }, { a: { y: 2, x: 1 } })).toEqual([]);
  });
});

describe('robots.txt', () => {
  const txt = `User-agent: *\nDisallow: /private/\nAllow: /private/open\nDisallow: /*.pdf$\n\nUser-agent: Googlebot\nDisallow: /nogoogle\n\nSitemap: https://example.com/sitemap.xml`;
  it('applies longest-match rules and agent groups', () => {
    expect(robotsAllowed(txt, 'Bingbot', '/private/x').allowed).toBe(false);
    expect(robotsAllowed(txt, 'Bingbot', '/private/open/page').allowed).toBe(
      true,
    );
    expect(robotsAllowed(txt, 'Bingbot', '/file.pdf').allowed).toBe(false);
    expect(robotsAllowed(txt, 'Bingbot', '/file.pdf?x=1').allowed).toBe(true);
    // Googlebot has its own group, so the * rules don't apply to it.
    expect(robotsAllowed(txt, 'Googlebot', '/private/x').allowed).toBe(true);
    expect(robotsAllowed(txt, 'Googlebot', '/nogoogle').allowed).toBe(false);
  });
  it('builds files', () => {
    expect(
      buildRobotsTxt(
        [
          { agent: '*', allow: [], disallow: [''] },
          { agent: 'GPTBot, CCBot', allow: [], disallow: ['/'] },
        ],
        ['https://example.com/sitemap.xml'],
      ),
    ).toBe(
      'User-agent: *\nDisallow:\n\nUser-agent: GPTBot\nUser-agent: CCBot\nDisallow: /\n\nSitemap: https://example.com/sitemap.xml\n',
    );
  });
});

describe('TOTP (RFC 6238 test vectors)', () => {
  const enc = (s: string) => new TextEncoder().encode(s);
  const k1 = enc('12345678901234567890');
  const k256 = enc('12345678901234567890123456789012');
  const k512 = enc(
    '1234567890123456789012345678901234567890123456789012345678901234',
  );
  it.each([
    [59, '94287082', '46119246', '90693936'],
    [1111111109, '07081804', '68084774', '25091201'],
    [1234567890, '89005924', '91819424', '93441116'],
    [20000000000, '65353130', '77737706', '47863826'],
  ])('t=%i', async (t, s1, s256, s512) => {
    const ms = t * 1000;
    expect(await totp(k1, ms, { digits: 8 })).toBe(s1);
    expect(await totp(k256, ms, { digits: 8, algorithm: 'SHA-256' })).toBe(
      s256,
    );
    expect(await totp(k512, ms, { digits: 8, algorithm: 'SHA-512' })).toBe(
      s512,
    );
  });
  it('matches RFC 4226 HOTP and Base32', async () => {
    expect(await hotp(k1, 0)).toBe('755224');
    expect(await hotp(k1, 9)).toBe('520489');
    expect(base32Encode(k1)).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
    expect(base32Decode('gezd gnbv gy3t qojq gezd gnbv gy3t qojq')).toEqual(k1);
    expect(() => base32Decode('abc1')).toThrow(/Base32/);
    expect(
      parseOtpAuthUri(
        'otpauth://totp/ACME%20Co:jane@example.com?secret=JBSWY3DPEHPK3PXP&issuer=ACME%20Co&digits=8&period=60&algorithm=SHA256',
      ),
    ).toEqual({
      secret: 'JBSWY3DPEHPK3PXP',
      issuer: 'ACME Co',
      account: 'jane@example.com',
      algorithm: 'SHA-256',
      digits: 8,
      period: 60,
    });
  });
});

describe('misc', () => {
  it('hashes and verifies bcrypt', () => {
    const hash = bcrypt.hashSync('correct horse', 4);
    expect(hash).toMatch(/^\$2[aby]\$04\$/);
    expect(bcrypt.compareSync('correct horse', hash)).toBe(true);
    expect(bcrypt.compareSync('wrong', hash)).toBe(false);
  });
  it('detects bots and looks up statuses', () => {
    expect(
      detectBot(
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      ),
    ).toEqual({ name: 'Googlebot', kind: 'Search engine' });
    expect(detectBot('curl/8.4.0')?.name).toBe('curl');
    expect(detectBot('Mozilla/5.0 (Windows NT 10.0) Chrome/130')).toBeNull();
    expect(new Set(HTTP_STATUSES.map((x) => x.code)).size).toBe(
      HTTP_STATUSES.length,
    );
    expect(searchStatuses('404')[0].name).toBe('Not Found');
    expect(searchStatuses('redirect').map((x) => x.code)).toContain(301);
    expect(
      searchStatuses('', 3).every((x) => x.code >= 300 && x.code < 400),
    ).toBe(true);
  });
  it('escapes meta tags', () => {
    const html = buildMetaTags({
      title: 'Tom "&" Jerry <3',
      description: 'Desc',
      url: 'https://example.com/',
      image: '',
      imageAlt: '',
      siteName: '',
      type: 'website',
      locale: '',
      twitterCard: 'summary_large_image',
      twitterSite: 'emojar',
      themeColor: '',
      robots: 'index, follow',
      canonical: true,
    });
    expect(html).toContain('<title>Tom &quot;&amp;&quot; Jerry &lt;3</title>');
    expect(html).toContain('<meta name="twitter:site" content="@emojar" />');
    expect(html).toContain(
      '<link rel="canonical" href="https://example.com/" />',
    );
    expect(html).not.toContain('og:image');
  });
});
