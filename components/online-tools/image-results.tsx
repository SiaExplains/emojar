'use client';

import { useState } from 'react';
import {
  formatBytes,
  savingsPercent,
  uniqueNames,
} from '@/lib/online-tools/image/core';
import { zipFiles } from './tools/image-shared';
import { btnSecondary, downloadBlob, useObjectUrl } from './ui';

/** One-click ZIP of several results, built in the browser. */
export function ZipButton({
  files,
  zipName,
}: {
  files: { name: string; blob: Blob }[];
  zipName: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={btnSecondary}
      disabled={busy || files.length < 2}
      onClick={async () => {
        setBusy(true);
        try {
          const names = uniqueNames(files.map((f) => f.name));
          const zip = await zipFiles(
            files.map((f, i) => ({ name: names[i], data: f.blob })),
          );
          downloadBlob(zip, zipName);
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? 'Zipping…' : '🗜️ Download ZIP'}
    </button>
  );
}

export type OutputItem = {
  name: string;
  blob: Blob;
  width?: number;
  height?: number;
  originalSize?: number;
  note?: string;
};

function ResultCard({ item }: { item: OutputItem }) {
  const url = useObjectUrl(
    item.blob.type.startsWith('image/') ? item.blob : null,
  );
  const saved = item.originalSize
    ? savingsPercent(item.originalSize, item.blob.size)
    : null;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-100 p-2.5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:12px_12px]">
        {url ? (
          <img
            src={url}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span aria-hidden className="text-2xl">
            📄
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {item.name}
        </p>
        <p className="text-xs text-gray-500">
          {item.width && item.height ? `${item.width}×${item.height} · ` : ''}
          {formatBytes(item.blob.size)}
          {item.originalSize
            ? ` (was ${formatBytes(item.originalSize)}${saved !== null ? `, ${saved >= 0 ? `−${saved}%` : `+${-saved}%`}` : ''})`
            : ''}
          {item.note ? ` · ${item.note}` : ''}
        </p>
      </div>
      <button
        type="button"
        className={btnSecondary}
        onClick={() => downloadBlob(item.blob, item.name)}
      >
        ⬇ <span className="hidden sm:inline">Download</span>
      </button>
    </li>
  );
}

export function OutputList({
  items,
  zipName = 'emojar-files.zip',
}: {
  items: OutputItem[];
  zipName?: string;
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {items.length} file{items.length === 1 ? '' : 's'} ready
        </h3>
        {items.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <ZipButton files={items} zipName={zipName} />
            <button
              type="button"
              className={btnSecondary}
              onClick={() =>
                items.forEach((it, i) =>
                  window.setTimeout(
                    () => downloadBlob(it.blob, it.name),
                    i * 250,
                  ),
                )
              }
            >
              ⬇ Download each
            </button>
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <ResultCard key={`${it.name}-${i}`} item={it} />
        ))}
      </ul>
    </div>
  );
}

export function SelectedFiles({
  files,
  onRemove,
  onClear,
}: {
  files: File[];
  onRemove: (i: number) => void;
  onClear: () => void;
}) {
  if (!files.length) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {files.length} file{files.length === 1 ? '' : 's'} selected
        </p>
        <button
          type="button"
          className="text-xs text-gray-500 underline hover:text-gray-800"
          onClick={onClear}
        >
          Clear all
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {files.map((f, i) => (
          <li
            key={`${f.name}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-1 text-xs text-gray-700"
          >
            <span className="max-w-[180px] truncate">{f.name}</span>
            <span className="text-gray-400">{formatBytes(f.size)}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded-full px-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label={`Remove ${f.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
