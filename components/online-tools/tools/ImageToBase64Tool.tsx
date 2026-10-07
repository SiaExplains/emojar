'use client';

import { useEffect, useState } from 'react';
import { formatBytes } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  ToolOutput,
  btnSecondary,
} from '../ui';

const MAX = 20 * 1024 * 1024;

export default function ImageToBase64Tool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dataUri, setDataUri] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) return setDataUri('');
    const reader = new FileReader();
    reader.onload = () => setDataUri(String(reader.result));
    reader.onerror = () => setError('The file could not be read.');
    reader.readAsDataURL(file);
    return () => reader.abort();
  }, [file]);

  const b64 = dataUri.replace(/^data:[^,]*,/, '');

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFiles={(f) => {
            setError('');
            if (f[0].size > MAX)
              return setError(
                'Please choose an image smaller than 20 MB — Base64 for larger files is impractical to use.',
              );
            setFile(f[0]);
          }}
          hint="PNG, JPG, GIF, WebP, SVG, ICO"
        />
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          {dataUri && (
            <img
              src={dataUri}
              alt=""
              className="h-16 w-16 rounded-lg border border-gray-100 object-contain"
            />
          )}
          <p className="text-sm text-gray-600">
            {file.name} · {formatBytes(file.size)} → {formatBytes(b64.length)}{' '}
            as Base64
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setFile(null)}
          >
            Choose another
          </button>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {dataUri && (
        <div className="space-y-4">
          {file && file.size > 100 * 1024 && (
            <Notice tone="amber">
              This image is over 100 KB. Inlining it as Base64 will make your
              HTML or CSS noticeably heavier.
            </Notice>
          )}
          <ToolOutput label="Data URI" value={dataUri} rows={4} />
          <ToolOutput label="Base64 only" value={b64} rows={4} />
          <ToolOutput
            label="HTML <img>"
            value={`<img src="${dataUri}" alt="" />`}
            rows={3}
          />
          <ToolOutput
            label="CSS background"
            value={`background-image: url("${dataUri}");`}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
