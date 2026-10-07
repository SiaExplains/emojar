// HTTP status codes (IANA registry; RFC 9110 unless noted), with a plain
// explanation and what each one means for SEO and caching.

export type HttpStatus = {
  code: number;
  name: string;
  meaning: string;
  seo?: string;
  ref: string;
};

const s = (
  code: number,
  name: string,
  meaning: string,
  ref = 'RFC 9110',
  seo?: string,
): HttpStatus => ({ code, name, meaning, ref, seo });

export const HTTP_STATUSES: HttpStatus[] = [
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

export const STATUS_CLASSES: Record<number, string> = {
  1: '1xx Informational',
  2: '2xx Success',
  3: '3xx Redirection',
  4: '4xx Client error',
  5: '5xx Server error',
};

export function searchStatuses(query: string, cls = 0): HttpStatus[] {
  const q = query.trim().toLowerCase();
  return HTTP_STATUSES.filter(
    (st) =>
      (!cls || Math.floor(st.code / 100) === cls) &&
      (!q ||
        String(st.code).startsWith(q) ||
        st.name.toLowerCase().includes(q) ||
        STATUS_CLASSES[Math.floor(st.code / 100)].toLowerCase().includes(q) ||
        st.meaning.toLowerCase().includes(q)),
  );
}
