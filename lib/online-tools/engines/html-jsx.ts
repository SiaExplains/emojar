// HTML → JSX. A small tokenizer (the input is never parsed into a live DOM
// or executed) that rewrites what React needs: attribute names, inline
// styles, void elements, comments, braces in text and unclosed tags. It
// covers everyday markup, not every corner of the HTML parsing spec.

export type JsxOptions = {
  /** Wrap several top-level elements in <>…</>. */
  fragment?: boolean;
  /** Wrap the result in `export default function Name() { return (…) }`. */
  component?: string;
};

export type JsxResult = { jsx: string; notes: string[] };

const VOID = new Set(
  'area base br col embed hr img input link meta param source track wbr'.split(
    ' ',
  ),
);

/** Elements whose start tag closes an open element of the same kind. */
const AUTO_CLOSE = new Set('p li option tr td th dt dd'.split(' '));

const ATTR_MAP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  accesskey: 'accessKey',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  enctype: 'encType',
  formaction: 'formAction',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  srcset: 'srcSet',
  usemap: 'useMap',
  novalidate: 'noValidate',
  spellcheck: 'spellCheck',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  datetime: 'dateTime',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  referrerpolicy: 'referrerPolicy',
  playsinline: 'playsInline',
  'accept-charset': 'acceptCharset',
  'http-equiv': 'httpEquiv',
  'xlink:href': 'xlinkHref',
  'xml:lang': 'xmlLang',
  'xml:space': 'xmlSpace',
  'xmlns:xlink': 'xmlnsXlink',
};

const camel = (s: string) =>
  s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** "color: red; font-size: 12px" → {{ color: 'red', fontSize: '12px' }} */
