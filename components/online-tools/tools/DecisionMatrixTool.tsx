'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  DownloadButton,
  Notice,
  SelectField,
  btnPrimary,
  btnSecondary,
  inputBase,
} from '../ui';
import { newId, useStoredState } from './playground-shared';
import { LocalDataBar, PrintOnly } from './productivity-shared';
import {
  DM_LIMITS,
  EXAMPLE_MATRIX,
  computeResults,
  effectiveScore,
  fmt,
  isDecisionMatrixState,
  isValidScore,
  isValidWeight,
  normaliseTo100,
  normalisedWeights,
  pruneScores,
  rescaleScores,
  toCsv,
  toTsv,
  type DMState,
  type Scale,
} from '@/lib/online-tools/engines/decision-matrix';

const KEY = 'emojar:decision-matrix:v1';
const PRINT_ID = 'decision-matrix-print';
const iconBtn =
  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30';
// Distinct colours plus dash patterns, so radar lines differ without colour.
const SERIES = [
  { color: '#4f46e5', dash: '' },
  { color: '#db2777', dash: '6 4' },
  { color: '#059669', dash: '2 3' },
  { color: '#d97706', dash: '10 3 2 3' },
  { color: '#0284c7', dash: '1 5' },
  { color: '#7c3aed', dash: '8 6' },
];

const blankMatrix = (): DMState => ({
  version: 1,
  title: '',
  scale: 10,
  weightMode: 'percent',
  options: [
    { id: newId(), name: 'Option 1' },
    { id: newId(), name: 'Option 2' },
  ],
  criteria: [
    { id: newId(), name: 'Criterion 1', weight: 100, lowerIsBetter: false },
  ],
  scores: {},
});

function move<T>(list: T[], i: number, delta: number): T[] {
  const j = i + delta;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/**
 * Number input that keeps what the user is typing, commits only valid
 * values and reverts to the saved value on blur.
 */
function NumInput({
  value,
  onCommit,
  valid,
  label,
  min,
  max,
  describedBy,
  allowEmpty,
  className = '',
}: {
  value: number | undefined;
  onCommit: (n: number | undefined) => void;
  valid: (n: number) => boolean;
  label: string;
  min: number;
  max?: number;
  describedBy?: string;
  allowEmpty?: boolean;
  className?: string;
}) {
  const shown = value === undefined ? '' : String(value);
  const [draft, setDraft] = useState(shown);
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setDraft(shown);
  }, [shown]);
  const n = Number(draft);
  const bad =
    draft.trim() === '' ? !allowEmpty : !Number.isFinite(n) || !valid(n);
  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      min={min}
      max={max}
      value={draft}
      aria-label={label}
      aria-invalid={bad}
      aria-describedby={describedBy}
      onFocus={() => (focused.current = true)}
      onBlur={() => {
        focused.current = false;
        setDraft(shown);
      }}
      onChange={(e) => {
        const v = e.target.value;
        setDraft(v);
        if (v.trim() === '') {
          if (allowEmpty) onCommit(undefined);
          return;
        }
        const x = Number(v);
        if (Number.isFinite(x) && valid(x)) onCommit(x);
      }}
      className={`${inputBase} !px-2 !py-1.5 text-center tabular-nums ${
        bad ? '!border-red-400 !ring-2 !ring-red-100' : ''
      } ${className}`}
    />
  );
}

