// HTTP status codes (IANA registry; RFC 9110 unless noted), with a plain
// explanation and what each one means for SEO and caching.

export type HttpStatus = {
  code: number;
  name: string;
  meaning: string;
  seo?: string;
  ref: string;
  /** Codes people actually meet day to day (browsers, APIs, CDNs). */
  common: boolean;
  /** One plain-English sentence on typical usage. */
  usage: string;
  /** Related codes; every one exists in HTTP_STATUSES. */
  related: number[];
};

type BaseStatus = Omit<HttpStatus, 'common' | 'usage' | 'related'>;

const s = (
  code: number,
  name: string,
  meaning: string,
  ref = 'RFC 9110',
  seo?: string,
): BaseStatus => ({ code, name, meaning, ref, seo });

const BASE: BaseStatus[] = [
  s(
    100,
    'Continue',
    'The server got the request headers; the client may send the body (used with “Expect: 100-continue”).',
  ),
  s(
    101,
    'Switching Protocols',
    'The server agrees to switch protocols, e.g. to WebSocket.',
  ),
  s(
    102,
    'Processing',
    'WebDAV: the request is accepted but not finished yet.',
    'RFC 2518',
  ),
  s(
    103,
    'Early Hints',
    'Sends Link headers early so the browser can preload resources while the final response is prepared.',
    'RFC 8297',
  ),
  s(
    200,
    'OK',
    'The request succeeded.',
    'RFC 9110',
    'The normal status for a page that should be indexed.',
  ),
  s(
    201,
    'Created',
    'A new resource was created; its URL is usually in the Location header.',
  ),
  s(
    202,
    'Accepted',
    'The request was accepted for processing, which happens later.',
  ),
  s(
    203,
    'Non-Authoritative Information',
    'The response was modified by a proxy.',
  ),
  s(
    204,
    'No Content',
    'Success, but there is no body to send (common for DELETE and form autosaves).',
  ),
  s(205, 'Reset Content', 'Success; the client should reset the form or view.'),
  s(
    206,
    'Partial Content',
    'Only part of the resource is sent, as asked for with a Range header (video streaming, resumable downloads).',
  ),
  s(
    207,
    'Multi-Status',
    'WebDAV: the body contains several status codes.',
    'RFC 4918',
  ),
  s(
    208,
    'Already Reported',
    'WebDAV: members already listed are not repeated.',
    'RFC 5842',
  ),
  s(
    226,
    'IM Used',
    'The response is the result of instance manipulations (delta encoding).',
    'RFC 3229',
  ),
  s(
    300,
    'Multiple Choices',
    'Several representations are available; the client chooses.',
  ),
  s(
    301,
    'Moved Permanently',
    'The resource has a new permanent URL (in Location). Browsers may change POST to GET.',
    'RFC 9110',
    'Passes ranking signals to the new URL; use it for permanent moves and domain changes.',
  ),
  s(
    302,
    'Found',
    'The resource is temporarily at another URL. Browsers may change POST to GET.',
    'RFC 9110',
    'Treated as temporary: the original URL usually stays indexed. Use 301 for permanent moves.',
  ),
  s(
    303,
    'See Other',
    'Go to another URL with GET — typical after a form POST.',
  ),
  s(
    304,
    'Not Modified',
    'The cached copy is still valid (after If-None-Match / If-Modified-Since); no body is sent.',
    'RFC 9110',
    'Fine for crawlers — it saves crawl budget.',
  ),
  s(305, 'Use Proxy', 'Deprecated; not supported by browsers.'),
  s(
    307,
    'Temporary Redirect',
    'Temporarily at another URL; the method and body must not change.',
    'RFC 9110',
    'Treated like 302 (temporary). Also what browsers show internally for HSTS upgrades.',
  ),
  s(
    308,
    'Permanent Redirect',
    'Permanently at another URL; the method and body must not change.',
    'RFC 9110',
    'Treated like 301 (permanent).',
  ),
  s(
    400,
    'Bad Request',
    'The server can’t process the request because it is malformed (bad syntax, invalid JSON, too-large headers).',
  ),
  s(
    401,
    'Unauthorized',
    'Authentication is required or failed. Despite the name it means “unauthenticated”; a WWW-Authenticate header says how to log in.',
    'RFC 9110',
    'Not indexed.',
  ),
  s(
    402,
    'Payment Required',
    'Reserved for future use; some APIs use it for billing problems.',
  ),
  s(
    403,
    'Forbidden',
    'The server understood the request but refuses it — the user is known but not allowed, or access is blocked.',
    'RFC 9110',
    'Not indexed; repeated 403s on important pages often mean a firewall is blocking crawlers.',
  ),
  s(
    404,
    'Not Found',
    'There is nothing at this URL (or the server won’t say).',
    'RFC 9110',
    'Removed from the index over time. Normal for deleted pages; fix internal links that point to 404s.',
  ),
  s(
    405,
    'Method Not Allowed',
    'The URL exists but doesn’t support this method (e.g. POST to a read-only page); an Allow header lists valid methods.',
  ),
  s(406, 'Not Acceptable', 'No representation matches the Accept headers.'),
  s(407, 'Proxy Authentication Required', 'Like 401, but for a proxy.'),
  s(408, 'Request Timeout', 'The client took too long to send the request.'),
  s(
    409,
    'Conflict',
    'The request conflicts with the resource’s current state, e.g. an edit conflict or duplicate.',
  ),
  s(
    410,
    'Gone',
    'The resource was deliberately and permanently removed.',
    'RFC 9110',
    'Dropped from the index slightly faster than a 404.',
  ),
  s(411, 'Length Required', 'A Content-Length header is required.'),
  s(
    412,
    'Precondition Failed',
    'A condition such as If-Match was not met (optimistic locking).',
  ),
  s(
    413,
    'Content Too Large',
    'The request body is larger than the server accepts (often an upload limit).',
  ),
  s(414, 'URI Too Long', 'The URL is longer than the server will handle.'),
  s(
    415,
    'Unsupported Media Type',
    'The body’s Content-Type isn’t supported (e.g. sending form data to a JSON API).',
  ),
  s(
    416,
    'Range Not Satisfiable',
    'The requested byte range is outside the file.',
  ),
  s(417, 'Expectation Failed', 'The Expect header can’t be met.'),
  s(
    418,
    'I’m a teapot',
    'An April Fools’ joke from the Hyper Text Coffee Pot Control Protocol; some servers use it to refuse bots.',
    'RFC 2324',
  ),
  s(
    421,
    'Misdirected Request',
    'The request reached a server that can’t answer for this host (HTTP/2 connection reuse).',
  ),
  s(
    422,
    'Unprocessable Content',
    'The syntax is fine but the content is invalid — typical for form validation errors in APIs.',
  ),
  s(423, 'Locked', 'WebDAV: the resource is locked.', 'RFC 4918'),
  s(
    424,
    'Failed Dependency',
    'WebDAV: an earlier request this one depended on failed.',
    'RFC 4918',
  ),
  s(
    425,
    'Too Early',
    'The server won’t risk processing a request that might be replayed (TLS early data).',
    'RFC 8470',
  ),
  s(
    426,
    'Upgrade Required',
    'The client must switch to another protocol (in the Upgrade header).',
  ),
  s(
    428,
    'Precondition Required',
    'The server requires a conditional request to avoid lost updates.',
    'RFC 6585',
  ),
  s(
    429,
    'Too Many Requests',
    'Rate limit reached; a Retry-After header may say when to try again.',
    'RFC 6585',
    'Crawlers slow down; persistent 429s reduce crawling.',
  ),
  s(
    431,
    'Request Header Fields Too Large',
    'Headers (often cookies) are too large.',
    'RFC 6585',
  ),
  s(
    451,
    'Unavailable For Legal Reasons',
    'Blocked for legal reasons, such as a court order or sanctions.',
    'RFC 7725',
  ),
  s(
    500,
    'Internal Server Error',
    'A generic error on the server — an unhandled exception or misconfiguration.',
    'RFC 9110',
    'Crawlers retry; if it persists, pages drop out of the index.',
  ),
  s(501, 'Not Implemented', 'The server doesn’t support the method.'),
  s(
    502,
    'Bad Gateway',
    'A proxy or load balancer got an invalid response from the upstream server (app crashed or not running).',
    'RFC 9110',
    'Treated like 500 — fix quickly.',
  ),
  s(
    503,
    'Service Unavailable',
    'The server is overloaded or in maintenance; a Retry-After header may say when it will be back.',
    'RFC 9110',
    'The right status for planned maintenance: crawlers come back later without dropping pages (for a short time).',
  ),
  s(
    504,
    'Gateway Timeout',
    'A proxy didn’t get a response from the upstream server in time.',
  ),
  s(
    505,
    'HTTP Version Not Supported',
    'The HTTP version used isn’t supported.',
  ),
  s(
    506,
    'Variant Also Negotiates',
    'Content negotiation is misconfigured.',
    'RFC 2295',
  ),
  s(
    507,
    'Insufficient Storage',
    'WebDAV: the server is out of space.',
    'RFC 4918',
  ),
  s(508, 'Loop Detected', 'WebDAV: an infinite loop was found.', 'RFC 5842'),
  s(
    510,
    'Not Extended',
    'Further extensions are required (obsolete).',
    'RFC 2774',
  ),
  s(
    511,
    'Network Authentication Required',
    'You need to log in to the network first — captive portals in hotels and airports.',
    'RFC 6585',
  ),
];

