'use client';

// Visual HTTP request builder that writes code for several clients. It never
// sends the request: a web page can't call arbitrary APIs because of CORS,
// and nothing typed here (tokens included) leaves the tab or is saved.

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  METHODS,
  SNIPPET_TARGETS,
  buildUrl,
  generateSnippet,
  mergeParams,
  requestWarnings,
  splitUrl,
  validateUrl,
  type AuthType,
  type BodyType,
  type KV,
  type RequestSpec,
  type SnippetTarget,
} from '@/lib/online-tools/engines/http-snippets';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  Notice,
  SelectField,
  TextField,
  ToolInput,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';
import { CodePanel } from './playground-shared';

const DEFAULT_URL = 'https://api.example.com/users?page=1&limit=20';

const initialSpec = (): RequestSpec => ({
  method: 'POST',
  url: DEFAULT_URL,
  params: splitUrl(DEFAULT_URL).params,
  headers: [{ enabled: true, key: 'Accept', value: 'application/json' }],
  bodyType: 'json',
  body: JSON.stringify({ name: 'Ada Lovelace', role: 'admin' }, null, 2),
  fields: [{ enabled: true, key: '', value: '' }],
  auth: { type: 'none', token: '', username: '', password: '' },
});

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'form', label: 'Form (urlencoded)' },
  { value: 'text', label: 'Raw text' },
  { value: 'multipart', label: 'Multipart form' },
];

const COMMON_HEADERS = [
  'Accept',
  'Accept-Language',
  'Authorization',
  'Cache-Control',
  'Content-Type',
  'Cookie',
  'If-None-Match',
  'Origin',
  'User-Agent',
  'X-API-Key',
  'X-Request-ID',
];

function KvTable({
  label,
  rows,
  onChange,
  keyList,
  addLabel,
}: {
  label: string;
  rows: KV[];
  onChange: (rows: KV[]) => void;
  keyList?: string;
  addLabel: string;
}) {
  const update = (i: number, patch: Partial<KV>) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2" role="group" aria-label={label}>
      {rows.length === 0 && (
        <p className="text-sm text-gray-500">No {label.toLowerCase()} yet.</p>
      )}
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2"
        >
          <input
            type="checkbox"
            checked={r.enabled}
            onChange={(e) => update(i, { enabled: e.target.checked })}
            aria-label={`Include ${label.toLowerCase()} row ${i + 1}`}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <input
            value={r.key}
            onChange={(e) => update(i, { key: e.target.value })}
            placeholder="Key"
            aria-label={`${label} row ${i + 1} key`}
            list={keyList}
            spellCheck={false}
            className={`${inputBase} font-mono ${r.enabled ? '' : 'opacity-60'}`}
          />
          <input
            value={r.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder="Value"
            aria-label={`${label} row ${i + 1} value`}
            spellCheck={false}
            className={`${inputBase} font-mono ${r.enabled ? '' : 'opacity-60'}`}
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Remove ${label.toLowerCase()} row ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className={btnSecondary}
        onClick={() =>
          onChange([...rows, { enabled: true, key: '', value: '' }])
        }
      >
        + {addLabel}
      </button>
    </div>
  );
}

