'use client';

import { useMemo, useState } from 'react';
import { decodeJwt } from '@/lib/online-tools/engines/data';
import { relativeTime } from '@/lib/online-tools/engines/dates';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  ToolInput,
  btnSecondary,
  friendlyError,
} from '../ui';

// Example token signed with the throwaway secret "emojar-example"; not tied to any system.
const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTgwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.7u8tB60bd0KASOJ_0fJRF0yyw10TEKBAq1eq4_hB8Eg';

const CLAIMS: Record<string, string> = {
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expires at',
  nbf: 'Not before',
  iat: 'Issued at',
  jti: 'JWT ID',
};

function JsonBlock({ title, value }: { title: string; value: object }) {
  const json = JSON.stringify(value, null, 2);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <CopyButton text={json} />
      </div>
      <pre className="max-h-80 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[13px] leading-relaxed">
        {json}
      </pre>
    </div>
  );
}

export default function JwtDecoderTool(_: ToolProps) {
  const [token, setToken] = useState('');
  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { ok: true as const, value: decodeJwt(token) };
    } catch (e) {
      return { ok: false as const, error: friendlyError(e) };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <ToolInput
        label="JSON Web Token"
        value={token}
        onChange={setToken}
        rows={5}
        placeholder="eyJhbGciOi…"
        actions={
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setToken(SAMPLE)}
          >
            Load sample
          </button>
        }
      />
      {decoded && !decoded.ok && <ErrorMessage>{decoded.error}</ErrorMessage>}
      {decoded?.ok && (
        <div className="space-y-4">
          {decoded.value.expiresAt && (
            <Notice tone={decoded.value.expired ? 'amber' : 'green'}>
              {decoded.value.expired
                ? '⚠️ This token has expired'
                : '✓ This token has not expired yet'}{' '}
              — exp {decoded.value.expiresAt.toLocaleString()} (
              {relativeTime(decoded.value.expiresAt)}).
            </Notice>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <JsonBlock title="Header" value={decoded.value.header} />
            <JsonBlock title="Payload" value={decoded.value.payload} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left text-sm font-semibold text-gray-900">
                Registered claims
              </caption>
              <tbody>
                {Object.entries(CLAIMS)
                  .filter(([k]) => k in decoded.value.payload)
                  .map(([k, label]) => {
                    const v = decoded.value.payload[k];
                    const isTime =
                      ['exp', 'nbf', 'iat'].includes(k) &&
                      typeof v === 'number';
                    return (
                      <tr key={k} className="border-t border-gray-100">
                        <th className="py-2 pr-4 font-mono text-xs font-medium text-gray-500">
                          {k}
                        </th>
                        <td className="py-2 pr-4 text-gray-700">{label}</td>
                        <td className="py-2 break-all font-mono text-xs text-gray-900">
                          {isTime
                            ? `${new Date((v as number) * 1000).toLocaleString()} (${relativeTime(new Date((v as number) * 1000))})`
                            : JSON.stringify(v)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            Signature ({String(decoded.value.header.alg ?? 'unknown')}):{' '}
            <span className="break-all font-mono">
              {decoded.value.signature || '(none)'}
            </span>{' '}
            — not verified. Decoding does not prove a token is authentic.
          </p>
        </div>
      )}
    </div>
  );
}
