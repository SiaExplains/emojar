'use client';

import { useState } from 'react';
import { formatBytes, outputName } from '@/lib/online-tools/image/core';
import {
  readMetadata,
  writeMetadata,
  type PdfMetadata,
} from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

const fmtDate = (d?: Date) => (d ? d.toLocaleString() : '—');
const mm = (pt: number) => Math.round((pt / 72) * 25.4);

export default function PdfMetadataTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PdfMetadata | null>(null);
  const [edit, setEdit] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: '',
  });
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');

  const load = async (f: File) => {
    setError('');
    setResults([]);
    try {
      const m = await readMetadata(await f.arrayBuffer());
      setFile(f);
      setMeta(m);
      setEdit({
        title: m.title ?? '',
        author: m.author ?? '',
        subject: m.subject ?? '',
        keywords: m.keywords ?? '',
      });
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  };

  const save = async () => {
    if (!file) return;
    try {
      const bytes = await writeMetadata(await file.arrayBuffer(), edit);
      setResults([
        {
          name: outputName(file.name, 'pdf', '-edited'),
          blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The metadata could not be saved.'));
    }
  };

  if (!file || !meta)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => load(f[0])}
          label="Choose a PDF or drop it here"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const sizes = Array.from(
    new Set(meta.pageSizes.map((s) => `${mm(s.width)} × ${mm(s.height)} mm`)),
  );
  const rows: [string, string][] = [
    ['File size', formatBytes(file.size)],
    ['Pages', String(meta.pages)],
    [
      'Page size',
      sizes.slice(0, 3).join(', ') + (sizes.length > 3 ? ' …' : ''),
    ],
    ['Creator (app)', meta.creator || '—'],
    ['Producer', meta.producer || '—'],
    ['Created', fmtDate(meta.created)],
    ['Modified', fmtDate(meta.modified)],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong>
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setMeta(null);
          }}
        >
          Choose another PDF
        </button>
      </div>
      <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-100 px-4">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2 text-sm">
            <dt className="text-gray-500">{k}</dt>
            <dd className="text-right text-gray-900">{v}</dd>
          </div>
        ))}
      </dl>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-gray-900">
          Editable properties
        </legend>
        <TextField
          label="Title"
          value={edit.title}
          onChange={(v) => setEdit({ ...edit, title: v })}
        />
        <TextField
          label="Author"
          value={edit.author}
          onChange={(v) => setEdit({ ...edit, author: v })}
        />
        <TextField
          label="Subject"
          value={edit.subject}
          onChange={(v) => setEdit({ ...edit, subject: v })}
        />
        <TextField
          label="Keywords (comma-separated)"
          value={edit.keywords}
          onChange={(v) => setEdit({ ...edit, keywords: v })}
        />
      </fieldset>
      <button type="button" className={btnPrimary} onClick={save}>
        Save & download PDF
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
