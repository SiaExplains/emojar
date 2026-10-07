'use client';

// GPA calculator and weighted grade / final-exam calculator.

import { useState } from 'react';
import {
  GPA_SCALE,
  computeGpa,
  finalNeeded,
  letterFor,
  weightedGrade,
} from '@/lib/online-tools/engines/games';
import type { ToolProps } from '../ToolRenderer';
import { NumberField, btnSecondary, inputBase } from '../ui';

let rowId = 10;

function Big({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
      <p className="text-sm text-emerald-800">{label}</p>
      <p className="text-3xl font-bold tabular-nums text-emerald-950">
        {value}
      </p>
      {sub && <p className="text-xs text-emerald-800">{sub}</p>}
    </div>
  );
}

export function GpaCalculatorTool(_: ToolProps) {
  const [rows, setRows] = useState([
    { id: 1, name: 'Calculus', grade: 'A-', credits: '4' },
    { id: 2, name: 'English Literature', grade: 'B+', credits: '3' },
    { id: 3, name: 'Biology', grade: 'A', credits: '4' },
    { id: 4, name: '', grade: 'B', credits: '3' },
  ]);
  const [priorGpa, setPriorGpa] = useState('');
  const [priorCredits, setPriorCredits] = useState('');

  const courses = rows.map((r) => ({
    grade: r.grade,
    credits: Number(r.credits),
  }));
  const semester = computeGpa(courses);
  const pg = Number(priorGpa);
  const pc = Number(priorCredits);
  const cumulative =
    pg >= 0 && pg <= 5 && pc > 0
      ? computeGpa(courses, { gpa: pg, credits: pc })
      : null;
  const update = (id: number, patch: Partial<(typeof rows)[number]>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-500">
            <tr>
              <th className="pb-2 font-medium">Course (optional)</th>
              <th className="pb-2 font-medium">Grade</th>
              <th className="pb-2 font-medium">Credits</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Course ${i + 1} name`}
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })}
                    className={inputBase}
                    placeholder={`Course ${i + 1}`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <select
                    aria-label={`Course ${i + 1} grade`}
                    value={r.grade}
                    onChange={(e) => update(r.id, { grade: e.target.value })}
                    className={inputBase}
                  >
                    {Object.entries(GPA_SCALE).map(([g, p]) => (
                      <option key={g} value={g}>
                        {g} ({p.toFixed(1)})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Course ${i + 1} credits`}
                    type="number"
                    min={0}
                    step="any"
                    value={r.credits}
                    onChange={(e) => update(r.id, { credits: e.target.value })}
                    className={`${inputBase} w-24`}
                  />
                </td>
                <td className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setRows((rs) => rs.filter((x) => x.id !== r.id))
                    }
                    className="rounded px-2 text-gray-400 hover:text-gray-700"
                    aria-label={`Remove course ${i + 1}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className={btnSecondary}
        onClick={() =>
          setRows((rs) => [
            ...rs,
            { id: rowId++, name: '', grade: 'A', credits: '3' },
          ])
        }
      >
        + Add course
      </button>
      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <Big
          label="Semester GPA"
          value={semester.credits ? semester.gpa.toFixed(2) : '—'}
          sub={`${semester.credits} credits · ${semester.points.toFixed(1)} grade points`}
        />
        {cumulative && (
          <Big
            label="New cumulative GPA"
            value={cumulative.gpa.toFixed(2)}
            sub={`${cumulative.credits} total credits`}
          />
        )}
      </div>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-gray-900">
          Cumulative GPA (optional)
        </legend>
        <NumberField
          label="Current cumulative GPA"
          value={priorGpa}
          onChange={setPriorGpa}
          min={0}
          step="any"
        />
        <NumberField
          label="Credits completed so far"
          value={priorCredits}
          onChange={setPriorCredits}
          min={0}
          step="any"
        />
      </fieldset>
    </div>
  );
}

export function GradeCalculatorTool(_: ToolProps) {
  const [rows, setRows] = useState([
    { id: 1, name: 'Homework', score: '92', weight: '20' },
    { id: 2, name: 'Quizzes', score: '85', weight: '15' },
    { id: 3, name: 'Midterm', score: '78', weight: '25' },
  ]);
  const [target, setTarget] = useState('85');
  const [finalWeight, setFinalWeight] = useState('40');
  const g = weightedGrade(
    rows.map((r) => ({ score: Number(r.score), weight: Number(r.weight) })),
  );
  const update = (id: number, patch: Partial<(typeof rows)[number]>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  let needed: number | null = null;
  try {
    needed = g.weight
      ? finalNeeded(g.grade, Number(target), Number(finalWeight))
      : null;
  } catch {
    needed = null;
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-500">
            <tr>
              <th className="pb-2 font-medium">Assignment / category</th>
              <th className="pb-2 font-medium">Score %</th>
              <th className="pb-2 font-medium">Weight %</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Item ${i + 1} name`}
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })}
                    className={inputBase}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Item ${i + 1} score`}
                    type="number"
                    step="any"
                    value={r.score}
                    onChange={(e) => update(r.id, { score: e.target.value })}
                    className={`${inputBase} w-24`}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    aria-label={`Item ${i + 1} weight`}
                    type="number"
                    min={0}
                    step="any"
                    value={r.weight}
                    onChange={(e) => update(r.id, { weight: e.target.value })}
                    className={`${inputBase} w-24`}
                  />
                </td>
                <td className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setRows((rs) => rs.filter((x) => x.id !== r.id))
                    }
                    className="rounded px-2 text-gray-400 hover:text-gray-700"
                    aria-label={`Remove item ${i + 1}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className={btnSecondary}
        onClick={() =>
          setRows((rs) => [
            ...rs,
            { id: rowId++, name: '', score: '', weight: '10' },
          ])
        }
      >
        + Add item
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Target final grade"
          value={target}
          onChange={setTarget}
          min={0}
          max={100}
          suffix="%"
        />
        <NumberField
          label="Final exam weight"
          value={finalWeight}
          onChange={setFinalWeight}
          min={1}
          max={100}
          suffix="%"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <Big
          label="Current grade"
          value={g.weight ? `${g.grade.toFixed(1)}%` : '—'}
          sub={
            g.weight
              ? `${letterFor(g.grade)} · based on ${g.weight}% of the course`
              : undefined
          }
        />
        {needed !== null && (
          <Big
            label="Needed on the final"
            value={`${needed.toFixed(1)}%`}
            sub={
              needed > 100
                ? 'Above 100% — the target is out of reach without extra credit.'
                : needed <= 0
                  ? 'You have already secured this target.'
                  : `to finish with ${target}%`
            }
          />
        )}
      </div>
      {g.weight + Number(finalWeight) !== 100 && g.weight > 0 && (
        <p className="text-xs text-gray-500">
          Your items ({g.weight}%) plus the final ({finalWeight}%) add up to{' '}
          {g.weight + Number(finalWeight)}%, not 100%. The final-exam estimate
          assumes everything except the final counts as your current grade.
        </p>
      )}
    </div>
  );
}

export default GpaCalculatorTool;
