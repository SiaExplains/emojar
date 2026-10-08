'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  BLOCKS,
  UNICODE_VERSION,
} from '@/lib/online-tools/data/unicode-blocks';
import {
  charInfo,
  displayChar,
  formatBytes,
  parseNameDb,
  searchUnicode,
  uPlus,
  utf16Units,
  utf8Bytes,
  type NameDb,
} from '@/lib/online-tools/engines/unicode';
import type { ToolProps } from '../ToolRenderer';
import { btnSecondary } from '../ui';
import {
  CopyChip,
  DetailDialog,
  EmptyState,
  Fact,
  SearchBox,
  SelectChip,
} from './ReferenceUI';

const PAGE = 256;
const NAMES_URL = `/data/unicode-names-${UNICODE_VERSION.split('.')[0]}.txt`;

export default function UnicodeExplorerTool({ config }: ToolProps) {
  const initBlock = String(config.init_block ?? 'Latin-1 Supplement');
  const [db, setDb] = useState<NameDb | null>(null);
  const [dbState, setDbState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [query, setQuery] = useState('');
  const [block, setBlock] = useState(
    Math.max(
      0,
      BLOCKS.findIndex(([, , n]) => n === initBlock),
    ),
  );
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = useDeferredValue(query);

  // Names (~1 MB, ~170 KB compressed) are fetched from this site only when the
  // explorer opens; browsing and pasting work before they arrive.
  useEffect(() => {
    let alive = true;
    fetch(NAMES_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => {
        if (!alive) return;
        setDb(parseNameDb(t));
        setDbState('ready');
      })
      .catch(() => alive && setDbState('error'));
    return () => {
      alive = false;
    };
  }, []);

  const result = useMemo(
    () => (q.trim() ? searchUnicode(q, db) : null),
    [q, db],
  );
  // Typing an exact block name (“Arrows”) shows that block.
  const shownBlock =
    result?.kind === 'block'
      ? BLOCKS.findIndex(([a]) => a === result.first)
      : block;
  const shownPage = result?.kind === 'block' ? 0 : page;
  const [first, last, blockName] = BLOCKS[shownBlock];
  const blockCps = useMemo(() => {
    const start = first + shownPage * PAGE;
    const end = Math.min(last, start + PAGE - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [first, last, shownPage]);
  const pages = Math.ceil((last - first + 1) / PAGE);

  const showBlock = (cp0: number) => {
    const idx = BLOCKS.findIndex(([a, b]) => cp0 >= a && cp0 <= b);
    if (idx >= 0) {
      setBlock(idx);
      setPage(Math.floor((cp0 - BLOCKS[idx][0]) / PAGE));
      setQuery('');
    }
  };

  const blockHit = result?.kind === 'block' ? result : null;
  const cps = result?.kind === 'codepoints' ? result.cps : blockCps;

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search Unicode"
        value={query}
        onChange={setQuery}
        placeholder="Paste a character, or search “snowman”, U+00E9, 1F600, Arrows…"
        count={result?.kind === 'codepoints' ? result.cps.length : undefined}
        noun="character"
      />
      <p className="text-xs text-gray-500" aria-live="polite">
        {dbState === 'loading'
          ? 'Loading character names… you can already browse and paste.'
          : dbState === 'error'
            ? 'Character names could not be loaded — code points, blocks and encodings still work.'
            : `Unicode ${UNICODE_VERSION}: ${db!.names.length.toLocaleString('en-US')} named characters in ${BLOCKS.length} blocks.`}
      </p>

      {!q.trim() && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[16rem] flex-1">
            <SelectChip
              label="Unicode block"
              value={String(block)}
              onChange={(v) => {
                setBlock(Number(v));
                setPage(0);
              }}
              options={BLOCKS.map(([a, b, n], i) => ({
                value: String(i),
                label: `${n} (${uPlus(a)}–${uPlus(b)})`,
              }))}
            />
          </div>
          {pages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                className={btnSecondary}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="tabular-nums text-gray-600">
                {page + 1} / {pages}
              </span>
              <button
                type="button"
                className={btnSecondary}
                disabled={page >= pages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {cps && cps.length === 0 && (
        <EmptyState>
          {dbState === 'ready'
            ? `No character name contains “${q}”. Try fewer words, or a code point like U+2603.`
            : 'Names are still loading — try again in a moment, or search by code point.'}
        </EmptyState>
      )}
      {cps && cps.length > 0 && (
        <>
          {(!q.trim() || blockHit) && (
            <h2 className="text-sm font-semibold text-gray-800">
              {blockName}{' '}
              <span className="font-normal text-gray-500">
                {uPlus(first)}–{uPlus(last)}
              </span>
              {blockHit && (
                <button
                  type="button"
                  onClick={() => showBlock(blockHit.first)}
                  className="ml-2 text-xs font-normal text-indigo-600 underline underline-offset-2"
                >
                  Browse this block
                </button>
              )}
            </h2>
          )}
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5">
            {cps.map((cp) => {
              const info = charInfo(cp, db);
              return (
                <li key={cp}>
                  <button
                    type="button"
                    onClick={() => setSelected(cp)}
                    title={`${uPlus(cp)} ${info.name}`}
                    aria-label={`${uPlus(cp)} ${info.name || 'character'}`}
                    className={`flex h-14 w-full flex-col items-center justify-center rounded-lg border text-xl transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      info.gc === 'Cn' && db
                        ? 'border-dashed border-gray-200 text-gray-300'
                        : 'border-gray-100 text-gray-900'
                    }`}
                  >
                    <span className="leading-none">
                      {displayChar(cp, info.gc)}
                    </span>
                    <span className="mt-1 font-mono text-[9px] text-gray-400">
                      {cp.toString(16).toUpperCase()}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {result?.kind === 'codepoints' && result.truncated && (
            <p className="text-xs text-gray-500">
              Showing the first {result.cps.length} matches — add a word to
              narrow it down.
            </p>
          )}
        </>
      )}

      <DetailDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={
          selected !== null &&
          `${uPlus(selected)} ${charInfo(selected, db).name}`
        }
      >
        {selected !== null && (
          <CharDetails
            cp={selected}
            db={db}
            onBlock={() => {
              setSelected(null);
              showBlock(selected);
            }}
          />
        )}
      </DetailDialog>
    </div>
  );
}

function CharDetails({
  cp,
  db,
  onBlock,
}: {
  cp: number;
  db: NameDb | null;
  onBlock: () => void;
}) {
  const info = charInfo(cp, db);
  const u8 = utf8Bytes(cp);
  const u16 = utf16Units(cp);
  const u16hex = u16.map((x) => x.toString(16).toUpperCase().padStart(4, '0'));
  // \u{…} is JavaScript-only; JSON needs the UTF-16 surrogate pair.
  const jsEscape =
    cp > 0xffff ? `\\u{${cp.toString(16).toUpperCase()}}` : `\\u${u16hex[0]}`;
  const jsonEscape = u16hex.map((h) => `\\u${h}`).join('');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-6 text-6xl">
        {displayChar(cp, info.gc)}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <CopyChip label="Character" value={info.char} mono={false} />
        <CopyChip label="Code point" value={uPlus(cp)} />
        <CopyChip label="HTML decimal" value={`&#${cp};`} />
        <CopyChip
          label="HTML hex"
          value={`&#x${cp.toString(16).toUpperCase()};`}
        />
        <CopyChip
          label="UTF-8 bytes"
          value={u8.length ? formatBytes(u8) : 'n/a (surrogate)'}
        />
        <CopyChip
          label="UTF-16"
          value={u16
            .map((x) => x.toString(16).toUpperCase().padStart(4, '0'))
            .join(' ')}
        />
        <CopyChip label="JavaScript" value={jsEscape} />
        <CopyChip label="JSON" value={jsonEscape} />
        <CopyChip label="CSS" value={`\\${cp.toString(16).toUpperCase()}`} />
      </div>
      <dl>
        <Fact label="Name" value={info.name || '(no name)'} />
        <Fact label="Code point" value={`${uPlus(cp)} (decimal ${cp})`} />
        <Fact
          label="General category"
          value={`${info.category} (${info.gc})`}
        />
        <Fact
          label="Block"
          value={
            <button
              type="button"
              onClick={onBlock}
              className="text-indigo-600 underline underline-offset-2"
            >
              {info.block}
            </button>
          }
        />
        <Fact
          label="Plane"
          value={
            cp <= 0xffff ? 'Basic Multilingual Plane (0)' : `Plane ${cp >> 16}`
          }
        />
        <Fact
          label="UTF-8 length"
          value={
            u8.length ? `${u8.length} byte${u8.length > 1 ? 's' : ''}` : '—'
          }
        />
        <Fact
          label="UTF-16 length"
          value={`${u16.length} code unit${u16.length > 1 ? 's' : ''}${u16.length > 1 ? ' (surrogate pair)' : ''}`}
        />
      </dl>
    </div>
  );
}
