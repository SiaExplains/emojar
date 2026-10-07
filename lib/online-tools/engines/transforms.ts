// Text-in / text-out transforms behind the generic TextTransformTool. Each
// tool in the registry points at one of these by id. Heavy libraries are
// imported lazily so they only load on the page that needs them.

import type { Plugin } from 'prettier';
import {
  ToolInputError,
  base64ToUtf8,
  csvToJson,
  formatJson,
  formatXml,
  jsonToCsv,
  minifyJson,
  minifyXml,
  urlDecode,
  urlEncode,
  utf8ToBase64,
  validateJson,
} from './data';
import {
  convertCase,
  isMorse,
  morseToText,
  removeDuplicateLines,
  removeEmptyLines,
  sortLines,
  textToMorse,
  type SortMode,
} from './text';

export type TransformOption =
  | {
      id: string;
      label: string;
      type: 'select';
      choices: { value: string; label: string }[];
      default: string;
    }
  | { id: string; label: string; type: 'checkbox'; default: boolean };

export type TransformValues = Record<string, string | boolean>;

export type TransformDefinition = {
  inputLabel: string;
  outputLabel: string;
  actionLabel: string;
  placeholder: string;
  sample: string;
  /** File extension for the download button, without the dot. */
  outputExt: string;
  /** Re-run on every keystroke (cheap transforms only). */
  live: boolean;
  options?: TransformOption[];
  /** Output is a status message rather than data (validators). */
  statusOnly?: boolean;
  run: (input: string, opts: TransformValues) => string | Promise<string>;
};

const indentOption: TransformOption = {
  id: 'indent',
  label: 'Indent',
  type: 'select',
  choices: [
    { value: '2', label: '2 spaces' },
    { value: '4', label: '4 spaces' },
    { value: 'tab', label: 'Tab' },
  ],
  default: '2',
};

const delimiterOption: TransformOption = {
  id: 'delimiter',
  label: 'Delimiter',
  type: 'select',
  choices: [
    { value: ',', label: 'Comma (,)' },
    { value: ';', label: 'Semicolon (;)' },
    { value: '\\t', label: 'Tab' },
    { value: '|', label: 'Pipe (|)' },
  ],
  default: ',',
};

const SAMPLE_JSON =
  '{"name":"Emojar","tools":["JSON Formatter","Word Counter"],"free":true,"version":2,"meta":{"private":true,"uploads":null}}';

