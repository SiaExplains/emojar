'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  RangeField,
  ToolInput,
  ToolOutput,
  btnSecondary,
  friendlyError,
  useObjectUrl,
} from '../ui';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Generator: Adobe Illustrator 27.0.0, SVG Export Plug-In -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="120" height="120" viewBox="0 0 120.000000 120.000000" version="1.1">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description about="Emojar sample"/></rdf:RDF>
  </metadata>
  <defs></defs>
  <g inkscape:label="Layer 1" id="layer1">
    <g>
      <circle cx="60.000000" cy="60.000000" r="50.000000" fill="#ffcc00" stroke="#000000" stroke-width="4.000000"/>
      <circle cx="42.500000" cy="48.000000" r="6.000000" fill="#000000"/>
      <circle cx="77.500000" cy="48.000000" r="6.000000" fill="#000000"/>
      <path d="M 35.000000 72.000000 C 45.000000 90.000000 75.000000 90.000000 85.000000 72.000000" fill="none" stroke="#000000" stroke-width="5.000000" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

const kb = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);

class SvgInputError extends Error {
  name = 'ToolInputError';
}

export default function SvgOptimizerTool(_: ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [multipass, setMultipass] = useState(true);
  const [precision, setPrecision] = useState(3);
  const [pretty, setPretty] = useState(false);
  const [dimensions, setDimensions] = useState(false);
  const [keepComments, setKeepComments] = useState(false);
  const [fileName, setFileName] = useState('optimized.svg');
  const runId = useRef(0);

  useEffect(() => {
    const id = ++runId.current;
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    const t = window.setTimeout(async () => {
      setBusy(true);
      try {
        if (!/<svg[\s>]/i.test(input))
          throw new SvgInputError(
            'This doesn’t look like SVG markup — it needs an <svg> element.',
          );
        const { optimize } = await import('svgo/browser');
        const result = optimize(input, {
          multipass,
          floatPrecision: precision,
          js2svg: pretty ? { pretty: true, indent: 2 } : undefined,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: keepComments ? { removeComments: false } : {},
              },
            },
            ...(dimensions ? (['removeDimensions'] as const) : []),
          ],
        });
        if (id !== runId.current) return;
        setOutput(result.data);
        setError('');
      } catch (e) {
        if (id !== runId.current) return;
        setOutput('');
        setError(
          friendlyError(
            e,
            'The SVG could not be parsed. Check that it is complete, valid XML.',
          ),
        );
      } finally {
        if (id === runId.current) setBusy(false);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [input, multipass, precision, pretty, dimensions, keepComments]);

  const before = useMemo(() => new Blob([input]).size, [input]);
  const after = useMemo(() => new Blob([output]).size, [output]);
  const saved = before ? Math.round((1 - after / before) * 1000) / 10 : 0;
  // Previews are shown as <img> from a blob, so scripts in an SVG never run.
  // The blobs are memoised: a new Blob on every render would re-run
  // useObjectUrl's effect endlessly.
  const beforeBlob = useMemo(
    () =>
      input && output ? new Blob([input], { type: 'image/svg+xml' }) : null,
    [input, output],
  );
  const afterBlob = useMemo(
    () => (output ? new Blob([output], { type: 'image/svg+xml' }) : null),
    [output],
  );
  const beforeUrl = useObjectUrl(beforeBlob);
  const afterUrl = useObjectUrl(afterBlob);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept=".svg,image/svg+xml"
        onFiles={async (files) => {
          const f = files[0];
          if (!f) return;
          setFileName(f.name.replace(/\.svg$/i, '') + '.min.svg');
          setInput(await f.text());
        }}
        label="Drop an SVG file here, or paste the code below"
      />
      <ToolInput
        label="SVG code"
        value={input}
        onChange={setInput}
        rows={8}
        placeholder="<svg …>…</svg>"
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput(SAMPLE)}
            >
              Load sample
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput('')}
              disabled={!input}
            >
              Clear
            </button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <RangeField
          label="Number precision (decimal places)"
          value={precision}
          onChange={setPrecision}
          min={0}
          max={6}
        />
        <div className="flex flex-col gap-2">
          <Checkbox
            label="Multiple passes (smaller)"
            checked={multipass}
            onChange={setMultipass}
          />
          <Checkbox
            label="Remove width/height (keep viewBox, scales freely)"
            checked={dimensions}
            onChange={setDimensions}
          />
          <Checkbox
            label="Keep comments"
            checked={keepComments}
            onChange={setKeepComments}
          />
          <Checkbox
            label="Pretty-print output"
            checked={pretty}
            onChange={setPretty}
          />
        </div>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {output && (
        <>
          <p className="text-sm text-gray-700" aria-live="polite">
            {kb(before)} → <strong>{kb(after)}</strong>{' '}
            {saved > 0 ? (
              <span className="text-emerald-700">({saved} % smaller)</span>
            ) : (
              <span className="text-gray-500">(already optimised)</span>
            )}
            {busy && <span className="ml-2 text-gray-400">Working…</span>}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Before', beforeUrl],
              ['After', afterUrl],
            ].map(([label, url]) => (
              <figure
                key={label}
                className="rounded-xl border border-gray-100 bg-[conic-gradient(#f3f4f6_25%,#fff_0_50%,#f3f4f6_0_75%,#fff_0)] bg-[length:16px_16px] p-3"
              >
                {url && (
                  <img
                    src={url}
                    alt={`${label} preview`}
                    className="mx-auto max-h-48"
                  />
                )}
                <figcaption className="mt-2 text-center text-xs text-gray-500">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
          <ToolOutput
            label="Optimised SVG"
            value={output}
            rows={8}
            filename={fileName}
            mime="image/svg+xml"
          />
        </>
      )}
      <p className="text-xs text-gray-500">
        Uses SVGO, the standard SVG optimiser, in your browser. Check the
        preview after optimising: low precision can slightly change curves, and
        removing width/height changes how some apps size the image.
      </p>
    </div>
  );
}
