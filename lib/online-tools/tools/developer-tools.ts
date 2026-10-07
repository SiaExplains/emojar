import type { ToolDefinition } from '../types';

export const DEVELOPER_TOOLS: ToolDefinition[] = [
  {
    slug: 'json-formatter',
    category: 'developer-tools',
    name: 'JSON Formatter',
    icon: '🧾',
    shortDescription: 'Format and beautify JSON online.',
    description:
      'Format, beautify and validate JSON in one click. Paste minified or messy JSON and get clean, indented output with clear error messages. Your JSON is processed directly in your browser.',
    title: 'JSON Formatter – Format JSON Online',
    metaDescription:
      'Format, beautify and validate JSON online. Your JSON is processed directly in your browser.',
    keywords: [
      'json formatter',
      'json beautifier',
      'format json',
      'pretty print json',
      'json viewer',
    ],
    relatedTools: [
      'json-validator',
      'json-minifier',
      'json-to-yaml',
      'json-to-csv',
      'jwt-decoder',
      'base64-encoder',
    ],
    component: 'text-transform',
    config: { transform: 'json-format' },
    popular: true,
    howTo: [
      'Paste your JSON into the input box (or click “Load sample”).',
      'Choose the indentation and whether to sort keys alphabetically.',
      'Click “Format JSON”, then copy or download the result.',
    ],
    about: [
      'A JSON formatter (or beautifier) adds consistent indentation and line breaks to JSON so humans can read it. The data itself is unchanged. If the input is not valid JSON, the formatter shows the error and the line and column where parsing failed.',
      'API responses, config files and logs often contain sensitive data. This formatter uses the browser’s native JSON parser, so nothing is sent to a server.',
    ],
    faqs: [
      {
        q: 'Why does my JSON fail to format?',
        a: 'Common causes are trailing commas, single quotes instead of double quotes, unquoted keys and comments — none of which are allowed in standard JSON.',
      },
      {
        q: 'Does sorting keys change my data?',
        a: 'No. JSON objects are unordered, so sorting keys only changes how the data is displayed. Array order is never changed.',
      },
    ],
  },
  {
    slug: 'json-validator',
    category: 'developer-tools',
    name: 'JSON Validator',
    icon: '✅',
    shortDescription: 'Check if JSON is valid and find syntax errors.',
    description:
      'Validate JSON as you type. The validator tells you instantly whether your JSON is valid and, if not, what is wrong and on which line and column.',
    title: 'JSON Validator – Check JSON Syntax Online',
    metaDescription:
      'Validate JSON online and find syntax errors with line and column numbers. Instant, free and private — runs in your browser.',
    keywords: [
      'json validator',
      'validate json',
      'json lint',
      'json checker',
      'json syntax',
    ],
    relatedTools: [
      'json-formatter',
      'json-minifier',
      'yaml-to-json',
      'xml-formatter',
    ],
    component: 'text-transform',
    config: { transform: 'json-validate' },
    popular: true,
    howTo: [
      'Paste JSON into the box.',
      'The result updates as you type: a green check for valid JSON, or the error with its position.',
      'Fix the error and watch the status turn green.',
    ],
    about: [
      'JSON validation checks that text follows the JSON grammar defined in RFC 8259: double-quoted strings and keys, no trailing commas, no comments, and only the values true, false, null, numbers, strings, arrays and objects.',
    ],
    faqs: [
      {
        q: 'Does the validator check against a JSON Schema?',
        a: 'No. It checks syntax only — whether the text is valid JSON — not whether the data matches a particular schema.',
      },
    ],
  },
  {
    slug: 'json-minifier',
    category: 'developer-tools',
    name: 'JSON Minifier',
    icon: '📦',
    shortDescription: 'Remove whitespace to make JSON compact.',
    description:
      'Minify JSON by removing all unnecessary whitespace and line breaks. The output is the smallest valid JSON representation of your data, ready to embed or send.',
    title: 'JSON Minifier – Compress & Minify JSON Online',
    metaDescription:
      'Minify JSON online. Remove whitespace and line breaks to make JSON as small as possible. Free, instant and processed in your browser.',
    keywords: ['json minifier', 'minify json', 'compress json', 'json compact'],
    relatedTools: [
      'json-formatter',
      'json-validator',
      'javascript-minifier',
      'base64-encoder',
    ],
    component: 'text-transform',
    config: { transform: 'json-minify' },
    popular: true,
    howTo: [
      'Paste formatted JSON.',
      'The minified version appears instantly.',
      'Copy it or download it as a .json file.',
    ],
    about: [
      'Minifying JSON removes spaces, tabs and new lines between tokens. It does not change keys or values, and the result parses to exactly the same data.',
    ],
    faqs: [
      {
        q: 'How much smaller does minified JSON get?',
        a: 'Typically 10–30% for pretty-printed JSON, depending on indentation and nesting depth.',
      },
    ],
  },
  {
    slug: 'json-to-yaml',
    category: 'developer-tools',
    name: 'JSON to YAML',
    icon: '🔁',
    shortDescription: 'Convert JSON to YAML.',
    description:
      'Convert JSON into clean, readable YAML for configuration files, Kubernetes manifests, CI pipelines and more. Conversion happens in your browser.',
    title: 'JSON to YAML Converter – Convert JSON to YAML Online',
    metaDescription:
      'Convert JSON to YAML online instantly. Clean output for Kubernetes, Docker Compose and CI configs. Free and private.',
    keywords: ['json to yaml', 'convert json to yaml', 'json yaml converter'],
    relatedTools: [
      'yaml-to-json',
      'json-formatter',
      'json-to-csv',
      'xml-formatter',
    ],
    component: 'text-transform',
    config: { transform: 'json-to-yaml' },
    howTo: [
      'Paste JSON into the input.',
      'The YAML output appears as you type.',
      'Copy it or download a .yaml file.',
    ],
    about: [
      'YAML is a superset of JSON that uses indentation instead of braces, making it popular for configuration. Every JSON document can be represented as YAML.',
    ],
    faqs: [
      {
        q: 'Are strings quoted in the output?',
        a: 'Only when needed — for example strings that look like numbers, booleans or contain special characters keep their quotes so the YAML parses back to the same values.',
      },
    ],
  },
  {
    slug: 'yaml-to-json',
    category: 'developer-tools',
    name: 'YAML to JSON',
    icon: '🔁',
    shortDescription: 'Convert YAML to JSON.',
    description:
      'Convert YAML into JSON and validate it at the same time. Errors are reported with a clear message. Your YAML never leaves your browser.',
    title: 'YAML to JSON Converter – Convert YAML Online',
    metaDescription:
      'Convert YAML to JSON online with validation and clear error messages. Fast, free and processed in your browser.',
    keywords: [
      'yaml to json',
      'convert yaml to json',
      'yaml parser',
      'yaml validator',
    ],
    relatedTools: [
      'json-to-yaml',
      'json-formatter',
      'json-validator',
      'csv-to-json',
    ],
    component: 'text-transform',
    config: { transform: 'yaml-to-json' },
    howTo: [
      'Paste YAML into the input.',
      'The JSON output appears as you type.',
      'Copy or download the JSON.',
    ],
    about: [
      'YAML features like anchors, aliases and multi-line strings are resolved into plain JSON values.',
    ],
    faqs: [
      {
        q: 'Does it support multiple YAML documents?',
        a: 'Only the first document (before the first ---) is converted.',
      },
    ],
  },
  {
    slug: 'json-to-csv',
    category: 'developer-tools',
    name: 'JSON to CSV',
    icon: '📊',
    shortDescription: 'Convert a JSON array to a CSV table.',
    description:
      'Convert an array of JSON objects into CSV you can open in Excel, Google Sheets or Numbers. Nested objects are flattened into dot-notation columns.',
    title: 'JSON to CSV Converter – Convert JSON to Excel-Ready CSV',
    metaDescription:
      'Convert JSON to CSV online. Nested objects are flattened to columns; choose comma, semicolon or tab. Free and private.',
    keywords: [
      'json to csv',
      'convert json to csv',
      'json to excel',
      'json to spreadsheet',
    ],
    relatedTools: ['csv-to-json', 'json-formatter', 'json-to-yaml'],
    component: 'text-transform',
    config: { transform: 'json-to-csv' },
    howTo: [
      'Paste a JSON array of objects.',
      'Choose the delimiter (use semicolon for Excel in many European locales).',
      'Copy the CSV or download it as a .csv file.',
    ],
    about: [
      'Each object becomes a row and each key becomes a column. Nested objects become columns like address.city; arrays are kept as JSON text in a single cell.',
    ],
    faqs: [
      {
        q: 'What if objects have different keys?',
        a: 'All keys from all objects become columns; missing values are left empty.',
      },
    ],
  },
  {
    slug: 'csv-to-json',
    category: 'developer-tools',
    name: 'CSV to JSON',
    icon: '📊',
    shortDescription: 'Convert CSV data to JSON.',
    description:
      'Convert CSV to JSON with header detection, automatic number and boolean detection, and support for quoted fields. Works with comma, semicolon, tab and pipe delimiters.',
    title: 'CSV to JSON Converter – Convert CSV Online',
    metaDescription:
      'Convert CSV to JSON online with header and type detection. Supports quoted fields and custom delimiters. Runs in your browser.',
    keywords: [
      'csv to json',
      'convert csv to json',
      'csv parser',
      'excel to json',
    ],
    relatedTools: ['json-to-csv', 'json-formatter', 'yaml-to-json'],
    component: 'text-transform',
    config: { transform: 'csv-to-json' },
    howTo: [
      'Paste CSV text.',
      'Choose the delimiter and whether the first row contains column names.',
      'Copy or download the JSON.',
    ],
    about: [
      'The parser follows RFC 4180: fields containing delimiters, quotes or line breaks must be wrapped in double quotes, and quotes inside are doubled ("").',
    ],
    faqs: [
      {
        q: 'Can I keep numbers as strings?',
        a: 'Yes — turn off “Detect numbers & booleans”, useful for IDs with leading zeros or postcodes.',
      },
    ],
  },
  {
    slug: 'xml-formatter',
    category: 'developer-tools',
    name: 'XML Formatter',
    icon: '🏷️',
    shortDescription: 'Beautify or minify XML.',
    description:
      'Format XML with clean indentation, or minify it to a single line. Mismatched and unclosed tags are reported clearly.',
    title: 'XML Formatter – Beautify & Minify XML Online',
    metaDescription:
      'Format and beautify XML online, or minify it. Detects unclosed and mismatched tags. Free, fast and processed in your browser.',
    keywords: [
      'xml formatter',
      'xml beautifier',
      'format xml',
      'xml minify',
      'pretty print xml',
    ],
    relatedTools: ['html-formatter', 'json-formatter', 'css-formatter'],
    component: 'text-transform',
    config: { transform: 'xml-format' },
    howTo: [
      'Paste XML.',
      'Choose beautify (2 or 4 spaces) or minify.',
      'Click “Format XML”, then copy or download.',
    ],
    about: [
      'Elements that only contain text stay on one line for readability; comments, CDATA sections and processing instructions are preserved.',
    ],
    faqs: [
      {
        q: 'Does it validate against a schema (XSD)?',
        a: 'No — it checks that tags are properly nested and closed, not that the document matches an XSD.',
      },
    ],
  },
  {
    slug: 'html-formatter',
    category: 'developer-tools',
    name: 'HTML Formatter',
    icon: '🌐',
    shortDescription: 'Beautify HTML code.',
    description:
      'Format messy or minified HTML into clean, consistently indented markup using Prettier — including embedded CSS and JavaScript.',
    title: 'HTML Formatter – Beautify HTML Code Online',
    metaDescription:
      'Format and beautify HTML online with Prettier. Indents nested tags, inline CSS and scripts. Free and runs in your browser.',
    keywords: [
      'html formatter',
      'html beautifier',
      'format html',
      'pretty html',
    ],
    relatedTools: [
      'css-formatter',
      'javascript-formatter',
      'html-to-markdown',
      'xml-formatter',
    ],
    component: 'text-transform',
    config: { transform: 'html-format' },
    howTo: [
      'Paste your HTML.',
      'Choose indentation.',
      'Click “Format HTML” and copy the result.',
    ],
    about: [
      'The formatter uses Prettier, the most widely used code formatter, loaded on demand in your browser.',
    ],
    faqs: [
      {
        q: 'Will formatting change how my page looks?',
        a: 'Prettier is careful with whitespace-sensitive inline elements, so rendering should not change.',
      },
    ],
  },
  {
    slug: 'css-formatter',
    category: 'developer-tools',
    name: 'CSS Formatter',
    icon: '🎨',
    shortDescription: 'Beautify CSS, SCSS-style code.',
    description:
      'Turn minified or messy CSS into readable, consistently formatted stylesheets with one rule per line.',
    title: 'CSS Formatter – Beautify CSS Online',
    metaDescription:
      'Format and beautify CSS online with Prettier. Make minified stylesheets readable instantly — free and processed in your browser.',
    keywords: ['css formatter', 'css beautifier', 'format css', 'unminify css'],
    relatedTools: [
      'html-formatter',
      'javascript-formatter',
      'gradient-generator',
      'color-converter',
    ],
    component: 'text-transform',
    config: { transform: 'css-format' },
    howTo: [
      'Paste CSS.',
      'Choose indentation.',
      'Click “Format CSS” and copy the result.',
    ],
    about: [
      'Formatting puts each declaration on its own line, normalises spacing and indents media queries and nested rules.',
    ],
    faqs: [
      {
        q: 'Can it minify CSS too?',
        a: 'This tool beautifies. Minification is best done by your build tool, which can also remove unused rules.',
      },
    ],
  },
  {
    slug: 'javascript-formatter',
    category: 'developer-tools',
    name: 'JavaScript Formatter',
    icon: '🟨',
    shortDescription: 'Beautify JavaScript code.',
    description:
      'Format JavaScript with Prettier — consistent indentation, semicolons and quotes. Syntax errors are reported instead of producing broken output.',
    title: 'JavaScript Formatter – Beautify JS Code Online',
    metaDescription:
      'Format and beautify JavaScript online with Prettier. Choose indentation and quote style. Free and private — runs in your browser.',
    keywords: [
      'javascript formatter',
      'js beautifier',
      'format javascript',
      'prettier online',
    ],
    relatedTools: [
      'javascript-minifier',
      'json-formatter',
      'html-formatter',
      'css-formatter',
    ],
    component: 'text-transform',
    config: { transform: 'js-format' },
    howTo: [
      'Paste JavaScript.',
      'Choose indentation and quote style.',
      'Click “Format JavaScript” and copy the result.',
    ],
    about: [
      'Prettier parses your code into a syntax tree and prints it again from scratch, so the formatting is consistent regardless of the input style. Modern syntax and JSX are supported.',
    ],
    faqs: [
      {
        q: 'Does it support TypeScript?',
        a: 'Plain JavaScript and JSX are supported. TypeScript-only syntax such as type annotations will be reported as a syntax error.',
      },
    ],
  },
  {
    slug: 'javascript-minifier',
    category: 'developer-tools',
    name: 'JavaScript Minifier',
    icon: '📦',
    shortDescription: 'Minify JavaScript to reduce file size.',
    description:
      'Minify JavaScript with Terser: remove whitespace and comments, shorten variable names and simplify code — without changing what it does.',
    title: 'JavaScript Minifier – Minify JS Online with Terser',
    metaDescription:
      'Minify JavaScript online with Terser. Remove comments and whitespace and shorten names to reduce file size. Runs in your browser.',
    keywords: [
      'javascript minifier',
      'minify js',
      'js compressor',
      'terser online',
      'uglify js',
    ],
    relatedTools: ['javascript-formatter', 'json-minifier', 'css-formatter'],
    component: 'text-transform',
    config: { transform: 'js-minify' },
    howTo: [
      'Paste JavaScript.',
      'Choose whether to shorten variable names.',
      'Click “Minify JavaScript” and copy the output.',
    ],
    about: [
      'Terser is the minifier used by most JavaScript build tools. Minification typically reduces file size by 30–60% before gzip.',
    ],
    faqs: [
      {
        q: 'Is minified code safe to deploy?',
        a: 'Yes — minification preserves behaviour. Keep the original source for editing and debugging.',
      },
    ],
  },
  {
    slug: 'base64-encoder',
    category: 'developer-tools',
    name: 'Base64 Encoder',
    icon: '🔐',
    shortDescription: 'Encode text to Base64.',
    description:
      'Encode text to Base64 with full UTF-8 support (emoji and accents included), with an optional URL-safe Base64URL variant.',
    title: 'Base64 Encode – Encode Text to Base64 Online',
    metaDescription:
      'Encode text to Base64 online with UTF-8 and URL-safe (Base64URL) support. Instant and private — runs in your browser.',
    keywords: [
      'base64 encode',
      'base64 encoder',
      'text to base64',
      'base64url',
    ],
    relatedTools: [
      'base64-decoder',
      'url-encoder',
      'image-to-base64',
      'jwt-decoder',
      'hash-generator',
    ],
    component: 'text-transform',
    config: { transform: 'base64-encode' },
    howTo: [
      'Type or paste text.',
      'Optionally enable URL-safe mode.',
      'Copy the Base64 output.',
    ],
    about: [
      'Base64 represents binary data using 64 printable characters. It is an encoding, not encryption — anyone can decode it.',
    ],
    faqs: [
      {
        q: 'What is Base64URL?',
        a: 'A variant that replaces + and / with - and _ and drops = padding so the result can be used in URLs and JWTs.',
      },
    ],
  },
  {
    slug: 'base64-decoder',
    category: 'developer-tools',
    name: 'Base64 Decoder',
    icon: '🔓',
    shortDescription: 'Decode Base64 to text.',
    description:
      'Decode Base64 or Base64URL back into readable UTF-8 text. Invalid input and binary data are detected and explained.',
    title: 'Base64 Decode – Decode Base64 to Text Online',
    metaDescription:
      'Decode Base64 and Base64URL to text online with UTF-8 support. Clear errors for invalid input. Free and private.',
    keywords: ['base64 decode', 'base64 decoder', 'base64 to text'],
    relatedTools: [
      'base64-encoder',
      'base64-to-image',
      'url-decoder',
      'jwt-decoder',
    ],
    component: 'text-transform',
    config: { transform: 'base64-decode' },
    howTo: [
      'Paste Base64 text.',
      'The decoded text appears instantly.',
      'Copy the result.',
    ],
    about: [
      'Both standard Base64 and URL-safe Base64URL are accepted, with or without padding, and whitespace is ignored.',
    ],
    faqs: [
      {
        q: 'Why do I get an error about UTF-8?',
        a: 'The data is binary (for example an image or a ZIP file), not text. Use Base64 to Image for images.',
      },
    ],
  },
  {
    slug: 'url-encoder',
    category: 'developer-tools',
    name: 'URL Encoder',
    icon: '🔗',
    shortDescription: 'Percent-encode text for URLs.',
    description:
      'Percent-encode text so it can be safely used in URLs and query strings. Choose between encoding everything or keeping the URL structure intact.',
    title: 'URL Encode – Percent-Encode Text Online',
    metaDescription:
      'URL-encode text and query parameters online (percent-encoding). encodeURIComponent and encodeURI modes. Free and instant.',
    keywords: [
      'url encode',
      'url encoder',
      'percent encoding',
      'encodeuricomponent',
    ],
    relatedTools: ['url-decoder', 'base64-encoder', 'html-formatter'],
    component: 'text-transform',
    config: { transform: 'url-encode' },
    howTo: [
      'Type or paste text.',
      'Choose a mode: encode everything (for parameter values) or keep URL structure (for whole URLs).',
      'Copy the encoded output.',
    ],
    about: [
      'Percent-encoding replaces unsafe characters with % followed by two hex digits — a space becomes %20 and “é” becomes %C3%A9.',
    ],
    faqs: [
      {
        q: 'Which mode should I use?',
        a: 'Use “encode everything” for a single query value; use “keep URL structure” for a complete URL whose : / ? & characters must stay.',
      },
    ],
  },
  {
    slug: 'url-decoder',
    category: 'developer-tools',
    name: 'URL Decoder',
    icon: '🔗',
    shortDescription: 'Decode percent-encoded URLs.',
    description:
      'Decode percent-encoded URLs and query strings back to readable text, with an option to treat + as a space as in HTML form data.',
    title: 'URL Decode – Decode Percent-Encoded URLs Online',
    metaDescription:
      'URL-decode percent-encoded strings and query parameters online. Handles UTF-8 and + as space. Free and private.',
    keywords: ['url decode', 'url decoder', 'decode url', 'percent decode'],
    relatedTools: ['url-encoder', 'base64-decoder', 'jwt-decoder'],
    component: 'text-transform',
    config: { transform: 'url-decode' },
    howTo: [
      'Paste an encoded URL or string.',
      'The decoded text appears instantly.',
      'Copy the result.',
    ],
    about: [
      'Decoding reverses percent-encoding, turning sequences like %20 back into spaces and multi-byte sequences into Unicode characters.',
    ],
    faqs: [
      {
        q: 'Why does decoding fail?',
        a: 'The input contains a % that is not followed by two hexadecimal digits, or an incomplete UTF-8 sequence.',
      },
    ],
  },
  {
    slug: 'jwt-decoder',
    category: 'developer-tools',
    name: 'JWT Decoder',
    icon: '🎫',
    shortDescription: 'Decode JWT tokens directly in your browser.',
    description:
      'Decode a JSON Web Token to see its header, payload and claims, with human-readable issued-at and expiry times. The token is decoded in your browser and never sent anywhere.',
    title: 'JWT Decoder – Decode JSON Web Tokens Online, Privately',
    metaDescription:
      'Decode JWT tokens online: header, payload, claims and expiry. Tokens are decoded in your browser and never sent to a server.',
    keywords: [
      'jwt decoder',
      'decode jwt',
      'jwt parser',
      'json web token',
      'jwt debugger',
    ],
    relatedTools: [
      'base64-decoder',
      'json-formatter',
      'unix-timestamp-converter',
      'hash-generator',
    ],
    component: 'jwt-decoder',
    popular: true,
    howTo: [
      'Paste a JWT (the “Bearer ” prefix is removed automatically).',
      'Read the decoded header and payload.',
      'Check the expiry status and timestamps.',
    ],
    about: [
      'A JWT has three Base64URL-encoded parts separated by dots: a header (algorithm and type), a payload (claims such as sub, exp and iat) and a signature. Decoding reveals the header and payload; it does not prove the token is genuine.',
      'Pasting production tokens into online tools that send them to a server is a security risk. This decoder works entirely offline in your browser.',
    ],
    faqs: [
      {
        q: 'Does this verify the signature?',
        a: 'No. Verifying a signature requires the secret or public key. Never trust a decoded payload without verifying it on your server.',
      },
      {
        q: 'Are JWTs encrypted?',
        a: 'Standard signed JWTs (JWS) are only encoded, so anyone can read the payload. Do not put secrets in them.',
      },
    ],
  },
  {
    slug: 'uuid-generator',
    category: 'developer-tools',
    alsoIn: ['security-generators'],
    name: 'UUID Generator',
    icon: '🆔',
    shortDescription: 'Generate random UUID v4 and time-ordered v7.',
    description:
      'Generate one or thousands of UUIDs (v4 random or v7 time-ordered) using your browser’s cryptographically secure random generator. Copy them or download as a text file.',
    title: 'UUID Generator – Generate UUID v4 & v7 Online',
    metaDescription:
      'Generate UUID v4 and v7 online in bulk. Cryptographically secure, uppercase or lowercase, with or without hyphens. Free and instant.',
    keywords: [
      'uuid generator',
      'guid generator',
      'uuid v4',
      'uuid v7',
      'random uuid',
    ],
    relatedTools: [
      'random-string-generator',
      'password-generator',
      'hash-generator',
      'random-number-generator',
    ],
    component: 'uuid-generator',
    howTo: [
      'Choose the UUID version and how many you need.',
      'Pick formatting options (uppercase, hyphens, braces).',
      'Click Generate, then copy or download.',
    ],
    about: [
      'A UUID (universally unique identifier, also called GUID) is a 128-bit identifier. Version 4 is fully random; version 7 starts with a timestamp, so new IDs sort in creation order — which keeps database indexes efficient.',
    ],
    faqs: [
      {
        q: 'Can two UUIDs collide?',
        a: 'In practice, no. A v4 UUID has 122 random bits; generating a billion per second for 85 years gives roughly a 50% chance of a single collision.',
      },
      {
        q: 'Should I use v4 or v7?',
        a: 'Use v7 for database primary keys (sortable and index-friendly); use v4 when the ID must not reveal when it was created.',
      },
    ],
  },
  {
    slug: 'hash-generator',
    category: 'developer-tools',
    alsoIn: ['security-generators'],
    name: 'Hash Generator',
    icon: '#️⃣',
    shortDescription: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.',
    description:
      'Calculate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or files, plus HMAC signatures. Hashing is done locally with the Web Crypto API.',
    title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online',
    metaDescription:
      'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes of text or files online. Supports HMAC. Private — computed in your browser.',
    keywords: [
      'hash generator',
      'md5 hash',
      'sha256 hash',
      'sha1',
      'checksum',
      'file hash',
    ],
    relatedTools: [
      'sha256-generator',
      'sha512-generator',
      'base64-encoder',
      'uuid-generator',
      'password-generator',
    ],
    component: 'hash-generator',
    config: { algorithm: 'all' },
    howTo: [
      'Type text or choose a file.',
      'All hashes are calculated instantly.',
      'Copy the one you need. Add a secret key to compute an HMAC instead.',
    ],
    about: [
      'A cryptographic hash function turns any input into a fixed-length fingerprint. The same input always gives the same hash, and the smallest change produces a completely different one — which makes hashes ideal for checking file integrity.',
    ],
    faqs: [
      {
        q: 'Is MD5 still safe?',
        a: 'Not for security. MD5 and SHA-1 have known collision attacks. They are fine for non-security checksums; use SHA-256 or better otherwise.',
      },
      {
        q: 'Should I hash passwords with SHA-256?',
        a: 'No. Passwords need slow, salted algorithms like Argon2, bcrypt or scrypt.',
      },
    ],
  },
  {
    slug: 'regex-tester',
    category: 'developer-tools',
    name: 'Regex Tester',
    icon: '🧪',
    shortDescription: 'Test regular expressions with live highlighting.',
    description:
      'Test JavaScript regular expressions against your text with live match highlighting, capture groups and a replace preview. A safety timeout stops runaway patterns.',
    title: 'Regex Tester – Test JavaScript Regular Expressions Online',
    metaDescription:
      'Test regular expressions online with live highlighting, capture groups, flags and replace preview. JavaScript regex, runs in your browser.',
    keywords: [
      'regex tester',
      'regular expression tester',
      'regex online',
      'javascript regex',
      'regex debugger',
    ],
    relatedTools: [
      'find-and-replace',
      'text-diff',
      'json-validator',
      'cron-expression-generator',
    ],
    component: 'regex-tester',
    howTo: [
      'Enter a pattern and choose flags (g, i, m, s, u).',
      'Type or paste the test text — matches are highlighted as you type.',
      'Inspect capture groups, or enter a replacement to preview the result.',
    ],
    about: [
      'The tester uses your browser’s JavaScript regex engine, so behaviour matches Node.js and browsers exactly. Matching runs in a background worker with a timeout, so catastrophic backtracking cannot freeze the page.',
    ],
    faqs: [
      {
        q: 'Does it support lookbehind and named groups?',
        a: 'Yes — all modern JavaScript features including (?<name>…), lookbehind (?<=…) and the s (dotAll) and u (Unicode) flags.',
      },
    ],
  },
  {
    slug: 'cron-expression-generator',
    category: 'developer-tools',
    name: 'Cron Expression Generator',
    icon: '⏰',
    shortDescription: 'Build and explain cron schedules.',
    description:
      'Build a cron expression with simple dropdowns or paste one to have it explained in plain English, along with the next run times.',
    title: 'Cron Expression Generator – Build & Explain Cron Schedules',
    metaDescription:
      'Generate and explain cron expressions online. Plain-English descriptions and next run times for standard 5-field cron. Free.',
    keywords: [
      'cron expression generator',
      'crontab generator',
      'cron explained',
      'cron schedule',
      'crontab guru',
    ],
    relatedTools: [
      'unix-timestamp-converter',
      'timezone-converter',
      'regex-tester',
    ],
    component: 'cron-generator',
    howTo: [
      'Pick a preset or set minute, hour, day, month and weekday.',
      'Or paste an existing expression to explain it.',
      'Check the description and next run times, then copy the expression.',
    ],
    about: [
      'Cron is the standard Unix job scheduler. An expression has five fields — minute, hour, day of month, month and day of week — each accepting numbers, ranges (1-5), lists (1,3,5), steps (*/15) and * for “every”.',
      'When both day of month and day of week are restricted, standard cron runs the job when either matches.',
    ],
    faqs: [
      {
        q: 'Does it support seconds or the Quartz format?',
        a: 'No — it uses the standard 5-field format used by crontab, Kubernetes CronJobs, GitHub Actions and most cloud schedulers.',
      },
    ],
  },
  {
    slug: 'markdown-to-html',
    category: 'developer-tools',
    name: 'Markdown to HTML',
    icon: '⬇️',
    shortDescription: 'Convert Markdown to HTML.',
    description:
      'Convert Markdown to clean HTML with GitHub Flavored Markdown support (tables, task lists, strikethrough). Copy or download the generated HTML.',
    title: 'Markdown to HTML Converter – Online, GFM Supported',
    metaDescription:
      'Convert Markdown to HTML online with GitHub Flavored Markdown: tables, task lists and code blocks. Free and private.',
    keywords: [
      'markdown to html',
      'md to html',
      'convert markdown',
      'markdown converter',
    ],
    relatedTools: ['html-to-markdown', 'markdown-previewer', 'html-formatter'],
    component: 'text-transform',
    config: { transform: 'markdown-to-html' },
    howTo: [
      'Write or paste Markdown.',
      'The HTML updates as you type.',
      'Copy or download the HTML.',
    ],
    about: [
      'Conversion uses the marked library, which follows the CommonMark specification and GitHub Flavored Markdown extensions.',
    ],
    faqs: [
      {
        q: 'Is raw HTML in Markdown kept?',
        a: 'Yes, inline HTML is passed through to the output, as Markdown allows.',
      },
    ],
  },
  {
    slug: 'html-to-markdown',
    category: 'developer-tools',
    name: 'HTML to Markdown',
    icon: '⬆️',
    shortDescription: 'Convert HTML to Markdown.',
    description:
      'Convert HTML into clean Markdown — headings, links, lists, emphasis and code blocks are preserved. Useful for moving content into docs, wikis and README files.',
    title: 'HTML to Markdown Converter – Convert HTML Online',
    metaDescription:
      'Convert HTML to Markdown online. Keeps headings, links, lists and code blocks. Free, instant and processed in your browser.',
    keywords: ['html to markdown', 'html to md', 'convert html to markdown'],
    relatedTools: ['markdown-to-html', 'markdown-previewer', 'html-formatter'],
    component: 'text-transform',
    config: { transform: 'html-to-markdown' },
    howTo: [
      'Paste HTML.',
      'The Markdown output appears as you type.',
      'Copy or download the .md file.',
    ],
    about: [
      'The converter (Turndown) walks the HTML structure and writes the equivalent Markdown. Elements without a Markdown equivalent keep only their text.',
    ],
    faqs: [
      {
        q: 'Are tables converted?',
        a: 'Simple tables are converted to text; complex layouts may need manual tidying.',
      },
    ],
  },
];