type StatusExtra = { common?: boolean; usage: string; related: number[] };

const EXTRA: Record<number, StatusExtra> = {
  100: {
    usage:
      'Sent before a large upload so the client knows it can send the body; rarely seen outside HTTP client libraries.',
    related: [417, 413],
  },
  101: {
    common: true,
    usage:
      'Returned when a connection upgrades, most often from HTTP/1.1 to WebSocket.',
    related: [426],
  },
  102: {
    usage:
      'Old WebDAV keep-alive for slow requests; deprecated and rarely sent today.',
    related: [202, 103],
  },
  103: {
    usage:
      'Sent before the final response so browsers can preload CSS and fonts; supported by some CDNs.',
    related: [200, 100],
  },
  200: {
    common: true,
    usage:
      'The default for a successful GET, or a POST/PUT that returns a body.',
    related: [201, 204, 304],
  },
  201: {
    common: true,
    usage:
      'Return after a POST creates a resource, with a Location header pointing to it.',
    related: [200, 202, 303],
  },
  202: {
    common: true,
    usage:
      'Return when work is queued (jobs, webhooks, batch imports) and include a way to check its status.',
    related: [201, 200, 303],
  },
  203: {
    usage:
      'Rarely used; a transforming proxy may send it instead of 200 when it changed the payload.',
    related: [200],
  },
  204: {
    common: true,
    usage:
      'Return for a successful DELETE, PUT or save that has nothing to send back; the body must be empty.',
    related: [200, 205, 304],
  },
  205: {
    usage:
      'Rarely used; tells the client to clear the form or view after a successful submit.',
    related: [204, 200],
  },
  206: {
    common: true,
    usage:
      'Sent when serving a byte range for video seeking, audio streaming or resumable downloads.',
    related: [416, 200],
  },
  207: {
    usage:
      'WebDAV responses that report a separate status for each of several resources.',
    related: [208, 424],
  },
  208: {
    usage:
      'WebDAV bindings: skips members already listed earlier in the same 207 response.',
    related: [207, 508],
  },
  226: {
    usage: 'Delta encoding (A-IM header); almost never seen in practice.',
    related: [200],
  },
  300: {
    usage:
      'Rarely used; would list alternative representations (e.g. languages) for the client to pick from.',
    related: [301, 302, 406],
  },
  301: {
    common: true,
    usage:
      'Use for permanent URL changes: domain moves, HTTPS migrations, renamed slugs.',
    related: [302, 308, 307],
  },
  302: {
    common: true,
    usage:
      'Use for short-term redirects such as login flows or A/B tests; the original URL stays canonical.',
    related: [301, 307, 303],
  },
  303: {
    common: true,
    usage:
      'Use after a form POST to send the browser to a result page with GET (Post/Redirect/Get).',
    related: [302, 307, 201],
  },
  304: {
    common: true,
    usage:
      'Returned for conditional GETs when the ETag or Last-Modified still matches the cached copy.',
    related: [200, 412],
  },
  305: {
    usage: 'Deprecated for security reasons; do not use. Browsers ignore it.',
    related: [407, 307],
  },
  307: {
    common: true,
    usage:
      'Use for temporary redirects of POST/PUT requests where the method and body must be kept.',
    related: [302, 308, 303],
  },
  308: {
    common: true,
    usage:
      'Use for permanent redirects where the method must be kept, e.g. moved API endpoints.',
    related: [301, 307],
  },
  400: {
    common: true,
    usage:
      'Return for malformed requests: invalid JSON, missing required parameters, bad query syntax.',
    related: [422, 415, 431],
  },
  401: {
    common: true,
    usage:
      'Return when credentials are missing, expired or invalid, with a WWW-Authenticate header.',
    related: [403, 407, 511],
  },
  402: {
    usage:
      'Non-standard in practice; some APIs and SaaS products use it for unpaid plans or exhausted credits.',
    related: [403, 429],
  },
  403: {
    common: true,
    usage:
      'Return when the user is authenticated but lacks permission, or a WAF blocks the request.',
    related: [401, 404, 451],
  },
  404: {
    common: true,
    usage:
      'Return for URLs with no resource; also used to hide private resources instead of a 403.',
    related: [410, 403, 405],
  },
  405: {
    common: true,
    usage:
      'Return when the route exists but not for this method; list allowed methods in the Allow header.',
    related: [404, 501],
  },
  406: {
    usage:
      'Return when content negotiation fails, e.g. the client only accepts XML and the API only serves JSON.',
    related: [415, 300],
  },
  407: {
    usage:
      'Sent by a proxy that requires credentials, with a Proxy-Authenticate header.',
    related: [401, 511],
  },
  408: {
    common: true,
    usage:
      'Sent when the client opens a connection but sends the request too slowly; servers then close it.',
    related: [504, 400],
  },
  409: {
    common: true,
    usage:
      'Return for duplicate records, version conflicts or edits clashing with the current state.',
    related: [412, 422, 423],
  },
  410: {
    common: true,
    usage:
      'Use for content removed on purpose and never coming back, such as expired listings.',
    related: [404, 301],
  },
  411: {
    usage:
      'Return when the server refuses a body sent without a Content-Length header.',
    related: [413, 400],
  },
  412: {
    usage:
      'Return when If-Match or If-Unmodified-Since fails, to stop a lost update.',
    related: [428, 409, 304],
  },
  413: {
    common: true,
    usage:
      'Return when an upload or request body exceeds the size limit (formerly “Payload Too Large”).',
    related: [414, 431, 411],
  },
  414: {
    usage:
      'Return when the URL is too long, often from huge query strings or redirect loops.',
    related: [413, 431, 400],
  },
  415: {
    common: true,
    usage:
      'Return when the Content-Type or Content-Encoding of the body is not accepted.',
    related: [406, 400, 422],
  },
  416: {
    usage:
      'Return when a Range header asks for bytes beyond the end of the file.',
    related: [206],
  },
  417: {
    usage:
      'Return when the server cannot meet the Expect header, usually “Expect: 100-continue”.',
    related: [100],
  },
  418: {
    usage:
      'A joke code; some sites send it to refuse bots or scrapers. Not part of HTTP proper.',
    related: [403, 429],
  },
  421: {
    usage:
      'Sent when a reused HTTP/2 connection reaches a server not configured for the requested host.',
    related: [400, 502],
  },
  422: {
    common: true,
    usage:
      'Return for validation errors on well-formed requests (formerly “Unprocessable Entity”).',
    related: [400, 409, 415],
  },
  423: {
    usage: 'WebDAV: return when the resource is locked by another client.',
    related: [409, 424],
  },
  424: {
    usage:
      'WebDAV: return when an action failed because an earlier action it depended on failed.',
    related: [207, 423],
  },
  425: {
    usage:
      'Sent to reject TLS 1.3 early-data (0-RTT) requests that are unsafe to replay.',
    related: [400, 429],
  },
  426: {
    usage:
      'Return when the client must switch protocol, e.g. to TLS or a newer HTTP version, via Upgrade.',
    related: [101, 505],
  },
  428: {
    usage:
      'Return when an API demands If-Match on updates to prevent lost updates.',
    related: [412, 409],
  },
  429: {
    common: true,
    usage:
      'Return when a client exceeds a rate limit, with a Retry-After header saying when to retry.',
    related: [503, 403],
  },
  431: {
    usage:
      'Return when request headers are too large, often from oversized or accumulated cookies.',
    related: [400, 413, 414],
  },
  451: {
    usage:
      'Return when content is blocked by law, such as a court order or regional restriction.',
    related: [403, 404],
  },
  500: {
    common: true,
    usage:
      'The catch-all for unhandled exceptions and server bugs; log the cause and never leak stack traces.',
    related: [502, 503, 501],
  },
  501: {
    common: true,
    usage:
      'Return when the server does not support the request method or a feature at all.',
    related: [405, 500],
  },
  502: {
    common: true,
    usage:
      'Sent by a proxy, CDN or load balancer when the upstream app crashed or sent a bad response.',
    related: [503, 504, 500],
  },
  503: {
    common: true,
    usage:
      'Return during maintenance or overload, ideally with Retry-After so clients and crawlers come back.',
    related: [429, 502, 504],
  },
  504: {
    common: true,
    usage:
      'Sent by a proxy or CDN when the upstream server took too long to respond.',
    related: [502, 503, 408],
  },
  505: {
    usage:
      'Return when the server refuses the HTTP major version in the request.',
    related: [426, 400],
  },
  506: {
    usage:
      'Indicates a server misconfiguration in transparent content negotiation; very rare.',
    related: [500, 300],
  },
  507: {
    usage:
      'WebDAV: return when the server has no space to store the representation.',
    related: [413, 500],
  },
  508: {
    usage:
      'WebDAV: return when the server finds an infinite loop while processing a Depth: infinity request.',
    related: [208, 500],
  },
  510: {
    usage:
      'Historic HTTP Extension Framework code; obsolete and essentially unused.',
    related: [501],
  },
  511: {
    usage:
      'Sent by captive portals (hotel, airport Wi-Fi) that need you to log in before browsing.',
    related: [401, 407],
  },
};

