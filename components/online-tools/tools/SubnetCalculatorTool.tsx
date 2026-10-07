'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import {
  ipv4Subnet,
  ipv6Subnet,
  splitSubnet,
} from '@/lib/online-tools/engines/network';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  SelectField,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

const fmt = (n: number | bigint) => n.toLocaleString('en-US');

export default function SubnetCalculatorTool(_: ToolProps) {
  const [input, setInput] = useState('192.168.1.10/24');
  const [split, setSplit] = useState('');
  const q = useDeferredValue(input);

  const result = useMemo(() => {
    const t = q.trim();
    if (!t) return null;
    try {
      if (t.includes(':')) return { v6: ipv6Subnet(t) } as const;
      return { v4: ipv4Subnet(t) } as const;
    } catch (e) {
      return {
        error: friendlyError(e, 'Enter an address like 192.168.1.0/24.'),
      } as const;
    }
  }, [q]);

  const v4 = result && 'v4' in result ? result.v4 : null;
  const v6 = result && 'v6' in result ? result.v6 : null;

  const subnets = useMemo(() => {
    if (!v4 || !split) return null;
    try {
      return splitSubnet(`${v4.network}/${v4.prefix}`, Number(split));
    } catch {
      return null;
    }
  }, [v4, split]);

  const rows: [string, string][] = v4
    ? [
        ['Network address', `${v4.network}/${v4.prefix}`],
        ['Subnet mask', v4.mask],
        ['Wildcard mask', v4.wildcard],
        ['Broadcast address', v4.broadcast],
        ['First usable host', v4.firstHost],
        ['Last usable host', v4.lastHost],
        ['Usable hosts', fmt(v4.usableHosts)],
        ['Total addresses', fmt(v4.totalAddresses)],
        ['Address class', v4.ipClass],
        ['Type', v4.scope],
        ['Binary address', v4.binaryAddress],
        ['Binary mask', v4.binaryMask],
      ]
    : v6
      ? [
          ['Network', v6.network],
          ['First address', v6.first],
          ['Last address', v6.last],
          [
            'Addresses',
            v6.total < BigInt(1e15) ? fmt(v6.total) : `2^${128 - v6.prefix}`,
          ],
          ['Expanded address', v6.expanded],
          ['Compressed address', v6.address],
        ]
      : [];

  const report = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="cidr-in" className={labelBase}>
          IP address with prefix or mask
        </label>
        <input
          id="cidr-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          placeholder="192.168.1.10/24, 10.0.0.1 255.255.0.0 or 2001:db8::/48"
          className={`${inputBase} font-mono`}
        />
        <div className="flex flex-wrap gap-1.5">
          {[
            '192.168.1.10/24',
            '10.20.30.40/16',
            '172.16.5.4 255.255.240.0',
            '203.0.113.9/30',
            '2001:db8:abcd:12::1/64',
          ].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="rounded-full border border-gray-200 px-2.5 py-0.5 font-mono text-xs text-gray-700 hover:bg-gray-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {result && 'error' in result && (
        <ErrorMessage>{result.error}</ErrorMessage>
      )}

      {rows.length > 0 && (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Subnet details</caption>
              <tbody className="divide-y divide-gray-100">
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <th
                      scope="row"
                      className="w-2/5 px-4 py-2 font-normal text-gray-600"
                    >
                      {k}
                    </th>
                    <td className="break-all px-4 py-2 font-mono text-[13px] font-medium text-gray-900">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CopyButton text={report} label="Copy details" />
        </>
      )}

      {v4 && v4.prefix < 32 && (
        <div className="space-y-3">
          <SelectField
            label="Split this network into smaller subnets"
            value={split}
            onChange={setSplit}
            options={[
              { value: '', label: 'Choose a prefix…' },
              ...Array.from(
                { length: Math.min(32 - v4.prefix, 16) },
                (_, i) => {
                  const p = v4.prefix + i + 1;
                  const n = 2 ** (p - v4.prefix);
                  return {
                    value: String(p),
                    label: `/${p} — ${fmt(n)} subnets of ${fmt(2 ** (32 - p))} addresses`,
                  };
                },
              ),
            ]}
            className="max-w-md"
          />
          {subnets && (
            <>
              <ol className="grid gap-1 font-mono text-xs text-gray-800 sm:grid-cols-2 lg:grid-cols-3">
                {subnets.list.map((s) => (
                  <li key={s} className="rounded bg-gray-50 px-2 py-1">
                    {s}
                  </li>
                ))}
              </ol>
              {subnets.count > subnets.list.length && (
                <p className="text-xs text-gray-500">
                  Showing the first {subnets.list.length} of{' '}
                  {fmt(subnets.count)} subnets.
                </p>
              )}
            </>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">
        /31 networks (point-to-point links, RFC 3021) and /32 single hosts have
        no separate network and broadcast address, so every address is usable.
      </p>
    </div>
  );
}
