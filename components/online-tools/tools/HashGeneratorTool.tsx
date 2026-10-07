'use client';

import { useEffect, useState } from 'react';
import {
  HASH_ALGORITHMS,
  hashBytes,
  hmacText,
  type HashAlgorithm,
} from '@/lib/online-tools/engines/hash';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  FileSize,
  Notice,
  ResultRow,
  TextField,
  ToolInput,
  btnSecondary,
} from '../ui';

const MAX_FILE = 1024 * 1024 * 1024;

export default function HashGeneratorTool({ config }: ToolProps) {
  const only =
    config.algorithm && config.algorithm !== 'all'
      ? (String(config.algorithm) as HashAlgorithm)
      : null;
  const algorithms = only ? [only] : HASH_ALGORITHMS;
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [compare, setCompare] = useState('');
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>(
    {},
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setError('');
      if (mode === 'text' && !text && !key) return setHashes({});
      if (mode === 'file' && !file) return setHashes({});
      setBusy(true);
      try {
        const out: Partial<Record<HashAlgorithm, string>> = {};
        if (mode === 'text' && key) {
          for (const a of algorithms)
            if (a !== 'MD5') out[a] = await hmacText(text, key, a);
        } else {
          const bytes =
            mode === 'file' && file
              ? new Uint8Array(await file.arrayBuffer())
              : new TextEncoder().encode(text);
          for (const a of algorithms) out[a] = await hashBytes(bytes, a);
        }
        if (!cancelled) setHashes(out);
      } catch {
        if (!cancelled)
          setError(
            'The hash could not be calculated. The file may be too large for your browser’s memory.',
          );
      } finally {
        if (!cancelled) setBusy(false);
      }
    };
    const t = window.setTimeout(run, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
    // `algorithms` is derived from `only`, so `only` stands in for it here.
  }, [mode, text, file, key, only]);

  const cmp = compare.trim().toLowerCase();
  const matched = cmp
    ? Object.entries(hashes).find(([, h]) => h === cmp)?.[0]
    : undefined;

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Input type"
        className="inline-flex rounded-xl border border-gray-200 p-1"
      >
        {(['text', 'file'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            {m === 'text' ? 'Text' : 'File'}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <>
          <ToolInput
            label="Text to hash"
            value={text}
            onChange={setText}
            rows={5}
            placeholder="Type or paste text…"
          />
          <TextField
            label="HMAC secret key (optional)"
            value={key}
            onChange={setKey}
            mono
            placeholder="Leave empty for a plain hash"
          />
        </>
      ) : (
        <div className="space-y-2">
          <FileDropzone
            onFiles={(f) => {
              if (f[0].size > MAX_FILE)
                return setError(
                  'Files larger than 1 GB are not supported in the browser.',
                );
              setFile(f[0]);
            }}
            hint="Any file type — it is read locally"
          />
          {file && (
            <p className="text-sm text-gray-600">
              {file.name} · <FileSize bytes={file.size} />{' '}
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setFile(null)}
              >
                Remove
              </button>
            </p>
          )}
        </div>
      )}

      <ErrorMessage>{error}</ErrorMessage>
      {busy && (
        <p className="text-sm text-gray-500" role="status">
          Calculating…
        </p>
      )}
      {Object.keys(hashes).length > 0 && (
        <div className="rounded-2xl border border-gray-100 px-4">
          {algorithms
            .filter((a) => hashes[a])
            .map((a) => (
              <ResultRow
                key={a}
                label={key && mode === 'text' ? `HMAC-${a}` : a}
                value={hashes[a]!}
                mono
              />
            ))}
        </div>
      )}
      {key && mode === 'text' && !only && (
        <p className="text-xs text-gray-500">HMAC is not offered for MD5.</p>
      )}
      <TextField
        label="Compare with a known hash (optional)"
        value={compare}
        onChange={setCompare}
        mono
        placeholder="Paste a checksum to verify"
      />
      {cmp && Object.keys(hashes).length > 0 && (
        <Notice tone={matched ? 'green' : 'amber'}>
          {matched
            ? `✓ Match — identical ${matched} hash.`
            : '✗ No match with any calculated hash.'}
        </Notice>
      )}
    </div>
  );
}
