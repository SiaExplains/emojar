'use client';

import { useMemo, useState } from 'react';
import { base64ToBytes } from '@/lib/online-tools/engines/data';
import { detectImageType, formatBytes } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import {
  DownloadButton,
  ErrorMessage,
  ToolInput,
  friendlyError,
  useObjectUrl,
} from '../ui';

export default function Base64ToImageTool(_: ToolProps) {
  const [input, setInput] = useState('');

  const decoded = useMemo(():
    | { error: string }
    | { blob: Blob; ext: string; size: number }
    | null => {
    if (!input.trim()) return null;
    try {
      const bytes = base64ToBytes(input);
      const type = detectImageType(bytes);
      if (!type)
        return {
          error:
            'The decoded data is not a recognised image (PNG, JPG, GIF, WebP, BMP, ICO or SVG). Check that the Base64 text is complete.',
        };
      return {
        blob: new Blob([new Uint8Array(bytes)], { type: type.mime }),
        ext: type.ext,
        size: bytes.length,
      };
    } catch (e) {
      return { error: friendlyError(e) };
    }
  }, [input]);

  const blob = decoded && 'blob' in decoded ? decoded.blob : null;
  const url = useObjectUrl(blob);

  return (
    <div className="space-y-5">
      <ToolInput
        label="Base64 string or data URI"
        value={input}
        onChange={setInput}
        rows={6}
        placeholder="data:image/png;base64,iVBORw0KGgo…"
      />
      {decoded && 'error' in decoded && (
        <ErrorMessage>{decoded.error}</ErrorMessage>
      )}
      {decoded && 'blob' in decoded && url && (
        <div className="space-y-3">
          <div className="flex justify-center rounded-2xl bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px] p-4">
            <img
              src={url}
              alt="Decoded image preview"
              className="max-h-80 max-w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span>
              Detected: <strong>{decoded.ext.toUpperCase()}</strong> ·{' '}
              {formatBytes(decoded.size)}
            </span>
            <DownloadButton
              data={decoded.blob}
              filename={`image.${decoded.ext}`}
              label={`Download .${decoded.ext}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