function Section({
  title,
  children,
  aside,
}: {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function HttpRequestTool(_: ToolProps) {
  const [spec, setSpec] = useState<RequestSpec>(initialSpec);
  const [target, setTarget] = useState<SnippetTarget>('curl');
  const [showSecret, setShowSecret] = useState(false);
  const urlId = useId();
  const headerList = useId();
  const bodyName = useId();

  const set = (patch: Partial<RequestSpec>) =>
    setSpec((s) => ({ ...s, ...patch }));

  const onUrl = (url: string) =>
    setSpec((s) => ({
      ...s,
      url,
      params: mergeParams(splitUrl(url).params, s.params),
    }));

  const onParams = (params: KV[]) =>
    setSpec((s) => {
      const { base, hash } = splitUrl(s.url);
      return { ...s, params, url: buildUrl(base, params, hash) };
    });

  const setAuth = (patch: Partial<RequestSpec['auth']>) =>
    setSpec((s) => ({ ...s, auth: { ...s.auth, ...patch } }));

  const urlError = validateUrl(spec.url);
  const warnings = useMemo(() => requestWarnings(spec), [spec]);
  const snippet = useMemo(
    () => (urlError ? '' : generateSnippet(spec, target)),
    [spec, target, urlError],
  );

  let jsonError = '';
  if (spec.bodyType === 'json' && spec.body.trim())
    try {
      JSON.parse(spec.body);
    } catch (e) {
      jsonError = e instanceof Error ? e.message : 'Invalid JSON';
    }

  const label = SNIPPET_TARGETS.find((t) => t.id === target)?.label ?? '';

  return (
    <div className="space-y-5">
      <Notice tone="amber">
        <strong>This builder never sends your request.</strong> Browsers block a
        web page from calling most other sites’ APIs unless those APIs allow it
        (CORS), so copy the generated code and run it in your terminal or app.
        Tokens and passwords stay in this tab’s memory and are not saved.
      </Notice>

      <div className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <SelectField
          label="Method"
          value={spec.method}
          onChange={(method) => set({ method })}
          options={METHODS.map((m) => ({ value: m, label: m }))}
        />
        <div className="space-y-1.5">
          <label htmlFor={urlId} className={labelBase}>
            URL
          </label>
          <input
            id={urlId}
            type="url"
            inputMode="url"
            value={spec.url}
            onChange={(e) => onUrl(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={!!urlError}
            aria-describedby={urlError ? `${urlId}-err` : undefined}
            className={`${inputBase} font-mono`}
          />
          {urlError && (
            <p id={`${urlId}-err`} className="text-xs text-red-700">
              {urlError}
            </p>
          )}
        </div>
      </div>

      <Section
        title={`Query parameters (${spec.params.filter((p) => p.enabled && p.key).length})`}
      >
        <KvTable
          label="Query parameters"
          rows={spec.params}
          onChange={onParams}
          addLabel="Add parameter"
        />
        <p className="text-xs text-gray-500">
          Kept in sync with the URL. Unticked rows are left out of the URL.
        </p>
      </Section>

      <Section title="Headers">
        <datalist id={headerList}>
          {COMMON_HEADERS.map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
        <KvTable
          label="Headers"
          rows={spec.headers}
          onChange={(headers) => set({ headers })}
          keyList={headerList}
          addLabel="Add header"
        />
        <p className="text-xs text-gray-500">
          Content-Type is added automatically for the body type unless you set
          one yourself.
        </p>
      </Section>

      <Section title="Body">
        <fieldset>
          <legend className="sr-only">Body type</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {BODY_TYPES.map((b) => (
              <label
                key={b.value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name={bodyName}
                  value={b.value}
                  checked={spec.bodyType === b.value}
                  onChange={() => set({ bodyType: b.value })}
                  className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                {b.label}
              </label>
            ))}
          </div>
        </fieldset>
        {(spec.bodyType === 'json' || spec.bodyType === 'text') && (
          <ToolInput
            label={spec.bodyType === 'json' ? 'JSON body' : 'Text body'}
            value={spec.body}
            onChange={(body) => set({ body })}
            rows={7}
            actions={
              spec.bodyType === 'json' ? (
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={!!jsonError || !spec.body.trim()}
                  onClick={() =>
                    set({
                      body: JSON.stringify(JSON.parse(spec.body), null, 2),
                    })
                  }
                >
                  Format JSON
                </button>
              ) : undefined
            }
          />
        )}
        {spec.bodyType === 'json' && (
          <p
            className={`text-xs ${jsonError ? 'text-red-700' : 'text-emerald-700'}`}
            aria-live="polite"
          >
            {!spec.body.trim()
              ? ''
              : jsonError
                ? `Invalid JSON: ${jsonError}`
                : '✓ Valid JSON'}
          </p>
        )}
        {(spec.bodyType === 'form' || spec.bodyType === 'multipart') && (
          <KvTable
            label="Form fields"
            rows={spec.fields}
            onChange={(fields) => set({ fields })}
            addLabel="Add field"
          />
        )}
        {spec.bodyType === 'multipart' && (
          <p className="text-xs text-gray-500">
            Text fields only — files can’t be embedded in generated code. Add a
            file part by hand, e.g. <code>-F 'file=@photo.jpg'</code> in cURL.
            The multipart boundary is set by the client, so no Content-Type
            header is written.
          </p>
        )}
      </Section>

      <Section title="Authorization">
        <SelectField
          label="Type"
          value={spec.auth.type}
          onChange={(v) => setAuth({ type: v as AuthType })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'bearer', label: 'Bearer token' },
            { value: 'basic', label: 'Basic (username + password)' },
          ]}
          className="max-w-xs"
        />
        {spec.auth.type === 'bearer' && (
          <TextField
            label="Token"
            value={spec.auth.token}
            onChange={(token) => setAuth({ token })}
            type={showSecret ? 'text' : 'password'}
            mono
          />
        )}
        {spec.auth.type === 'basic' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Username"
              value={spec.auth.username}
              onChange={(username) => setAuth({ username })}
              mono
            />
            <TextField
              label="Password"
              value={spec.auth.password}
              onChange={(password) => setAuth({ password })}
              type={showSecret ? 'text' : 'password'}
              mono
            />
          </div>
        )}
        {spec.auth.type !== 'none' && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showSecret}
                onChange={(e) => setShowSecret(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              Show {spec.auth.type === 'bearer' ? 'token' : 'password'}
            </label>
            <p className="text-xs text-gray-500">
              Turned into an Authorization header in the code. Not stored — it’s
              gone when you close the tab. Remember the generated code contains
              it.
            </p>
          </div>
        )}
      </Section>

      {warnings.length > 0 && (
        <Notice tone="amber">
          <ul className="list-disc space-y-1 pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Notice>
      )}

      <div className="space-y-3">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Code language"
        >
          {SNIPPET_TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={target === t.id}
              onClick={() => setTarget(t.id)}
              className={`rounded-lg border px-2.5 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${target === t.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {urlError ? (
          <ErrorMessage>Fix the URL to generate code.</ErrorMessage>
        ) : (
          <CodePanel css={snippet} title={label} copyLabel="Copy code" />
        )}
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setSpec(initialSpec());
            setShowSecret(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
