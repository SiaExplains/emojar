// v0.7.0 text tools that fit the generic TextTransformTool. Merged into
// TRANSFORMS in transforms.ts.

import {
  COMBINING_STYLES,
  REPEAT_SEPARATORS,
  addPrefixSuffix,
  flipText,
  removeLineBreaks,
  repeatText,
  reverseText,
  slugify,
  styleText,
  type CombiningStyle,
  type FlipMode,
  type LineBreakMode,
  type ReverseMode,
} from './text-more';
import type { TransformDefinition } from './transforms';

export const TEXT_TRANSFORMS: Record<string, TransformDefinition> = {
  'flip-text': {
    inputLabel: 'Your text',
    outputLabel: 'Flipped text',
    actionLabel: 'Flip',
    placeholder: 'Type or paste text…',
    sample: 'Hello world! Can you read this?',
    outputExt: 'txt',
    live: true,
    prose: true,
    options: [
      {
        id: 'mode',
        label: 'Flip',
        type: 'select',
        choices: [
          { value: 'upside-down', label: 'Upside down (rotate 180°)' },
          { value: 'mirror', label: 'Mirror (left ↔ right)' },
          { value: 'letters', label: 'Upside-down letters, normal order' },
        ],
        default: 'upside-down',
      },
    ],
    run: (input, o) => flipText(input, (o.mode as FlipMode) || 'upside-down'),
  },
  'combining-style': {
    inputLabel: 'Your text',
    outputLabel: 'Styled text',
    actionLabel: 'Apply',
    placeholder: 'Type or paste text…',
    sample: 'This price is wrong',
    outputExt: 'txt',
    live: true,
    prose: true,
    options: [
      {
        id: 'style',
        label: 'Style',
        type: 'select',
        choices: [
          ...Object.entries(COMBINING_STYLES).map(([value, s]) => ({
            value,
            label: s.label,
          })),
          { value: 'remove', label: 'Remove these lines (clean text)' },
        ],
        default: 'strikethrough',
      },
      {
        id: 'spaces',
        label: 'Also mark spaces (one continuous line)',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      styleText(input, (o.style as CombiningStyle) || 'strikethrough', {
        spaces: o.spaces !== false,
      }),
  },
  'reverse-text': {
    inputLabel: 'Your text',
    outputLabel: 'Reversed text',
    actionLabel: 'Reverse',
    placeholder: 'Type or paste text…',
    sample: 'Never odd or even.\nStressed? Have some desserts 🍰',
    outputExt: 'txt',
    live: true,
    prose: true,
    options: [
      {
        id: 'mode',
        label: 'Reverse',
        type: 'select',
        choices: [
          { value: 'characters', label: 'Every character (backwards text)' },
          { value: 'words', label: 'Word order in each line' },
          { value: 'each-word', label: 'Letters in each word' },
          { value: 'lines', label: 'Line order' },
        ],
        default: 'characters',
      },
    ],
    run: (input, o) =>
      reverseText(input, (o.mode as ReverseMode) || 'characters'),
  },
  'repeat-text': {
    inputLabel: 'Text to repeat',
    outputLabel: 'Repeated text',
    actionLabel: 'Repeat',
    placeholder: 'Type a word, emoji or sentence…',
    sample: 'Happy birthday! 🎉',
    outputExt: 'txt',
    live: true,
    prose: true,
    keepWhitespace: true,
    options: [
      {
        id: 'count',
        label: 'Repeat (times)',
        type: 'text',
        default: '10',
        placeholder: '10',
      },
      {
        id: 'separator',
        label: 'Separate with',
        type: 'select',
        choices: [
          { value: 'newline', label: 'New line' },
          { value: 'space', label: 'Space' },
          { value: 'none', label: 'Nothing' },
          { value: 'comma', label: 'Comma' },
          { value: 'custom', label: 'Custom…' },
        ],
        default: 'newline',
      },
      {
        id: 'custom',
        label: 'Custom separator',
        type: 'text',
        default: ' | ',
        placeholder: 'Used when “Custom…” is chosen',
      },
    ],
    run: (input, o) =>
      repeatText(
        input,
        String(o.count ?? ''),
        o.separator === 'custom'
          ? String(o.custom ?? '')
          : (REPEAT_SEPARATORS[String(o.separator)] ?? '\n'),
      ),
  },
  'remove-line-breaks': {
    inputLabel: 'Text with line breaks',
    outputLabel: 'Text without line breaks',
    actionLabel: 'Remove line breaks',
    placeholder: 'Paste text copied from a PDF, email or website…',
    sample:
      'Text copied from a PDF often has a line\nbreak at the end of every line, which\nmakes it hard to paste into an email or\na web form.\n\nThis second paragraph has a hyphen-\nated word split across two lines.',
    outputExt: 'txt',
    live: true,
    prose: true,
    options: [
      {
        id: 'mode',
        label: 'Line breaks',
        type: 'select',
        choices: [
          { value: 'paragraphs', label: 'Remove, keep paragraphs' },
          { value: 'space', label: 'Replace all with a space' },
          { value: 'none', label: 'Remove all (no space)' },
        ],
        default: 'paragraphs',
      },
      {
        id: 'collapse',
        label: 'Collapse repeated spaces',
        type: 'checkbox',
        default: true,
      },
      {
        id: 'hyphens',
        label: 'Join words hyphenated across lines',
        type: 'checkbox',
        default: true,
      },
    ],
    run: (input, o) =>
      removeLineBreaks(input, (o.mode as LineBreakMode) || 'paragraphs', {
        collapseSpaces: o.collapse !== false,
        joinHyphens: o.hyphens !== false,
      }),
  },
  'prefix-suffix': {
    inputLabel: 'Lines of text',
    outputLabel: 'Result',
    actionLabel: 'Add',
    placeholder: 'One item per line…',
    sample: 'apples\nbananas\n\ncherries\ndates',
    outputExt: 'txt',
    live: true,
    keepWhitespace: true,
    options: [
      {
        id: 'prefix',
        label: 'Prefix (before each line)',
        type: 'text',
        default: '{n}. ',
        placeholder: 'e.g. - or "  or {n}. ',
      },
      {
        id: 'suffix',
        label: 'Suffix (after each line)',
        type: 'text',
        default: '',
        placeholder: 'e.g. , or ";',
      },
      {
        id: 'skipEmpty',
        label: 'Skip empty lines',
        type: 'checkbox',
        default: true,
      },
      {
        id: 'trim',
        label: 'Trim spaces from each line',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) =>
      addPrefixSuffix(input, String(o.prefix ?? ''), String(o.suffix ?? ''), {
        skipEmpty: o.skipEmpty !== false,
        trim: !!o.trim,
      }),
  },
  slug: {
    inputLabel: 'Titles (one per line)',
    outputLabel: 'URL slugs',
    actionLabel: 'Generate slugs',
    placeholder: 'Paste a title or headline…',
    sample:
      '10 Tips for Crème Brûlée & Straße Food!\nWhy Don’t Cats Like Water?\nThe Ultimate Guide to Next.js 15',
    outputExt: 'txt',
    live: true,
    options: [
      {
        id: 'separator',
        label: 'Separator',
        type: 'select',
        choices: [
          { value: '-', label: 'Hyphen (-)' },
          { value: '_', label: 'Underscore (_)' },
        ],
        default: '-',
      },
      {
        id: 'maxLength',
        label: 'Max length (optional)',
        type: 'text',
        default: '',
        placeholder: 'e.g. 60',
      },
      {
        id: 'lowercase',
        label: 'Lowercase',
        type: 'checkbox',
        default: true,
      },
      {
        id: 'stopWords',
        label: 'Remove stop words (a, the, and…)',
        type: 'checkbox',
        default: false,
      },
    ],
    run: (input, o) => {
      const max = Number(String(o.maxLength ?? '').trim());
      return input
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) =>
          slugify(line, {
            separator: o.separator === '_' ? '_' : '-',
            lowercase: o.lowercase !== false,
            stopWords: !!o.stopWords,
            maxLength: Number.isFinite(max) && max > 0 ? max : undefined,
          }),
        )
        .join('\n');
    },
  },
};
