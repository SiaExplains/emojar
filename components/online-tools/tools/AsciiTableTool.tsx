'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { searchAscii, type AsciiRow } from '@/lib/online-tools/engines/ascii';
import type { ToolProps } from '../ToolRenderer';
import {
  Chips,
  CopyChip,
  DetailDialog,
  EmptyState,
  SearchBox,
  useCopyFlash,
} from './ReferenceUI';

type Section = 'all' | 'control' | 'printable';

export default function AsciiTableTool({ config }: ToolProps) {
  const init = String(config.init_section ?? 'all') as Section;
  const [section, setSection] = useState<Section>(
    ['all', 'control', 'printable'].includes(init) ? init : 'all',
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AsciiRow | null>(null);
  const q = useDeferredValue(query);
  const rows = useMemo(() => searchAscii(q, section), [q, section]);
  const { copy, region } = useCopyFlash();

  const cellBtn = (text: string, label: string, mono = true) => (
    <button
      type="button"
      onClick={() => void copy(text, label)}
      className={`rounded px-1 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${mono ? 'font-mono' : ''}`}
      aria-label={`Copy ${label}`}
    >
      {text}
    </button>
  );

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search ASCII"
        value={query}
        onChange={setQuery}
        placeholder="A, 65, 0x41, LF, tab, escape…"
        count={rows.length}
        noun="character"
      />
      <Chips
        label="Section"
        value={section}
        onChange={setSection}
        options={[
          { value: 'all', label: 'All 128' },
          { value: 'control', label: 'Control characters (0–31, 127)' },
          { value: 'printable', label: 'Printable (32–126)' },
        ]}
      />
      {region}
      {rows.length === 0 ? (
        <EmptyState>
          Nothing matches “{q}”. ASCII only covers 128 characters — for é, € or
          emoji try the Unicode Character Explorer.
        </EmptyState>
      ) : (
        <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">
              ASCII table. Click a value to copy it; click the name for details.
            </caption>
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {[
                  'Dec',
                  'Hex',
                  'Oct',
                  'Binary',
                  'Char',
                  'HTML dec',
                  'HTML hex',
                  'Name',
                ].map((h) => (
                  <th key={h} scope="col" className="px-2 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.dec}
                  className={`border-t border-gray-100 ${r.control ? 'bg-amber-50/40' : ''}`}
                >
                  <td className="px-1 py-1 tabular-nums">
                    {cellBtn(String(r.dec), `decimal ${r.dec}`)}
                  </td>
                  <td className="px-1 py-1">
                    {cellBtn(r.hex, `hex ${r.hex}`)}
                  </td>
                  <td className="px-1 py-1">
                    {cellBtn(r.oct, `octal ${r.oct}`)}
                  </td>
                  <td className="px-1 py-1">
                    {cellBtn(r.bin, `binary ${r.bin}`)}
                  </td>
                  <td className="px-1 py-1 text-base">
                    {r.control ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-900">
                        {r.abbr}
                      </span>
                    ) : (
                      cellBtn(r.dec === 32 ? ' ' : r.char, r.name, false)
                    )}
                  </td>
                  <td className="px-1 py-1">{cellBtn(r.htmlDec, r.htmlDec)}</td>
                  <td className="px-1 py-1">{cellBtn(r.htmlHex, r.htmlHex)}</td>
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className="text-left text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      {r.control || r.dec === 32
                        ? `${r.abbr} — ${r.name}`
                        : r.name}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected && `${selected.abbr} · ASCII ${selected.dec}`}
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {selected.name}
              {selected.control && ' — a non-printing control code.'}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {!selected.control && (
                <CopyChip label="Character" value={selected.char} />
              )}
              <CopyChip label="Decimal" value={String(selected.dec)} />
              <CopyChip label="Hex" value={`0x${selected.hex}`} />
              <CopyChip label="Octal" value={selected.oct} />
              <CopyChip label="Binary" value={selected.bin} />
              <CopyChip label="HTML decimal" value={selected.htmlDec} />
              <CopyChip label="HTML hex" value={selected.htmlHex} />
              <CopyChip
                label="Unicode"
                value={`U+${selected.dec.toString(16).toUpperCase().padStart(4, '0')}`}
              />
              {selected.escape && (
                <CopyChip label="Escape sequence" value={selected.escape} />
              )}
              {selected.caret && (
                <CopyChip label="Caret notation" value={selected.caret} />
              )}
            </div>
          </div>
        )}
      </DetailDialog>
    </div>
  );
}
