'use client';

import { useEffect, useState } from 'react';
import {
  formatBytes,
  outputName,
  type ImageFormat,
} from '@/lib/online-tools/image/core';
import { imageSize, processImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  btnPrimary,
  btnSecondary,
  useObjectUrl,
} from '../ui';

type Tags = Record<string, unknown>;

const GROUPS: { title: string; keys: string[] }[] = [
  {
    title: 'Camera',
    keys: ['Make', 'Model', 'LensModel', 'LensMake', 'Software'],
  },
  {
    title: 'Settings',
    keys: [
      'ExposureTime',
      'FNumber',
      'ISO',
      'FocalLength',
      'FocalLengthIn35mmFormat',
      'Flash',
      'WhiteBalance',
      'ExposureProgram',
      'MeteringMode',
    ],
  },
  {
    title: 'Date',
    keys: [
      'DateTimeOriginal',
      'CreateDate',
      'ModifyDate',
      'OffsetTimeOriginal',
    ],
  },
  {
    title: 'Image',
    keys: [
      'ImageWidth',
      'ImageHeight',
      'ExifImageWidth',
      'ExifImageHeight',
      'Orientation',
      'ColorSpace',
      'XResolution',
      'YResolution',
    ],
  },
  {
    title: 'Author',
    keys: ['Artist', 'Copyright', 'ImageDescription', 'OwnerName'],
  },
];

function show(v: unknown): string {
  if (v instanceof Date) return v.toLocaleString();
  if (typeof v === 'number')
    return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4)));
  if (Array.isArray(v)) return v.join(', ');
  if (v && typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function ExifViewerTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<Tags | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [error, setError] = useState('');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const url = useObjectUrl(file);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        const exifr = (await import('exifr')).default;
        const data = (await exifr.parse(file, {
          tiff: true,
          exif: true,
          gps: true,
          xmp: true,
          iptc: true,
          icc: false,
          mergeOutput: true,
        })) as Tags | undefined;
        if (!cancelled) setTags(data ?? {});
      } catch {
        if (!cancelled) setTags({});
      }
      imageSize(file)
        .then((s) => !cancelled && setSize(s))
        .catch(() => undefined);
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const strip = async () => {
    if (!file) return;
    try {
      const fmt: ImageFormat =
        file.type === 'image/png'
          ? 'png'
          : file.type === 'image/webp'
            ? 'webp'
            : 'jpg';
      const r = await processImage(file, {
        format: fmt,
        quality: fmt === 'png' ? undefined : 0.95,
      });
      setResults([
        {
          name: outputName(file.name, fmt, '-no-metadata'),
          blob: r.blob,
          width: r.width,
          height: r.height,
          originalSize: file.size,
        },
      ]);
    } catch {
      setError(
        'This image could not be re-encoded in your browser (HEIC/TIFF files may not be supported).',
      );
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="image/*,.heic,.heif,.tif,.tiff"
        onFiles={(f) => (setError(''), setFile(f[0]))}
        hint="JPG, HEIC, PNG, WebP or TIFF"
      />
    );

  const lat = typeof tags?.latitude === 'number' ? tags.latitude : null;
  const lon = typeof tags?.longitude === 'number' ? tags.longitude : null;
  const count = tags ? Object.keys(tags).length : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        {url && (
          <img
            src={url}
            alt=""
            className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
          />
        )}
        <div className="text-sm">
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-gray-500">
            {formatBytes(file.size)} · {file.type || 'unknown type'}
            {size ? ` · ${size.width}×${size.height}` : ''}
          </p>
        </div>
        <button
          type="button"
          className={`${btnSecondary} ml-auto`}
          onClick={() => {
            setFile(null);
            setTags(null);
            setResults([]);
          }}
        >
          Choose another
        </button>
      </div>

      {tags && count === 0 && (
        <Notice tone="green">
          No EXIF metadata found — this image is already clean.
        </Notice>
      )}
      {lat !== null && lon !== null && (
        <Notice tone="amber">
          📍 This photo contains GPS coordinates:{' '}
          <span className="font-mono">
            {lat.toFixed(6)}, {lon.toFixed(6)}
          </span>
          .{' '}
          <a
            className="underline"
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on map ↗
          </a>{' '}
          Anyone you send the original file to can see this location.
        </Notice>
      )}

      {tags && count > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {GROUPS.map((g) => {
            const rows = g.keys.filter((k) => tags[k] !== undefined);
            if (!rows.length) return null;
            return (
              <div
                key={g.title}
                className="rounded-2xl border border-gray-100 p-4"
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  {g.title}
                </h3>
                <dl className="space-y-1 text-sm">
                  {rows.map((k) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="break-all text-right text-gray-900">
                        {show(tags[k])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
      {tags && count > 0 && (
        <details
          open={showAll}
          onToggle={(e) => setShowAll((e.target as HTMLDetailsElement).open)}
          className="rounded-2xl border border-gray-100"
        >
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">
            All {count} tags
          </summary>
          <dl className="max-h-96 space-y-1 overflow-auto px-4 pb-4 text-xs">
            {Object.entries(tags).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 border-t border-gray-50 py-1"
              >
                <dt className="text-gray-500">{k}</dt>
                <dd className="break-all text-right font-mono text-gray-900">
                  {show(v).slice(0, 300)}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      <button type="button" className={btnPrimary} onClick={strip}>
        Download without metadata
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
