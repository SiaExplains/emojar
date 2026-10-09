'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import {
  MAX_BLANK_COUNT,
  PALETTE,
  blankText,
  charOf,
  cleanInvisible,
  codeLabel,
  scanInvisible,
} from '@/lib/online-tools/engines/invisible';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  NumberField,
  SelectField,
  ToolInput,
  ToolOutput,
  btnSecondary,
} from '../ui';

const DETECT_SAMPLE = `Hello\u200Bworld — this\u00A0text has\u2060hidden characters.\u3164 Emoji joiners like 👩\u200D💻 stay intact.`;

export default function InvisibleTextTool({ config }: ToolProps) {
  const [cp, setCp] = useState(
    () => Number(config.init_char ?? 0x3164) || 0x3164,
  );
  const [count, setCount] = useState('1');
  const [text, setText] = useState('');
  const [spacesToNormal, setSpacesToNormal] = useState(true);
  const deferred = useDeferredValue(text);
  const scan = useMemo(() => scanInvisible(deferred), [deferred]);
  const cleaned = useMemo(
    () => (deferred ? cleanInvisible(deferred, { spacesToNormal }) : ''),
    [deferred, spacesToNormal],
  );
  const n = Math.min(
    MAX_BLANK_COUNT,
    Math.max(1, Math.floor(Number(count)) || 1),
  );
  const generated = blankText(cp, n);

  return (
    <div className="space-y-8">
      <section className="space-y-3" aria-labelledby="inv-copy">
        <h2 id="inv-copy" className="text-base font-semibold text-gray-900">
          Copy an invisible character
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PALETTE.map((c) => (
            <li
              key={c.cp}
              className="flex items-start gap-3 rounded-xl border border-gray-100 p-3"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 font-mono text-xs text-gray-400"
              >
                {c.short}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {c.name}{' '}
                  <span className="font-mono text-xs text-gray-500">
                    {codeLabel(c.cp)}
                  </span>
                </p>
                <p className="text-xs text-gray-600">{c.palette}</p>
              </div>
              <CopyButton
                text={charOf(c.cp)}
                className="!px-2.5 !py-1 text-xs"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="inv-gen">
        <h2 id="inv-gen" className="text-base font-semibold text-gray-900">
          Blank text generator
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <SelectField
            label="Character"
            value={String(cp)}
            onChange={(v) => setCp(Number(v))}
            options={PALETTE.map((c) => ({
              value: String(c.cp),
              label: `${c.name} (${codeLabel(c.cp)})`,
            }))}
            className="min-w-[240px]"
          />
          <NumberField
            label="How many"
            value={count}
            onChange={setCount}
            min={1}
            max={MAX_BLANK_COUNT}
            step={1}
            className="w-32"
          />
          <div className="pb-0.5">
            <CopyButton text={generated} label={`Copy ${n} blank`} />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          The copied text looks empty. If an app removes it, try another
          character from the list — Hangul Filler and Braille Blank are accepted
          most often.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="inv-detect">
        <h2 id="inv-detect" className="text-base font-semibold text-gray-900">
          Find and remove hidden characters
        </h2>
        <ToolInput
          label="Paste text to check"
          value={text}
          onChange={setText}
          rows={6}
          mono={false}
          placeholder="Paste text that behaves strangely — a password that won’t match, a name that looks empty, code that won’t compile…"
          actions={
            <>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setText(DETECT_SAMPLE)}
              >
                Load sample
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </button>
            </>
          }
        />
        {deferred && (
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm font-medium text-gray-800">
              {scan.total === 0
                ? 'No hidden characters found.'
                : `Found ${scan.total} hidden character${scan.total === 1 ? '' : 's'}:`}
            </p>
            {scan.findings.length > 0 && (
              <>
                <ul className="flex flex-wrap gap-2">
                  {scan.findings.map((f) => (
                    <li
                      key={f.cp}
                      className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs text-rose-900"
                    >
                      {f.count}× {f.name}{' '}
                      <span className="font-mono">{codeLabel(f.cp)}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className="whitespace-pre-wrap break-words rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm leading-7 text-gray-800"
                  aria-label="Text with hidden characters marked"
                >
                  {scan.segments.map((s, i) =>
                    s.type === 'text' ? (
                      <span key={i}>{s.value}</span>
                    ) : (
                      <mark
                        key={i}
                        title={`${s.char.name} (${codeLabel(s.char.cp)})`}
                        className="mx-0.5 rounded bg-rose-200 px-1 font-mono text-xs text-rose-900"
                      >
                        {s.char.short}
                      </mark>
                    ),
                  )}
                </div>
                <Checkbox
                  label="Turn unusual spaces into normal spaces (instead of deleting them)"
                  checked={spacesToNormal}
                  onChange={setSpacesToNormal}
                />
                <ToolOutput
                  label="Clean text"
                  value={cleaned}
                  rows={5}
                  mono={false}
                  filename="clean-text.txt"
                  mime="text/plain"
                />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