function Radar({ state }: { state: DMState }) {
  const n = state.criteria.length;
  const size = 320;
  const c = size / 2;
  const r = 110;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const k = (v / state.scale) * r;
    return [c + k * Math.cos(a), c + k * Math.sin(a)] as const;
  };
  const options = state.options.slice(0, SERIES.length);
  return (
    <figure className="space-y-2">
      <figcaption className="text-sm font-semibold text-gray-900">
        Radar chart (scores after “lower is better” inversion)
      </figcaption>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto w-full max-w-sm"
        role="img"
        aria-label={`Radar chart of ${options.length} options across ${n} criteria. The table above has the exact values.`}
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={state.criteria
              .map((_, i) => pt(i, f * state.scale).join(','))
              .join(' ')}
            fill="none"
            stroke="#e5e7eb"
          />
        ))}
        {state.criteria.map((cr, i) => {
          const [x, y] = pt(i, state.scale);
          const [lx, ly] = pt(i, state.scale * 1.18);
          return (
            <g key={cr.id}>
              <line x1={c} y1={c} x2={x} y2={y} stroke="#e5e7eb" />
              <text
                x={lx}
                y={ly}
                fontSize="10"
                fill="#4b5563"
                textAnchor={
                  Math.abs(lx - c) < 4 ? 'middle' : lx < c ? 'end' : 'start'
                }
                dominantBaseline="middle"
              >
                {cr.name.length > 14 ? `${cr.name.slice(0, 13)}…` : cr.name}
              </text>
            </g>
          );
        })}
        {options.map((o, oi) => (
          <polygon
            key={o.id}
            points={state.criteria
              .map((cr, i) => {
                const s = state.scores[cr.id]?.[o.id];
                const v =
                  s === undefined
                    ? 0
                    : effectiveScore(s, state.scale, cr.lowerIsBetter);
                return pt(i, v).join(',');
              })
              .join(' ')}
            fill={SERIES[oi].color}
            fillOpacity="0.08"
            stroke={SERIES[oi].color}
            strokeWidth="2"
            strokeDasharray={SERIES[oi].dash}
          />
        ))}
      </svg>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-700">
        {options.map((o, oi) => (
          <li key={o.id} className="inline-flex items-center gap-1.5">
            <svg width="28" height="8" aria-hidden>
              <line
                x1="0"
                y1="4"
                x2="28"
                y2="4"
                stroke={SERIES[oi].color}
                strokeWidth="2"
                strokeDasharray={SERIES[oi].dash}
              />
            </svg>
            {o.name || 'Untitled'}
          </li>
        ))}
      </ul>
      {state.options.length > SERIES.length && (
        <p className="text-center text-xs text-gray-500">
          The chart shows the first {SERIES.length} options.
        </p>
      )}
    </figure>
  );
}

