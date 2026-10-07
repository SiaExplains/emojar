'use client';

import { useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import {
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  Notice,
  ToolOutput,
  btnSecondary,
  friendlyError,
} from '../ui';

export default function PdfToTextTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const extract = async (f: File) => {
    setFile(f);
    setBusy(true);
    setError('');
    setText('');
    try {
      const { extractPdfText } = await import('@/lib/online-tools/pdf/render');
      const pages = await extractPdfText(await f.arrayBuffer(), (done, total) =>
        setProgress({ done, total }),
      );
      setText(
        pages.map((p) => `--- Page ${p.page} ---\n${p.text}`).join('\n\n'),
      );
      if (pages.every((p) => !p.text))
        setError(
          'No text was found. This PDF is probably a scanned image — text extraction needs a real text layer.',
        );
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => extract(f[0])}
          label="Choose a PDF or drop it here"
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-700">
            📄 <strong>{file.name}</strong>
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setFile(null);
              setText('');
              setError('');
            }}
          >
            Choose another PDF
          </button>
        </div>
      )}
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Reading pages"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {text && !error && (
        <Notice tone="green">
          Text extracted from {progress.total} page
          {progress.total === 1 ? '' : 's'}.
        </Notice>
      )}
      {text && (
        <ToolOutput
          label="Extracted text"
          value={text}
          rows={16}
          mono={false}
          filename={outputName(file?.name ?? 'document', 'txt')}
        />
      )}
    </div>
  );
}
