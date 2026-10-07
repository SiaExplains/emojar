'use client';

import { useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  RangeField,
  SelectField,
  TextField,
  btnSecondary,
  downloadBlob,
} from '../ui';

const FORMATS = [
  { value: 'CODE128', label: 'Code 128 (any text)', sample: 'EMOJAR-2026' },
  { value: 'EAN13', label: 'EAN-13 (12–13 digits)', sample: '400638133393' },
  { value: 'EAN8', label: 'EAN-8 (7–8 digits)', sample: '9638507' },
  { value: 'UPC', label: 'UPC-A (11–12 digits)', sample: '03600029145' },
  {
    value: 'CODE39',
    label: 'Code 39 (A–Z, 0–9, - . $ / + % space)',
    sample: 'CODE 39',
  },
  { value: 'ITF14', label: 'ITF-14 (13–14 digits)', sample: '1540014128876' },
  { value: 'MSI', label: 'MSI Plessey (digits)', sample: '1234567' },
  { value: 'pharmacode', label: 'Pharmacode (3–131070)', sample: '1234' },
];

export default function BarcodeGeneratorTool(_: ToolProps) {
  const [format, setFormat] = useState('CODE128');
  const [value, setValue] = useState('EMOJAR-2026');
  const [height, setHeight] = useState(100);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { default: JsBarcode } = await import('jsbarcode');
      if (cancelled || !svgRef.current) return;
      let valid = true;
      try {
        JsBarcode(svgRef.current, value, {
          format,
          height,
          width: barWidth,
          displayValue: showText,
          margin: 10,
          valid: (v: boolean) => {
            valid = v;
          },
        });
      } catch {
        valid = false;
      }
      setError(
        valid
          ? ''
          : `“${value}” is not a valid ${FORMATS.find((f) => f.value === format)?.label ?? format} value.`,
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [format, value, height, barWidth, showText]);

  const svgMarkup = () =>
    svgRef.current ? new XMLSerializer().serializeToString(svgRef.current) : '';

  const downloadPng = () => {
    const markup = svgMarkup();
    if (!markup) return;
    const img = new Image();
    const url = URL.createObjectURL(
      new Blob([markup], { type: 'image/svg+xml' }),
    );
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (b) => b && downloadBlob(b, `barcode-${format.toLowerCase()}.png`),
        'image/png',
      );
    };
    img.src = url;
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          label="Format"
          value={format}
          onChange={(v) => {
            setFormat(v);
            setValue(FORMATS.find((f) => f.value === v)?.sample ?? '');
          }}
          options={FORMATS}
        />
        <TextField label="Value" value={value} onChange={setValue} mono />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <RangeField
          label="Height"
          value={height}
          onChange={setHeight}
          min={30}
          max={200}
          display={`${height}px`}
        />
        <RangeField
          label="Bar width"
          value={barWidth}
          onChange={setBarWidth}
          min={1}
          max={4}
          display={`${barWidth}px`}
        />
      </div>
      <Checkbox
        label="Show text below the barcode"
        checked={showText}
        onChange={setShowText}
      />
      <ErrorMessage>{error}</ErrorMessage>
      <div
        className={`overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 text-center ${error ? 'opacity-30' : ''}`}
      >
        <svg
          ref={svgRef}
          role="img"
          aria-label={`Barcode for ${value}`}
          className="mx-auto max-w-full"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={!!error}
          onClick={() =>
            downloadBlob(
              svgMarkup(),
              `barcode-${format.toLowerCase()}.svg`,
              'image/svg+xml',
            )
          }
        >
          ⬇ SVG
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={!!error}
          onClick={downloadPng}
        >
          ⬇ PNG
        </button>
      </div>
    </div>
  );
}