/**
 * Data-integrity problems: statuses without an EXTRA entry, and related
 * codes that are not in the list. Should always be empty (checked in tests).
 */
export const HTTP_STATUS_ISSUES: string[] = (() => {
  const codes = new Set(BASE.map((st) => st.code));
  const issues: string[] = [];
  for (const st of BASE) {
    const ex = EXTRA[st.code];
    if (!ex) {
      issues.push(`${st.code}: missing usage/related`);
      continue;
    }
    for (const r of ex.related)
      if (!codes.has(r) || r === st.code)
        issues.push(`${st.code}: bad related code ${r}`);
  }
  for (const c of Object.keys(EXTRA))
    if (!codes.has(Number(c)))
      issues.push(`${c}: EXTRA entry for unknown code`);
  return issues;
})();

export const HTTP_STATUSES: HttpStatus[] = BASE.map((st) => ({
  ...st,
  common: EXTRA[st.code]?.common ?? false,
  usage: EXTRA[st.code]?.usage ?? '',
  related: EXTRA[st.code]?.related ?? [],
}));

export const STATUS_CLASSES: Record<number, string> = {
  1: '1xx Informational',
  2: '2xx Success',
  3: '3xx Redirection',
  4: '4xx Client error',
  5: '5xx Server error',
};

export function searchStatuses(
  query: string,
  cls = 0,
  commonOnly = false,
): HttpStatus[] {
  const q = query.trim().toLowerCase();
  return HTTP_STATUSES.filter(
    (st) =>
      (!cls || Math.floor(st.code / 100) === cls) &&
      (!commonOnly || st.common) &&
      (!q ||
        String(st.code).startsWith(q) ||
        st.name.toLowerCase().includes(q) ||
        STATUS_CLASSES[Math.floor(st.code / 100)].toLowerCase().includes(q) ||
        st.meaning.toLowerCase().includes(q) ||
        st.usage.toLowerCase().includes(q)),
  );
}
