'use client';

// Shared pieces for the page-editing PDF tools: loading a PDF and showing one
// page at a time as a preview image.

import { useCallback, useEffect, useState } from 'react';
import { pageCount } from '@/lib/online-tools/pdf/core';
import { btnSecondary, friendlyError } from '../ui';

export const PDF_ACCEPT = 'application/pdf,.pdf';

export const pdfBlob = (bytes: Uint8Array) =>
  new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });

/** Loads a PDF file and reports its page count or a friendly error. */
export function usePdfFile() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const load = useCallback(async (f: File) => {
    setError('');
    try {
      const buf = await f.arrayBuffer();
      const n = await pageCount(buf);
      setFile(f);
      setBuffer(buf);
      setTotal(n);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  }, []);
  const clear = useCallback(() => {
    setFile(null);
    setBuffer(null);
    setTotal(0);
  }, []);
  return { file, buffer, total, error, setError, load, clear };
}

/** Renders one page (as shown in viewers: crop box and rotation applied). */
export function usePagePreview(
  buffer: ArrayBuffer | null,
  page: number,
  width = 760,
) {
  const [preview, setPreview] = useState<{
    url: string;
    aspect: number;
    page: number;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!buffer) return;
    let cancelled = false;
    setFailed(false);
    (async () => {
      const { renderThumbnail } = await import('@/lib/online-tools/pdf/render');
      const url = await renderThumbnail(buffer, page, width);
      const img = new Image();
      img.onload = () =>
        !cancelled && setPreview({ url, aspect: img.width / img.height, page });
      img.src = url;
    })().catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [buffer, page, width]);
  return { preview: preview?.page === page ? preview : null, failed };
}

export function PageNav({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total < 2) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <button
        type="button"
        className={`${btnSecondary} !px-3 !py-1.5`}
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        ←
      </button>
      <label className="flex items-center gap-1">
        Page
        <input
          type="number"
          min={1}
          max={total}
          value={page + 1}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= 1 && v <= total) onChange(v - 1);
          }}
          className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center"
        />
        of {total}
      </label>
      <button
        type="button"
        className={`${btnSecondary} !px-3 !py-1.5`}
        disabled={page >= total - 1}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );
}