export default function DecisionMatrixTool(_: ToolProps) {
  const [state, setState] = useStoredState<DMState>(
    KEY,
    EXAMPLE_MATRIX,
    isDecisionMatrixState,
  );
  const [showRadar, setShowRadar] = useState(false);
  const hintId = useId();
  const set = (patch: Partial<DMState>) =>
    setState((s) => ({ ...s, ...patch }));
  const res = computeResults(state);
  const w = normalisedWeights(state.criteria);
  const totals = new Map(res.ranked.map((r) => [r.id, r]));
  const off100 =
    state.weightMode === 'percent' &&
    state.criteria.length > 0 &&
    Math.abs(res.weightTotal - 100) > 0.001;
  const name = (id: string) =>
    state.options.find((o) => o.id === id)?.name || 'Untitled';

  const setScore = (cid: string, oid: string, v: number | undefined) =>
    setState((s) => {
      const row = { ...(s.scores[cid] ?? {}) };
      if (v === undefined) delete row[oid];
      else row[oid] = v;
      return { ...s, scores: { ...s.scores, [cid]: row } };
    });

  const updateOption = (i: number, nameV: string) =>
    set({
      options: state.options.map((o, oi) =>
        oi === i ? { ...o, name: nameV } : o,
      ),
    });
  const updateCriterion = (
    i: number,
    patch: Partial<DMState['criteria'][number]>,
  ) =>
    set({
      criteria: state.criteria.map((c, ci) =>
        ci === i ? { ...c, ...patch } : c,
      ),
    });

  let summary = '';
  if (!state.options.length || !state.criteria.length)
    summary = 'Add at least one option and one criterion.';
  else if (res.weightTotal <= 0)
    summary = 'Give at least one criterion a weight above 0.';
  else if (res.winners.length > 1)
    summary = `Tie: ${res.winners.map(name).join(' and ')} score ${fmt(res.ranked[0].total)} / ${state.scale}.`;
  else if (res.margin !== null)
    summary = `${name(res.winners[0])} wins with ${fmt(res.ranked[0].total)} / ${state.scale}, ${fmt(res.margin)} points (${fmt((res.margin / (res.ranked[1].total || 1)) * 100, 1)}%) ahead of ${name(res.ranked[1].id)}.`;
  else if (res.ranked[0])
    summary = `${name(res.ranked[0].id)} scores ${fmt(res.ranked[0].total)} / ${state.scale}. Add another option to compare.`;

  return (
    <div className="space-y-5">
      <PrintOnly id={PRINT_ID} />
      <div className="no-print grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="dm-title"
            className="block text-sm font-medium text-gray-700"
          >
            Decision
          </label>
          <input
            id="dm-title"
            value={state.title}
            maxLength={200}
            placeholder="e.g. Which laptop should I buy?"
            onChange={(e) => set({ title: e.target.value })}
            className={inputBase}
          />
        </div>
        <SelectField
          label="Score scale"
          value={String(state.scale)}
          onChange={(v) =>
            setState((s) => rescaleScores(s, Number(v) as Scale))
          }
          options={[
            { value: '10', label: '1 to 10' },
            { value: '5', label: '1 to 5' },
          ]}
        />
        <SelectField
          label="Enter weights as"
          value={state.weightMode}
          onChange={(v) => set({ weightMode: v as DMState['weightMode'] })}
          options={[
            { value: 'percent', label: 'Percentages (total 100)' },
            { value: 'raw', label: 'Points (any numbers)' },
          ]}
        />
      </div>

      <div id={PRINT_ID} className="space-y-4">
        {state.title && (
          <h2 className="text-lg font-semibold text-gray-900">{state.title}</h2>
        )}
        <p id={hintId} className="no-print text-xs text-gray-500">
          Scores from 1 (poor) to {state.scale} (excellent). Tick “lower is
          better” when a low score is the good outcome, such as cost or risk
          rated as an amount — the score is inverted, so {state.scale} counts as
          1. Empty cells count as 0.
        </p>

        <div className="print-overflow overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="sr-only">
              Decision matrix: criteria in rows, options in columns
            </caption>
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="min-w-[170px] px-3 py-2 text-left font-semibold text-gray-700"
                >
                  Criterion
                </th>
                <th
                  scope="col"
                  className="w-28 px-2 py-2 text-left font-semibold text-gray-700"
                >
                  Weight
                </th>
                {state.options.map((o, i) => (
                  <th
                    key={o.id}
                    scope="col"
                    className="min-w-[110px] px-2 py-2 align-top"
                  >
                    <input
                      value={o.name}
                      maxLength={DM_LIMITS.name}
                      aria-label={`Option ${i + 1} name`}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className={`${inputBase} !px-2 !py-1.5 text-center font-semibold`}
                    />
                    <div className="no-print mt-1 flex justify-center gap-1">
                      <button
                        type="button"
                        className={iconBtn}
                        disabled={i === 0}
                        aria-label={`Move ${o.name || 'option'} left`}
                        onClick={() =>
                          set({ options: move(state.options, i, -1) })
                        }
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className={iconBtn}
                        disabled={i === state.options.length - 1}
                        aria-label={`Move ${o.name || 'option'} right`}
                        onClick={() =>
                          set({ options: move(state.options, i, 1) })
                        }
                      >
                        →
                      </button>
                      <button
                        type="button"
                        className={iconBtn}
                        aria-label={`Delete ${o.name || 'option'}`}
                        onClick={() =>
                          setState((s) =>
                            pruneScores({
                              ...s,
                              options: s.options.filter((x) => x.id !== o.id),
                            }),
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.criteria.map((c, i) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <th scope="row" className="px-3 py-2 text-left align-top">
                    <input
                      value={c.name}
                      maxLength={DM_LIMITS.name}
                      aria-label={`Criterion ${i + 1} name`}
                      onChange={(e) =>
                        updateCriterion(i, { name: e.target.value })
                      }
                      className={`${inputBase} !px-2 !py-1.5 font-medium`}
                    />
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <label className="inline-flex items-center gap-1.5 text-xs font-normal text-gray-600">
                        <input
                          type="checkbox"
                          checked={c.lowerIsBetter}
                          onChange={(e) =>
                            updateCriterion(i, {
                              lowerIsBetter: e.target.checked,
                            })
                          }
                          className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Lower is better
                      </label>
                      <span className="no-print ml-auto flex gap-1">
                        <button
                          type="button"
                          className={iconBtn}
                          disabled={i === 0}
                          aria-label={`Move ${c.name || 'criterion'} up`}
                          onClick={() =>
                            set({ criteria: move(state.criteria, i, -1) })
                          }
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={iconBtn}
                          disabled={i === state.criteria.length - 1}
                          aria-label={`Move ${c.name || 'criterion'} down`}
                          onClick={() =>
                            set({ criteria: move(state.criteria, i, 1) })
                          }
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className={iconBtn}
                          aria-label={`Delete ${c.name || 'criterion'}`}
                          onClick={() =>
                            setState((s) =>
                              pruneScores({
                                ...s,
                                criteria: s.criteria.filter(
                                  (x) => x.id !== c.id,
                                ),
                              }),
                            )
                          }
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  </th>
                  <td className="px-2 py-2 align-top">
                    <NumInput
                      value={c.weight}
                      min={0}
                      valid={isValidWeight}
                      label={`Weight of ${c.name || `criterion ${i + 1}`}${state.weightMode === 'percent' ? ' in percent' : ''}`}
                      onCommit={(n) =>
                        n !== undefined && updateCriterion(i, { weight: n })
                      }
                    />
                    <span className="mt-1 block text-center text-xs tabular-nums text-gray-500">
                      = {fmt(w[i] * 100, 1)}%
                    </span>
                  </td>
                  {state.options.map((o) => (
                    <td key={o.id} className="px-2 py-2 align-top">
                      <NumInput
                        value={state.scores[c.id]?.[o.id]}
                        min={1}
                        max={state.scale}
                        allowEmpty
                        valid={(n) => isValidScore(n, state.scale)}
                        describedBy={hintId}
                        label={`Score of ${o.name || 'option'} for ${c.name || 'criterion'}`}
                        onCommit={(n) => setScore(c.id, o.id, n)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <th
                  scope="row"
                  className="px-3 py-2 text-left font-semibold text-gray-900"
                >
                  Weighted total
                </th>
                <td className="px-2 py-2 text-center text-xs tabular-nums text-gray-500">
                  {fmt(res.weightTotal, 2)}
                  {state.weightMode === 'percent' ? '%' : ' pts'}
                </td>
                {state.options.map((o) => {
                  const t = totals.get(o.id);
                  return (
                    <td
                      key={o.id}
                      className="px-2 py-2 text-center font-semibold tabular-nums text-gray-900"
                    >
                      {fmt(t?.total ?? 0)}
                      <span className="block text-xs font-normal text-gray-500">
                        rank {t?.rank}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            disabled={state.criteria.length >= DM_LIMITS.criteria}
            onClick={() =>
              set({
                criteria: [
                  ...state.criteria,
                  {
                    id: newId(),
                    name: `Criterion ${state.criteria.length + 1}`,
                    weight: state.weightMode === 'percent' ? 0 : 1,
                    lowerIsBetter: false,
                  },
                ],
              })
            }
          >
            + Add criterion
          </button>
          <button
            type="button"
            className={btnSecondary}
            disabled={state.options.length >= DM_LIMITS.options}
            onClick={() =>
              set({
                options: [
                  ...state.options,
                  { id: newId(), name: `Option ${state.options.length + 1}` },
                ],
              })
            }
          >
            + Add option
          </button>
        </div>

        {off100 && (
          <div className="no-print">
            <Notice tone="amber">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  Weights add up to {fmt(res.weightTotal, 2)}%, not 100%. The
                  results already use them proportionally (see the “=” values).
                </span>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() =>
                    set({ criteria: normaliseTo100(state.criteria) })
                  }
                >
                  Normalise to 100%
                </button>
              </div>
            </Notice>
          </div>
        )}

        <section aria-labelledby="dm-results" className="space-y-3">
          <h2 id="dm-results" className="text-sm font-semibold text-gray-900">
            Ranking
          </h2>
          <p
            aria-live="polite"
            className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-900"
          >
            {summary}
            {res.missingCells > 0 &&
              ` ${res.missingCells} empty score${res.missingCells === 1 ? '' : 's'} counted as 0.`}
          </p>
          <ol className="space-y-2">
            {res.ranked.map((r) => (
              <li key={r.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium text-gray-900">
                    {r.rank}. {r.name || 'Untitled'}
                    {r.rank === 1 && state.options.length > 1 && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        {res.winners.length > 1 ? 'Tied best' : 'Best'}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 tabular-nums text-gray-700">
                    {fmt(r.total)} / {state.scale}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${r.rank === 1 ? 'bg-indigo-600' : 'bg-indigo-300'}`}
                    style={{
                      width: `${Math.max(0, Math.min(100, (r.total / state.scale) * 100))}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {showRadar &&
          state.criteria.length >= 3 &&
          state.options.length > 0 && <Radar state={state} />}
      </div>

      <div className="no-print flex flex-wrap gap-2">
        <CopyButton text={toTsv(state)} label="Copy table" />
        <DownloadButton
          data={toCsv(state)}
          filename="decision-matrix.csv"
          type="text/csv;charset=utf-8"
          label="Download CSV"
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => window.print()}
        >
          🖨 Print
        </button>
        <button
          type="button"
          className={btnSecondary}
          aria-pressed={showRadar}
          disabled={state.criteria.length < 3}
          title={
            state.criteria.length < 3 ? 'Needs at least 3 criteria' : undefined
          }
          onClick={() => setShowRadar((v) => !v)}
        >
          {showRadar ? 'Hide radar chart' : 'Show radar chart'}
        </button>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            if (window.confirm('Replace your matrix with the example?'))
              setState(EXAMPLE_MATRIX);
          }}
        >
          Reset to example
        </button>
      </div>

      <LocalDataBar
        tool="decision-matrix"
        state={state}
        guard={isDecisionMatrixState}
        onImport={setState}
        onClear={() => setState(blankMatrix())}
        clearConfirm="Delete all options, criteria and scores? This can’t be undone."
      />
    </div>
  );
}
