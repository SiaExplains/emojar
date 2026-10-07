// Infers TypeScript interfaces from a JSON sample. Arrays of objects are
// merged into one interface; keys missing from some items become optional.

import { ToolInputError, validateJson } from './data';

type Shape =
  | {
      kind: 'primitive';
      type: 'string' | 'number' | 'boolean' | 'null' | 'unknown';
    }
  | { kind: 'array'; item: Shape }
  | { kind: 'object'; fields: Map<string, { shape: Shape; optional: boolean }> }
  | { kind: 'union'; options: Shape[] };

const prim = (
  type: 'string' | 'number' | 'boolean' | 'null' | 'unknown',
): Shape => ({ kind: 'primitive', type });

function infer(value: unknown): Shape {
  if (value === null) return prim('null');
  if (Array.isArray(value)) {
    if (!value.length) return { kind: 'array', item: prim('unknown') };
    return { kind: 'array', item: value.map(infer).reduce(merge) };
  }
  switch (typeof value) {
    case 'string':
      return prim('string');
    case 'number':
      return prim('number');
    case 'boolean':
      return prim('boolean');
    case 'object': {
      const fields = new Map<string, { shape: Shape; optional: boolean }>();
      for (const [k, v] of Object.entries(value as Record<string, unknown>))
        fields.set(k, { shape: infer(v), optional: false });
      return { kind: 'object', fields };
    }
    default:
      return prim('unknown');
  }
}

function key(s: Shape): string {
  switch (s.kind) {
    case 'primitive':
      return s.type;
    case 'array':
      return `${key(s.item)}[]`;
    case 'object':
      return 'object';
    case 'union':
      return s.options.map(key).sort().join('|');
  }
}

function merge(a: Shape, b: Shape): Shape {
  if (a.kind === 'primitive' && a.type === 'unknown') return b;
  if (b.kind === 'primitive' && b.type === 'unknown') return a;
  if (a.kind === 'object' && b.kind === 'object') {
    const fields = new Map<string, { shape: Shape; optional: boolean }>();
    for (const [k, fa] of a.fields) {
      const fb = b.fields.get(k);
      fields.set(
        k,
        fb
          ? {
              shape: merge(fa.shape, fb.shape),
              optional: fa.optional || fb.optional,
            }
          : { ...fa, optional: true },
      );
    }
    for (const [k, fb] of b.fields)
      if (!a.fields.has(k)) fields.set(k, { ...fb, optional: true });
    return { kind: 'object', fields };
  }
  if (a.kind === 'array' && b.kind === 'array')
    return { kind: 'array', item: merge(a.item, b.item) };
  if (key(a) === key(b)) return a;
  const options = [
    ...(a.kind === 'union' ? a.options : [a]),
    ...(b.kind === 'union' ? b.options : [b]),
  ];
  // Merge all object members into one, then dedupe the rest by type key.
  const objects: Shape[] = options.filter((o) => o.kind === 'object');
  const others = options.filter((o) => o.kind !== 'object');
  const merged: Shape[] = objects.length ? [objects.reduce(merge)] : [];
  for (const o of others)
    if (!merged.some((m) => key(m) === key(o))) merged.push(o);
  return merged.length === 1 ? merged[0] : { kind: 'union', options: merged };
}

const pascal = (s: string) =>
  s
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) =>
      c ? c.toUpperCase() : '',
    )
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/^(\d)/, '_$1') || 'Item';

const singular = (s: string) =>
  /ies$/i.test(s)
    ? s.slice(0, -3) + 'y'
    : /(ss|x|ch|sh)es$/i.test(s)
      ? s.slice(0, -2)
      : s.endsWith('s') && !s.endsWith('ss')
        ? s.slice(0, -1)
        : s;

const validIdent = (k: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);

export type JsonToTsOptions = {
  rootName?: string;
  useType?: boolean;
  readonly?: boolean;
  exportAll?: boolean;
};

export function jsonToTypeScript(
  input: string,
  opts: JsonToTsOptions = {},
): string {
  const r = validateJson(input);
  if (!r.valid) throw new ToolInputError(r.message);
  const root = pascal(opts.rootName || 'Root');
  const declarations: string[] = [];
  const used = new Set<string>();

  const uniqueName = (base: string) => {
    let name = base;
    let i = 2;
    while (used.has(name)) name = `${base}${i++}`;
    used.add(name);
    return name;
  };

  const render = (shape: Shape, nameHint: string): string => {
    switch (shape.kind) {
      case 'primitive':
        return shape.type;
      case 'array': {
        const inner = render(shape.item, singular(nameHint));
        return /[|]/.test(inner) ? `(${inner})[]` : `${inner}[]`;
      }
      case 'union':
        return shape.options.map((o) => render(o, nameHint)).join(' | ');
      case 'object': {
        const name = uniqueName(pascal(nameHint));
        const ro = opts.readonly ? 'readonly ' : '';
        const lines = [...shape.fields].map(([k, f]) => {
          const prop = validIdent(k) ? k : JSON.stringify(k);
          return `  ${ro}${prop}${f.optional ? '?' : ''}: ${render(f.shape, k)};`;
        });
        const exp = opts.exportAll === false ? '' : 'export ';
        declarations.push(
          opts.useType
            ? `${exp}type ${name} = {\n${lines.join('\n')}\n};`
            : `${exp}interface ${name} {\n${lines.join('\n')}\n}`,
        );
        return name;
      }
    }
  };

  const shape = infer(r.value);
  const top = render(shape, shape.kind === 'array' ? `${root}Item` : root);
  if (shape.kind !== 'object') {
    const exp = opts.exportAll === false ? '' : 'export ';
    declarations.push(`${exp}type ${uniqueName(root)} = ${top};`);
  }
  // Nested declarations are pushed first; show the root first.
  return declarations.reverse().join('\n\n') + '\n';
}
