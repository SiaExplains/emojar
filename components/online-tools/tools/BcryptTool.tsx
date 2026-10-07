'use client';

import { useEffect, useRef, useState } from 'react';
import { createBcryptWorker } from '@/lib/online-tools/engines/bcrypt-client';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  RangeField,
  TextField,
  btnPrimary,
  inputBase,
  labelBase,
} from '../ui';

type Reply =
  | { id: number; ok: true; hash?: string; match?: boolean; ms: number }
  | { id: number; ok: false; error: string };

const HASH_RE = /^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/;

export default function BcryptTool(_: ToolProps) {
  const worker = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, (r: Reply) => void>());
  const nextId = useRef(1);

  const [password, setPassword] = useState('');
  const [cost, setCost] = useState(10);
  const [hash, setHash] = useState('');
  const [hashMs, setHashMs] = useState(0);
  const [busy, setBusy] = useState<'hash' | 'verify' | null>(null);
  const [error, setError] = useState('');

  const [vPassword, setVPassword] = useState('');
  const [vHash, setVHash] = useState('');
  const [verdict, setVerdict] = useState<boolean | null>(null);

  useEffect(() => {
    const w = createBcryptWorker();
    w.onmessage = (e: MessageEvent<Reply>) => {
      pending.current.get(e.data.id)?.(e.data);
      pending.current.delete(e.data.id);
    };
    worker.current = w;
    return () => w.terminate();
  }, []);

  const call = (msg: Record<string, unknown>) =>
    new Promise<Reply>((resolve) => {
      const id = nextId.current++;
      pending.current.set(id, resolve);
      worker.current?.postMessage({ id, ...msg });
    });

  const doHash = async () => {
    if (!password) return;
    setBusy('hash');
    setError('');
    const r = await call({ op: 'hash', password, cost });
    setBusy(null);
    if (!r.ok) return setError(r.error);
    setHash(r.hash ?? '');
    setHashMs(r.ms);
    setVHash(r.hash ?? '');
  };

  const doVerify = async () => {
    setVerdict(null);
    if (!HASH_RE.test(vHash.trim()))
      return setError(
        'That doesn’t look like a bcrypt hash — it should start with $2a$, $2b$ or $2y$ (older $2$ / $2x$ also work) and be 60 characters long.',
      );
    setBusy('verify');
    setError('');
    const r = await call({
      op: 'verify',
      password: vPassword,
      hash: vHash.trim(),
    });
    setBusy(null);
    if (!r.ok) return setError(r.error);
    setVerdict(!!r.match);
  };

  const bytes = new TextEncoder().encode(password).length;

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="bc-hash">
        <h2 id="bc-hash" className="text-base font-semibold text-gray-900">
          Generate a bcrypt hash
        </h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <TextField
            label="Password or text"
            value={password}
            onChange={setPassword}
            placeholder="Type the password to hash"
            mono
          />
          <RangeField
            label="Cost factor (rounds)"
            value={cost}
            onChange={setCost}
            min={4}
            max={15}
            display={`${cost} (2^${cost} = ${(2 ** cost).toLocaleString('en-US')})`}
          />
        </div>
        {bytes > 72 && (
          <Notice tone="amber">
            bcrypt only uses the first 72 bytes of a password — this one is{' '}
            {bytes} bytes, so the rest is ignored.
          </Notice>
        )}
        <button
          type="button"
          className={btnPrimary}
          onClick={() => void doHash()}
          disabled={!password || busy !== null}
        >
          {busy === 'hash' ? 'Hashing…' : 'Generate hash'}
        </button>
        {hash && (
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={labelBase}>
                bcrypt hash{' '}
                <span className="font-normal text-gray-500">
                  (took {Math.round(hashMs).toLocaleString('en-US')} ms)
                </span>
              </span>
              <CopyButton text={hash} />
            </div>
            <p className="break-all rounded-xl border border-gray-100 bg-gray-50 p-3 font-mono text-sm text-gray-900">
              {hash}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-mono">{hash.slice(0, 4)}</span> version ·{' '}
              <span className="font-mono">{hash.slice(4, 6)}</span> cost · next
              22 characters salt · last 31 characters hash. A new random salt is
              used every time, so the same password gives a different hash each
              run.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="bc-verify">
        <h2 id="bc-verify" className="text-base font-semibold text-gray-900">
          Check a password against a hash
        </h2>
        <TextField
          label="Password"
          value={vPassword}
          onChange={(v) => {
            setVPassword(v);
            setVerdict(null);
          }}
          mono
        />
        <div className="space-y-1.5">
          <label htmlFor="bc-hash-in" className={labelBase}>
            bcrypt hash
          </label>
          <input
            id="bc-hash-in"
            value={vHash}
            onChange={(e) => {
              setVHash(e.target.value);
              setVerdict(null);
            }}
            placeholder="$2b$10$…"
            spellCheck={false}
            autoComplete="off"
            className={`${inputBase} font-mono`}
          />
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => void doVerify()}
          disabled={!vHash || busy !== null}
        >
          {busy === 'verify' ? 'Checking…' : 'Verify'}
        </button>
        {verdict !== null && (
          <Notice tone={verdict ? 'green' : 'amber'}>
            {verdict
              ? '✓ Match — this password produces this hash.'
              : '✗ No match — the password is different (or the hash was made with something else).'}
          </Notice>
        )}
      </section>
      <ErrorMessage>{error}</ErrorMessage>
      <p className="text-xs text-gray-500">
        Hashing runs in a background worker in your browser; the password is
        never sent anywhere. For real systems, hash passwords on your server —
        this tool is for testing, seeding databases and learning.
      </p>
    </div>
  );
}
