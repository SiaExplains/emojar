'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import {
  readability,
  type ReadabilityLang,
} from '@/lib/online-tools/engines/readability';
import type { ToolProps } from '../ToolRenderer';
import { SelectField, ToolInput, btnSecondary } from '../ui';

const LANGS: { value: ReadabilityLang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
];

const SAMPLES: Partial<Record<ReadabilityLang, string>> = {
  de: 'Lesbarkeitsformeln schätzen, wie schwer ein Text zu lesen ist. Sie zählen, wie lang die Sätze und wie lang die Wörter sind. Kurze Sätze mit Alltagswörtern gelten als leicht. Lange Sätze voller Fachbegriffe und zusammengesetzter Substantive wie Datenschutzgrundverordnung sind deutlich schwerer zu verstehen.',
  es: 'Las fórmulas de legibilidad estiman lo difícil que es leer un texto. Miden la longitud de las frases y de las palabras. Las frases cortas con palabras cotidianas se consideran fáciles. Las frases largas, llenas de vocabulario técnico y palabras polisílabas, resultan bastante más difíciles de comprender.',
  fr: 'Les formules de lisibilité estiment la difficulté de lecture d’un texte. Elles mesurent la longueur des phrases et des mots. Les phrases courtes avec des mots courants sont faciles. Les phrases longues, remplies de vocabulaire technique et de mots polysyllabiques, sont nettement plus difficiles à comprendre.',
};

const SAMPLE = `Readability formulas estimate how hard a text is to read. They look at two things: how long the sentences are and how long the words are. Short sentences with everyday words score as easy. Long sentences full of technical, multi-syllable vocabulary are considered considerably more difficult, particularly for readers who are unfamiliar with the subject matter and who are reading on a small screen while doing something else at the same time.

Use the score as a guide, not a rule. A legal contract and a children's story should not read the same way.`;

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 1 });

function gradeText(g: number) {
  if (g < 1) return 'Kindergarten';
  if (g > 16) return 'Postgraduate';
  if (g > 12) return 'College';
  return `Grade ${Math.round(g)}`;
}

export default function ReadabilityTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [lang, setLang] = useState<ReadabilityLang>('en');
  const deferred = useDeferredValue(text);
  const r = useMemo(() => readability(deferred, lang), [deferred, lang]);

  const scores = r
    ? [
        {
          name: 'Flesch–Kincaid Grade Level',
          value: r.fleschKincaidGrade,
          hint: 'US school grade',
        },
        {
          name: 'Gunning Fog Index',
          value: r.gunningFog,
          hint: 'years of education',
        },
        {
          name: 'SMOG Index',
          value: r.smog,
          hint: r.sentences < 30 ? 'most reliable with 30+ sentences' : 'grade',
        },
        {
          name: 'Coleman–Liau Index',
          value: r.colemanLiau,
          hint: 'grade, from letters per word',
        },
        {
          name: 'Automated Readability Index',
          value: r.ari,
          hint: 'grade, from characters per word',
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      <SelectField
        label="Language of the text"
        value={lang}
        onChange={(v) => setLang(v as ReadabilityLang)}
        options={LANGS}
        className="max-w-xs"
      />
      <ToolInput
        label="Your text"
        value={text}
        onChange={setText}
        rows={10}
        mono={false}
        placeholder="Paste an article, email, essay or web page copy…"
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setText(SAMPLES[lang] ?? SAMPLE)}
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

      {!r ? (
        <p className="text-sm text-gray-500">
          Paste some text to see its readability scores. A few paragraphs give
          more reliable results than a single sentence.
        </p>
      ) : (
        <div className="space-y-5" aria-live="polite">
          {r.localScores.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {r.localScores.map((ls, i) => (
                <div
                  key={ls.name}
                  className={`rounded-2xl border p-4 ${i === 0 ? 'border-indigo-100 bg-indigo-50' : 'border-gray-100 bg-gray-50'}`}
                >
                  <p className="text-xs font-medium text-indigo-700">
                    {ls.name}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">
                    {fmt(ls.value)}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {ls.band} · {ls.scale}
                  </p>
                </div>
              ))}
            </div>
          )}
          {lang === 'en' && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-xs font-medium text-indigo-700">
                    Flesch Reading Ease
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">
                    {fmt(r.fleschReadingEase)}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {r.level.label} · {r.level.grade} · higher is easier (0–100)
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-600">
                    Average grade level
                  </p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">
                    {fmt(r.averageGrade)}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {gradeText(r.averageGrade)} · mean of the five grade
                    formulas
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Readability scores</caption>
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Formula</th>
                      <th className="px-4 py-2 font-medium">Score</th>
                      <th className="px-4 py-2 font-medium">Reading level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scores.map((s) => (
                      <tr key={s.name}>
                        <td className="px-4 py-2 text-gray-800">{s.name}</td>
                        <td className="px-4 py-2 font-semibold tabular-nums">
                          {fmt(s.value)}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {gradeText(s.value)}{' '}
                          <span className="text-xs text-gray-400">
                            ({s.hint})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Words', r.words],
              ['Sentences', r.sentences],
              ['Words per sentence', r.wordsPerSentence],
              ['Syllables per word', r.syllablesPerWord],
              ['Syllables', r.syllables],
              ['Complex words (3+ syllables)', r.complexWords],
              [
                'Complex words share',
                `${Math.round((r.complexWords / r.words) * 100)} %`,
              ],
              ['Letters', r.letters],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-xl border border-gray-100 p-3"
              >
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-lg font-semibold tabular-nums text-gray-900">
                  {typeof value === 'number' ? fmt(value) : value}
                </dd>
              </div>
            ))}
          </dl>

          {r.longestSentences.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">
                Longest sentences — simplify these first
              </h3>
              <ol className="space-y-2">
                {r.longestSentences.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-gray-800"
                  >
                    <span className="mr-2 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900">
                      {s.words} words
                    </span>
                    {s.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? 'Scores use an estimated syllable count, so they can differ slightly from other checkers. Most web content aims for a Flesch score of 60 or more (about grade 8).'
              : lang === 'de'
                ? 'German uses the Amstad adaptation of Flesch and the first Wiener Sachtextformel (Bamberger & Vanecek), which estimates a German school year. Syllables are estimated, so scores can differ slightly from other checkers.'
                : lang === 'es'
                  ? 'Spanish uses Fernández Huerta (in the corrected form with words per sentence) and Szigriszt-Pazos on the INFLESZ scale, where 55–65 is normal everyday text. Syllables are estimated.'
                  : 'French uses the Kandel–Moles adaptation of Flesch; aim for 60 or more for general audiences. Syllables are estimated, and silent final e/es/ent are not counted.'}
          </p>
        </div>
      )}
    </div>
  );
}
