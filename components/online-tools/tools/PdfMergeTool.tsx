'use client';

import { useState } from 'react';
import { formatBytes } from '@/lib/online-tools/image/core';
import { mergePdfs } from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  btnPrimary,
  friendlyError,
} from '../ui';

const isPdf = (f: File) =>
  f.type === 'application/pdf' || /\.pdf$/i.test(f.name);

export default function PdfMergeTool(_: ToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const move = (i: number, d: -1 | 1) =>
    setFiles((cur) => {
      const next = [...cur];
      const j = i + d;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const merge = async () => {
    setBusy(true);
    setError('');
    setResults([]);
    setProgress({ done: 0, total: files.length });
    try {
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const bytes = await mergePdfs(buffers, (done) =>
        setProgress({ done, total: files.length }),
      );
      setResults([
        {
          name: 'merged.pdf',
          blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
          note: `${files.length} files combined`,
        },
      ]);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'The PDFs could not be merged. Please make sure every file is a valid, unencrypted PDF.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept="application/pdf,.pdf"
        onFiles={(list) => {
          const pdfs = list.filter(isPdf);
          setError(
            pdfs.length < list.length
              ? 'Only PDF files can be merged; other files were skipped.'
              : '',
          );
          setFiles((cur) => [...cur, ...pdfs]);
          setResults([]);
        }}
        label="Choose PDF files or drop them here"
        hint="Add two or more PDFs"
      />
      {files.length > 0 && (
        <ol className="space-y-2" aria-label="Merge order">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2"
            >
              <span className="w-6 text-center text-sm font-semibold text-gray-400">
                {i + 1}
              </span>
              <span aria-hidden>📄</span>
              <span className="min-w-0 flex-1 truncate text-sm text-gray-900">
                {f.name}
              </span>
              <span className="text-xs text-gray-400">
                {formatBytes(f.size)}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  aria-label={`Move ${f.name} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                  className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  aria-label={`Move ${f.name} down`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFiles((cur) => cur.filter((_, k) => k !== i))
                  }
                  className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
                  aria-label={`Remove ${f.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        className={btnPrimary}
        onClick={merge}
        disabled={files.length < 2 || busy}
      >
        {busy
          ? 'Merging…'
          : files.length < 2
            ? 'Add at least 2 PDFs'
            : `Merge ${files.length} PDFs`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Merging"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
