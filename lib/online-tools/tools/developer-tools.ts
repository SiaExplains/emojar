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
      'json-diff',
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
        a: 'Only when needed: strings that look like numbers, true/false or null, or that contain special characters, keep their quotes. Words like yes, no, on and off are written unquoted, and older YAML 1.1 parsers may read them as booleans.',
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
      'Aliases (*name) and multi-line strings are resolved into plain JSON values. Merge keys (<<:) are not expanded and appear as a literal "<<" key.',
    ],
    faqs: [
      {
        q: 'Does it support multiple YAML documents?',
        a: 'No. Input with several documents separated by --- is rejected; convert one document at a time.',
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
        a: 'Values with leading zeros (like 02134) already stay strings. Turn off “Detect numbers & booleans” when a column must have one type — otherwise an ID column can mix strings and numbers.',
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
    relatedTools: [
      'json-to-xml',
      'html-formatter',
      'json-formatter',
      'css-formatter',
    ],
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
    relatedTools: [
      'url-parser',
      'url-decoder',
      'slug-generator',
      'base64-encoder',
      'html-formatter',
    ],
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
      'bcrypt-generator',
      'totp-generator',
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
      'bcrypt-generator',
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
    shortDescription: 'Test, explain and visualize regular expressions.',
    description:
      'Test JavaScript regular expressions against your text with live match highlighting, a match table with positions and every capture group, a plain-English breakdown of the pattern and a replace preview. A safety timeout stops runaway patterns.',
    title: 'Regex Tester & Explainer – Test and Visualize JavaScript Regex',
    metaDescription:
      'Test regular expressions online with live highlighting, a match table of indexes and groups, and a plain-English pattern breakdown. JavaScript regex, runs locally.',
    keywords: [
      'regex tester',
      'regular expression tester',
      'regex explainer',
      'regex visualizer',
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
      'Check the match table for each match’s start and end index and the value of every numbered or named group.',
      'Read the pattern breakdown to see what each group, class, quantifier and anchor does, or enter a replacement to preview the result.',
    ],
    about: [
      'The tester uses your browser’s JavaScript regex engine, so behaviour matches Node.js and browsers exactly. Matching runs in a background worker with a timeout, so catastrophic backtracking cannot freeze the page.',
      'The pattern breakdown splits the expression into a tree — capturing, named and non-capturing groups, lookahead and lookbehind, character classes and ranges, shorthand escapes like \\d and \\w, Unicode properties such as \\p{L}, quantifiers (greedy or lazy), anchors, alternation and backreferences — and explains each part in plain English. It is a quick way to understand a regex you found in someone else’s code.',
    ],
    faqs: [
      {
        q: 'Does it support lookbehind and named groups?',
        a: 'Yes — all modern JavaScript features including (?<name>…), lookbehind (?<=…) and the s (dotAll) and u (Unicode) flags.',
      },
      {
        q: 'What is the difference between greedy and lazy quantifiers?',
        a: 'A greedy quantifier like .* takes as much text as it can and gives back only if the rest of the pattern fails; a lazy one like .*? takes as little as possible. On “<b>x</b>”, <.*> matches the whole string while <.*?> matches just “<b>”. The breakdown labels each quantifier as greedy or lazy.',
      },
      {
        q: 'Why does a group show “—” in the match table?',
        a: 'The group didn’t take part in that match — for example the unused side of an alternation like (a)|(b), or an optional group (x)? that was skipped. JavaScript reports such groups as undefined.',
      },
      {
        q: 'Is my pattern or text sent anywhere?',
        a: 'No. Matching and the breakdown both run in your browser; nothing is uploaded.',
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

  {
    slug: 'sql-formatter',
    category: 'developer-tools',
    name: 'SQL Formatter',
    icon: '🗄️',
    shortDescription: 'Beautify SQL queries for 10 dialects.',
    description:
      'Format messy or one-line SQL into readable, consistently indented queries. Supports PostgreSQL, MySQL, SQL Server, SQLite, Oracle, BigQuery, Snowflake and more, with uppercase or lowercase keywords.',
    title: 'SQL Formatter – Beautify SQL Queries Online (Postgres, MySQL)',
    metaDescription:
      'Format and beautify SQL online for PostgreSQL, MySQL, SQL Server, SQLite, Oracle, BigQuery and Snowflake. Choose keyword case and indent. Runs in your browser.',
    keywords: [
      'sql formatter',
      'format sql',
      'sql beautifier',
      'pretty print sql',
      'sql query formatter',
    ],
    relatedTools: [
      'json-formatter',
      'javascript-formatter',
      'xml-formatter',
      'csv-to-json',
      'text-diff',
    ],
    component: 'text-transform',
    config: { transform: 'sql-format' },
    popular: true,
    howTo: [
      'Paste your SQL.',
      'Pick the dialect, keyword case and indentation.',
      'Click “Format SQL” and copy the result.',
    ],
    about: [
      'Formatting puts each clause (SELECT, FROM, JOIN, WHERE, GROUP BY…) on its own line and indents nested queries, which makes long queries much easier to review in code reviews and pull requests.',
      'The formatter is the open-source sql-formatter library running in your browser, so queries containing table names or customer data are never sent anywhere.',
    ],
    faqs: [
      {
        q: 'Does formatting change what the query does?',
        a: 'No. Only whitespace and, if you choose, the case of keywords and literals such as TRUE and NULL change. String literals and identifiers stay exactly as written.',
      },
      {
        q: 'Why does my query fail to format?',
        a: 'Dialect-specific syntax (for example T-SQL brackets or BigQuery backticks) needs the matching dialect. Switch the dialect and try again.',
      },
    ],
  },
  {
    slug: 'json-to-typescript',
    category: 'developer-tools',
    name: 'JSON to TypeScript',
    icon: '🟦',
    shortDescription: 'Generate TypeScript interfaces from JSON.',
    description:
      'Paste a JSON sample — an API response, a config file, a database record — and get ready-to-use TypeScript interfaces, with nested types, arrays, unions and optional fields inferred automatically.',
    title: 'JSON to TypeScript – Generate Interfaces From JSON Online',
    metaDescription:
      'Convert JSON to TypeScript interfaces or types online. Nested objects, arrays, unions and optional fields are inferred. Free and private — runs in your browser.',
    keywords: [
      'json to typescript',
      'json to ts',
      'generate typescript interface from json',
      'json to interface',
      'typescript type generator',
    ],
    relatedTools: [
      'json-formatter',
      'json-validator',
      'json-to-yaml',
      'jwt-decoder',
      'sql-formatter',
    ],
    component: 'text-transform',
    config: { transform: 'json-to-ts' },
    howTo: [
      'Paste a JSON sample.',
      'Set the root type name and choose interface or type alias.',
      'Copy the generated TypeScript.',
    ],
    about: [
      'Each JSON object becomes an interface named after its key (an array called “orders” produces an “Order” interface). When an array contains objects with different keys, the keys that are missing in some items become optional (`?`).',
      'Types can only be as good as the sample: a field that is null in your sample is typed as null. Paste a representative response, then refine the generated types by hand.',
    ],
    faqs: [
      {
        q: 'Should I use interface or type?',
        a: 'Both work for object shapes. Interfaces can be extended and merged; type aliases can also express unions. Many teams pick one for consistency.',
      },
    ],
  },
  {
    slug: 'html-entity-encoder',
    category: 'developer-tools',
    name: 'HTML Entity Encoder / Decoder',
    icon: '🔣',
    shortDescription: 'Encode & < > " as HTML entities, or decode them.',
    description:
      'Encode text for safe use in HTML — & < > " and \' become &amp; &lt; &gt; &quot; and &#39; — and optionally turn accented letters and symbols into named or numeric entities. Switch to Decode to turn &eacute;, &#233; and &#xE9; back into é.',
    title: 'HTML Entity Encoder & Decoder – Escape HTML Characters Online',
    metaDescription:
      'Encode text to HTML entities (&amp; &lt; &gt; &quot;) or decode named and numeric entities back to text. Named, decimal and hex options. Free and private.',
    keywords: [
      'html entity encoder',
      'html entity decoder',
      'html escape',
      'html encode online',
      'decode html entities',
    ],
    relatedTools: [
      'string-escape',
      'url-encoder',
      'html-formatter',
      'special-characters',
      'markdown-to-html',
    ],
    component: 'text-transform',
    config: { transform: 'html-entities' },
    howTo: [
      'Paste your text or HTML.',
      'Choose Encode or Decode; for encoding, pick whether non-ASCII characters become named, decimal or hex entities.',
      'Copy or download the result.',
    ],
    about: [
      'Five characters have special meaning in HTML: & starts an entity, < and > delimit tags, and " and \' end attribute values. Encoding them is what stops user-supplied text from breaking a page or injecting markup. The minimal mode does exactly that and leaves everything else readable; the other modes also convert characters outside ASCII, which is useful for old systems and email templates that mangle UTF-8.',
      'Decoding understands every named entity in the HTML standard (more than 2,000, such as &nbsp; &hellip; and &rarr;) as well as decimal (&#8230;) and hexadecimal (&#x2026;) references. Decoding happens in your browser’s own HTML parser in a sandboxed document, so markup in the input is never rendered or run.',
    ],
    faqs: [
      {
        q: 'Do I need to encode accented letters like é?',
        a: 'Not on a page served as UTF-8, which is almost every modern page. Encoding only & < > " and \' is enough; use the named or numeric modes for systems that can’t handle UTF-8.',
      },
      {
        q: 'Is HTML encoding enough to prevent XSS?',
        a: 'It is the right defence for text placed between tags and inside quoted attributes. Values used in URLs, JavaScript or CSS need their own escaping — use your framework’s built-in escaping wherever possible.',
      },
    ],
    variants: [
      {
        slug: 'html-entity-decoder',
        name: 'HTML Entity Decoder',
        title: 'HTML Entity Decoder – Convert &amp; &nbsp; &#39; Back to Text',
        metaDescription:
          'Decode HTML entities online: turn &amp; &nbsp; &eacute; &#39; and &#x2014; back into normal characters. Supports all named, decimal and hex entities.',
        description:
          'Paste text full of &amp;, &nbsp;, &#39; or &#x2014; and get readable characters back — every named, decimal and hexadecimal HTML entity is supported.',
        config: { transform: 'html-entities', init_mode: 'decode' },
        keywords: [
          'html entity decoder',
          'decode html',
          'unescape html',
          'html entities to text',
        ],
      },
    ],
  },
  {
    slug: 'number-base-converter',
    category: 'developer-tools',
    alsoIn: ['unit-converters', 'reference-tools'],
    name: 'Number Base Converter',
    icon: '🔢',
    shortDescription: 'Binary, octal, decimal and hex — any base 2–36.',
    description:
      'Convert numbers between binary, octal, decimal, hexadecimal and any base from 2 to 36, and see why the answer is right: each digit’s place value is broken down (255 = 15×16¹ + 15×16⁰). Use prefixes like 0x and 0b, swap bases in one click, convert huge numbers exactly, or paste a list to convert many at once.',
    title: 'Number Base Converter – Binary, Hex, Decimal & Octal',
    metaDescription:
      'Convert between binary, decimal, hexadecimal, octal and any base 2–36. Exact for huge numbers, accepts 0x/0b prefixes, converts many numbers at once. Free.',
    keywords: [
      'number base converter',
      'binary to decimal',
      'hex to decimal',
      'decimal to binary',
      'base converter',
    ],
    relatedTools: [
      'text-to-binary',
      'roman-numeral-converter',
      'chmod-calculator',
      'subnet-calculator',
      'color-converter',
      'scientific-calculator',
    ],
    component: 'number-system',
    config: { transform: 'number-base' },
    popular: true,
    howTo: [
      'Enter one or more numbers, one per line.',
      'Choose the base you are converting from (or Auto to detect 0x, 0b and 0o prefixes) and the base to convert to.',
      'Copy the result; turn on digit grouping for easier reading.',
    ],
    about: [
      'Each base uses a different number of digits: binary uses 0 and 1, octal 0–7, decimal 0–9 and hexadecimal 0–9 plus a–f. Hex is popular in programming because one hex digit is exactly four binary digits, so 0xFF is 1111 1111 — one byte.',
      'Numbers are converted with arbitrary-precision integers, so even values larger than 2⁶⁴ convert exactly instead of being rounded, as they would be in a normal calculator. Negative numbers keep their minus sign; fractions are not supported.',
    ],
    faqs: [
      {
        q: 'How do I convert binary to decimal by hand?',
        a: 'Multiply each digit by its place value (1, 2, 4, 8 … from the right) and add them up: 1011 = 8 + 0 + 2 + 1 = 11.',
      },
      {
        q: 'Does it show two’s complement for negative numbers?',
        a: 'No — negative numbers are shown with a minus sign. Two’s complement depends on the bit width (8, 16, 32 or 64 bits) chosen by a program.',
      },
    ],
    variants: [
      {
        slug: 'binary-to-decimal',
        name: 'Binary to Decimal Converter',
        title: 'Binary to Decimal Converter – Convert Binary Numbers Online',
        metaDescription:
          'Convert binary to decimal instantly: paste binary numbers (with or without 0b) and get exact decimal values, even for very long numbers. Converts many at once.',
        description:
          'Paste binary numbers — 1011, 0b11111111 or long 64-bit values — and get their exact decimal value, one per line.',
        config: { transform: 'number-base', init_from: '2', init_to: '10' },
        keywords: [
          'binary to decimal',
          'binary converter',
          'convert binary to number',
        ],
      },
      {
        slug: 'hex-to-decimal',
        name: 'Hex to Decimal Converter',
        title: 'Hex to Decimal Converter – Hexadecimal to Number',
        metaDescription:
          'Convert hexadecimal to decimal: paste hex values like FF, 0x1A3F or DEADBEEF and get exact decimal numbers. Works for 64-bit and larger values.',
        description:
          'Paste hex values — FF, 0x1A3F, DEADBEEF — and get their exact decimal value. Upper and lower case both work.',
        config: { transform: 'number-base', init_from: '16', init_to: '10' },
        keywords: ['hex to decimal', 'hexadecimal to decimal', 'hex converter'],
      },
      {
        slug: 'decimal-to-binary',
        name: 'Decimal to Binary Converter',
        title: 'Decimal to Binary Converter – Number to Binary Online',
        metaDescription:
          'Convert decimal numbers to binary instantly, with optional 4-bit grouping. Exact for very large numbers; paste several numbers to convert them at once.',
        description:
          'Type a decimal number and get its binary form — 255 becomes 11111111 — with optional grouping into blocks of four bits.',
        config: {
          transform: 'number-base',
          init_from: '10',
          init_to: '2',
          init_group: true,
        },
        keywords: [
          'decimal to binary',
          'number to binary',
          'convert to binary',
        ],
      },
    ],
  },
  {
    slug: 'json-to-xml',
    category: 'developer-tools',
    name: 'JSON to XML Converter',
    icon: '🔀',
    shortDescription: 'Convert JSON to XML, and XML back to JSON.',
    description:
      'Convert JSON to well-formed XML: objects become elements, arrays become repeated elements, and keys starting with @ become attributes. Switch direction to turn XML into JSON. Choose the root and array item names.',
    title: 'JSON to XML Converter – Convert JSON to XML (and Back) Online',
    metaDescription:
      'Convert JSON to XML online with custom root and item names, @attributes and pretty printing — or XML to JSON. Free, instant and processed in your browser.',
    keywords: [
      'json to xml',
      'json to xml converter',
      'convert json to xml',
      'xml to json',
      'json xml',
    ],
    relatedTools: [
      'xml-formatter',
      'json-formatter',
      'json-to-yaml',
      'json-to-csv',
      'json-diff',
    ],
    component: 'text-transform',
    config: { transform: 'json-xml' },
    howTo: [
      'Paste your JSON (or XML when converting XML → JSON).',
      'Optionally set the root element and the name used for array items.',
      'Copy or download the converted output.',
    ],
    about: [
      'JSON and XML model data differently, so a few conventions are used: each object key becomes a child element, an array becomes the same element repeated (“tags”: [“a”, “b”] → <tags>a</tags><tags>b</tags>), null becomes an empty element, and keys prefixed with @ become attributes. Keys that aren’t valid XML names — like “2nd key” — are adjusted to _2nd_key.',
      'XML → JSON does the reverse: attributes get an @ prefix, repeated elements become arrays, text next to child elements is stored as #text, and numbers and true/false are converted to JSON types. Inline DTDs are rejected to avoid entity-expansion attacks.',
    ],
    faqs: [
      {
        q: 'Why is there no root element in my JSON?',
        a: 'If the JSON object has a single top-level key, that key becomes the root. Otherwise everything is wrapped in <root> — or the name you enter.',
      },
      {
        q: 'Does XML → JSON keep the order of mixed elements?',
        a: 'Elements with the same name are grouped into one array, so the original interleaving of different elements is not preserved.',
      },
    ],
    variants: [
      {
        slug: 'xml-to-json',
        name: 'XML to JSON Converter',
        title: 'XML to JSON Converter – Convert XML to JSON Online',
        metaDescription:
          'Convert XML to JSON online: attributes become @keys, repeated elements become arrays and numbers keep their type. Paste XML and copy clean, formatted JSON.',
        description:
          'Paste XML and get clean JSON: attributes become @keys, repeated elements become arrays, and numbers and booleans keep their type.',
        config: { transform: 'json-xml', init_direction: 'xml-to-json' },
        keywords: [
          'xml to json',
          'xml to json converter',
          'convert xml to json',
        ],
      },
    ],
  },
  {
    slug: 'json-diff',
    category: 'developer-tools',
    name: 'JSON Diff',
    icon: '🧮',
    shortDescription: 'Compare two JSON documents and list every change.',
    description:
      'Compare two JSON documents and see exactly what changed — added, removed and changed values with their paths, like $.settings.theme. Key order and formatting are ignored, and you can ignore the order of array items too.',
    title: 'JSON Diff – Compare Two JSON Files Online (Structural)',
    metaDescription:
      'Compare JSON online: see added, removed and changed values by path ($.user.name), ignoring key order and whitespace. Optional array-order ignore. Free and private.',
    keywords: [
      'json diff',
      'json compare',
      'compare json online',
      'json difference',
      'diff two json files',
    ],
    relatedTools: [
      'text-diff',
      'json-formatter',
      'json-validator',
      'json-to-xml',
      'yaml-to-json',
    ],
    component: 'json-diff',
    howTo: [
      'Paste the original JSON on the left and the changed JSON on the right.',
      'Read the list of differences — each one shows its path and the old and new value.',
      'Tick “Ignore the order of items in arrays” if order doesn’t matter, then copy the report.',
    ],
    about: [
      'A text diff compares lines, so reformatting or reordering keys makes everything look different. A structural diff parses both documents first and compares values, so {"a":1,"b":2} and {"b":2,"a":1} are equal. Each difference is reported with a JSONPath-style location: $ is the root, .name is a key and [2] an array index.',
      'Arrays are compared position by position by default, which is right for ordered lists. With “ignore order” on, items are matched by value instead — useful for tag lists or sets of IDs.',
    ],
    faqs: [
      {
        q: 'Why do I see many changes when only one item was inserted in an array?',
        a: 'Position-by-position comparison shifts every later item. Turn on “Ignore the order of items in arrays” to match items by value instead.',
      },
      {
        q: 'Is 1 the same as 1.0?',
        a: 'Yes — both are the same JSON number. "1" (a string) and 1 (a number) are different and are reported as a change.',
      },
    ],
  },
  {
    slug: 'string-escape',
    category: 'developer-tools',
    name: 'String Escape / Unescape',
    icon: '🧷',
    shortDescription: 'Escape strings for JSON, JS, Python, SQL, CSV, regex…',
    description:
      'Escape or unescape text for JSON, JavaScript, Java and C#, Python, SQL, CSV, regular expressions, shell commands and XML. Turn quotes, backslashes, line breaks and tabs into the right escape sequences — or decode \\n, \\u00e9 and \\" back into text.',
    title: 'String Escape & Unescape – JSON, JavaScript, SQL, Regex & More',
    metaDescription:
      'Escape or unescape strings for JSON, JavaScript, Java, C#, Python, SQL, CSV, regex, shell and XML. Handles quotes, backslashes, newlines and Unicode. Free.',
    keywords: [
      'string escape',
      'escape string online',
      'json escape',
      'unescape string',
      'escape quotes',
    ],
    relatedTools: [
      'html-entity-encoder',
      'url-encoder',
      'json-formatter',
      'regex-tester',
      'base64-encoder',
    ],
    component: 'text-transform',
    config: { transform: 'string-escape' },
    howTo: [
      'Paste the text.',
      'Choose Escape or Unescape and the language or format.',
      'Copy the result into your code, query or file.',
    ],
    about: [
      "Every language has characters that can’t appear raw inside a string literal. JSON, JavaScript, Java, C# and Python use backslash sequences (\\\" \\\\ \\n \\t \\u00e9); SQL doubles single quotes (O''Brien); CSV wraps a field in quotes and doubles the quotes inside; regular expressions put a backslash before . * + ? ( ) [ ] { } | ^ $ \\ / and -; and the shell mode wraps text in single quotes so nothing is expanded.",
      'Escaping for SQL here is for writing literals by hand — in application code always use parameterised queries instead, which make escaping unnecessary and prevent SQL injection.',
    ],
    faqs: [
      {
        q: 'What is the difference between JSON and JavaScript escaping?',
        a: 'JSON only allows double-quoted strings, so single quotes are left alone. JavaScript mode also escapes single quotes, backticks and $ so the result works in any kind of JS string, including template literals.',
      },
      {
        q: 'Why does unescaping JSON fail?',
        a: 'The input must be a valid JSON string body: every " and \\ inside it must already be escaped, and \\u must be followed by four hex digits.',
      },
    ],
  },
  {
    slug: 'url-parser',
    category: 'developer-tools',
    name: 'URL Parser & Query String Builder',
    icon: '🔗',
    shortDescription: 'Split a URL into parts and edit its query string.',
    description:
      'Paste a URL to see its protocol, host, port, path, query parameters and fragment. Edit, add, reorder or remove parameters — including utm_, gclid and fbclid tracking tags — and the URL is rebuilt and correctly encoded as you type.',
    title: 'URL Parser & Query String Builder – Edit URL Parameters Online',
    metaDescription:
      'Parse any URL into protocol, host, path, query and hash. Edit, add or remove query parameters, strip utm_/gclid/fbclid tracking and copy the rebuilt URL. Free.',
    keywords: [
      'url parser',
      'query string builder',
      'parse url online',
      'url parameters',
      'remove utm parameters',
    ],
    relatedTools: [
      'url-encoder',
      'url-decoder',
      'meta-tag-generator',
      'slug-generator',
      'jwt-decoder',
    ],
    component: 'url-parser',
    howTo: [
      'Paste a full URL, including https://.',
      'Read its parts in the table, then edit the query parameters below it.',
      'Copy the rebuilt URL.',
    ],
    about: [
      'A URL has up to eight parts: scheme (https:), user info, host, port, path, query string (?key=value&…), and fragment (#section). The tool uses your browser’s standard URL parser — the same one websites use — so results match what browsers actually do, including default ports (443 for https) and decoding of percent-encoded characters.',
      'Query parameters are rebuilt with application/x-www-form-urlencoded encoding: spaces become +, and &, = and # inside values are percent-encoded so they can’t break the URL. Parameter order is kept, and repeated keys (tag=a&tag=b) are supported.',
    ],
    faqs: [
      {
        q: 'Is it safe to remove utm_ parameters?',
        a: 'Yes for sharing links — they only tell analytics where a visit came from. Removing them doesn’t change the page you land on.',
      },
      {
        q: 'Why does my space show as + and not %20?',
        a: 'In query strings both mean a space. The form-encoding standard browsers use for parameters writes it as +.',
      },
    ],
  },
  {
    slug: 'user-agent-parser',
    category: 'developer-tools',
    name: 'User Agent Parser',
    icon: '🕵️',
    shortDescription: 'Parse any user-agent string; spot bots and crawlers.',
    description:
      'Paste one or many user-agent strings — from logs, analytics or bug reports — and see the browser, version, engine, operating system and device type for each, plus whether it is a bot such as Googlebot, an AI crawler or curl. Export as CSV.',
    title: 'User Agent Parser – Decode Browser, OS, Device & Bots',
    metaDescription:
      'Parse user-agent strings: browser, version, rendering engine, OS and device type, plus bot detection for Googlebot, AI crawlers and scripts. Bulk parse and export CSV.',
    keywords: [
      'user agent parser',
      'parse user agent',
      'user agent decoder',
      'user agent lookup',
      'bot user agent',
    ],
    relatedTools: [
      'what-is-my-browser',
      'robots-txt-generator',
      'http-status-codes',
      'regex-tester',
      'jwt-decoder',
    ],
    component: 'ua-parser',
    howTo: [
      'Paste user-agent strings, one per line (your own is filled in to start).',
      'Read the browser, engine, operating system and device for each, and any bot warning.',
      'Click “Copy as CSV” to take the results to a spreadsheet.',
    ],
    about: [
      'Browsers send a user-agent string with every request, and it ends up in server logs and analytics. The format is a historical mess — every browser claims to be “Mozilla/5.0” and Chrome-based browsers also mention Safari — so the parser checks the specific tokens in the right order (Edg/ before Chrome/, CriOS for Chrome on iPhone, “; wv)” for Android WebViews).',
      'Bot detection recognises search-engine crawlers, AI crawlers (GPTBot, ClaudeBot, PerplexityBot…), link-preview bots and common scripts. Any client can fake its user agent, so for real Googlebot or Bingbot traffic confirm it with a reverse DNS lookup of the IP address.',
    ],
    faqs: [
      {
        q: 'Why is the Windows version “10 or 11”?',
        a: 'Windows 11 browsers still send “Windows NT 10.0”, so the string alone can’t tell them apart. Only User-Agent Client Hints, read live by a browser, can.',
      },
      {
        q: 'Why are versions like 130.0.0.0?',
        a: 'Chrome reduced the user agent for privacy: minor version numbers are frozen to 0. The full version is only available through Client Hints.',
      },
    ],
  },
  {
    slug: 'subnet-calculator',
    category: 'developer-tools',
    name: 'Subnet Calculator',
    icon: '🌐',
    shortDescription: 'IPv4/IPv6 CIDR: network, mask, broadcast, hosts.',
    description:
      'Enter an IP address with a CIDR prefix (192.168.1.10/24) or a subnet mask to get the network and broadcast address, subnet and wildcard masks, first and last usable host and the number of hosts. Split a network into smaller subnets. IPv6 prefixes are supported too.',
    title: 'Subnet Calculator – IPv4 & IPv6 CIDR, Mask & Host Range',
    metaDescription:
      'Free subnet calculator: network, broadcast, subnet and wildcard mask, usable host range and host count for any IPv4 CIDR, plus subnetting and IPv6 prefixes.',
    keywords: [
      'subnet calculator',
      'ip subnet calculator',
      'subnet mask calculator',
      'ipv4 subnet',
      'ipv6 subnet calculator',
    ],
    relatedTools: [
      'number-base-converter',
      'chmod-calculator',
      'url-parser',
      'http-status-codes',
      'what-is-my-browser',
    ],
    component: 'subnet-calculator',
    popular: true,
    howTo: [
      'Enter an address with a prefix like 10.0.0.5/16, or an address and mask like 10.0.0.5 255.255.0.0.',
      'Read the network, broadcast, masks and usable host range.',
      'Optionally choose a longer prefix to split the network into equal subnets.',
    ],
    about: [
      'The prefix length (/24) says how many leading bits identify the network; the rest identify hosts. A /24 leaves 8 host bits: 256 addresses, of which the first (network) and last (broadcast) are reserved, leaving 254 usable hosts. The subnet mask 255.255.255.0 is the same information written as an address, and the wildcard mask 0.0.0.255 — used in Cisco ACLs and OSPF — is its inverse.',
      'The tool also tells you whether an address is private (10/8, 172.16/12, 192.168/16), loopback, link-local, carrier-grade NAT or public. For IPv6 it shows the first and last address of the prefix and the total count; IPv6 has no broadcast address, and /64 is the standard size for a LAN.',
    ],
    faqs: [
      {
        q: 'How many hosts are in a /24, /25 or /30?',
        a: '/24: 254 usable hosts, /25: 126, /26: 62, /27: 30, /28: 14, /29: 6, /30: 2. Each extra prefix bit halves the network.',
      },
      {
        q: 'Why does /31 have 2 usable hosts?',
        a: 'RFC 3021 allows /31 on point-to-point links, where no broadcast address is needed, so both addresses are usable.',
      },
    ],
    variants: [
      {
        slug: 'cidr-calculator',
        name: 'CIDR Calculator',
        title: 'CIDR Calculator – CIDR to IP Range, Mask & Host Count',
        metaDescription:
          'Convert CIDR notation to an IP range: enter 10.0.0.0/22 to get the first and last address, subnet mask, wildcard and number of hosts. IPv4 and IPv6.',
        description:
          'Enter a CIDR block such as 10.0.0.0/22 to see the IP range it covers, its subnet mask, wildcard mask and how many hosts it holds.',
        config: {},
        keywords: [
          'cidr calculator',
          'cidr to ip range',
          'cidr notation',
          'ip range calculator',
        ],
      },
    ],
  },
  {
    slug: 'chmod-calculator',
    category: 'developer-tools',
    name: 'Chmod Calculator',
    icon: '🔐',
    shortDescription: 'Linux file permissions: 755 ↔ rwxr-xr-x.',
    description:
      'Work out Linux and macOS file permissions: tick read, write and execute for owner, group and others to get the octal number (755) and symbolic form (rwxr-xr-x), or type either one to see what it means. Includes setuid, setgid and sticky bits and the chmod command.',
    title: 'Chmod Calculator – Linux File Permissions (755, 644, rwxr-xr-x)',
    metaDescription:
      'Calculate chmod permissions: convert between octal (755, 644) and symbolic (rwxr-xr-x), set setuid, setgid and sticky bits, and copy the chmod command.',
    keywords: [
      'chmod calculator',
      'chmod 755',
      'linux file permissions',
      'chmod 644',
      'unix permissions calculator',
    ],
    relatedTools: [
      'number-base-converter',
      'subnet-calculator',
      'cron-expression-generator',
      'robots-txt-generator',
      'hash-generator',
    ],
    component: 'chmod-calculator',
    howTo: [
      'Tick the permissions you want for owner, group and others — or type an octal or symbolic value.',
      'Add setuid, setgid or sticky if needed.',
      'Enter the file name and copy the chmod command.',
    ],
    about: [
      'Each of the three classes — owner, group, others — gets three permission bits: read (4), write (2) and execute (1). Adding them gives one octal digit per class, so rwx = 7, r-x = 5 and r-- = 4, and rwxr-xr-x is 755. On a folder, execute means “may enter the folder” and read means “may list its contents”.',
      'An optional leading digit sets the special bits: 4 setuid (run as the file’s owner), 2 setgid (run as the group, or new files in a folder inherit its group) and 1 sticky (in a shared folder like /tmp, only owners can delete their files). In the symbolic form they appear as s or t in place of x — uppercase S or T if the underlying execute bit is off.',
    ],
    faqs: [
      {
        q: 'What is the difference between 644 and 755?',
        a: '644 (rw-r--r--) lets the owner edit and everyone read — right for normal files. 755 (rwxr-xr-x) also lets everyone execute or enter — right for scripts, programs and folders.',
      },
      {
        q: 'Is chmod 777 safe?',
        a: 'Rarely. It lets every user on the system change or replace the file. Use the narrowest permissions that work, such as 755 or 775 with the right group.',
      },
    ],
  },
  {
    slug: 'svg-optimizer',
    category: 'developer-tools',
    alsoIn: ['image-tools'],
    name: 'SVG Optimizer',
    icon: '🪶',
    shortDescription: 'Shrink SVG files by removing editor junk.',
    description:
      'Make SVG files smaller with SVGO, the standard SVG optimiser: remove editor metadata, comments and hidden elements, round numbers and simplify paths. See the size saving and a before/after preview, then copy or download the result.',
    title: 'SVG Optimizer – Minify & Compress SVG Files Online (SVGO)',
    metaDescription:
      'Optimise SVG files online with SVGO: strip metadata and comments, round numbers, simplify paths and see before/after size and preview. Free, runs in your browser.',
    keywords: [
      'svg optimizer',
      'svg minifier',
      'compress svg',
      'optimize svg online',
      'svgo online',
    ],
    relatedTools: [
      'svg-to-png',
      'image-compressor',
      'favicon-generator',
      'html-entity-encoder',
      'code-to-image',
    ],
    component: 'svg-optimizer',
    handlesFiles: true,
    howTo: [
      'Drop an SVG file or paste its code.',
      'Adjust precision and options — the result updates automatically.',
      'Compare the previews, then copy or download the optimised SVG.',
    ],
    about: [
      'SVGs exported from Illustrator, Inkscape, Figma or Sketch carry a lot that browsers don’t need: editor namespaces and metadata, comments, empty groups, default attribute values and coordinates with six decimal places. Removing them usually saves 20–60 % without any visible change, which speeds up pages that inline icons or logos.',
      'Precision controls how many decimal places coordinates keep: 2–3 is safe for icons, while very small or detailed drawings may need more. “Remove width/height” keeps only the viewBox so the image scales to its container. Previews are rendered as images, so scripts inside an SVG never run on this page.',
    ],
    faqs: [
      {
        q: 'Will optimising change how my SVG looks?',
        a: 'Normally not. If curves shift slightly, raise the precision; compare the before and after previews before using the result.',
      },
      {
        q: 'Should I gzip SVGs as well?',
        a: 'Yes — servers usually compress SVG with gzip or Brotli automatically. Optimising first still helps, because it removes data compression can’t.',
      },
    ],
  },
  {
    slug: 'meta-tag-generator',
    category: 'developer-tools',
    name: 'Meta Tag & Open Graph Generator',
    icon: '🏷️',
    shortDescription: 'SEO meta tags, Open Graph and X cards with previews.',
    description:
      'Generate the HTML meta tags for a page — title, description, canonical, robots, Open Graph for Facebook and LinkedIn, and X (Twitter) cards — with live previews of how the link will look in Google and when shared. Length warnings help you avoid truncation.',
    title: 'Meta Tag & Open Graph Generator – SEO Tags with Live Previews',
    metaDescription:
      'Generate SEO meta tags, Open Graph and X/Twitter card tags with live Google, Facebook and X previews and length warnings. Copy the HTML for your <head>. Free.',
    keywords: [
      'meta tag generator',
      'open graph generator',
      'og tags',
      'twitter card generator',
      'seo meta tags',
    ],
    relatedTools: [
      'robots-txt-generator',
      'url-parser',
      'favicon-generator',
      'social-media-image-resizer',
      'html-entity-encoder',
    ],
    component: 'meta-tag-generator',
    popular: true,
    howTo: [
      'Fill in the title, description, page URL and share image.',
      'Check the length counters and the Google, Facebook and X previews.',
      'Copy the generated HTML into the <head> of your page.',
    ],
    about: [
      'The title and meta description are what search engines usually show in results; keep titles to about 60 characters and descriptions to about 155 so they aren’t cut off. The canonical link tells search engines which URL is the main version of a page. Open Graph tags (og:title, og:image…) control link previews on Facebook, LinkedIn, WhatsApp, Slack and Discord, and twitter:card tags control X.',
      'Share images should be 1200 × 630 pixels (1.91:1) and under about 5 MB. All values are HTML-escaped in the output, so quotes and ampersands in a title can’t break your markup. Platforms cache previews, so after changing tags use their sharing debuggers to refresh them.',
    ],
    faqs: [
      {
        q: 'Does Google use the meta keywords tag?',
        a: 'No — Google has ignored it for years, so this generator doesn’t add it.',
      },
      {
        q: 'Do I need both Open Graph and Twitter tags?',
        a: 'X falls back to Open Graph for title, description and image, but it needs twitter:card to choose the large-image layout. The generator includes both for full control.',
      },
    ],
  },
  {
    slug: 'robots-txt-generator',
    category: 'developer-tools',
    name: 'Robots.txt Generator',
    icon: '🤖',
    shortDescription: 'Build robots.txt, block AI crawlers, test URLs.',
    description:
      'Create a robots.txt file with rules for all crawlers or specific bots, sitemap links and ready-made presets — including one that blocks AI crawlers such as GPTBot, ClaudeBot and Google-Extended. Test any path against your rules before you publish.',
    title: 'Robots.txt Generator & Tester – Block AI Crawlers, Add Sitemaps',
    metaDescription:
      'Generate robots.txt with allow/disallow rules, sitemaps and presets to block AI crawlers (GPTBot, ClaudeBot, CCBot). Test URLs against the rules. Free.',
    keywords: [
      'robots.txt generator',
      'robots txt',
      'block ai crawlers',
      'robots.txt tester',
      'disallow gptbot',
    ],
    relatedTools: [
      'meta-tag-generator',
      'user-agent-parser',
      'http-status-codes',
      'url-parser',
      'slug-generator',
    ],
    component: 'robots-txt',
    howTo: [
      'Start from a preset or edit the rule groups: user agents, paths to disallow and exceptions to allow.',
      'Add your sitemap URL.',
      'Test a few paths, then download robots.txt and upload it to the root of your site.',
    ],
    about: [
      'robots.txt sits at the root of a domain and tells crawlers which paths they may fetch. Rules are grouped by user agent; a crawler uses the most specific group that names it and ignores the rest, so a Googlebot group replaces the * rules for Google entirely. Within a group the longest matching rule wins, and Allow wins a tie — so Allow: /private/open overrides Disallow: /private/. * matches any characters and $ anchors the end, as in Disallow: /*.pdf$.',
      'The tester follows these rules (Google’s interpretation, standardised in RFC 9309). Remember that robots.txt is a request, not access control: well-behaved crawlers honour it, but it doesn’t hide content, and a blocked URL can still be indexed from links — use noindex for that.',
    ],
    faqs: [
      {
        q: 'How do I block ChatGPT and other AI crawlers?',
        a: 'Use the “Block AI crawlers” preset. It disallows GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot and others while leaving normal search engines allowed.',
      },
      {
        q: 'Does Crawl-delay work?',
        a: 'Bing and Yandex honour it; Google ignores it and adjusts its crawl rate automatically.',
      },
    ],
  },
  {
    slug: 'http-status-codes',
    category: 'developer-tools',
    alsoIn: ['reference-tools'],
    name: 'HTTP Status Code Lookup',
    icon: '🚦',
    shortDescription: 'Every HTTP status code explained, with SEO notes.',
    description:
      'Look up any HTTP status code — 200, 301, 404, 503 and every other registered code — and see what it means, what usually causes it and how search engines treat it. Search by number or keyword and filter by class.',
    title: 'HTTP Status Codes – Full List with Meanings & SEO Impact',
    metaDescription:
      'Look up every HTTP status code from 100 to 511: what it means, common causes and SEO impact (301 vs 302, 404 vs 410, 503). Search and filter by class.',
    keywords: [
      'http status codes',
      'http status code list',
      '404 meaning',
      '301 vs 302',
      '503 service unavailable',
    ],
    relatedTools: [
      'robots-txt-generator',
      'url-parser',
      'user-agent-parser',
      'meta-tag-generator',
      'json-formatter',
    ],
    component: 'http-status',
    howTo: [
      'Type a code or a word such as “redirect” or “timeout”.',
      'Filter by class: 1xx informational, 2xx success, 3xx redirection, 4xx client errors, 5xx server errors.',
      'Read the meaning and, where relevant, how search engines treat it.',
    ],
    about: [
      'The first digit says what happened: 2xx success, 3xx “look elsewhere”, 4xx the request was wrong (or not allowed) and 5xx the server failed. The definitions come from the IANA registry, mostly RFC 9110, which replaced the older HTTP/1.1 RFCs in 2022.',
      'For SEO the important pairs are 301/308 (permanent — ranking signals move to the new URL) vs 302/307 (temporary), 404 vs 410 (both remove a page; 410 slightly faster), and 503 with Retry-After for maintenance, which tells crawlers to come back instead of dropping pages.',
    ],
    faqs: [
      {
        q: 'What is the difference between 401 and 403?',
        a: '401 means “we don’t know who you are — log in”. 403 means “we know who you are, but you’re not allowed”.',
      },
      {
        q: 'Should I use 301 or 308?',
        a: 'Both are permanent. 308 guarantees the method (e.g. POST) is kept; for normal page moves 301 is the most widely understood.',
      },
    ],
  },
  {
    slug: 'code-to-image',
    category: 'developer-tools',
    name: 'Code to Image',
    icon: '🖼️',
    shortDescription: 'Beautiful code screenshots as PNG.',
    description:
      'Turn code into a beautiful image for slides, docs and social posts: syntax highlighting for 20 languages, themes like One Dark and Dracula, gradient backgrounds, window buttons, line numbers and 1–3× export. Download a PNG or copy it to the clipboard.',
    title: 'Code to Image – Create Beautiful Code Screenshots (PNG)',
    metaDescription:
      'Create beautiful code screenshots: syntax highlighting for 20 languages, themes, gradient backgrounds, window frame and line numbers. Download PNG or copy. Free.',
    keywords: [
      'code to image',
      'code screenshot',
      'carbon alternative',
      'code snippet image',
      'beautiful code images',
    ],
    relatedTools: [
      'svg-optimizer',
      'javascript-formatter',
      'markdown-previewer',
      'json-formatter',
      'meme-generator',
    ],
    component: 'code-to-image',
    popular: true,
    howTo: [
      'Paste your code and pick the language (or let it detect automatically).',
      'Choose a theme, background, padding and font size; add a title or line numbers.',
      'Download the PNG or copy the image straight into your post or slides.',
    ],
    about: [
      'Code is highlighted with highlight.js and drawn onto a canvas in your browser, so the image is crisp at 2× or 3× for high-resolution screens and print. Tabs become two spaces and very long files are limited to 300 lines — for social posts, 10–25 lines read best.',
      'Images are great for slides and social media, but they aren’t searchable or accessible to screen readers and can’t be copied. When sharing code people should reuse, also link the text — for example in a gist — and describe what the code does in your post.',
    ],
    faqs: [
      {
        q: 'Which font is used?',
        a: 'Your system’s monospace font (SF Mono, Menlo, Consolas…), so the image can look slightly different on another computer.',
      },
      {
        q: 'Can I get a transparent background?',
        a: 'Yes — choose “None (transparent)” as the background to export just the code window on a transparent PNG.',
      },
    ],
  },
  {
    slug: 'bcrypt-generator',
    category: 'developer-tools',
    alsoIn: ['security-generators'],
    name: 'Bcrypt Hash Generator',
    icon: '🧂',
    shortDescription: 'Hash passwords with bcrypt and verify hashes.',
    description:
      'Generate bcrypt password hashes with a cost factor from 4 to 15, and check whether a password matches an existing bcrypt hash. Hashing runs in a background worker in your browser; nothing is sent or stored.',
    title: 'Bcrypt Hash Generator & Checker – Hash and Verify Passwords',
    metaDescription:
      'Generate bcrypt password hashes with a chosen cost factor and verify a password against a $2a$/$2b$/$2y$ hash. Runs in your browser — nothing is sent anywhere.',
    keywords: [
      'bcrypt generator',
      'bcrypt hash',
      'bcrypt online',
      'bcrypt checker',
      'password hash generator',
    ],
    relatedTools: [
      'hash-generator',
      'password-generator',
      'totp-generator',
      'jwt-decoder',
      'sha256-generator',
    ],
    component: 'bcrypt',
    howTo: [
      'Type the password and choose a cost factor (10–12 is typical).',
      'Click “Generate hash” and copy it.',
      'To verify, enter a password and an existing hash and click Verify.',
    ],
    about: [
      'bcrypt is a password-hashing function designed to be slow: the cost factor sets the work to 2^cost rounds, so each step up doubles the time. That slowness makes guessing passwords from a stolen database expensive, which plain hashes such as SHA-256 do not. A bcrypt hash stores everything needed to check it — version ($2b$), cost, a random 22-character salt and the 31-character result — which is why the same password gives a different hash each time.',
      'Choose a cost that takes roughly 100–300 ms on your server; 10–12 is common today. bcrypt only uses the first 72 bytes of a password, and the tool warns when input is longer.',
    ],
    faqs: [
      {
        q: 'Why is the hash different every time?',
        a: 'A new random salt is generated for each hash. Verification reads the salt from the stored hash, so any of them will match the right password.',
      },
      {
        q: 'Is bcrypt still recommended?',
        a: 'Yes, it remains a solid choice. Argon2id is the newer recommendation for new systems; scrypt and PBKDF2 are also acceptable with strong settings.',
      },
    ],
  },
  {
    slug: 'totp-generator',
    category: 'developer-tools',
    alsoIn: ['security-generators'],
    name: 'TOTP / 2FA Code Generator',
    icon: '⏱️',
    shortDescription: 'Live 2FA codes from a secret key or otpauth link.',
    description:
      'Generate time-based one-time passwords (TOTP) like an authenticator app: enter a Base32 secret or an otpauth:// link and see the current 6- to 8-digit code with a countdown, plus the previous and next codes. Useful for testing 2FA and recovering from a backup secret.',
    title: 'TOTP Generator – 2FA Authenticator Codes from a Secret Key',
    metaDescription:
      'Generate TOTP 2FA codes from a Base32 secret or otpauth:// link: SHA-1/256/512, 6–8 digits, 30/60 s, with countdown. Runs in your browser; nothing is stored.',
    keywords: [
      'totp generator',
      '2fa code generator',
      'authenticator online',
      'totp code',
      'google authenticator code',
    ],
    relatedTools: [
      'bcrypt-generator',
      'password-generator',
      'qr-code-scanner',
      'hash-generator',
      'jwt-decoder',
    ],
    component: 'totp',
    howTo: [
      'Paste the secret key (letters A–Z and digits 2–7) or the full otpauth:// link from a QR code.',
      'Check the algorithm, digits and period match the service (most use SHA-1, 6 digits, 30 s).',
      'Use the current code before the countdown runs out.',
    ],
    about: [
      'TOTP (RFC 6238) is the algorithm behind Google Authenticator, Microsoft Authenticator, 1Password and most 2FA apps. Both sides know a shared secret; every 30 seconds each computes an HMAC of the current time step and reduces it to a short code. Because the code depends only on the secret and the clock, this page produces the same codes as your app — verified against the RFC’s test vectors.',
      'A QR code for 2FA contains an otpauth:// link with the secret and settings; scan it with the QR Code Scanner to read it. Treat the secret like a password: anyone who has it can generate your codes. This page keeps it in memory only and stores nothing.',
    ],
    faqs: [
      {
        q: 'Why doesn’t the code match my app?',
        a: 'Most often the device clock is off — enable automatic time. Also check the algorithm, digits and period, and that the secret has no typos.',
      },
      {
        q: 'Is it safe to type my 2FA secret into a website?',
        a: 'Only into one you trust, because the secret is equivalent to the second factor. This page runs entirely in your browser and sends nothing, but for everyday logins keep using a dedicated authenticator app.',
      },
    ],
  },
  {
    slug: 'text-to-binary',
    category: 'developer-tools',
    alsoIn: ['unit-converters', 'text-tools'],
    name: 'Text to Binary Converter',
    icon: '0️⃣',
    shortDescription: 'Text ↔ binary, hex and decimal bytes (UTF-8).',
    description:
      'Convert text to binary code — “Hi” becomes 01001000 01101001 — or binary back to readable text. Uses UTF-8, so accents and emoji work, and can also show the bytes as hex, decimal or octal.',
    title: 'Text to Binary Converter – Binary to Text Translator (UTF-8)',
    metaDescription:
      'Convert text to binary and binary to text online. UTF-8, so emoji and accents work. Also hex, decimal and octal bytes, with or without spaces. Free.',
    keywords: [
      'text to binary',
      'binary to text',
      'binary translator',
      'binary code translator',
      'text to binary converter',
    ],
    relatedTools: [
      'number-base-converter',
      'base64-encoder',
      'morse-code-converter',
      'hash-generator',
      'string-escape',
    ],
    component: 'text-transform',
    config: { transform: 'text-binary' },
    popular: true,
    howTo: [
      'Type text, or paste binary (8-bit groups, with or without spaces).',
      'Choose Text → binary or Binary → text, and the number format.',
      'Copy the result.',
    ],
    about: [
      'Computers store text as bytes. The text is first encoded as UTF-8 — one byte for each basic Latin letter (H = 72 = 01001000), two for accented letters like é (11000011 10101001) and four for most emoji — and each byte is then written as eight binary digits. The same bytes can be shown as hex (48 69), decimal (72 105) or octal.',
      'When decoding, each space-separated group is read as one byte (so 7-bit ASCII groups work too), and the result must be valid UTF-8 — otherwise the tool says so instead of printing garbage. Binary without spaces is split into 8-bit groups automatically and must be a multiple of 8 digits long.',
    ],
    faqs: [
      {
        q: 'What is “hello” in binary?',
        a: '01101000 01100101 01101100 01101100 01101111 — one 8-bit byte per letter in UTF-8 (and ASCII).',
      },
      {
        q: 'Why does an emoji become 32 bits?',
        a: 'Emoji are outside the basic range, so UTF-8 uses four bytes for them — four groups of eight bits.',
      },
    ],
    variants: [
      {
        slug: 'binary-to-text',
        name: 'Binary to Text Converter',
        title: 'Binary to Text Converter – Translate Binary Code to Words',
        metaDescription:
          'Translate binary code to text: paste 8-bit groups like 01001000 01101001 and get “Hi”. UTF-8, with or without spaces, plus hex and decimal input.',
        description:
          'Paste binary code — 8-bit groups like 01001000 01101001 — and read the text. UTF-8 is supported, so emoji and accented letters decode correctly.',
        config: { transform: 'text-binary', init_mode: 'decode' },
        keywords: [
          'binary to text',
          'binary to english',
          'binary decoder',
          'translate binary',
        ],
      },
    ],
  },
  {
    slug: 'css-unit-visualizer',
    category: 'developer-tools',
    name: 'CSS Unit Visualizer',
    icon: '📏',
    shortDescription: 'See px, %, em, rem, vw, vh, ch and ex side by side.',
    description:
      'See how CSS length units resolve to pixels: set the root and parent font size, parent width and viewport size, and every unit — px, %, em, rem, vw, vh, vmin, vmax, ch, ex, pt, cm, mm and in — converts live, with bars and a to-scale box so you can see the difference.',
    title: 'CSS Unit Converter & Visualizer – px, rem, em, vw, vh',
    metaDescription:
      'Convert and compare CSS units visually: px, rem, em, %, vw, vh, vmin, vmax, ch and ex. Set font size and viewport and see 10rem = 160px update live.',
    keywords: [
      'css units',
      'px to rem',
      'rem to px',
      'em vs rem',
      'vw to px',
      'css unit converter',
      'css',
    ],
    relatedTools: [
      'flexbox-playground',
      'grid-playground',
      'measurement-reference',
      'css-formatter',
      'color-converter',
    ],
    component: 'css-units',
    howTo: [
      'Set the context: root font size (for rem), parent font size (for em), parent width (for %) and viewport size.',
      'Enter a value and unit, such as 10 rem, to see it in pixels and every other unit.',
      'Compare one of each unit in the bar chart.',
      'Size a box in any units to see it drawn inside the viewport to scale.',
    ],
    about: [
      'CSS units fall into four families. Absolute units (px, pt, cm, in) are fixed: 1in is always 96px in CSS. Font-relative units scale with text: rem follows the root font size, em follows the parent’s font size, ch is the width of the digit 0 and ex the height of the letter x. Viewport units are percentages of the browser window — 1vw is 1% of its width. Percentages refer to the parent element.',
      'rem is the usual choice for font sizes and spacing because it respects the reader’s browser font-size setting without compounding like em does in nested elements. The ch and ex ratios on this page are measured in your browser for its default font, so they match what your CSS would actually produce.',
    ],
    faqs: [
      {
        q: 'How many pixels is 1rem?',
        a: '16px by default, because browsers set the root font size to 16px. If a user raises their default font size, or your CSS sets html { font-size }, 1rem changes with it.',
      },
      {
        q: 'What is the difference between em and rem?',
        a: 'rem is relative to the root (html) font size and is the same everywhere on the page. em is relative to the current element’s parent font size, so 1.2em inside 1.2em becomes 1.44 times the base.',
      },
      {
        q: 'Why does 100vh look too tall on phones?',
        a: 'Mobile browsers count the area behind the address bar. Use 100dvh (dynamic) or 100svh (small viewport) instead.',
      },
    ],
  },
  {
    slug: 'html-entity-reference',
    category: 'developer-tools',
    alsoIn: ['reference-tools'],
    name: 'HTML Entity Reference',
    icon: '&',
    shortDescription: 'Search all 2,000+ named HTML entities and copy them.',
    description:
      'Search every named character reference in the HTML standard — &copy;, &nbsp;, &rarr;, &euro; and 1,500 more characters — by name, character or Unicode code point. Each one shows the named entity, decimal and hex references and the code point, all ready to copy.',
    title: 'HTML Entities List – Search & Copy Named, Decimal & Hex Codes',
    metaDescription:
      'Complete list of HTML entities: search by name, character or code point and copy &copy; &nbsp; &rarr; &euro; with decimal and hex codes. Arrows, math, currency, Greek.',
    keywords: [
      'html entities',
      'html entity list',
      'html symbols',
      'character entity reference',
      'nbsp',
      'html special characters',
      'unicode',
    ],
    relatedTools: [
      'html-entity-encoder',
      'unicode-character-explorer',
      'math-symbols',
      'special-characters',
      'ascii-table',
    ],
    component: 'html-entity-reference',
    howTo: [
      'Search by entity name (copy, rarr), the character itself (©) or its code point (U+00A9).',
      'Filter by category: symbols, currency, arrows, mathematical, punctuation, Latin, Greek or Cyrillic.',
      'Click an entity to see and copy the named, decimal and hexadecimal forms.',
    ],
    about: [
      'An HTML entity is a way to write a character using only ASCII: the named reference &copy;, the decimal reference &#169; and the hexadecimal reference &#xA9; all produce ©. The list here is the official set of 2,231 names from the WHATWG HTML standard, grouped by the character they produce (many characters have several names, such as &rarr; and &rightarrow;).',
      'In a UTF-8 page you can type most characters directly. Entities are still needed for the characters HTML itself uses — &lt; for <, &gt; for >, &amp; for & and &quot; inside attribute values — and they help for invisible characters like the non-breaking space (&nbsp;). To escape a whole block of text at once, use the HTML Entity Encoder.',
    ],
    faqs: [
      {
        q: 'What is &nbsp;?',
        a: 'A non-breaking space (U+00A0): it looks like a space but stops the browser from breaking the line there, so “10 kg” or “Mr. Smith” stay together.',
      },
      {
        q: 'Should I use named or numeric entities?',
        a: 'Both work in every modern browser. Named ones are easier to read; numeric ones work for any character, including those without a name.',
      },
      {
        q: 'Do entities need the semicolon?',
        a: 'Always include it. A few legacy names work without it, but omitting it can make the browser misread text that follows.',
      },
    ],
    variants: [
      {
        slug: 'html-arrow-entities',
        name: 'HTML Arrow Entities',
        title: 'HTML Arrow Entities – &rarr; &larr; &uarr; &darr; and More',
        metaDescription:
          'All HTML arrow entities with codes to copy: &rarr; → &larr; ← &uarr; ↑ &darr; ↓ &harr; ↔ &rArr; ⇒ and more, with decimal, hex and Unicode.',
        description:
          'Every arrow that has a named HTML entity — from &rarr; (→) and &larr; (←) to double arrows like &rArr; (⇒) and long arrows like &xrarr; (⟶) — with its decimal and hex references.',
        config: { init_category: 'arrows' },
        keywords: [
          'html arrow entity',
          'rarr',
          'html arrow code',
          'arrow symbol html',
        ],
      },
    ],
  },
  {
    slug: 'flexbox-playground',
    category: 'developer-tools',
    name: 'CSS Flexbox Playground',
    icon: '↔️',
    shortDescription: 'Build flexbox layouts visually and copy the CSS.',
    description:
      'Learn and build CSS flexbox layouts by clicking: change flex-direction, wrap, justify-content, align-items, align-content and gaps, tune each item’s flex-grow, flex-shrink, flex-basis, align-self and order, and copy the generated CSS.',
    title: 'CSS Flexbox Playground – Visual Flexbox Generator',
    metaDescription:
      'Interactive CSS flexbox playground: try justify-content, align-items, flex-wrap, gap and flex-grow on live boxes, resize the preview and copy clean CSS.',
    keywords: [
      'flexbox playground',
      'css flexbox',
      'flexbox generator',
      'justify-content',
      'align-items',
      'flexbox cheat sheet',
      'css',
    ],
    relatedTools: [
      'grid-playground',
      'css-unit-visualizer',
      'gradient-generator',
      'css-formatter',
      'color-palette-generator',
    ],
    component: 'flexbox-playground',
    howTo: [
      'Set the container properties on the left — direction, wrap, alignment and gaps.',
      'Click an item (or its number) to edit its flex-grow, flex-shrink, flex-basis, align-self and order.',
      'Drag “Preview width” to see how the layout responds to narrower screens.',
      'Copy the generated CSS, or press Randomize for an example to study.',
    ],
    about: [
      'Flexbox lays items out along one axis. flex-direction sets that main axis (row or column); justify-content spaces items along it, and align-items positions them on the cross axis. With flex-wrap: wrap, items move onto new lines when they run out of room, and align-content then spaces those lines.',
      'Each item’s flex shorthand — grow, shrink, basis — decides how it shares space: flex: 1 1 0 makes items equal widths, flex: 0 0 200px fixes a width. The generated CSS only includes properties that differ from the defaults, so it stays short.',
    ],
    faqs: [
      {
        q: 'How do I centre something with flexbox?',
        a: 'On the container: display: flex; justify-content: center; align-items: center; — and give it a height if you want vertical centring.',
      },
      {
        q: 'Flexbox or grid?',
        a: 'Flexbox for one dimension — a row of buttons, a navigation bar. Grid when you need rows and columns at the same time.',
      },
    ],
  },
  {
    slug: 'grid-playground',
    category: 'developer-tools',
    name: 'CSS Grid Playground',
    icon: '▦',
    shortDescription:
      'Build CSS grid layouts with numbered lines and copy the CSS.',
    description:
      'Build CSS grid layouts visually: set grid-template-columns and rows, gaps, alignment and auto-flow, place items with grid-column and grid-row using the numbered grid lines, start from examples like a dashboard or holy-grail page, and copy the CSS.',
    title: 'CSS Grid Playground – Visual Grid Layout Generator',
    metaDescription:
      'Interactive CSS grid generator: set grid-template-columns, rows and gaps, place items by line number or span, see numbered grid lines and copy the CSS.',
    keywords: [
      'css grid generator',
      'css grid playground',
      'grid-template-columns',
      'grid layout',
      'css grid',
      'css',
    ],
    relatedTools: [
      'flexbox-playground',
      'css-unit-visualizer',
      'css-formatter',
      'gradient-generator',
    ],
    component: 'grid-playground',
    howTo: [
      'Type the column and row templates, e.g. repeat(3, 1fr) or 200px 1fr.',
      'Set gaps, alignment and auto-flow.',
      'Click an item and set its grid-column and grid-row start and end — use the small line numbers, or values like span 2.',
      'Load an example layout, then copy the generated CSS.',
    ],
    about: [
      'CSS grid places items on rows and columns at once. grid-template-columns: repeat(3, 1fr) makes three equal columns; fr means a fraction of the free space, and minmax(120px, 1fr) with auto-fill makes as many columns as fit — a responsive gallery without media queries.',
      'Grid lines are numbered from 1 at the start edge. grid-column: 1 / 3 spans from line 1 to line 3 (two columns); span 2 does the same from wherever the item lands. The line numbers in the preview are read back from your browser, so they match exactly what the CSS produces.',
    ],
    faqs: [
      {
        q: 'What does 1fr mean?',
        a: 'One fraction of the remaining space. In 1fr 2fr, the second column gets twice the leftover width of the first.',
      },
      {
        q: 'What is the difference between auto-fill and auto-fit?',
        a: 'Both create as many tracks as fit. auto-fill keeps empty tracks; auto-fit collapses them so the items stretch to fill the row.',
      },
    ],
  },
  {
    slug: 'ascii-table',
    category: 'developer-tools',
    alsoIn: ['reference-tools'],
    name: 'ASCII Table',
    icon: '🔡',
    shortDescription:
      'All 128 ASCII codes in decimal, hex, octal, binary and HTML.',
    description:
      'The complete ASCII table: all 128 characters with decimal, hexadecimal, octal and binary values, HTML codes and names, with the 33 control characters such as NUL, TAB, LF, CR, ESC and DEL clearly labelled. Search by character, number or name and click any value to copy it.',
    title: 'ASCII Table – Codes in Decimal, Hex, Binary & HTML',
    metaDescription:
      'Full ASCII table of all 128 characters: decimal, hex, octal, binary and HTML codes, control characters (NUL, TAB, LF, CR, ESC, DEL) explained. Search and copy.',
    keywords: [
      'ascii table',
      'ascii code',
      'ascii chart',
      'ascii to hex',
      'ascii control characters',
      'ascii values',
    ],
    relatedTools: [
      'unicode-character-explorer',
      'number-base-converter',
      'text-to-binary',
      'html-entity-reference',
      'base64-encoder',
    ],
    component: 'ascii-table',
    howTo: [
      'Search for a character (A), a decimal (65), a hex value (0x41) or a name (escape, tab).',
      'Switch between all 128 codes, the control characters and the printable ones.',
      'Click any value in the table to copy it, or click a name for every representation.',
    ],
    about: [
      'ASCII (American Standard Code for Information Interchange) assigns the numbers 0–127 to English letters, digits, punctuation and 33 control codes. It fits in 7 bits, and the first 128 Unicode code points are identical to it, which is why ASCII text is also valid UTF-8.',
      'Codes 0–31 and 127 are control characters from the teleprinter era. A few still matter: 9 is TAB, 10 is LF (the line ending on Linux and macOS), 13 is CR (Windows ends lines with CR + LF), 27 is ESC (start of terminal colour codes) and 0 is NUL, the string terminator in C. Handy patterns: uppercase letters start at 65 and lowercase at 97, exactly 32 apart.',
    ],
    faqs: [
      {
        q: 'What is the ASCII code for A?',
        a: '65 in decimal, 0x41 in hex, 101 in octal and 1000001 in binary. Lowercase a is 97 (0x61).',
      },
      {
        q: 'Is ASCII the same as Unicode?',
        a: 'ASCII is the first 128 code points of Unicode. Unicode extends it to over 150,000 characters, including accented letters, other scripts and emoji.',
      },
      {
        q: 'What is “extended ASCII”?',
        a: 'Several different 8-bit code pages (such as Windows-1252 and ISO-8859-1) that use 128–255 for extra characters. They are not part of ASCII itself and disagree with each other, which is why UTF-8 replaced them.',
      },
    ],
    variants: [
      {
        slug: 'ascii-control-characters',
        name: 'ASCII Control Characters',
        title: 'ASCII Control Characters – NUL, TAB, LF, CR, ESC & DEL',
        metaDescription:
          'All 33 ASCII control characters (0–31 and 127) with names, decimal, hex, caret notation and escape sequences: NUL, BEL, TAB, LF, CR, ESC, DEL.',
        description:
          'The 33 non-printing ASCII control codes — 0 to 31 and 127 — with their abbreviations, names, hex values, caret notation (^M) and escape sequences such as \\n, \\r and \\t.',
        config: { init_section: 'control' },
        keywords: [
          'ascii control characters',
          'control codes',
          'nul character',
          'crlf',
          'escape character',
        ],
      },
    ],
  },
  {
    slug: 'box-shadow-generator',
    category: 'developer-tools',
    name: 'CSS Box Shadow Generator',
    icon: '🔲',
    shortDescription: 'Layer CSS box-shadows visually and copy the code.',
    description:
      'Build CSS box-shadow values by eye: set the X and Y offset, blur, spread, colour, opacity and inset for each layer, stack several shadows and reorder them, try presets like soft, layered or neumorphic, and copy the finished box-shadow declaration.',
    title: 'CSS Box Shadow Generator – Layered Shadows with Live Preview',
    metaDescription:
      'Free CSS box-shadow generator: tune offset, blur, spread, colour and opacity, stack and reorder layers, add inset shadows, preview on any background and copy CSS.',
    keywords: [
      'box shadow generator',
      'css box shadow',
      'box-shadow',
      'css shadow generator',
      'inset shadow',
      'neumorphism css',
      'layered shadow',
    ],
    relatedTools: [
      'border-radius-generator',
      'gradient-generator',
      'css-transform-playground',
      'color-picker',
      'css-formatter',
    ],
    component: 'box-shadow',
    howTo: [
      'Pick a preset or start from the default soft shadow.',
      'Adjust the offsets, blur, spread, colour and opacity with the sliders or type exact pixel values.',
      'Add more layers with “Add shadow”, choose one with the number buttons and move it up or down — layer 1 is drawn on top.',
      'Change the preview background and card colour to check the shadow in context, then copy the CSS.',
    ],
    about: [
      'box-shadow takes one or more comma-separated shadows, each written as x-offset y-offset blur spread colour, with an optional inset keyword. Positive offsets move the shadow right and down; blur softens its edge and spread grows or shrinks it before blurring. The first shadow in the list is painted on top.',
      'Realistic shadows usually combine several layers with low opacity — a tight, darker one for contact and wider, fainter ones for distance. The generator writes colours as rgba() so opacity is kept separate from the colour, and omits zero spread and blur so the output stays short.',
    ],
    faqs: [
      {
        q: 'What is the difference between blur and spread?',
        a: 'Spread changes the size of the shadow shape before it is blurred: positive values grow it, negative values shrink it. Blur only softens the edge. A negative spread with a large blur gives a shadow that only shows below the element.',
      },
      {
        q: 'How do I put a shadow on only one side?',
        a: 'Offset the shadow towards that side and use a negative spread about the size of the blur, for example box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.4) for the bottom edge.',
      },
      {
        q: 'Does box-shadow affect layout or performance?',
        a: 'It never changes layout — the shadow takes no space and isn’t part of the box size. Very large blurs on many elements, or animating box-shadow directly, can be slow; animate the opacity of a pseudo-element that carries the shadow instead.',
      },
      {
        q: 'Why doesn’t my shadow follow a transparent PNG’s shape?',
        a: 'box-shadow always follows the element’s box and border-radius. For the outline of an image’s visible pixels use filter: drop-shadow() instead.',
      },
    ],
  },
  {
    slug: 'border-radius-generator',
    category: 'developer-tools',
    name: 'CSS Border Radius Generator',
    icon: '⬭',
    shortDescription: 'Shape corners with draggable handles and copy CSS.',
    description:
      'Create any border-radius visually: drag the corner handles or set each corner exactly, link or unlink the four corners, switch to elliptical radii for blob and egg shapes, work in px or %, and copy the shortest valid border-radius CSS.',
    title: 'CSS Border Radius Generator – Drag Corners, Blobs & Ellipses',
    metaDescription:
      'Visual CSS border-radius generator: drag corner handles, link or unlink corners, set elliptical radii for blob shapes, use px or %, and copy the shortest CSS.',
    keywords: [
      'border radius generator',
      'css border radius',
      'border-radius',
      'rounded corners css',
      'css blob shape',
      'elliptical border radius',
      'fancy border radius',
    ],
    relatedTools: [
      'box-shadow-generator',
      'clip-path-generator',
      'gradient-generator',
      'css-unit-visualizer',
      'flexbox-playground',
    ],
    component: 'border-radius',
    howTo: [
      'Drag a white handle along the edge of the preview to round that corner, or use the sliders and number boxes.',
      'Untick “Link all corners” to set each corner separately.',
      'Turn on elliptical corners to set horizontal and vertical radii independently — handles appear on both edges of each corner.',
      'Pick px or %, try a preset like Blob or Leaf, then copy the CSS.',
    ],
    about: [
      'border-radius sets the curve of each corner in the order top-left, top-right, bottom-right, bottom-left. One value rounds all four; two values set the diagonals; three or four set corners individually. A slash separates horizontal radii from vertical ones, so border-radius: 30% 70% 70% 30% / 30% 30% 70% 70% gives each corner an elliptical curve — the trick behind organic blob shapes.',
      'Percentages are relative to the box: horizontal radii to its width and vertical radii to its height, which is why 50% makes a circle from a square and an ellipse from a rectangle. When adjacent radii add up to more than the side length, the browser scales all of them down proportionally; that’s why a huge value like 9999px makes a perfect pill.',
    ],
    faqs: [
      {
        q: 'How do I make a pill-shaped button?',
        a: 'Use a length larger than half the button’s height, such as border-radius: 9999px. Unlike 50%, it keeps the sides straight and the ends perfectly round at any width.',
      },
      {
        q: 'What does the slash in border-radius mean?',
        a: 'Values before the slash are the horizontal radii and values after it the vertical radii of each corner, so every corner can be a quarter-ellipse rather than a quarter-circle.',
      },
      {
        q: 'Why does the generated CSS have fewer values than corners?',
        a: 'The tool writes the shortest equivalent form: four equal corners become one value, matching diagonals become two, and a matching top-right and bottom-left become three — exactly how the shorthand expands back.',
      },
    ],
  },
  {
    slug: 'clip-path-generator',
    category: 'developer-tools',
    name: 'CSS Clip-Path Generator',
    icon: '✂️',
    shortDescription: 'Draw clip-path polygons, circles and insets.',
    description:
      'Make CSS clip-path shapes visually: click to add polygon points, drag them into place, snap to a grid and fine-tune coordinates, or switch to circle, ellipse and inset. Start from presets like a star, arrow or message bubble and copy clean clip-path CSS.',
    title: 'CSS Clip-Path Generator – Polygon Editor, Circle & Inset',
    metaDescription:
      'Free CSS clip-path maker: click to add polygon points, drag and snap them to a grid, or use circle, ellipse and inset shapes. Star, arrow and hexagon presets included.',
    keywords: [
      'clip path generator',
      'css clip-path',
      'clip-path polygon',
      'css polygon generator',
      'css shapes',
      'clippy',
      'clip-path circle',
    ],
    relatedTools: [
      'border-radius-generator',
      'css-transform-playground',
      'gradient-generator',
      'image-cropper',
      'box-shadow-generator',
    ],
    component: 'clip-path',
    howTo: [
      'Choose a shape: polygon, circle, ellipse or inset.',
      'For polygons, pick a preset or click empty space on the preview to add a point on the nearest edge; drag points to move them.',
      'Turn on grid snapping for tidy values, or type exact x and y percentages in the point list. Select a point and press Delete to remove it.',
      'For circle, ellipse and inset, use the sliders (or drag the centre handle), then copy the CSS.',
    ],
    about: [
      'clip-path hides every part of an element outside a shape, without changing its layout box. polygon() takes a list of x y points — percentages of the element’s width and height — joined in order and closed automatically. circle() and ellipse() take radii and a centre after the at keyword; inset() cuts in from each edge like margins and can round the corners.',
      'Because the coordinates are percentages, the same clip-path works at any element size. Shapes with the same number of points can be animated smoothly with a CSS transition on clip-path, which is how many hover reveals are built.',
    ],
    faqs: [
      {
        q: 'Does clip-path work in all browsers?',
        a: 'Basic shapes — polygon, circle, ellipse and inset — work unprefixed in all current browsers. Very old Safari versions needed -webkit-clip-path.',
      },
      {
        q: 'Can I animate a clip-path?',
        a: 'Yes, between two shapes of the same type; polygons must have the same number of points. Add duplicate points to the simpler shape if needed.',
      },
      {
        q: 'Why is my box-shadow gone after clipping?',
        a: 'clip-path also clips the shadow, because it sits outside the shape. Put the clip-path on an inner element and use filter: drop-shadow() on a wrapper instead.',
      },
      {
        q: 'Does clip-path change what is clickable?',
        a: 'Yes. The clipped-away area no longer receives clicks or hover, so the interactive area matches the visible shape.',
      },
    ],
  },
  {
    slug: 'css-transform-playground',
    category: 'developer-tools',
    name: 'CSS Transform Playground',
    icon: '🔄',
    shortDescription: 'Translate, rotate, scale and skew a box, copy CSS.',
    description:
      'Experiment with CSS transforms on a live box: drag it to translate, spin the handle to rotate, scale and skew it, move the transform-origin and try 3D rotation with perspective. The tool writes only the functions you changed, plus the equivalent matrix().',
    title: 'CSS Transform Playground – Rotate, Scale, Skew & Matrix',
    metaDescription:
      'Interactive CSS transform generator: drag to translate, rotate with a handle, scale, skew, set transform-origin and 3D perspective, then copy the CSS and matrix().',
    keywords: [
      'css transform generator',
      'css transform',
      'transform rotate',
      'transform-origin',
      'css skew',
      'css matrix',
      'css 3d transform',
    ],
    relatedTools: [
      'box-shadow-generator',
      'border-radius-generator',
      'clip-path-generator',
      'flexbox-playground',
      'css-unit-visualizer',
    ],
    component: 'css-transform',
    howTo: [
      'Drag the box to move it, or use the Translate sliders. Tab to the box and use the arrow keys for keyboard moves.',
      'Drag the ↻ handle to rotate (or focus it and press the arrow keys), and set scale and skew with the sliders.',
      'Pick a transform-origin from the 3 × 3 grid or type custom percentages; the red dot shows where it is.',
      'Tick 3D rotation for rotateX, rotateY and perspective, then copy the CSS — Randomize gives an example to study.',
    ],
    about: [
      'transform changes how an element is drawn without affecting the layout around it: translate() moves it, rotate() turns it, scale() resizes it and skew() slants it. Functions are applied from left to right, so translate(50px) rotate(45deg) moves first and then rotates in place, while rotate(45deg) translate(50px) moves along the rotated axis.',
      'Every 2D transform list collapses to one matrix(a, b, c, d, e, f), and 3D ones to matrix3d() with 16 numbers. The playground shows that equivalent so you can see what the browser actually computes. transform-origin sets the fixed point for rotation, scaling and skewing; it defaults to the centre.',
    ],
    faqs: [
      {
        q: 'Does the order of transform functions matter?',
        a: 'Yes. Each function works in the coordinate system left by the previous one, so rotating before translating moves the element along a rotated direction. This tool writes translate, rotate, scale, skew in that order.',
      },
      {
        q: 'Why use transform instead of top and left to move things?',
        a: 'Transforms don’t trigger layout, and browsers can composite them on the GPU, so animations stay smooth. Changing top or left reflows the page on every frame.',
      },
      {
        q: 'Why doesn’t my 3D rotation look 3D?',
        a: 'Without perspective a 3D rotation is drawn flat and just looks squashed. Add perspective() at the start of the transform, as this tool does, or set perspective on the parent element.',
      },
    ],
  },
  {
    slug: 'css-specificity-calculator',
    category: 'developer-tools',
    name: 'CSS Specificity Calculator',
    icon: '🎯',
    shortDescription: 'Calculate and compare CSS selector specificity.',
    description:
      'Paste CSS selectors to see their specificity as (a, b, c): IDs, then classes, attributes and pseudo-classes, then elements and pseudo-elements. Each part is highlighted and explained, :is(), :not(), :has(), :where() and :nth-child(… of S) follow Selectors Level 4, and a ranking shows which rule wins.',
    title: 'CSS Specificity Calculator – Compare Selectors (a, b, c)',
    metaDescription:
      'Calculate CSS specificity for any selector: see the (a, b, c) score, which parts count, Level 4 rules for :is(), :not(), :has() and :where(), and which selector wins.',
    keywords: [
      'css specificity calculator',
      'specificity calculator',
      'css specificity',
      'selector specificity',
      'css selector weight',
      'specificity :is :where',
      'which css rule wins',
    ],
    relatedTools: [
      'css-formatter',
      'flexbox-playground',
      'grid-playground',
      'regex-tester',
      'css-unit-visualizer',
    ],
    component: 'css-specificity',
    howTo: [
      'Type or paste selectors, one per line. Selector lists separated by commas are split into separate entries, and pasted { declarations } are ignored.',
      'Read each selector’s (a, b, c) score and the parts that count in each column, colour-coded and labelled.',
      'Use the ranking to see which selector is most specific; equal scores are broken by source order.',
      'Load the Level 4 example to see how :is(), :not(), :has() and :where() are counted.',
    ],
    about: [
      'When several rules set the same property on an element, the browser picks the one with the highest specificity, compared column by column. Column A counts ID selectors; column B counts classes, attribute selectors and pseudo-classes; column C counts type selectors and pseudo-elements. The universal selector * and combinators (space, >, +, ~) count nothing. A single ID beats any number of classes.',
      'Selectors Level 4 added rules for functional pseudo-classes: :is(), :not() and :has() take the specificity of their most specific argument, :where() always counts zero, and :nth-child(2n of .item) counts as one pseudo-class plus its most specific selector. Old single-colon pseudo-elements like :before still count as elements. Inline style attributes and !important sit above all selector specificity.',
    ],
    faqs: [
      {
        q: 'What is the specificity of #app .card:hover > button?',
        a: '(1, 2, 1): one ID (#app), one class plus one pseudo-class (.card and :hover), and one element (button). The > combinator adds nothing.',
      },
      {
        q: 'What happens when two selectors have the same specificity?',
        a: 'The one that appears later in the stylesheet (or in a later stylesheet) wins. Cascade layers and !important are checked before specificity.',
      },
      {
        q: 'Why use :where()?',
        a: 'It always has zero specificity, so styles inside it are easy to override. That makes it ideal for resets and library defaults.',
      },
      {
        q: 'Does :not() add specificity?',
        a: 'The :not() itself adds nothing, but its most specific argument does: :not(#nav) counts as an ID and :not(.a, p) counts as one class.',
      },
    ],
  },
  {
    slug: 'typography-playground',
    category: 'developer-tools',
    alsoIn: ['text-tools'],
    name: 'Typography Playground',
    icon: '🔤',
    shortDescription: 'Tune font, size, spacing and line length, copy CSS.',
    description:
      'Test typography on your own text: choose a system font stack, then adjust size, weight, line height, letter and word spacing, alignment, case, colours and line length. Preview at phone, tablet and desktop widths, check the contrast ratio and copy the CSS.',
    title: 'Typography Playground – Test Font Size, Line Height & Spacing',
    metaDescription:
      'Try font size, weight, line height, letter spacing and line length on your own text with system font stacks, preview mobile to desktop, check contrast and copy CSS.',
    keywords: [
      'typography playground',
      'font tester',
      'line height calculator',
      'letter spacing css',
      'font size preview',
      'web safe fonts',
      'css typography generator',
    ],
    relatedTools: [
      'contrast-checker',
      'css-unit-visualizer',
      'word-counter',
      'css-formatter',
      'color-picker',
    ],
    component: 'typography',
    howTo: [
      'Type your own text or load a sample: heading and paragraph, a long article paragraph or UI labels.',
      'Pick a font stack and adjust size (px or rem), weight, line height, letter spacing, word spacing, alignment and text transform.',
      'Set the text and background colours and watch the contrast ratio and its pass or fail label.',
      'Set the container width in ch or px, switch between 375, 768 and 1200 px previews, then copy the CSS.',
    ],
    about: [
      'Readable body text depends on a few settings working together. Sizes of 16–20px suit most screens; line height around 1.5 gives lines room without breaking the paragraph apart; and a line length of about 45–75 characters — roughly 60–70ch — keeps the eye from getting lost. Letter spacing is best kept at normal for body text, with small positive values for all-caps labels.',
      'Every font here is a system stack: a list of fonts already installed on most devices, ending in a generic family like sans-serif. Nothing is downloaded, so pages load fast and the preview shows exactly what your visitors’ devices will render. The contrast ratio uses the WCAG formula; normal text needs 4.5:1 for AA and large text 3:1.',
    ],
    faqs: [
      {
        q: 'Should I use px or rem for font size?',
        a: 'rem respects the reader’s browser font-size setting, so it is the better default for text. 1rem is 16px unless the user or your CSS changes the root size.',
      },
      {
        q: 'What line height should body text use?',
        a: 'Usually 1.4 to 1.7, written without a unit so it scales with the font size. Headings can be tighter, around 1.1 to 1.3.',
      },
      {
        q: 'What does the ch unit mean for max-width?',
        a: '1ch is the width of the digit 0 in the current font, so max-width: 65ch keeps lines at roughly 65 characters whatever the font size.',
      },
      {
        q: 'Why doesn’t a weight like 300 change anything?',
        a: 'Many system fonts only include regular and bold. If a weight isn’t installed, the browser uses the nearest available one.',
      },
    ],
  },
  {
    slug: 'svg-path-editor',
    category: 'developer-tools',
    alsoIn: ['image-tools'],
    name: 'SVG Path Editor',
    icon: '✒️',
    shortDescription: 'Draw and edit SVG paths visually, copy the d code.',
    description:
      'Edit SVG paths by dragging points on a grid: add lines, quadratic and cubic Bézier curves, move their control handles, close the path and style the stroke and fill. Paste any existing path d attribute to load it, then copy the cleaned-up absolute path data or download a complete SVG file.',
    title: 'SVG Path Editor – Draw & Edit SVG Path d Visually',
    metaDescription:
      'Free visual SVG path editor: drag points and Bézier handles, paste a d attribute to edit, convert relative commands to absolute and copy the path or download the SVG.',
    keywords: [
      'svg path editor',
      'svg path builder',
      'svg path d',
      'svg path visualizer',
      'bezier path editor',
      'svg path generator',
      'edit svg path online',
    ],
    relatedTools: [
      'bezier-curve-visualizer',
      'svg-optimizer',
      'svg-to-png',
      'pixel-art-editor',
      'favicon-generator',
    ],
    component: 'svg-path',
    howTo: [
      'Start from the heart example, or paste your own path data into “Paste path data” and press Load path.',
      'Drag the circles (end points) and diamonds (Bézier control points). Tab to a point and use the arrow keys for precise moves, or type exact x and y values.',
      'Pick a segment type and press Add at end or Insert after selected; Delete selected removes a segment. Tick Close path to add Z.',
      'Set the viewBox size, grid and snapping, stroke and fill, then copy the path d value or the full SVG, or download it as a file.',
    ],
    about: [
      'An SVG path is described by its d attribute: a list of commands such as M (move to), L (line to), Q (quadratic Bézier), C (cubic Bézier), A (arc) and Z (close). Capital letters use absolute coordinates and lower-case letters are relative to the previous point; H and V draw horizontal and vertical lines, and S and T continue a curve by mirroring the previous control point.',
      'This editor parses every command and turns the path into explicit absolute segments, so each point can be dragged. Arcs are kept as arcs with editable radii and flags. The output is rounded to the number of decimals you choose, which also makes it a quick way to tidy or normalise path data copied from a design tool. Everything happens in your browser.',
    ],
    faqs: [
      {
        q: 'Can I edit a path from an existing SVG file?',
        a: 'Yes. Copy the value of the path’s d attribute (the text inside d="…"), paste it into the paste box and press Load path. Relative commands and H, V, S and T shorthands are converted to absolute L, C and Q segments.',
      },
      {
        q: 'What is the difference between quadratic and cubic Bézier curves?',
        a: 'A quadratic curve (Q) has one control point that both ends bend towards; a cubic curve (C) has two, one for each end, so it can form S-shapes and gives finer control. Most design tools export cubic curves.',
      },
      {
        q: 'Why does my pasted path look different after loading?',
        a: 'It shouldn’t look different, but the code will: shorthand and relative commands become absolute ones and numbers are rounded to the decimals you chose. If a command can’t be read, an error tells you where.',
      },
      {
        q: 'How do I make the path fit my icon size?',
        a: 'Set the viewBox width and height to your artboard size (for example 24 × 24 for icons), choose a grid size such as 1 and enable snapping so points land on whole units.',
      },
    ],
  },
  {
    slug: 'json-viewer',
    category: 'developer-tools',
    name: 'JSON Viewer & Tree Explorer',
    icon: '🌳',
    shortDescription: 'Explore JSON as a collapsible tree and copy paths.',
    description:
      'Paste JSON or open a .json file to explore it as a collapsible tree: see each value’s type, array lengths and key counts, search keys and values, and copy any node’s value, JSON path (like users[0].profile.name) or pretty-printed subtree.',
    title: 'JSON Viewer – Explore JSON as a Tree & Copy JSON Paths',
    metaDescription:
      'Free online JSON viewer: explore JSON as an expandable tree, search keys and values, see types and sizes, and copy values, JSON paths or subtrees. Runs locally.',
    keywords: [
      'json viewer',
      'json tree viewer',
      'json explorer',
      'json path finder',
      'json tree',
      'view json online',
      'jsonpath',
    ],
    relatedTools: [
      'json-formatter',
      'json-validator',
      'json-diff',
      'json-to-typescript',
      'json-to-yaml',
    ],
    component: 'json-viewer',
    handlesFiles: true,
    howTo: [
      'Paste JSON into the box, open a .json file, or press Sample to try it.',
      'Click the arrows (or use the arrow keys) to open objects and arrays; Expand all, Collapse all and Expand to depth open many levels at once.',
      'Type in Search to highlight matching keys and values; Next and Prev jump between matches and open their parents.',
      'Select a node and copy its value, its JSON path or the whole subtree as formatted JSON.',
    ],
    about: [
      'A JSON viewer shows a document as a tree instead of a wall of text, so you can see its shape at a glance: every object shows how many keys it has, every array how many items, and every value is labelled as a string, number, boolean or null.',
      'Paths are written the way you would type them in JavaScript — users[0].profile.name — with keys that aren’t valid identifiers in brackets, like ["first name"]. Turn on the $ option for JSONPath style ($.users[0].profile.name) used by tools such as jq-like filters, Postman tests and JSONPath libraries.',
      'Big files stay responsive because only the rows you can see are drawn and children are built only when their parent is opened. Invalid JSON is reported with the line and column of the first error, and everything — including files you open — stays in your browser.',
    ],
    faqs: [
      {
        q: 'How do I get the path to a value in JSON?',
        a: 'Click the value in the tree (or search for it), then press Copy JSON path. You get a path like orders[2].items[0].sku that you can paste into code, or $.orders[2].items[0].sku with the JSONPath option on.',
      },
      {
        q: 'Can it open large JSON files?',
        a: 'Yes — files of several megabytes work because the tree only renders the rows on screen. Expand all stops after the first 2,000 objects and arrays on huge documents; use search or open branches one by one to go deeper.',
      },
      {
        q: 'Why does it say my JSON is invalid?',
        a: 'Common causes are trailing commas, single quotes, comments or unquoted keys — all allowed in JavaScript but not in JSON. The error shows the line and column where parsing stopped, which is usually right after the real mistake.',
      },
      {
        q: 'Is my JSON uploaded anywhere?',
        a: 'No. Parsing, searching and copying all happen in your browser; opened files are read locally and never sent to a server.',
      },
    ],
  },
  {
    slug: 'http-request-builder',
    category: 'developer-tools',
    name: 'HTTP Request Builder',
    icon: '📮',
    shortDescription: 'Build HTTP requests and get cURL, fetch & Python code.',
    description:
      'Build an HTTP request visually — method, URL, query parameters, headers, JSON or form body and auth — and get ready-to-run code for cURL, JavaScript fetch, Axios, Python requests, Node.js, HTTPie and PowerShell, with correct quoting for each.',
    title: 'HTTP Request Builder – Generate cURL, Fetch, Axios & Python Code',
    metaDescription:
      'Build HTTP requests visually and copy code for cURL, fetch, Axios, Python requests, Node.js, HTTPie and PowerShell. Query params, headers, JSON and auth.',
    keywords: [
      'http request builder',
      'curl generator',
      'curl command builder',
      'fetch code generator',
      'convert request to python requests',
      'axios generator',
      'api request builder',
      'httpie',
    ],
    relatedTools: [
      'url-parser',
      'url-encoder',
      'http-status-codes',
      'json-formatter',
      'base64-encoder',
      'jwt-decoder',
    ],
    component: 'http-request',
    howTo: [
      'Pick the method and enter the URL — its query string fills the parameters table, and editing the table updates the URL.',
      'Add headers, choose a body type (JSON, form, raw text or multipart text fields) and optionally a Bearer token or Basic login.',
      'Choose a language tab — cURL, fetch, Axios, Python, Node.js, HTTPie or PowerShell — and copy the code.',
      'Run the code in your terminal or project. The builder itself never sends the request.',
    ],
    about: [
      "The request builder turns a form into code. Content-Type is set for you from the body type (unless you set one), Basic auth is base64-encoded into an Authorization header, and query parameters are percent-encoded. Each language gets its own escaping: single quotes in shell commands become '\\'', JavaScript and Python strings escape quotes, backslashes and line breaks, so values containing quotes, $ signs, newlines or emoji paste safely.",
      'It deliberately doesn’t send requests. Browsers enforce CORS: a page on one site can only call another site’s API if that API explicitly allows it, so a browser-based sender either fails for most APIs or needs a proxy server that would see your data and tokens. Generating code keeps everything on your device.',
    ],
    faqs: [
      {
        q: 'Why can’t this tool send the request for me?',
        a: 'Browsers block cross-origin requests unless the target API allows them via CORS headers, and most APIs don’t. Getting around that would need a proxy server that sees your data and tokens, so the builder only writes the code for you to run.',
      },
      {
        q: 'Are my tokens and passwords saved?',
        a: 'No. Nothing is stored or sent anywhere — values live only in this tab’s memory and disappear when you close it. Remember that the generated code contains them, so be careful where you paste it.',
      },
      {
        q: 'How do I send JSON with cURL?',
        a: "Choose the JSON body type: the cURL tab adds -H 'Content-Type: application/json' and --data-raw with your JSON, quoted so it survives the shell. --data-raw also makes cURL use POST unless you choose another method.",
      },
      {
        q: 'Can I upload a file with multipart?',
        a: 'The builder writes text fields only, because a web page can’t embed your local files into code. Add a file part by hand, for example -F \'file=@photo.jpg\' in cURL or files={"file": open("photo.jpg", "rb")} in Python.',
      },
    ],
  },
];
