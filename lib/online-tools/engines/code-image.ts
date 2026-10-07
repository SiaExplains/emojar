// Code-to-image helpers: lazy highlight.js setup, turning its HTML output
// into coloured tokens per line, and the colour themes. Drawing happens on
// a canvas in the component, so no HTML is ever injected into the page.

export type Token = { text: string; scope: string };

export const LANGUAGES: { id: string; label: string }[] = [
  { id: 'auto', label: 'Detect automatically' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
  { id: 'cpp', label: 'C / C++' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash / Shell' },
  { id: 'json', label: 'JSON' },
  { id: 'yaml', label: 'YAML' },
  { id: 'xml', label: 'HTML / XML' },
  { id: 'css', label: 'CSS' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'dockerfile', label: 'Dockerfile' },
  { id: 'plaintext', label: 'Plain text' },
];

type Hljs = typeof import('highlight.js/lib/core').default;
let loading: Promise<Hljs> | null = null;

export function loadHighlighter(): Promise<Hljs> {
  loading ??= (async () => {
    const { default: hljs } = await import('highlight.js/lib/core');
    const langs = await Promise.all([
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/java'),
      import('highlight.js/lib/languages/csharp'),
      import('highlight.js/lib/languages/cpp'),
      import('highlight.js/lib/languages/go'),
      import('highlight.js/lib/languages/rust'),
      import('highlight.js/lib/languages/php'),
      import('highlight.js/lib/languages/ruby'),
      import('highlight.js/lib/languages/kotlin'),
      import('highlight.js/lib/languages/swift'),
      import('highlight.js/lib/languages/sql'),
      import('highlight.js/lib/languages/bash'),
      import('highlight.js/lib/languages/json'),
      import('highlight.js/lib/languages/yaml'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/css'),
      import('highlight.js/lib/languages/markdown'),
      import('highlight.js/lib/languages/dockerfile'),
      import('highlight.js/lib/languages/plaintext'),
    ]);
    const ids = LANGUAGES.slice(1).map((l) => l.id);
    langs.forEach((m, i) => hljs.registerLanguage(ids[i], m.default));
    return hljs;
  })();
  return loading;
}

/**
 * Converts highlight.js HTML (only <span class="hljs-…"> and escaped text)
 * into lines of tokens, using an inert DOMParser document.
 */
export function htmlToLines(html: string): Token[][] {
  const doc = new DOMParser().parseFromString(
    `<pre>${html}</pre>`,
    'text/html',
  );
  const lines: Token[][] = [[]];
  const walk = (node: Node, scope: string) => {
    if (node.nodeType === 3) {
      const parts = (node.nodeValue ?? '').split('\n');
      parts.forEach((p, i) => {
        if (i > 0) lines.push([]);
        if (p) lines[lines.length - 1].push({ text: p, scope });
      });
      return;
    }
    const el = node as Element;
    const cls = el.getAttribute?.('class') ?? '';
    const own = cls
      .split(/\s+/)
      .find((c) => c.startsWith('hljs-'))
      ?.slice(5);
    node.childNodes.forEach((child) => walk(child, own ?? scope));
  };
  walk(doc.body.firstChild!, '');
  return lines;
}

export type Theme = {
  name: string;
  bg: string;
  fg: string;
  lineNo: string;
  colors: Record<string, string>;
};

const scopes = (m: Record<string, string>) => {
  const out: Record<string, string> = {};
  for (const [keys, color] of Object.entries(m))
    for (const k of keys.split(' ')) out[k] = color;
  return out;
};

export const THEMES: Record<string, Theme> = {
  dark: {
    name: 'One Dark',
    bg: '#282c34',
    fg: '#abb2bf',
    lineNo: '#5c6370',
    colors: scopes({
      'keyword selector-tag doctag': '#c678dd',
      'string regexp addition attribute meta-string': '#98c379',
      'number literal built_in type class': '#d19a66',
      'title function title.function title.class': '#61afef',
      comment: '#7f848e',
      'attr variable template-variable params property': '#e06c75',
      'tag name section': '#e06c75',
      'symbol bullet link meta': '#56b6c2',
      deletion: '#e06c75',
    }),
  },
  dracula: {
    name: 'Dracula',
    bg: '#282a36',
    fg: '#f8f8f2',
    lineNo: '#6272a4',
    colors: scopes({
      'keyword selector-tag literal section link': '#ff79c6',
      'string meta-string attribute regexp addition': '#f1fa8c',
      'number built_in type': '#bd93f9',
      'title function title.function title.class class': '#50fa7b',
      comment: '#6272a4',
      'attr variable params property tag name': '#8be9fd',
      'symbol bullet meta': '#ffb86c',
      deletion: '#ff5555',
    }),
  },
  light: {
    name: 'GitHub Light',
    bg: '#ffffff',
    fg: '#24292f',
    lineNo: '#8c959f',
    colors: scopes({
      'keyword selector-tag doctag type': '#cf222e',
      'string regexp meta-string addition': '#0a3069',
      'number literal built_in attr attribute variable symbol': '#0550ae',
      'title function title.function title.class class section': '#8250df',
      comment: '#6e7781',
      'tag name': '#116329',
      'params property bullet link meta': '#953800',
      deletion: '#82071e',
    }),
  },
  night: {
    name: 'Night Owl',
    bg: '#011627',
    fg: '#d6deeb',
    lineNo: '#4b6479',
    colors: scopes({
      'keyword selector-tag': '#c792ea',
      'string meta-string attribute addition': '#ecc48d',
      'number literal': '#f78c6c',
      'built_in type class': '#ffcb8b',
      'title function title.function title.class': '#82aaff',
      comment: '#637777',
      'attr variable params property tag name': '#7fdbca',
      'symbol bullet link meta regexp': '#addb67',
      deletion: '#ef5350',
    }),
  },
};

export function colorFor(theme: Theme, scope: string): string {
  if (!scope) return theme.fg;
  return theme.colors[scope] ?? theme.colors[scope.split('.')[0]] ?? theme.fg;
}

export const BACKGROUNDS: Record<string, string[] | null> = {
  Sunset: ['#f97316', '#db2777'],
  Ocean: ['#06b6d4', '#4f46e5'],
  Forest: ['#22c55e', '#0f766e'],
  Candy: ['#f472b6', '#a78bfa'],
  Midnight: ['#1e293b', '#0f172a'],
  None: null,
};