export function styleToObject(css: string): string {
  const parts: string[] = [];
  // Split on ; outside quotes and parentheses, e.g. url("a;b").
  let depth = 0;
  let quote = '';
  let cur = '';
  const decls: string[] = [];
  for (const ch of css) {
    if (quote) {
      if (ch === quote) quote = '';
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ';' && depth === 0) {
      decls.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  decls.push(cur);
  for (const d of decls) {
    const i = d.indexOf(':');
    if (i === -1) continue;
    const prop = d.slice(0, i).trim();
    const value = d.slice(i + 1).trim();
    if (!prop || !value) continue;
    let key: string;
    if (prop.startsWith('--')) key = `'${prop}'`;
    else {
      const lower = prop.toLowerCase();
      key = lower.startsWith('-ms-')
        ? camel(lower.slice(1))
        : lower.startsWith('-')
          ? camel(lower.slice(1)).replace(/^./, (c) => c.toUpperCase())
          : camel(lower);
    }
    const isNum = /^-?\d+(\.\d+)?$/.test(value) && value !== '0';
    parts.push(
      `${key}: ${isNum ? value : `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`}`,
    );
  }
  return parts.length ? `{{ ${parts.join(', ')} }}` : '{{}}';
}

type Attr = { name: string; value: string | null };

function parseAttrs(src: string): Attr[] {
  const out: Attr[] = [];
  const re = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const m of src.matchAll(re))
    out.push({ name: m[1], value: m[2] ?? m[3] ?? m[4] ?? null });
  return out;
}

function convertAttr(tag: string, a: Attr, notes: Set<string>): string {
  const raw = a.name;
  const lower = raw.toLowerCase();
  let name: string;
  if (lower.startsWith('data-') || lower.startsWith('aria-')) name = lower;
  else if (ATTR_MAP[lower]) name = ATTR_MAP[lower];
  else if (/^on[a-z]+$/.test(lower)) {
    name = `on${lower[2].toUpperCase()}${lower.slice(3)}`;
    notes.add(
      'Inline event handlers were turned into empty functions with the original code in a comment — move that logic into React handlers.',
    );
    const code = (a.value ?? '').replace(/\*\//g, '* /');
    return `${name}={() => { /* ${code} */ }}`;
  } else if (raw.includes('-') || raw.includes(':'))
    name = camel(lower.replace(':', '-'));
  else name = /[A-Z]/.test(raw) ? raw : lower; // keep SVG viewBox etc.

  if (
    (tag === 'input' || tag === 'textarea' || tag === 'select') &&
    (name === 'value' || name === 'checked')
  ) {
    notes.add(
      'value and checked became defaultValue and defaultChecked, so the fields stay editable without an onChange handler.',
    );
    name = name === 'value' ? 'defaultValue' : 'defaultChecked';
  }
  if (name === 'style' && a.value !== null)
    return `style=${styleToObject(a.value)}`;
  if (a.value === null) return name;
  if (a.value.includes('"') || a.value.includes('\\'))
    return `${name}={${JSON.stringify(a.value)}}`;
  return `${name}="${a.value}"`;
}

/** Braces are JSX syntax, so literal { and } in text must be escaped. */
const escapeText = (t: string) =>
  t.replace(/[{}]/g, (c) => `{'${c}'}`).replace(/>/g, '&gt;');

/**
 * HTML tag names are case-insensitive (<DIV> = <div>), but mixed-case names
 * are SVG elements (linearGradient) or components and must keep their case.
 */
const tagName = (raw: string) =>
  raw === raw.toUpperCase() || raw === raw.toLowerCase()
    ? raw.toLowerCase()
    : raw;

export function htmlToJsx(html: string, opts: JsxOptions = {}): JsxResult {
  const notes = new Set<string>();
  const out: string[] = [];
  const stack: string[] = [];
  let topLevel = 0;
  let i = 0;
  const closeTop = () => out.push(`</${stack.pop()}>`);

  while (i < html.length) {
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      const body = html.slice(i + 4, end === -1 ? html.length : end);
      out.push(`{/*${body.replace(/\*\//g, '* /')}*/}`);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    if (/^<!doctype/i.test(html.slice(i, i + 9))) {
      const end = html.indexOf('>', i);
      notes.add(
        'The <!DOCTYPE> declaration was removed; JSX has no equivalent.',
      );
      i = end === -1 ? html.length : end + 1;
      continue;
    }
    const close = /^<\/([A-Za-z][\w:-]*)\s*>/.exec(html.slice(i));
    if (close) {
      const idx = stack.lastIndexOf(tagName(close[1]));
      if (idx === -1) {
        notes.add('A closing tag without a matching opening tag was removed.');
      } else {
        if (idx < stack.length - 1)
          notes.add('Unclosed tags were closed where their parent ends.');
        while (stack.length > idx) closeTop();
      }
      i += close[0].length;
      continue;
    }
    const open =
      /^<([A-Za-z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/.exec(
        html.slice(i),
      );
    if (open) {
      const tag = tagName(open[1]);
      if (AUTO_CLOSE.has(tag) && stack[stack.length - 1] === tag) {
        closeTop();
        notes.add('Unclosed tags were closed where their parent ends.');
      }
      if (!stack.length) topLevel++;
      const attrs = parseAttrs(open[2]).map((a) => convertAttr(tag, a, notes));
      const attrStr = attrs.length ? ` ${attrs.join(' ')}` : '';
      const selfClose = open[3] === '/' || VOID.has(tag);
      i += open[0].length;
      if (selfClose) {
        out.push(`<${tag}${attrStr} />`);
        continue;
      }
      out.push(`<${tag}${attrStr}>`);
      if (tag === 'script' || tag === 'style') {
        const endRe = new RegExp(`</${tag}\\s*>`, 'i');
        const rest = html.slice(i);
        const m = endRe.exec(rest);
        const body = m ? rest.slice(0, m.index) : rest;
        if (body.trim())
          out.push(
            `{\`${body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`}`,
          );
        out.push(`</${tag}>`);
        if (tag === 'script')
          notes.add(
            'Script contents are kept as a string; React won’t run inline <script> tags rendered this way.',
          );
        i += m ? m.index + m[0].length : rest.length;
        continue;
      }
      stack.push(tag);
      continue;
    }
    // Text up to the next "<" (a lone "<" is kept as text).
    let next = html.indexOf('<', i + 1);
    if (next === -1) next = html.length;
    const text = html.slice(i, next);
    if (!stack.length && text.trim()) topLevel++;
    out.push(escapeText(text.replace(/^</, '&lt;')));
    i = next;
  }
  if (stack.length) notes.add('Unclosed tags were closed at the end.');
  while (stack.length) closeTop();

  let jsx = out.join('').trim();
  // A component must return one element, so it always gets the fragment.
  if ((opts.fragment || opts.component) && topLevel > 1)
    jsx = `<>\n${jsx}\n</>`;
  else if (topLevel > 1)
    notes.add(
      'There are several top-level elements; JSX needs one parent, so turn on “Wrap in a fragment”.',
    );
  if (opts.component) {
    const name = /^[A-Z][A-Za-z0-9]*$/.test(opts.component)
      ? opts.component
      : 'Component';
    const body = jsx
      .split('\n')
      .map((l) => (l ? `    ${l}` : l))
      .join('\n');
    jsx = `export default function ${name}() {\n  return (\n${body}\n  );\n}`;
  }
  return { jsx, notes: [...notes] };
}
