'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  base32Decode,
  parseOtpAuthUri,
  randomSecret,
  totp,
  type OtpAlgorithm,
  type OtpAuth,
} from '@/lib/online-tools/engines/totp';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  SelectField,
  btnSecondary,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

type Codes = { prev: string; now: string; next: string };

export default function TotpTool(_: ToolProps) {
  const [secretInput, setSecretInput] = useState('');
  const [algorithm, setAlgorithm] = useState<OtpAlgorithm>('SHA-1');
  const [digits, setDigits] = useState(6);
  const [period, setPeriod] = useState(30);
  const [label, setLabel] = useState('');
  const [codes, setCodes] = useState<Codes | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // An otpauth:// link fills in every setting at once.
  const parsed = useMemo((): {
    key: Uint8Array | null;
    uri: OtpAuth | null;
    error: string;
  } => {
    const t = secretInput.trim();
    if (!t) return { key: null, uri: null, error: '' };
    try {
      if (/^otpauth:/i.test(t)) {
        const o = parseOtpAuthUri(t);
        return { key: base32Decode(o.secret), uri: o, error: '' };
      }
      return { key: base32Decode(t), uri: null, error: '' };
    } catch (e) {
      return {
        key: null,
        uri: null,
        error: friendlyError(e, 'This secret is not valid.'),
      };
    }
  }, [secretInput]);

  useEffect(() => {
    if (!parsed.uri) return;
    setAlgorithm(parsed.uri.algorithm);
    setDigits(parsed.uri.digits);
    setPeriod(parsed.uri.period);
    setLabel(
      [parsed.uri.issuer, parsed.uri.account].filter(Boolean).join(' · '),
    );
  }, [parsed.uri]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);

  const step = Math.floor(now / 1000 / period);
  useEffect(() => {
    let cancelled = false;
    const key = parsed.key;
    if (!key || !key.length) {
      setCodes(null);
      return;
    }
    const base = step * period * 1000;
    const opts = { period, digits, algorithm };
    Promise.all([
      totp(key, base - period * 1000, opts),
      totp(key, base, opts),
      totp(key, base + period * 1000, opts),
    ])
      .then(([prev, cur, next]) => {
        if (!cancelled) setCodes({ prev, now: cur, next });
      })
      .catch(() => {
        if (!cancelled) setCodes(null);
      });
    return () => {
      cancelled = true;
    };
  }, [parsed.key, step, period, digits, algorithm]);

  const remaining = period - ((now / 1000) % period);
  const pct = remaining / period;
  const group = (c: string) =>
    c.length === 6
      ? `${c.slice(0, 3)} ${c.slice(3)}`
      : c.length === 8
        ? `${c.slice(0, 4)} ${c.slice(4)}`
        : c;

  return (
    <div className="space-y-6">
      <Notice tone="amber">
        Use this to test 2FA setups or to read a code from a backup secret.
        Don’t keep your only copy of a secret here: the page stores nothing, so
        the secret is gone when you close the tab — and anyone who has the
        secret can generate your codes.
      </Notice>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="totp-secret" className={labelBase}>
            Secret key (Base32) or otpauth:// link
          </label>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setSecretInput(randomSecret());
              setLabel('Test secret');
            }}
          >
            Generate test secret
          </button>
        </div>
        <input
          id="totp-secret"
          value={secretInput}
          onChange={(e) => setSecretInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="JBSWY3DPEHPK3PXP or otpauth://totp/…"
          className={`${inputBase} font-mono`}
        />
      </div>
      <ErrorMessage>{parsed.error}</ErrorMessage>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Algorithm"
          value={algorithm}
          onChange={(v) => setAlgorithm(v as OtpAlgorithm)}
          options={['SHA-1', 'SHA-256', 'SHA-512'].map((v) => ({
            value: v,
            label: v === 'SHA-1' ? 'SHA-1 (most apps)' : v,
          }))}
        />
        <SelectField
          label="Digits"
          value={String(digits)}
          onChange={(v) => setDigits(Number(v))}
          options={['6', '7', '8'].map((v) => ({ value: v, label: v }))}
        />
        <SelectField
          label="Period"
          value={String(period)}
          onChange={(v) => setPeriod(Number(v))}
          options={[...new Set(['30', '60', String(period)])].map((v) => ({
            value: v,
            label: `${v} seconds`,
          }))}
        />
      </div>

      {codes && (
        <div
          className="flex flex-wrap items-center gap-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5"
          aria-live="polite"
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 36 36"
            aria-hidden
            className="-rotate-90"
          >
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={remaining < 6 ? '#e11d48' : '#4f46e5'}
              strokeWidth="3"
              strokeDasharray={`${pct * 100} 100`}
              pathLength={100}
            />
          </svg>
          <div className="min-w-0 flex-1">
            {label && (
              <p className="text-xs font-medium text-indigo-700">{label}</p>
            )}
            <p className="font-mono text-4xl font-semibold tracking-wider text-gray-900">
              {group(codes.now)}
            </p>
            <p className="text-xs text-gray-600">
              Valid for {Math.ceil(remaining)} s · previous {group(codes.prev)}{' '}
              · next {group(codes.next)}
            </p>
          </div>
          <CopyButton text={codes.now} label="Copy code" />
        </div>
      )}
      <p className="text-xs text-gray-500">
        Codes follow RFC 6238 and are calculated with your browser’s Web Crypto
        API. If they don’t match your authenticator app, check that your device
        clock is set automatically — a clock that is 30 seconds off gives the
        neighbouring code.
      </p>
    </div>
  );
}
