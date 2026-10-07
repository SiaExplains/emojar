'use client';

import { useState } from 'react';
import {
  parseOctalMode,
  parseSymbolic,
  permsToOctal,
  permsToSymbolic,
  type Perms,
} from '@/lib/online-tools/engines/network';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, inputBase, labelBase } from '../ui';

const WHO = [
  ['owner', 'Owner (u)'],
  ['group', 'Group (g)'],
  ['others', 'Others (o)'],
] as const;
const BITS = [
  [4, 'Read'],
  [2, 'Write'],
  [1, 'Execute'],
] as const;
const SPECIAL = [
  [4, 'setuid', 'Run as the file’s owner'],
  [2, 'setgid', 'Run as the group / new files inherit the group'],
  [1, 'sticky', 'Only owners can delete files in the directory'],
] as const;

const COMMON: [string, string][] = [
  ['644', 'Files: owner can edit, everyone can read'],
  ['755', 'Programs, scripts and folders: everyone can run or open'],
  ['600', 'Private files such as SSH keys'],
  ['700', 'Private folders and scripts'],
  ['775', 'Shared group folders'],
  ['777', 'Everyone can do everything — avoid on servers'],
  ['1777', 'Shared temp folders like /tmp'],
];

export default function ChmodCalculatorTool(_: ToolProps) {
  const [perms, setPerms] = useState<Perms>({
    special: 0,
    owner: 7,
    group: 5,
    others: 5,
  });
  const [octalText, setOctalText] = useState('755');
  const [symText, setSymText] = useState('rwxr-xr-x');
  const [path, setPath] = useState('file.sh');
  const [error, setError] = useState('');

  const apply = (p: Perms, from?: 'octal' | 'symbolic') => {
    setPerms(p);
    setError('');
    if (from !== 'octal') setOctalText(permsToOctal(p));
    if (from !== 'symbolic') setSymText(permsToSymbolic(p));
  };

  const toggle = (who: 'owner' | 'group' | 'others', bit: number) =>
    apply({ ...perms, [who]: perms[who] ^ bit });

  const octal = permsToOctal(perms);
  const command = `chmod ${octal} ${path.trim() ? (/[\s'"$]/.test(path) ? `'${path.replace(/'/g, `'\\''`)}'` : path.trim()) : 'file'}`;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-center text-sm">
          <caption className="sr-only">Permission checkboxes</caption>
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Who</th>
              {BITS.map(([, name]) => (
                <th key={name} className="px-3 py-2 font-medium">
                  {name}
                </th>
              ))}
              <th className="px-3 py-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {WHO.map(([who, label]) => (
              <tr key={who}>
                <th
                  scope="row"
                  className="px-3 py-2 text-left font-medium text-gray-800"
                >
                  {label}
                </th>
                {BITS.map(([bit, name]) => (
                  <td key={bit} className="px-3 py-2">
                    <input
                      type="checkbox"
                      aria-label={`${label} ${name}`}
                      checked={!!(perms[who] & bit)}
                      onChange={() => toggle(who, bit)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    />
                  </td>
                ))}
                <td className="px-3 py-2 font-mono font-semibold">
                  {perms[who]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="mb-1 text-sm font-medium text-gray-700">
          Special bits
        </legend>
        {SPECIAL.map(([bit, name, help]) => (
          <label
            key={name}
            className="inline-flex items-center gap-2 text-sm text-gray-700"
            title={help}
          >
            <input
              type="checkbox"
              checked={!!(perms.special & bit)}
              onChange={() => apply({ ...perms, special: perms.special ^ bit })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            {name} <span className="text-xs text-gray-400">({help})</span>
          </label>
        ))}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="chmod-oct" className={labelBase}>
            Octal
          </label>
          <input
            id="chmod-oct"
            value={octalText}
            onChange={(e) => {
              setOctalText(e.target.value);
              try {
                apply(parseOctalMode(e.target.value), 'octal');
              } catch (err) {
                setError((err as Error).message);
              }
            }}
            className={`${inputBase} font-mono text-lg`}
            inputMode="numeric"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="chmod-sym" className={labelBase}>
            Symbolic
          </label>
          <input
            id="chmod-sym"
            value={symText}
            onChange={(e) => {
              setSymText(e.target.value);
              try {
                apply(parseSymbolic(e.target.value), 'symbolic');
              } catch (err) {
                setError((err as Error).message);
              }
            }}
            className={`${inputBase} font-mono text-lg`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="chmod-path" className={labelBase}>
            File or folder
          </label>
          <input
            id="chmod-path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className={`${inputBase} font-mono`}
          />
        </div>
      </div>
      {error && <p className="text-sm text-rose-700">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100">
        <span className="flex-1 break-all">{command}</span>
        <CopyButton text={command} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-800">
          Common permissions
        </h2>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {COMMON.map(([o, desc]) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => apply(parseOctalMode(o))}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="font-mono font-semibold text-gray-900">
                  {o}
                </span>
                <span className="font-mono text-xs text-gray-500">
                  {permsToSymbolic(parseOctalMode(o))}
                </span>
                <span className="text-gray-600">{desc}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
