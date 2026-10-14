'use client';

// Reading Time Calculator, Keyword Density Checker, Duplicate Word Finder
// and Sentence Length Checker. All analysis runs locally as you type.

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  Notice,
  NumberField,
  SelectField,
  ToolInput,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  findRepeatedWords,
  formatDuration,
  keywordDensity,
  phraseCount,
  readingStats,
  removeRepeats,
  sentenceReport,
} from '@/lib/online-tools/engines/text-analysis';

const MAX_CHARS = 1_000_000;

function Stat({
  label,
  value,
  primary,
}: {
  label: string;
  value: ReactNode;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 ${primary ? 'bg-brand-50' : 'bg-gray-50'}`}
    >
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd
        className={`font-semibold tabular-nums ${primary ? 'text-xl text-brand-800' : 'text-lg text-gray-900'}`}
      >
        {value}
      </dd>
    </div>
  );
}

function TextBox({
  value,
  onChange,
  label = 'Your text',
  placeholder = 'Paste or type your text here…',
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <ToolInput
      label={label}
      value={value}
      onChange={(v) => onChange(v.slice(0, MAX_CHARS))}
      rows={9}
      mono={false}
      placeholder={placeholder}
      actions={
        value ? (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => onChange('')}
          >
            Clear
          </button>
        ) : undefined
      }
    />
  );
}

const n = (x: number) => x.toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* Reading Time                                                         */
/* ------------------------------------------------------------------ */

const READ_PRESETS = [
  { value: '150', label: 'Slow / careful (150 wpm)' },
  { value: '238', label: 'Average adult, non-fiction (238 wpm)' },
  { value: '300', label: 'Fast / skimming (300 wpm)' },
  { value: 'custom', label: 'Custom…' },
];
const SPEAK_PRESETS = [
  { value: '120', label: 'Slow presentation (120 wpm)' },
  { value: '150', label: 'Normal speech (150 wpm)' },
  { value: '180', label: 'Fast / podcast (180 wpm)' },
  { value: 'custom', label: 'Custom…' },
];

export function ReadingTimeTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [readP, setReadP] = useState('238');
  const [speakP, setSpeakP] = useState('150');
  const [readC, setReadC] = useState('238');
  const [speakC, setSpeakC] = useState('150');
  const read = Number(readP === 'custom' ? readC : readP);
  const speak = Number(speakP === 'custom' ? speakC : speakP);
  const valid = (x: number) => Number.isFinite(x) && x >= 20 && x <= 2000;
  const s = readingStats(
    text,
    valid(read) ? read : 0,
    valid(speak) ? speak : 0,
  );

  return (
    <div className="space-y-5">
      <TextBox value={text} onChange={setText} />
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="Reading time"
          value={formatDuration(s.readingMinutes)}
          primary
        />
        <Stat
          label="Speaking time"
          value={formatDuration(s.speakingMinutes)}
          primary
        />
        <Stat label="Words" value={n(s.words)} />
        <Stat
          label="Characters (no spaces)"
          value={`${n(s.characters)} (${n(s.charactersNoSpaces)})`}
        />
      </dl>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <SelectField
            label="Reading speed"
            value={readP}
            onChange={setReadP}
            options={READ_PRESETS}
          />
          {readP === 'custom' && (
            <NumberField
              label="Words per minute (reading)"
              value={readC}
              onChange={setReadC}
              min={20}
              step={1}
            />
          )}
        </div>
        <div className="space-y-2">
          <SelectField
            label="Speaking speed"
            value={speakP}
            onChange={setSpeakP}
            options={SPEAK_PRESETS}
          />
          {speakP === 'custom' && (
            <NumberField
              label="Words per minute (speaking)"
              value={speakC}
              onChange={setSpeakC}
              min={20}
              step={1}
            />
          )}
        </div>
      </div>
      {(!valid(read) || !valid(speak)) && (
        <Notice tone="amber">
          Enter a speed between 20 and 2,000 words per minute.
        </Notice>
      )}
      <p className="text-xs text-gray-500">
        Reading time = words ÷ reading speed; speaking time = words ÷ speaking
        speed. Chinese and Japanese characters count as one word each.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Keyword Density                                                      */
/* ------------------------------------------------------------------ */

export function KeywordDensityTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [phrase, setPhrase] = useState('1');
  const [minLen, setMinLen] = useState('3');
  const [stop, setStop] = useState(true);
  const [target, setTarget] = useState('');
  const deferred = useDeferredValue(text);
  const len = Number(phrase);
  const report = useMemo(
    () =>
      keywordDensity(deferred, {
        phraseLength: len,
        minLength: Math.max(1, Number(minLen) || 1),
        excludeStopWords: stop,
        limit: 50,
      }),
    [deferred, len, minLen, stop],
  );
  const tCount = target.trim() ? phraseCount(deferred, target) : 0;
  const tWords = target.trim().split(/\s+/).length;
  const csv = [
    'phrase,count,density %',
    ...report.rows.map(
      (r) =>
        `"${r.phrase.replace(/"/g, '""')}",${r.count},${r.density.toFixed(2)}`,
    ),
  ].join('\r\n');

  return (
    <div className="space-y-5">
      <TextBox value={text} onChange={setText} />
      <div className="grid gap-3 sm:grid-cols-4">
        <SelectField
          label="Count"
          value={phrase}
          onChange={setPhrase}
          options={[
            { value: '1', label: 'Single words' },
            { value: '2', label: '2-word phrases' },
            { value: '3', label: '3-word phrases' },
            { value: '4', label: '4-word phrases' },
          ]}
        />
        <NumberField
          label="Minimum word length"
          value={minLen}
          onChange={setMinLen}
          min={1}
          step={1}
        />
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="kd-target"
            className="block text-sm font-medium text-gray-700"
          >
            Check a specific keyword or phrase
          </label>
          <input
            id="kd-target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. coffee beans"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={stop}
          onChange={(e) => setStop(e.target.checked)}
        />
        Ignore common words (the, and, of, to…)
      </label>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Total words" value={n(report.totalWords)} />
        <Stat label="Unique words" value={n(report.uniqueWords)} />
        {target.trim() && (
          <Stat
            label={`“${target.trim()}”`}
            value={`${tCount}× · ${report.totalWords ? ((tCount * tWords * 100) / report.totalWords).toFixed(2) : '0.00'}%`}
            primary
          />
        )}
      </dl>
      {report.rows.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Top {report.rows.length}{' '}
              {len === 1 ? 'words' : `${len}-word phrases`}
            </h3>
            <div className="flex gap-2">
              <CopyButton text={csv} label="Copy CSV" />
              <button
                type="button"
                className={btnSecondary}
                onClick={() =>
                  downloadBlob(csv, 'keyword-density.csv', 'text/csv')
                }
              >
                ⬇ CSV
              </button>
            </div>
          </div>
          <div className="max-h-[420px] overflow-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">
                    {len === 1 ? 'Word' : 'Phrase'}
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Count</th>
                  <th className="px-3 py-2 text-right font-medium">Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {report.rows.map((r, i) => (
                  <tr key={r.phrase}>
                    <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-1.5 font-medium text-gray-900">
                      {r.phrase}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {r.count}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {r.density.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        text.trim() && (
          <p className="text-sm text-gray-500">
            {len > 1
              ? 'No phrase appears more than once yet.'
              : 'No words match the current settings.'}
          </p>
        )
      )}
      <p className="text-xs text-gray-500">
        This is local text analysis of what you pasted — not search volume or
        ranking data. Density = occurrences × words in the phrase ÷ total words.
        Phrases don’t cross sentence breaks.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Highlighted text with navigation                                     */
/* ------------------------------------------------------------------ */

type Mark = {
  start: number;
  end: number;
  tone: 'red' | 'amber';
  title?: string;
};

function Highlighted({
  text,
  marks,
  active,
  refs,
}: {
  text: string;
  marks: Mark[];
  active: number;
  refs: React.MutableRefObject<(HTMLElement | null)[]>;
}) {
  const parts: ReactNode[] = [];
  let at = 0;
  marks.forEach((m, i) => {
    // Runs like "very very very" give overlapping marks; start after the last.
    const start = Math.max(m.start, at);
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <mark
        key={i}
        ref={(el) => {
          refs.current[i] = el;
        }}
        title={m.title}
        className={`rounded px-0.5 ${m.tone === 'red' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-950'} ${i === active ? 'ring-2 ring-brand-500' : ''}`}
      >
        {text.slice(start, m.end)}
      </mark>,
    );
    at = m.end;
  });
  parts.push(text.slice(at));
  return (
    <div className="max-h-[480px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-white p-4 text-[15px] leading-relaxed text-gray-800">
      {parts}
    </div>
  );
}

function Navigator({
  count,
  active,
  setActive,
  label,
}: {
  count: number;
  active: number;
  setActive: (i: number) => void;
  label: string;
}) {
  if (!count) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setActive((active - 1 + count) % count)}
        aria-label={`Previous ${label}`}
      >
        ↑ Previous
      </button>
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setActive((active + 1) % count)}
        aria-label={`Next ${label}`}
      >
        ↓ Next
      </button>
      <span className="text-gray-600" aria-live="polite">
        {active + 1} of {count}
      </span>
    </div>
  );
}

