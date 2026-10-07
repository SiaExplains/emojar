// v0.9.0 developer tools that fit the generic TextTransformTool. Merged into
// TRANSFORMS in transforms.ts.

import {
  convertBases,
  decodeEntities,
  encodeEntities,
  escapeString,
  jsonToXml,
  unescapeString,
  xmlToJson,
  bytesToText,
  textToBytes,
  type ByteFormat,
  type EntityEncodeMode,
  type EscapeMode,
} from './dev-tools';
import type { TransformDefinition } from './transforms';

const NAMED_BASES: Record<number, string> = {
  2: 'Binary (2)',
  8: 'Octal (8)',
  10: 'Decimal (10)',
  16: 'Hexadecimal (16)',
};
const BASES = [
  ...[2, 8, 10, 16].map((b) => ({ value: String(b), label: NAMED_BASES[b] })),
  ...Array.from({ length: 35 }, (_, i) => i + 2)
    .filter((b) => !NAMED_BASES[b])
    .map((b) => ({
      value: String(b),
      label: `Base ${b} (0–${b <= 10 ? b - 1 : `9, a–${'abcdefghijklmnopqrstuvwxyz'[b - 11]}`})`,
    })),
];

export const DEV_TRANSFORMS: Record<string, TransformDefinition> = {
  'html-entities': {
    inputLabel: 'Text or HTML',
    outputLabel: 'Result',
    actionLabel: 'Convert',
    placeholder: 'Paste text to encode, or HTML with &amp; entities to decode…',
    sample: '<p>Café “Crème” & Co. — 5 > 3 ©</p>',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        choices: [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' },
        ],
        default: 'encode',
      },
      {
        id: 'style',
        label: 'Encode',
        type: 'select',
        choices: [
          { value: 'minimal', label: 'Only & < > " \' (safe HTML)' },
          { value: 'named', label: 'Also non-ASCII, named (&eacute;)' },
          { value: 'numeric', label: 'Also non-ASCII, decimal (&#233;)' },
          { value: 'hex', label: 'Also non-ASCII, hex (&#xE9;)' },
        ],
        default: 'minimal',
      },
    ],
    run: (input, o) =>
      o.mode === 'decode'
        ? decodeEntities(input)
        : encodeEntities(input, (o.style as EntityEncodeMode) || 'minimal'),
  },
  'json-xml': {
    inputLabel: 'Input',
    outputLabel: 'Output',
    actionLabel: 'Convert',
    placeholder: 'Paste JSON (or XML when converting XML → JSON)…',
    sample:
      '{"library":{"@name":"City Library","book":[{"@id":"1","title":"Dune","author":"Frank Herbert","year":1965},{"@id":"2","title":"Neuromancer","author":"William Gibson","year":1984}]}}',
    outputExt: 'xml',
    outputExtFor: (o) => (o.direction === 'xml-to-json' ? 'json' : 'xml'),
    sampleFor: (o) =>
      o.direction === 'xml-to-json'
        ? '<library name="City Library">\n  <book id="1">\n    <title>Dune</title>\n    <author>Frank Herbert</author>\n    <year>1965</year>\n  </book>\n  <book id="2">\n    <title>Neuromancer</title>\n    <year>1984</year>\n  </book>\n</library>'
        : '{"library":{"@name":"City Library","book":[{"@id":"1","title":"Dune","author":"Frank Herbert","year":1965},{"@id":"2","title":"Neuromancer","author":"William Gibson","year":1984}]}}',
    live: true,
    options: [
      {
        id: 'direction',
        label: 'Convert',
        type: 'select',
        choices: [
          { value: 'json-to-xml', label: 'JSON → XML' },
          { value: 'xml-to-json', label: 'XML → JSON' },
        ],
        default: 'json-to-xml',
      },
      {
        id: 'root',
        label: 'Root element (JSON → XML)',
        type: 'text',
        default: '',
        placeholder: 'auto',
      },
      {
        id: 'item',
        label: 'Array item name',
        type: 'text',
        default: 'item',
        placeholder: 'item',
      },
      {
        id: 'declaration',
        label: 'XML declaration',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      o.direction === 'xml-to-json'
        ? xmlToJson(input)
        : jsonToXml(input, {
            root: String(o.root ?? '').trim() || undefined,
            item: String(o.item ?? '').trim() || 'item',
            declaration: o.declaration !== false,
          }),
  },
  'string-escape': {
    inputLabel: 'Text',
    outputLabel: 'Result',
    actionLabel: 'Convert',
    placeholder: 'Paste the text to escape or unescape…',
    sample: 'He said "hello"\n\tand left — it\'s C:\\temp',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        choices: [
          { value: 'escape', label: 'Escape' },
          { value: 'unescape', label: 'Unescape' },
        ],
        default: 'escape',
      },
      {
        id: 'lang',
        label: 'Format',
        type: 'select',
        choices: [
          { value: 'json', label: 'JSON string' },
          { value: 'javascript', label: 'JavaScript / TypeScript' },
          { value: 'java', label: 'Java / C# / C' },
          { value: 'python', label: 'Python' },
          { value: 'sql', label: 'SQL string literal' },
          { value: 'csv', label: 'CSV field' },
          { value: 'regex', label: 'Regular expression' },
          { value: 'shell', label: 'Shell (POSIX single quotes)' },
          { value: 'xml', label: 'XML / HTML' },
        ],
        default: 'json',
      },
    ],
    run: (input, o) => {
      const lang = (o.lang as EscapeMode) || 'json';
      return o.mode === 'unescape'
        ? unescapeString(input, lang)
        : escapeString(input, lang);
    },
  },
  'number-base': {
    inputLabel: 'Number(s), one per line',
    outputLabel: 'Converted',
    actionLabel: 'Convert',
    placeholder: 'e.g. 255, 0xff or 0b1010 — one number per line',
    sample: '255\n4096\n0xdeadbeef',
    sampleFor: (o) =>
      ({
        '2': '1010\n11111111\n1111111111111111111111111111111111111111111111111111111111111111',
        '8': '755\n644\n17777777777',
        '16': 'ff\n1A3F\nDEADBEEF',
      })[String(o.from)] ?? '255\n4096\n0xdeadbeef',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'from',
        label: 'From',
        type: 'select',
        choices: [
          { value: '0', label: 'Auto (0x / 0b / 0o, else decimal)' },
          ...BASES,
        ],
        default: '0',
      },
      {
        id: 'to',
        label: 'To',
        type: 'select',
        choices: [
          { value: 'all', label: 'Binary, octal, decimal & hex' },
          ...BASES,
        ],
        default: 'all',
      },
      {
        id: 'group',
        label: 'Group digits',
        type: 'checkbox',
        default: false,
      },
      {
        id: 'upper',
        label: 'Uppercase letters',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) =>
      convertBases(
        input,
        Number(o.from ?? 0),
        o.to === 'all' || !o.to ? 'all' : Number(o.to),
        { group: !!o.group, upper: !!o.upper },
      ),
  },
  'text-binary': {
    inputLabel: 'Text or binary',
    outputLabel: 'Result',
    actionLabel: 'Convert',
    placeholder: 'Type text to encode, or paste binary like 01001000 01101001',
    sample: 'Hi 👋',
    sampleFor: (o) =>
      o.mode === 'decode'
        ? ((
            {
              hex: '48 65 6c 6c 6f 20 f0 9f 8c 8d',
              decimal: '72 101 108 108 111 32 240 159 140 141',
              octal: '110 145 154 154 157 040 360 237 214 215',
            } as Record<string, string>
          )[String(o.format)] ??
          '01001000 01100101 01101100 01101100 01101111 00100000 11110000 10011111 10001100 10001101')
        : 'Hi 👋',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        choices: [
          { value: 'encode', label: 'Text → binary' },
          { value: 'decode', label: 'Binary → text' },
        ],
        default: 'encode',
      },
      {
        id: 'format',
        label: 'Number format',
        type: 'select',
        choices: [
          { value: 'binary', label: 'Binary (8 bits per byte)' },
          { value: 'hex', label: 'Hexadecimal' },
          { value: 'decimal', label: 'Decimal (0–255)' },
          { value: 'octal', label: 'Octal' },
        ],
        default: 'binary',
      },
      {
        id: 'spaces',
        label: 'Space between bytes',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) => {
      const format = (o.format as ByteFormat) || 'binary';
      return o.mode === 'decode'
        ? bytesToText(input, format)
        : textToBytes(
            input,
            format,
            o.spaces === false && format !== 'decimal' ? '' : ' ',
          );
    },
  },
};
