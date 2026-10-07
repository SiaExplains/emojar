'use client';

// Team, username, fake test data and random colour generators.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FAKE_FIELDS,
  MAX_FAKE_ROWS,
  generateFakeData,
  generateUsername,
  makeTeams,
  parseNames,
  randomColor,
  textOn,
  type ColorMode,
  type FakeField,
  type UsernameOptions,
  type UsernameStyle,
} from '@/lib/online-tools/engines/generators';
import { formatHsl, formatRgb } from '@/lib/online-tools/engines/color';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  NumberField,
  RangeField,
  SelectField,
  TextField,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

/* ------------------------------------------------------------------ */

const SAMPLE_NAMES =
  'Ada\nBen\nChloe\nDavid\nElena\nFinn\nGrace\nHugo\nIvy\nJamal\nKira\nLeo';

export function TeamGeneratorTool(_: ToolProps) {
  const [names, setNames] = useState('');
  const [mode, setMode] = useState<'teams' | 'perTeam'>('teams');
  const [count, setCount] = useState('3');
  const [captains, setCaptains] = useState('');
  const [teams, setTeams] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const list = parseNames(names);

  const generate = () => {
    try {
      const n = Number(count);
      setTeams(
        makeTeams(list, {
          ...(mode === 'teams' ? { teams: n } : { perTeam: n }),
          captains: parseNames(captains),
        }),
      );
      setError('');
    } catch (e) {
      setTeams([]);
      setError(friendlyError(e, 'Could not make teams.'));
    }
  };

  const text = teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n');

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="team-names" className={labelBase}>
            Names — one per line or separated by commas ({list.length})
          </label>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setNames(SAMPLE_NAMES)}
          >
            Load sample
          </button>
        </div>
        <textarea
          id="team-names"
          rows={7}
          value={names}
          onChange={(e) => setNames(e.target.value)}
          className={inputBase}
          placeholder="Ada&#10;Ben&#10;Chloe…"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Split by"
          value={mode}
          onChange={(v) => setMode(v as 'teams' | 'perTeam')}
          options={[
            { value: 'teams', label: 'Number of teams' },
            { value: 'perTeam', label: 'People per team' },
          ]}
        />
        <NumberField
          label={mode === 'teams' ? 'Teams' : 'People per team'}
          value={count}
          onChange={setCount}
          min={1}
          step={1}
        />
        <TextField
          label="Captains (optional, comma-separated)"
          value={captains}
          onChange={setCaptains}
          placeholder="Ada, Ben"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={generate}
          disabled={list.length < 2}
        >
          {teams.length ? 'Shuffle again' : 'Make teams'}
        </button>
        {teams.length > 0 && <CopyButton text={text} label="Copy teams" />}
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {teams.length > 0 && (
        <ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          aria-live="polite"
        >
          {teams.map((t, i) => (
            <li key={i} className="rounded-2xl border border-gray-100 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">
                Team {i + 1}{' '}
                <span className="text-xs font-normal text-gray-400">
                  ({t.length})
                </span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {t.map((n, j) => (
                  <li key={n + j}>
                    {n}
                    {j === 0 && parseNames(captains).includes(n) && (
                      <span className="ml-1 text-xs text-amber-600">
                        ★ captain
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500">
        Names are shuffled with your browser’s cryptographic random generator,
        so every split is equally likely.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const STYLES: { value: UsernameStyle; label: string }[] = [
  { value: 'adjective-animal', label: 'Adjective + animal (SwiftOtter)' },
  { value: 'word-word', label: 'Two words (maple_rocket)' },
  { value: 'gamer', label: 'Gamer (ShadowVolt)' },
  { value: 'cute', label: 'Cute (honeypanda)' },
  { value: 'professional', label: 'Professional (from your name)' },
];

export function UsernameGeneratorTool(_: ToolProps) {
  const [o, setO] = useState<UsernameOptions>({
    style: 'adjective-animal',
    separator: '',
    numbers: true,
    capitalize: true,
    keyword: '',
    firstName: '',
    lastName: '',
    maxLength: 20,
  });
  const [names, setNames] = useState<string[]>([]);
  const set = <K extends keyof UsernameOptions>(k: K, v: UsernameOptions[K]) =>
    setO((x) => ({ ...x, [k]: v }));
  const generate = useCallback(() => {
    const out = new Set<string>();
    for (let i = 0; i < 200 && out.size < 20; i++) out.add(generateUsername(o));
    setNames([...out]);
  }, [o]);
  useEffect(() => generate(), [generate]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Style"
          value={o.style}
          onChange={(v) => set('style', v as UsernameStyle)}
          options={STYLES}
        />
        <SelectField
          label="Separator"
          value={o.separator}
          onChange={(v) => set('separator', v as UsernameOptions['separator'])}
          options={[
            { value: '', label: 'None' },
            { value: '_', label: 'Underscore _' },
            { value: '.', label: 'Dot .' },
            { value: '-', label: 'Hyphen -' },
          ]}
        />
        <NumberField
          label="Max length"
          value={String(o.maxLength ?? '')}
          onChange={(v) => set('maxLength', Number(v) || undefined)}
          min={4}
          step={1}
        />
        {o.style === 'professional' ? (
          <>
            <TextField
              label="First name"
              value={o.firstName ?? ''}
              onChange={(v) => set('firstName', v)}
            />
            <TextField
              label="Last name"
              value={o.lastName ?? ''}
              onChange={(v) => set('lastName', v)}
            />
          </>
        ) : (
          <TextField
            label="Include a word (optional)"
            value={o.keyword ?? ''}
            onChange={(v) => set('keyword', v)}
            placeholder="e.g. chef, pixel"
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox
          label="Add numbers"
          checked={o.numbers}
          onChange={(v) => set('numbers', v)}
        />
        <Checkbox
          label="Capitalize words"
          checked={o.capitalize}
          onChange={(v) => set('capitalize', v)}
        />
        <button type="button" className={btnPrimary} onClick={generate}>
          Generate more
        </button>
      </div>
      <ul
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
      >
        {names.map((n) => (
          <li
            key={n}
            className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-3 py-2"
          >
            <span className="truncate font-mono text-sm text-gray-900">
              {n}
            </span>
            <CopyButton text={n} className="!px-2 !py-1 text-xs" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">
        Availability isn’t checked — try your favourite on the site you’re
        signing up for.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const DEFAULT_FIELDS: FakeField[] = [
  'id',
  'fullName',
  'email',
  'phone',
  'city',
  'country',
  'date',
];

export function FakeDataTool(_: ToolProps) {
  const [fields, setFields] = useState<FakeField[]>(DEFAULT_FIELDS);
  const [rows, setRows] = useState('20');
  const [format, setFormat] = useState<'csv' | 'json' | 'sql'>('csv');
  const [seed, setSeed] = useState('');
  const [table, setTable] = useState('users');
  const [nonce, setNonce] = useState(0);

  const { output, error } = useMemo(() => {
    void nonce;
    try {
      return {
        output: generateFakeData(fields, Number(rows), format, {
          seed: seed.trim() || undefined,
          table,
        }),
        error: '',
      };
    } catch (e) {
      return {
        output: '',
        error: friendlyError(e, 'Could not generate data.'),
      };
    }
  }, [fields, rows, format, seed, table, nonce]);

  const toggle = (f: FakeField) =>
    setFields((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]));

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className={labelBase}>Fields (in this order)</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.keys(FAKE_FIELDS) as FakeField[]).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={fields.includes(f)}
              onClick={() => toggle(f)}
              className={`rounded-full border px-3 py-1 text-xs ${fields.includes(f) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {FAKE_FIELDS[f]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-4">
        <NumberField
          label={`Rows (max ${MAX_FAKE_ROWS})`}
          value={rows}
          onChange={setRows}
          min={1}
          step={1}
        />
        <SelectField
          label="Format"
          value={format}
          onChange={(v) => setFormat(v as 'csv' | 'json' | 'sql')}
          options={[
            { value: 'csv', label: 'CSV' },
            { value: 'json', label: 'JSON' },
            { value: 'sql', label: 'SQL INSERT' },
          ]}
        />
        {format === 'sql' && (
          <TextField
            label="Table name"
            value={table}
            onChange={setTable}
            mono
          />
        )}
        <TextField
          label="Seed (optional, same seed = same data)"
          value={seed}
          onChange={setSeed}
          placeholder="e.g. demo-1"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setNonce((n) => n + 1)}
          disabled={!!seed.trim()}
        >
          Regenerate
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <ToolOutput
        label={`Test data (${format.toUpperCase()})`}
        value={output}
        rows={14}
        filename={`test-data.${format}`}
        mime={
          format === 'json'
            ? 'application/json'
            : format === 'csv'
              ? 'text/csv'
              : 'application/sql'
        }
      />
      <p className="text-xs text-gray-500">
        All values are invented: emails use the reserved example.com domains,
        phone numbers the 555-01xx fiction range and IPs the documentation
        ranges, so they can never reach a real person or server.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Swatch = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  locked: boolean;
};

export function RandomColorTool(_: ToolProps) {
  const [mode, setMode] = useState<ColorMode>('any');
  const [hue, setHue] = useState(210);
  const [count, setCount] = useState(5);
  const [swatches, setSwatches] = useState<Swatch[]>([]);

  const roll = useCallback(() => {
    setSwatches((prev) =>
      Array.from({ length: count }, (_, i) => {
        if (prev[i]?.locked) return prev[i];
        const c = randomColor(mode, hue);
        return { hex: c.hex, rgb: c.rgb, locked: false };
      }),
    );
  }, [mode, hue, count]);
  useEffect(() => roll(), [roll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement ||
          e.target instanceof HTMLButtonElement
        )
      ) {
        e.preventDefault();
        roll();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roll]);

  const all = swatches.map((s) => s.hex).join(', ');

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Kind of colour"
          value={mode}
          onChange={(v) => setMode(v as ColorMode)}
          options={[
            { value: 'any', label: 'Any colour' },
            { value: 'pastel', label: 'Pastel' },
            { value: 'vivid', label: 'Vivid / bright' },
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'hue', label: 'Around one hue' },
          ]}
        />
        {mode === 'hue' && (
          <RangeField
            label="Hue"
            value={hue}
            onChange={setHue}
            min={0}
            max={359}
            display={`${hue}°`}
          />
        )}
        <RangeField
          label="How many"
          value={count}
          onChange={setCount}
          min={1}
          max={10}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} onClick={roll}>
          Generate (or press Space)
        </button>
        <CopyButton text={all} label="Copy all HEX" />
      </div>
      <ul
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-live="polite"
      >
        {swatches.map((s, i) => {
          const fg = textOn(s.rgb);
          return (
            <li
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100"
            >
              <div
                className="flex h-28 items-start justify-end p-2"
                style={{ background: s.hex, color: fg }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    setSwatches((x) =>
                      x.map((y, j) =>
                        j === i ? { ...y, locked: !y.locked } : y,
                      ),
                    );
                    // Blur so Space regenerates instead of toggling this lock again.
                    e.currentTarget.blur();
                  }}
                  aria-pressed={s.locked}
                  aria-label={s.locked ? `Unlock ${s.hex}` : `Lock ${s.hex}`}
                  className="rounded-full bg-black/20 px-2 py-0.5 text-xs"
                >
                  {s.locked ? '🔒' : '🔓'}
                </button>
              </div>
              <div className="space-y-1 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold uppercase">
                    {s.hex}
                  </span>
                  <CopyButton text={s.hex} className="!px-2 !py-0.5 text-xs" />
                </div>
                {[formatRgb(s.rgb), formatHsl(s.rgb)].map((v) => (
                  <div
                    key={v}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="font-mono text-gray-500">{v}</span>
                    <CopyButton text={v} className="!px-2 !py-0.5 text-xs" />
                  </div>
                ))}
                <p className="text-gray-400">
                  Best text: {fg === '#000000' ? 'black' : 'white'}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