function useScrollTo(
  active: number,
  refs: React.MutableRefObject<(HTMLElement | null)[]>,
  enabled: boolean,
) {
  useEffect(() => {
    if (enabled)
      refs.current[active]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
  }, [active, refs, enabled]);
}

/* ------------------------------------------------------------------ */
/* Duplicate Word Finder                                                */
/* ------------------------------------------------------------------ */

export function DuplicateWordTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [strict, setStrict] = useState(false);
  const [active, setActive] = useState(0);
  const [nav, setNav] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const deferred = useDeferredValue(text);
  const repeats = useMemo(
    () => findRepeatedWords(deferred, strict),
    [deferred, strict],
  );
  const marks: Mark[] = repeats.map((r) => ({
    start: r.firstStart,
    end: r.end,
    tone: 'red',
    title: `“${r.word}” is repeated`,
  }));
  const idx = Math.min(active, Math.max(0, marks.length - 1));
  useScrollTo(idx, refs, nav);
  const counts = new Map<string, number>();
  for (const r of repeats)
    counts.set(
      r.word.toLowerCase(),
      (counts.get(r.word.toLowerCase()) ?? 0) + 1,
    );

  return (
    <div className="space-y-5">
      <TextBox value={text} onChange={(v) => (setText(v), setActive(0))} />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={strict}
          onChange={(e) => setStrict(e.target.checked)}
        />
        Also flag doubles that are often correct (“had had”, “that that”, “very
        very”)
      </label>
      {text.trim() &&
        (repeats.length ? (
          <>
            <Notice tone="amber">
              Found {repeats.length} repeated word
              {repeats.length === 1 ? '' : 's'}:{' '}
              {[...counts]
                .map(([w, c]) => `“${w}”${c > 1 ? ` ×${c}` : ''}`)
                .join(', ')}
              .
            </Notice>
            <Navigator
              count={marks.length}
              active={idx}
              setActive={(i) => (setNav(true), setActive(i))}
              label="repeat"
            />
            <Highlighted
              text={deferred}
              marks={marks}
              active={idx}
              refs={refs}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setText(removeRepeats(text, repeats))}
              >
                Remove all repeats
              </button>
              <CopyButton
                text={removeRepeats(text, repeats)}
                label="Copy fixed text"
              />
            </div>
          </>
        ) : (
          <Notice tone="green">✓ No repeated words found.</Notice>
        ))}
      <p className="text-xs text-gray-500">
        Flags the same word twice in a row, ignoring capitals and line breaks
        (“The the”). Words separated by punctuation, such as “Well, well”, and
        numbers are not flagged.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sentence Length Checker                                              */
