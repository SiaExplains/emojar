// Infers a JSON Schema from a sample document. The result describes the
// sample — types, nesting and which keys always appear — not the full data
// contract the sample came from.

import { ToolInputError, validateJson } from './data';

export type SchemaDraft = '2020-12' | '2019-09' | '07';

export const DRAFT_URI: Record<SchemaDraft, string> = {
  '2020-12': 'https://json-schema.org/draft/2020-12/schema',
  '2019-09': 'https://json-schema.org/draft/2019-09/schema',
  '07': 'http://json-schema.org/draft-07/schema#',
};

export type SchemaOptions = {
  draft?: SchemaDraft;
  /** Mark keys present in every sample object as required. */
  required?: boolean;
  /** Disallow keys that weren't in the sample. */
  strict?: boolean;
  /** Add "format" for date-time, date, email, uri and uuid strings. */
  formats?: boolean;
  title?: string;
};

type Schema = Record<string, unknown>;

const FORMATS: [string, RegExp][] = [
  [
    'date-time',
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  ],
  ['date', /^\d{4}-\d{2}-\d{2}$/],
  ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
  ['uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i],
  ['uri', /^[a-z][a-z\d+.-]*:\/\/\S+$/i],
];

const typeName = (v: unknown): string =>
  v === null
    ? 'null'
    : Array.isArray(v)
      ? 'array'
      : typeof v === 'number'
        ? Number.isInteger(v)
          ? 'integer'
          : 'number'
        : typeof v;

/** Infers a schema for one value. */
function infer(
  v: unknown,
  o: Required<Omit<SchemaOptions, 'title'>>,
  depth: number,
): Schema {
  if (depth > 100) throw new ToolInputError('The JSON is nested too deeply.');
  const t = typeName(v);
  if (t === 'array') return inferArray(v as unknown[], o, depth);
  if (t === 'object')
    return inferObjects([v as Record<string, unknown>], o, depth);
  if (t === 'string' && o.formats) {
    const f = FORMATS.find(([, re]) => re.test(v as string));
    if (f) return { type: 'string', format: f[0] };
  }
  return { type: t };
}

function inferArray(
  arr: unknown[],
  o: Required<Omit<SchemaOptions, 'title'>>,
  depth: number,
): Schema {
  if (!arr.length) return { type: 'array', items: {} };
  return { type: 'array', items: mergeValues(arr, o, depth + 1) };
}

/**
 * One schema for many values. Objects are merged key by key (a key is
 * required only if every object has it); other types become a type union or
 * an anyOf when the shapes differ.
 */
function mergeValues(
  values: unknown[],
  o: Required<Omit<SchemaOptions, 'title'>>,
  depth: number,
): Schema {
  const groups = new Map<string, unknown[]>();
  for (const v of values) {
    let t = typeName(v);
    if (t === 'integer') t = 'number';
    groups.set(t, [...(groups.get(t) ?? []), v]);
  }
  const parts: Schema[] = [];
  for (const [t, vs] of groups) {
    if (t === 'object')
      parts.push(inferObjects(vs as Record<string, unknown>[], o, depth));
    else if (t === 'array')
      parts.push(inferArray((vs as unknown[][]).flat(), o, depth));
    else if (t === 'number')
      parts.push({
        type: vs.every((n) => Number.isInteger(n)) ? 'integer' : 'number',
      });
    else if (t === 'string' && o.formats) {
      const f = FORMATS.find(([, re]) => vs.every((s) => re.test(s as string)));
      parts.push(f ? { type: 'string', format: f[0] } : { type: 'string' });
    } else parts.push({ type: t });
  }
  if (parts.length === 1) return parts[0];
  // Simple scalars collapse into a type list: { "type": ["string", "null"] }.
  if (parts.every((p) => Object.keys(p).length === 1))
    return { type: parts.map((p) => p.type as string) };
  return { anyOf: parts };
}

function inferObjects(
  objs: Record<string, unknown>[],
  o: Required<Omit<SchemaOptions, 'title'>>,
  depth: number,
): Schema {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const obj of objs)
    for (const k of Object.keys(obj))
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
  const properties: Schema = {};
  for (const k of keys) {
    const vals = objs.filter((x) => k in x).map((x) => x[k]);
    properties[k] =
      vals.length === 1
        ? infer(vals[0], o, depth + 1)
        : mergeValues(vals, o, depth + 1);
  }
  const s: Schema = { type: 'object', properties };
  if (o.required) {
    const req = keys.filter((k) => objs.every((x) => k in x));
    if (req.length) s.required = req;
  }
  if (o.strict) s.additionalProperties = false;
  return s;
}

export function generateJsonSchema(
  input: string,
  opts: SchemaOptions = {},
): string {
  const r = validateJson(input);
  if (!r.valid) throw new ToolInputError(r.message);
  const o = {
    draft: opts.draft ?? '2020-12',
    required: opts.required ?? true,
    strict: opts.strict ?? false,
    formats: opts.formats ?? true,
  };
  const body = infer(r.value, o, 0);
  const schema: Schema = { $schema: DRAFT_URI[o.draft] };
  if (opts.title?.trim()) schema.title = opts.title.trim();
  return JSON.stringify({ ...schema, ...body }, null, 2);
}
