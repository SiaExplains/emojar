'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  checkStrength,
  hibpCount,
  hibpParts,
  humanDuration,
} from '@/lib/online-tools/engines/password-strength';
import type { ToolProps } from '../ToolRenderer';
import { Notice, btnSecondary, inputBase, labelBase } from '../ui';

const COLORS = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-400',
  'bg-emerald-500',
  'bg-emerald-700',
];

export default function PasswordStrengthTool(_: ToolProps) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [breach, setBreach] = useState<{
    state: 'idle' | 'checking' | 'done' | 'error';
    count?: number;
    for?: string;
  }>({ state: 'idle' });
  const p = useDeferredValue(pw);
  const s = useMemo(() => checkStrength(p), [p]);

  const checkBreach = async () => {
    setBreach({ state: 'checking' });
    try {
      // k-anonymity: only the first 5 hex characters of the SHA-1 hash are sent.
      const { prefix, suffix } = await hibpParts(pw);
      const res = await fetch(
        `https://api.pwnedpasswords.com/range/${prefix}`,
        {
          referrerPolicy: 'no-referrer',
          credentials: 'omit',
        },
      );
      if (!res.ok) throw new Error(String(res.status));
      setBreach({
        state: 'done',
        count: hibpCount(await res.text(), suffix),
        for: pw,
      });
    } catch {
      setBreach({ state: 'error' });
    }
  };
  const breachValid = breach.state === 'done' && breach.for === pw;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="pw-in" className={labelBase}>
          Password to check
        </label>
        <div className="flex gap-2">
          <input
            id="pw-in"
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setBreach({ state: 'idle' });
            }}
            autoComplete="off"
            spellCheck={false}
            placeholder="Type a password — it never leaves this page"
            className={`${inputBase} font-mono`}
          />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setShow((x) => !x)}
            aria-pressed={show}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {p && (
        <div className="space-y-5" aria-live="polite">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">{s.label}</p>
              <p className="text-sm text-gray-500">
                ≈ {s.bits} bits of entropy
              </p>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden>
              {COLORS.map((c, i) => (
                <div
                  key={c}
                  className={`h-2 rounded-full ${i <= s.score ? COLORS[s.score] : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Estimated time to crack</caption>
              <tbody className="divide-y divide-gray-100">
                {s.crack.map((c) => (
                  <tr key={c.scenario}>
                    <th
                      scope="row"
                      className="px-4 py-2 font-normal text-gray-600"
                    >
                      {c.scenario}
                    </th>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      {humanDuration(c.seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {s.findings.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-800">
                What makes it weaker
              </h2>
              <ul className="space-y-1.5">
                {s.findings.map((f) => (
                  <li
                    key={f.label}
                    className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900"
                  >
                    <strong>{f.label}:</strong> {f.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-800">Tips</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {s.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Has it appeared in a data breach?
            </h2>
            <p className="text-sm text-gray-600">
              Optional. Sends only the first 5 characters of the password’s
              SHA-1 hash to Have I Been Pwned, which returns every leaked hash
              starting with them; the match is checked here, so neither the
              password nor its full hash leaves your device.
            </p>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void checkBreach()}
              disabled={breach.state === 'checking'}
            >
              {breach.state === 'checking'
                ? 'Checking…'
                : 'Check known breaches'}
            </button>
            {breachValid && (
              <Notice tone={breach.count ? 'amber' : 'green'}>
                {breach.count
                  ? `⚠ Found ${breach.count.toLocaleString('en-US')} times in known breaches — don’t use this password anywhere.`
                  : '✓ Not found in known breaches. That doesn’t make it strong — check the rating above.'}
              </Notice>
            )}
            {breach.state === 'error' && (
              <p className="text-sm text-rose-700">
                The breach service couldn’t be reached. Try again later.
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        The strength check runs entirely in your browser. Crack times are rough
        estimates for random guessing after the patterns above are removed. Need
        a strong one? Use the{' '}
        <Link
          href="/online-tool/security-generators/password-generator"
          className="text-indigo-600 underline underline-offset-2"
        >
          Password Generator
        </Link>
        .
      </p>
    </div>
  );
}