/* ------------------------------------------------------------------ */

export function SentenceLengthTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState('25');
  const [active, setActive] = useState(0);
  const [nav, setNav] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const deferred = useDeferredValue(text);
  const max = Math.max(5, Number(limit) || 25);
  const r = useMemo(() => sentenceReport(deferred, max), [deferred, max]);
  const long = r.sentences.filter((s) => s.words > max);
  const marks: Mark[] = long.map((s) => ({
    start: s.start,
    end: s.end,
    tone: s.words > max * 1.5 ? 'red' : 'amber',
    title: `${s.words} words`,
  }));
  const idx = Math.min(active, Math.max(0, marks.length - 1));
  useScrollTo(idx, refs, nav);
  const buckets = [
    { label: '1–10', test: (w: number) => w <= 10 },
    { label: '11–20', test: (w: number) => w > 10 && w <= 20 },
    { label: '21–30', test: (w: number) => w > 20 && w <= 30 },
    { label: '31+', test: (w: number) => w > 30 },
  ].map((b) => ({
    ...b,
    count: r.sentences.filter((s) => b.test(s.words)).length,
  }));

  return (
    <div className="space-y-5">
      <TextBox value={text} onChange={(v) => (setText(v), setActive(0))} />
      <div className="grid gap-3 sm:grid-cols-3">
        <NumberField
          label="Flag sentences longer than"
          value={limit}
          onChange={setLimit}
          min={5}
          step={1}
          suffix="words"
        />
      </div>
      {r.count > 0 && (
        <>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Sentences" value={n(r.count)} />
            <Stat
              label="Average length"
              value={`${r.average.toFixed(1)} words`}
              primary
            />
            <Stat label="Median length" value={`${r.median} words`} />
            <Stat
              label={`Over ${max} words`}
              value={`${r.overLimit} (${Math.round((r.overLimit / r.count) * 100)}%)`}
            />
          </dl>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {buckets.map((b) => (
              <div key={b.label} className="rounded-lg bg-gray-50 px-2 py-2">
                <p className="text-base font-semibold text-gray-900">
                  {b.count}
                </p>
                <p className="text-gray-500">{b.label} words</p>
              </div>
            ))}
          </div>
          {long.length > 0 ? (
            <>
              <Navigator
                count={marks.length}
                active={idx}
                setActive={(i) => (setNav(true), setActive(i))}
                label="long sentence"
              />
              <Highlighted
                text={deferred}
                marks={marks}
                active={idx}
                refs={refs}
              />
              <p className="text-xs text-gray-500">
                Amber: over {max} words. Red: over {Math.round(max * 1.5)}{' '}
                words.
              </p>
            </>
          ) : (
            <Notice tone="green">
              ✓ No sentence is longer than {max} words.
            </Notice>
          )}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Longest sentences
            </h3>
            <ol className="space-y-2 text-sm">
              {r.longest.map((s) => (
                <li
                  key={s.start}
                  className="rounded-xl border border-gray-200 bg-white p-3"
                >
                  <span className="mr-2 rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
                    {s.words} words
                  </span>
                  {s.text}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
      <p className="text-xs text-gray-500">
        Sentences are found with rules (full stops, question and exclamation
        marks, blank lines), skipping common abbreviations such as “Dr.” and
        “e.g.”, initials and decimals. Unusual punctuation can still split or
        join sentences.
      </p>
    </div>
  );
}
