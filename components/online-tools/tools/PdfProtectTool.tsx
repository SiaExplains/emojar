'use client';

import { useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  Notice,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

export default function PdfProtectTool({ config }: ToolProps) {
  const protect = config.mode !== 'unlock';
  const [file, setFile] = useState<File | null>(null);
  const [encrypted, setEncrypted] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [allowPrint, setAllowPrint] = useState(true);
  const [allowCopy, setAllowCopy] = useState(true);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (f: File) => {
    setFile(f);
    setResults([]);
    setError('');
    const { looksEncrypted } = await import('@/lib/online-tools/pdf/qpdf');
    setEncrypted(looksEncrypted(new Uint8Array(await f.arrayBuffer())));
  };

  const run = async () => {
    if (!file) return;
    if (protect && password.length < 4)
      return setError(
        'Use a password of at least 4 characters (12+ is much safer).',
      );
    if (protect && password !== confirm)
      return setError('The passwords do not match.');
    setBusy(true);
    setError('');
    try {
      const { encryptPdf, decryptPdf } = await import(
        '@/lib/online-tools/pdf/qpdf'
      );
      const input = new Uint8Array(await file.arrayBuffer());
      const out = protect
        ? await encryptPdf(input, {
            userPassword: password,
            allowPrint,
            allowCopy,
          })
        : await decryptPdf(input, password);
      setResults([
        {
          name: outputName(
            file.name,
            'pdf',
            protect ? '-protected' : '-unlocked',
          ),
          blob: new Blob([new Uint8Array(out)], { type: 'application/pdf' }),
        },
      ]);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'The PDF could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="application/pdf,.pdf"
        onFiles={(f) => load(f[0])}
        label={
          protect
            ? 'Choose the PDF to protect'
            : 'Choose the password-protected PDF'
        }
      />
    );

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void run();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong>
          {encrypted !== null && (
            <span className="ml-2 text-xs text-gray-500">
              {encrypted ? '🔒 encrypted' : 'not encrypted'}
            </span>
          )}
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => (
            setFile(null),
            setResults([]),
            setPassword(''),
            setConfirm('')
          )}
        >
          Choose another PDF
        </button>
      </div>
      {protect && encrypted && (
        <Notice tone="amber">
          This PDF is already encrypted. Unlock it first if you want to change
          its password.
        </Notice>
      )}
      {!protect && encrypted === false && (
        <Notice tone="green">
          This PDF doesn’t appear to be password-protected — you can already
          open it normally.
        </Notice>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label={protect ? 'New password' : 'PDF password'}
          value={password}
          onChange={setPassword}
          type={show ? 'text' : 'password'}
        />
        {protect && (
          <TextField
            label="Repeat password"
            value={confirm}
            onChange={setConfirm}
            type={show ? 'text' : 'password'}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox label="Show password" checked={show} onChange={setShow} />
        {protect && (
          <>
            <Checkbox
              label="Allow printing"
              checked={allowPrint}
              onChange={setAllowPrint}
            />
            <Checkbox
              label="Allow copying text"
              checked={allowCopy}
              onChange={setAllowCopy}
            />
          </>
        )}
      </div>
      <button
        type="submit"
        className={btnPrimary}
        disabled={busy || (protect && !!encrypted)}
      >
        {busy ? 'Working…' : protect ? 'Protect PDF' : 'Unlock PDF'}
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      {results.length > 0 && protect && (
        <Notice tone="green">
          Encrypted with AES-256. Keep the password safe — it cannot be
          recovered.
        </Notice>
      )}
      <OutputList items={results} />
    </form>
  );
}
