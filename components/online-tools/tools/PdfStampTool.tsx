'use client';

// Shared UI for "Add page numbers" and "Watermark PDF": both take one PDF,
// a few options, and stamp every page.

import { useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import {
  addPageNumbers,
  addTextWatermark,
  pageCount,
  type NumberFormat,
  type NumberPosition,
} from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  NumberField,
  RangeField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

export function PdfStampTool({ kind }: { kind: 'numbers' | 'watermark' }) {
  const [file, setFile] = useState<File | null>(null);
  const [total, setTotal] = useState(0);
  const [position, setPosition] = useState<NumberPosition>('bottom-center');
  const [format, setFormat] = useState<NumberFormat>('page-n-of-total');
  const [start, setStart] = useState('1');
  const [fontSize, setFontSize] = useState(11);
  const [skipFirst, setSkipFirst] = useState(false);
  const [text, setText] = useState('CONFIDENTIAL');
  const [wmSize, setWmSize] = useState(60);
  const [color, setColor] = useState('#dc2626');
  const [opacity, setOpacity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [layout, setLayout] = useState<'center' | 'tile'>('center');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (f: File) => {
    setError('');
    setResults([]);
    try {
      setTotal(await pageCount(await f.arrayBuffer()));
      setFile(f);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const buf = await file.arrayBuffer();
      const out =
        kind === 'numbers'
          ? await addPageNumbers(buf, {
              position,
              format,
              start: Math.max(0, Math.floor(Number(start)) || 1),
              fontSize,
              skipFirst,
            })
          : await addTextWatermark(buf, {
              text,
              fontSize: wmSize,
              color,
              opacity: opacity / 100,
              angle,
              position: layout,
            });
      setResults([
        {
          name: outputName(
            file.name,
            'pdf',
            kind === 'numbers' ? '-numbered' : '-watermarked',
          ),
          blob: new Blob([new Uint8Array(out)], { type: 'application/pdf' }),
          note: `${total} pages`,
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be processed.'));
    } finally {
      setBusy(false);
    }
  };

  if (!file)
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => (setFile(null), setResults([]))}
        >
          Choose another PDF
        </button>
      </div>

      {kind === 'numbers' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Position"
            value={position}
            onChange={(v) => setPosition(v as NumberPosition)}
            options={[
              { value: 'bottom-center', label: 'Bottom centre' },
              { value: 'bottom-right', label: 'Bottom right' },
              { value: 'bottom-left', label: 'Bottom left' },
              { value: 'top-center', label: 'Top centre' },
              { value: 'top-right', label: 'Top right' },
              { value: 'top-left', label: 'Top left' },
            ]}
          />
          <SelectField
            label="Format"
            value={format}
            onChange={(v) => setFormat(v as NumberFormat)}
            options={[
              { value: 'n', label: '1' },
              { value: 'page-n', label: 'Page 1' },
              { value: 'n-of-total', label: '1 of 10' },
              { value: 'page-n-of-total', label: 'Page 1 of 10' },
            ]}
          />
          <NumberField
            label="Start at"
            value={start}
            onChange={setStart}
            min={1}
          />
          <RangeField
            label="Font size"
            value={fontSize}
            onChange={setFontSize}
            min={7}
            max={24}
            display={`${fontSize} pt`}
          />
          <Checkbox
            label="Skip the first page (cover)"
            checked={skipFirst}
            onChange={setSkipFirst}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Watermark text" value={text} onChange={setText} />
          <SelectField
            label="Layout"
            value={layout}
            onChange={(v) => setLayout(v as 'center' | 'tile')}
            options={[
              { value: 'center', label: 'Once, centred' },
              { value: 'tile', label: 'Repeated across the page' },
            ]}
          />
          <RangeField
            label="Size"
            value={wmSize}
            onChange={setWmSize}
            min={16}
            max={140}
            display={`${wmSize} pt`}
          />
          <RangeField
            label="Opacity"
            value={opacity}
            onChange={setOpacity}
            min={5}
            max={100}
            display={`${opacity}%`}
          />
          <RangeField
            label="Angle"
            value={angle}
            onChange={setAngle}
            min={-90}
            max={90}
            display={`${angle}°`}
          />
          <label className="flex items-center gap-2 pt-6 text-sm text-gray-700">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-10 rounded border border-gray-200"
            />{' '}
            Colour
          </label>
          <div
            className="sm:col-span-2 flex h-40 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white"
            aria-hidden
          >
            <span
              className="whitespace-nowrap font-bold"
              style={{
                color,
                opacity: opacity / 100,
                transform: `rotate(${-angle}deg)`,
                fontSize: Math.max(12, wmSize / 2.2),
              }}
            >
              {text}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        className={btnPrimary}
        onClick={run}
        disabled={busy}
      >
        {busy
          ? 'Working…'
          : kind === 'numbers'
            ? 'Add page numbers'
            : 'Add watermark'}
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}

export function PdfPageNumbersTool(_: ToolProps) {
  return <PdfStampTool kind="numbers" />;
}

export default PdfPageNumbersTool;