async function prettierFormat(
  input: string,
  parser: 'babel' | 'html' | 'css',
  opts: TransformValues,
) {
  if (!input.trim())
    throw new ToolInputError('Please enter some code to format.');
  const prettier = await import('prettier/standalone');
  const plugins = (parser === 'babel'
    ? [
        await import('prettier/plugins/babel'),
        await import('prettier/plugins/estree'),
      ]
    : parser === 'html'
      ? [
          await import('prettier/plugins/html'),
          await import('prettier/plugins/postcss'),
          await import('prettier/plugins/babel'),
          await import('prettier/plugins/estree'),
        ]
      : [await import('prettier/plugins/postcss')]) as unknown as Plugin[];
  try {
    return await prettier.format(input, {
      parser,
      plugins,
      tabWidth: opts.indent === '4' ? 4 : 2,
      useTabs: opts.indent === 'tab',
      singleQuote: opts.quotes === 'single',
      printWidth: 80,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message.split('\n')[0] : '';
    throw new ToolInputError(`The code could not be parsed. ${msg}`.trim());
  }
}

export const TRANSFORMS: Record<string, TransformDefinition> = {
  'json-format': {
    inputLabel: 'JSON input',
    outputLabel: 'Formatted JSON',
    actionLabel: 'Format JSON',
    placeholder: 'Paste JSON here…',
    sample: SAMPLE_JSON,
    outputExt: 'json',
    live: false,
    options: [
      indentOption,
      {
        id: 'sortKeys',
        label: 'Sort keys A–Z',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) =>
      formatJson(input, {
        indent: o.indent === 'tab' ? 'tab' : Number(o.indent ?? 2),
        sortKeys: !!o.sortKeys,
      }),
  },
  'json-validate': {
    inputLabel: 'JSON input',
    outputLabel: 'Validation result',
    actionLabel: 'Validate JSON',
    placeholder: 'Paste JSON here…',
    sample: '{"name": "Emojar", "valid": true,}',
    outputExt: 'txt',
    live: true,
    statusOnly: true,
    run: (input) => {
      const r = validateJson(input);
      if (!r.valid) throw new ToolInputError(r.message);
      const v = r.value;
      const kind = Array.isArray(v)
        ? `an array with ${v.length} item(s)`
        : v === null
          ? 'null'
          : typeof v === 'object'
            ? `an object with ${Object.keys(v as object).length} key(s)`
            : `a ${typeof v}`;
      return `✓ Valid JSON — the document is ${kind}.`;
    },
  },
  'json-minify': {
    inputLabel: 'JSON input',
    outputLabel: 'Minified JSON',
    actionLabel: 'Minify JSON',
    placeholder: 'Paste JSON here…',
    sample: JSON.stringify(JSON.parse(SAMPLE_JSON), null, 2),
    outputExt: 'json',
    live: true,
    run: (input) => minifyJson(input),
  },
  'json-to-yaml': {
    inputLabel: 'JSON input',
    outputLabel: 'YAML output',
    actionLabel: 'Convert to YAML',
    placeholder: 'Paste JSON here…',
    sample: SAMPLE_JSON,
    outputExt: 'yaml',
    live: true,
    run: async (input) => {
      const r = validateJson(input);
      if (!r.valid) throw new ToolInputError(r.message);
      const { stringify } = await import('yaml');
      return stringify(r.value);
    },
  },
  'yaml-to-json': {
    inputLabel: 'YAML input',
    outputLabel: 'JSON output',
    actionLabel: 'Convert to JSON',
    placeholder: 'Paste YAML here…',
    sample:
      'name: Emojar\ntools:\n  - JSON Formatter\n  - Word Counter\nfree: true\n',
    outputExt: 'json',
    live: true,
    options: [indentOption],
    run: async (input, o) => {
      if (!input.trim()) throw new ToolInputError('Please enter some YAML.');
      const { parse } = await import('yaml');
      let value: unknown;
      try {
        value = parse(input);
      } catch (e) {
        const msg = e instanceof Error ? e.message.split('\n')[0] : '';
        throw new ToolInputError(`Invalid YAML: ${msg}`);
      }
      return JSON.stringify(
        value,
        null,
        o.indent === 'tab' ? '\t' : Number(o.indent ?? 2),
      );
    },
  },
  'json-to-csv': {
    inputLabel: 'JSON input (array of objects)',
    outputLabel: 'CSV output',
    actionLabel: 'Convert to CSV',
    placeholder: '[{"name":"Ada","age":36}]',
    sample:
      '[{"name":"Ada Lovelace","born":1815,"field":"Mathematics"},{"name":"Alan Turing","born":1912,"field":"Computer science"}]',
    outputExt: 'csv',
    live: true,
    options: [delimiterOption],
    run: (input, o) =>
      jsonToCsv(input, { delimiter: String(o.delimiter ?? ',') }),
  },
  'csv-to-json': {
    inputLabel: 'CSV input',
    outputLabel: 'JSON output',
    actionLabel: 'Convert to JSON',
    placeholder: 'name,age\nAda,36',
    sample:
      'name,born,field\nAda Lovelace,1815,Mathematics\nAlan Turing,1912,"Computer science"',
    outputExt: 'json',
    live: true,
    options: [
      delimiterOption,
      {
        id: 'header',
        label: 'First row is a header',
        type: 'checkbox',
        default: true,
      },
      {
        id: 'inferTypes',
        label: 'Detect numbers & booleans',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      csvToJson(input, {
        delimiter: String(o.delimiter ?? ','),
        header: o.header !== false,
        inferTypes: o.inferTypes !== false,
      }),
  },
  'xml-format': {
    inputLabel: 'XML input',
    outputLabel: 'Formatted XML',
    actionLabel: 'Format XML',
    placeholder: 'Paste XML here…',
    sample:
      '<?xml version="1.0"?><catalog><tool id="1"><name>XML Formatter</name><free>true</free></tool><tool id="2"><name>JSON Formatter</name></tool></catalog>',
    outputExt: 'xml',
    live: false,
    options: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        choices: [
          { value: '2', label: 'Beautify (2 spaces)' },
          { value: '4', label: 'Beautify (4 spaces)' },
          { value: 'minify', label: 'Minify' },
        ],
        default: '2',
      },
    ],
    run: (input, o) =>
      o.mode === 'minify'
        ? minifyXml(input)
        : formatXml(input, Number(o.mode ?? 2)),
  },
  'html-format': {
    inputLabel: 'HTML input',
    outputLabel: 'Formatted HTML',
    actionLabel: 'Format HTML',
    placeholder: 'Paste HTML here…',
    sample:
      '<!doctype html><html><head><title>Demo</title></head><body><main><h1>Hello</h1><p>Formatted <b>locally</b>.</p></main></body></html>',
    outputExt: 'html',
    live: false,
    options: [indentOption],
    run: (input, o) => prettierFormat(input, 'html', o),
  },
  'css-format': {
    inputLabel: 'CSS input',
    outputLabel: 'Formatted CSS',
    actionLabel: 'Format CSS',
    placeholder: 'Paste CSS here…',
    sample:
      '.card{display:flex;gap:8px;padding:16px}.card:hover{box-shadow:0 1px 3px rgba(0,0,0,.2)}@media (max-width:600px){.card{flex-direction:column}}',
    outputExt: 'css',
    live: false,
    options: [indentOption],
    run: (input, o) => prettierFormat(input, 'css', o),
  },
  'js-format': {
    inputLabel: 'JavaScript input',
    outputLabel: 'Formatted JavaScript',
    actionLabel: 'Format JavaScript',
    placeholder: 'Paste JavaScript here…',
    sample:
      'const add=(a,b)=>{return a+b};function greet(name){if(!name){return "Hello!"}return `Hello, ${name}!`}console.log(greet("world"),add(2,3))',
    outputExt: 'js',
    live: false,
    options: [
      indentOption,
      {
        id: 'quotes',
        label: 'Quotes',
        type: 'select',
        choices: [
          { value: 'double', label: 'Double quotes' },
          { value: 'single', label: 'Single quotes' },
        ],
        default: 'double',
      },
    ],
    run: (input, o) => prettierFormat(input, 'babel', o),
  },
  'js-minify': {
    inputLabel: 'JavaScript input',
    outputLabel: 'Minified JavaScript',
    actionLabel: 'Minify JavaScript',
    placeholder: 'Paste JavaScript here…',
    sample:
      'function greet(name) {\n  // Say hello\n  const message = `Hello, ${name}!`;\n  return message;\n}\n\nconsole.log(greet("world"));\n',
    outputExt: 'min.js',
    live: false,
    options: [
      {
        id: 'mangle',
        label: 'Shorten variable names',
        type: 'checkbox',
        default: true,
      },
    ],
    run: async (input, o) => {
      if (!input.trim())
        throw new ToolInputError('Please enter some JavaScript.');
      const { minify } = await import('terser');
      try {
        const result = await minify(input, {
          mangle: o.mangle !== false,
          compress: true,
        });
        return result.code ?? '';
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        throw new ToolInputError(
          `The JavaScript could not be parsed. ${msg}`.trim(),
        );
      }
    },
  },
  'base64-encode': {
    inputLabel: 'Text to encode',
    outputLabel: 'Base64 output',
    actionLabel: 'Encode',
    placeholder: 'Type or paste text…',
    sample: 'Hello, world! 👋 Ünïcödé works too.',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'urlSafe',
        label: 'URL-safe (Base64URL)',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) => utf8ToBase64(input, !!o.urlSafe),
  },
  'base64-decode': {
    inputLabel: 'Base64 to decode',
    outputLabel: 'Decoded text',
    actionLabel: 'Decode',
    placeholder: 'Paste Base64 here…',
    sample: 'SGVsbG8sIHdvcmxkISDwn5GLIMOcbsOvY8O2ZMOpIHdvcmtzIHRvby4=',
    outputExt: 'txt',
    live: true,
    run: (input) => (input.trim() ? base64ToUtf8(input) : ''),
  },
  'url-encode': {
    inputLabel: 'Text or URL to encode',
    outputLabel: 'Encoded output',
    actionLabel: 'Encode',
    placeholder: 'Type or paste text…',
    sample: 'https://emojar.com/search?q=café & crème&tag=☕',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        choices: [
          {
            value: 'component',
            label: 'Encode everything (encodeURIComponent)',
          },
          { value: 'uri', label: 'Keep URL structure (encodeURI)' },
        ],
        default: 'component',
      },
    ],
    run: (input, o) => urlEncode(input, o.mode === 'uri' ? 'uri' : 'component'),
  },
  'url-decode': {
    inputLabel: 'Encoded text or URL',
    outputLabel: 'Decoded output',
    actionLabel: 'Decode',
    placeholder: 'Paste a percent-encoded string…',
    sample:
      'https%3A%2F%2Femojar.com%2Fsearch%3Fq%3Dcaf%C3%A9%20%26%20cr%C3%A8me',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'plus',
        label: 'Treat “+” as space',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) => urlDecode(input, o.plus !== false),
  },
  'markdown-to-html': {
    inputLabel: 'Markdown input',
    outputLabel: 'HTML output',
    actionLabel: 'Convert to HTML',
    placeholder: 'Write Markdown…',
    sample:
      '# Hello\n\nThis is **Markdown** with a [link](https://emojar.com).\n\n- One\n- Two\n\n```js\nconsole.log("hi");\n```\n',
    outputExt: 'html',
    live: true,
    options: [
      {
        id: 'gfm',
        label: 'GitHub Flavored Markdown',
        type: 'checkbox',
        default: true,
      },
    ],
    run: async (input, o) => {
      const { marked } = await import('marked');
      return marked.parse(input, {
        gfm: o.gfm !== false,
        async: false,
      }) as string;
    },
  },
  'html-to-markdown': {
    inputLabel: 'HTML input',
    outputLabel: 'Markdown output',
    actionLabel: 'Convert to Markdown',
    placeholder: 'Paste HTML…',
    sample:
      '<h1>Hello</h1><p>This is <strong>HTML</strong> with a <a href="https://emojar.com">link</a>.</p><ul><li>One</li><li>Two</li></ul>',
    outputExt: 'md',
    live: true,
    options: [
      {
        id: 'headingStyle',
        label: 'Headings',
        type: 'select',
        choices: [
          { value: 'atx', label: '# ATX' },
          { value: 'setext', label: 'Setext (underlined)' },
        ],
        default: 'atx',
      },
    ],
    run: async (input, o) => {
      const { default: TurndownService } = await import('turndown');
      const td = new TurndownService({
        headingStyle: o.headingStyle === 'setext' ? 'setext' : 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
      });
      return td.turndown(input);
    },
  },
  uppercase: {
    inputLabel: 'Your text',
    outputLabel: 'UPPERCASE text',
    actionLabel: 'Convert',
    placeholder: 'Type or paste text…',
    sample: 'Turn this sentence into capital letters.',
    outputExt: 'txt',
    live: true,
    run: (input) => convertCase(input, 'upper'),
  },
  lowercase: {
    inputLabel: 'Your text',
    outputLabel: 'lowercase text',
    actionLabel: 'Convert',
    placeholder: 'Type or paste text…',
    sample: 'TURN THIS SENTENCE INTO Small Letters.',
    outputExt: 'txt',
    live: true,
    run: (input) => convertCase(input, 'lower'),
  },
  'title-case': {
    inputLabel: 'Your text',
    outputLabel: 'Title Case text',
    actionLabel: 'Convert',
    placeholder: 'Type or paste a headline…',
    sample: 'the quick brown fox jumps over the lazy dog',
    outputExt: 'txt',
    live: true,
    run: (input) => convertCase(input, 'title'),
  },
  'remove-duplicate-lines': {
    inputLabel: 'Lines of text',
    outputLabel: 'Unique lines',
    actionLabel: 'Remove duplicates',
    placeholder: 'One item per line…',
    sample: 'apple\nbanana\nApple\ncherry\nbanana\n  cherry',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'caseSensitive',
        label: 'Case sensitive',
        type: 'checkbox',
        default: true,
      },
      {
        id: 'trim',
        label: 'Ignore leading/trailing spaces',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      removeDuplicateLines(input, {
        caseSensitive: o.caseSensitive !== false,
        trim: o.trim !== false,
      }),
  },
  'remove-empty-lines': {
    inputLabel: 'Text',
    outputLabel: 'Text without empty lines',
    actionLabel: 'Remove empty lines',
    placeholder: 'Paste text…',
    sample: 'First line\n\n\nSecond line\n   \nThird line',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'whitespaceOnly',
        label: 'Also remove lines with only spaces',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      removeEmptyLines(input, { whitespaceOnly: o.whitespaceOnly !== false }),
  },
  'sort-lines': {
    inputLabel: 'Lines to sort',
    outputLabel: 'Sorted lines',
    actionLabel: 'Sort',
    placeholder: 'One item per line…',
    sample: 'item 10\nbanana\nitem 2\nApple\ncherry\nitem 1',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'mode',
        label: 'Order',
        type: 'select',
        choices: [
          { value: 'az', label: 'A → Z' },
          { value: 'za', label: 'Z → A' },
          { value: 'natural', label: 'Natural (item 2 before item 10)' },
          { value: 'length', label: 'Shortest first' },
          { value: 'length-desc', label: 'Longest first' },
          { value: 'reverse', label: 'Reverse current order' },
          { value: 'shuffle', label: 'Shuffle randomly' },
        ],
        default: 'az',
      },
      {
        id: 'caseSensitive',
        label: 'Case sensitive',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) =>
      sortLines(input, (o.mode as SortMode) ?? 'az', {
        caseSensitive: !!o.caseSensitive,
      }),
  },
  morse: {
    inputLabel: 'Text or Morse code',
    outputLabel: 'Result',
    actionLabel: 'Translate',
    placeholder: 'Type text, or paste Morse like .... . .-.. .-.. ---',
    sample: 'SOS Hello World',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'direction',
        label: 'Direction',
        type: 'select',
        choices: [
          { value: 'auto', label: 'Detect automatically' },
          { value: 'encode', label: 'Text → Morse' },
          { value: 'decode', label: 'Morse → Text' },
        ],
        default: 'auto',
      },
    ],
    run: (input, o) => {
      const decode =
        o.direction === 'decode' ||
        (o.direction !== 'encode' && isMorse(input));
      return decode ? morseToText(input) : textToMorse(input);
    },
  },
};
