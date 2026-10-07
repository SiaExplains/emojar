'use client';

import { useEffect, useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import {
  fillForm,
  readForm,
  type FieldInfo,
} from '@/lib/online-tools/pdf/edit';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  Notice,
  btnPrimary,
  btnSecondary,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';
import {
  PDF_ACCEPT,
  PageNav,
  pdfBlob,
  usePagePreview,
  usePdfFile,
} from './pdf-shared';

type Value = string | boolean | string[];

/** "applicant.first_name" / "FirstName" → "First name". */
function prettyName(name: string): string {
  const last = name.split('.').pop() ?? name;
  const words = last
    .replace(/\[\d+\]$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : name;
}

export default function PdfFormTool(_: ToolProps) {
  const { file, buffer, total, error, setError, load, clear } = usePdfFile();
  const [fields, setFields] = useState<FieldInfo[] | null>(null);
  const [hasXfa, setHasXfa] = useState(false);
  const [values, setValues] = useState<Record<string, Value>>({});
  const [flatten, setFlatten] = useState(false);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [busy, setBusy] = useState(false);
  const { preview } = usePagePreview(buffer, page, 640);

  useEffect(() => {
    if (!buffer) return;
    let cancelled = false;
    setFields(null);
    setResults([]);
    setPage(0);
    readForm(buffer)
      .then((info) => {
        if (cancelled) return;
        const fillable = info.fields.filter(
          (f) =>
            f.type !== 'button' && f.type !== 'signature' && f.type !== 'other',
        );
        setFields(fillable);
        setHasXfa(info.hasXfa);
        setValues(Object.fromEntries(fillable.map((f) => [f.name, f.value])));
      })
      .catch(
        (e) =>
          !cancelled &&
          setError(friendlyError(e, 'The form fields could not be read.')),
      );
    return () => {
      cancelled = true;
    };
  }, [buffer, setError]);

  const set = (name: string, v: Value) =>
    setValues((cur) => ({ ...cur, [name]: v }));

  const run = async () => {
    if (!buffer || !file || !fields) return;
    const missing = fields.filter(
      (f) =>
        f.required &&
        !f.readOnly &&
        (values[f.name] === '' ||
          values[f.name] === false ||
          (Array.isArray(values[f.name]) &&
            !(values[f.name] as string[]).length)),
    );
    if (missing.length) {
      setError(
        `Please fill in the required field${missing.length > 1 ? 's' : ''}: ${missing.map((f) => prettyName(f.name)).join(', ')}.`,
      );
      return;
    }
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const changed = Object.fromEntries(
        fields.filter((f) => !f.readOnly).map((f) => [f.name, values[f.name]]),
      );
      const bytes = await fillForm(buffer, changed, { flatten });
      setResults([
        {
          name: outputName(
            file.name,
            'pdf',
            flatten ? '-filled-flattened' : '-filled',
          ),
          blob: pdfBlob(bytes),
          note: flatten
            ? 'Flattened — fields are no longer editable'
            : 'Fields stay editable',
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The form could not be filled.'));
    } finally {
      setBusy(false);
    }
  };

  if (!file || !buffer)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept={PDF_ACCEPT}
          onFiles={(f) => load(f[0])}
          label="Choose a PDF form or drop it here"
          hint="Application forms, tax forms, contracts with fillable fields"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const fieldControl = (f: FieldInfo) => {
    const id = `ff-${f.name}`;
    const v = values[f.name];
    const label = (
      <label htmlFor={id} className={labelBase}>
        {prettyName(f.name)}
        {f.required && <span className="text-red-600"> *</span>}
        {f.readOnly && (
          <span className="ml-1 text-xs font-normal text-gray-400">
            (read-only)
          </span>
        )}
      </label>
    );
    if (f.type === 'checkbox')
      return (
        <Checkbox
          label={prettyName(f.name) + (f.required ? ' *' : '')}
          checked={Boolean(v)}
          onChange={(c) => !f.readOnly && set(f.name, c)}
        />
      );
    if (f.type === 'radio')
      return (
        <fieldset className="space-y-1.5">
          <legend className={labelBase}>
            {prettyName(f.name)}
            {f.required && <span className="text-red-600"> *</span>}
          </legend>
          <div className="flex flex-wrap gap-3">
            {f.options.map((o) => (
              <label
                key={o}
                className="inline-flex items-center gap-1.5 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name={id}
                  checked={v === o}
                  disabled={f.readOnly}
                  onChange={() => set(f.name, o)}
                />
                {o}
              </label>
            ))}
            {!f.readOnly && v !== '' && (
              <button
                type="button"
                className="text-xs text-indigo-700 hover:underline"
                onClick={() => set(f.name, '')}
              >
                Clear
              </button>
            )}
          </div>
        </fieldset>
      );
    if (f.type === 'dropdown')
      return (
        <div className="space-y-1.5">
          {label}
          <select
            id={id}
            value={String(v ?? '')}
            disabled={f.readOnly}
            onChange={(e) => set(f.name, e.target.value)}
            className={inputBase}
          >
            <option value="">—</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    if (f.type === 'list')
      return (
        <div className="space-y-1.5">
          {label}
          <select
            id={id}
            multiple={f.multiSelect}
            value={f.multiSelect ? (v as string[]) : ((v as string[])[0] ?? '')}
            disabled={f.readOnly}
            onChange={(e) =>
              set(
                f.name,
                Array.from(e.target.selectedOptions, (o) => o.value),
              )
            }
            className={inputBase}
          >
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    return (
      <div className="space-y-1.5">
        {label}
        {f.multiline ? (
          <textarea
            id={id}
            rows={3}
            value={String(v ?? '')}
            readOnly={f.readOnly}
            maxLength={f.maxLength}
            onChange={(e) => set(f.name, e.target.value)}
            className={inputBase}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={String(v ?? '')}
            readOnly={f.readOnly}
            maxLength={f.maxLength}
            onChange={(e) => set(f.name, e.target.value)}
            className={inputBase}
          />
        )}
        {f.maxLength != null && (
          <p className="text-xs text-gray-400">
            Up to {f.maxLength} characters
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
          {fields &&
            ` · ${fields.length} fillable field${fields.length === 1 ? '' : 's'}`}
        </p>
        <button type="button" className={btnSecondary} onClick={clear}>
          Choose another PDF
        </button>
      </div>

      {fields && fields.length === 0 ? (
        <div className="space-y-3">
          <Notice tone="amber">
            This PDF has no fillable form fields
            {hasXfa
              ? ' (it uses the XFA format, which only Adobe Reader can fill)'
              : ''}
            . You can still type onto it with{' '}
            <a
              href="/online-tool/pdf-tools/edit-pdf"
              className="font-medium underline"
            >
              Edit PDF
            </a>
            .
          </Notice>
          <div className="mx-auto max-w-[520px] space-y-2">
            <PageNav page={page} total={total} onChange={setPage} />
            {preview && (
              <img
                src={preview.url}
                alt={`Page ${page + 1}`}
                className="w-full rounded border border-gray-200 shadow-sm"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="order-2 space-y-4 lg:order-1">
            {!fields ? (
              <p className="text-sm text-gray-500">Reading form fields…</p>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run();
                }}
              >
                {hasXfa && (
                  <Notice tone="amber">
                    This form also contains Adobe XFA data. It will be removed
                    so that every PDF viewer shows the values you enter here.
                  </Notice>
                )}
                {fields.map((f) => (
                  <div key={f.name}>{fieldControl(f)}</div>
                ))}
                <Checkbox
                  label="Flatten the form (values become part of the page and can’t be edited)"
                  checked={flatten}
                  onChange={setFlatten}
                />
                <button type="submit" className={btnPrimary} disabled={busy}>
                  {busy ? 'Saving…' : 'Save filled PDF'}
                </button>
              </form>
            )}
          </div>
          <div className="order-1 space-y-2 lg:order-2">
            <PageNav page={page} total={total} onChange={setPage} />
            {preview && (
              <img
                src={preview.url}
                alt={`Page ${page + 1} of the form`}
                className="w-full rounded border border-gray-200 shadow-sm"
              />
            )}
            <p className="text-xs text-gray-500">
              Preview of the original form, for finding the fields.
            </p>
          </div>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
