'use client';

import { useState, type ReactNode } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';
import { newId, useStoredState } from './playground-shared';
import { LocalDataBar, PrintOnly } from './productivity-shared';
import {
  ACCENTS,
  RESUME_LIMITS,
  bullets,
  contactItems,
  dateRange,
  emptyEntry,
  emptyResume,
  exampleResume,
  isBlankEntry,
  isResume,
  resumeFileName,
  splitList,
  type ResumeData,
  type ResumeEntry,
  type ResumeSectionKey,
} from '@/lib/online-tools/engines/resume';

const KEY = 'emojar:resume-builder:v1';
const TOOL = 'resume-builder';

/** US and Canada use Letter paper; everyone else A4. */
const defaultPaper = (): 'a4' | 'letter' =>
  typeof navigator !== 'undefined' && /^en-(US|CA)\b/.test(navigator.language)
    ? 'letter'
    : 'a4';

const SECTIONS: {
  key: ResumeSectionKey;
  label: string;
  add: string;
  title: string;
  org: string;
  details: string;
}[] = [
  {
    key: 'experience',
    label: 'Work experience',
    add: 'Add a job',
    title: 'Job title',
    org: 'Company',
    details: 'Achievements — one per line, start with a verb and a number',
  },
  {
    key: 'education',
    label: 'Education',
    add: 'Add education',
    title: 'Degree or course',
    org: 'School or university',
    details: 'Optional: honours, thesis, relevant courses (one per line)',
  },
  {
    key: 'projects',
    label: 'Projects (optional)',
    add: 'Add a project',
    title: 'Project name',
    org: 'Client, team or link',
    details: 'What you built and the result (one per line)',
  },
];

export default function ResumeBuilderTool(_props: ToolProps) {
  const [data, setData] = useStoredState<ResumeData>(
    KEY,
    () => emptyResume(defaultPaper()),
    isResume,
  );
  const [view, setView] = useState<'form' | 'preview'>('form');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    setData((d) => ({ ...d, [k]: v }));
  const setEntries = (
    k: ResumeSectionKey,
    fn: (list: ResumeEntry[]) => ResumeEntry[],
  ) => setData((d) => ({ ...d, [k]: fn(d[k]) }));

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const { resumePdf } = await import('@/lib/online-tools/pdf/documents');
      const bytes = await resumePdf(data);
      downloadBlob(
        new Blob([bytes as BlobPart], { type: 'application/pdf' }),
        resumeFileName(data.name),
      );
    } catch (e) {
      setError(
        `${friendlyError(e, 'The PDF couldn’t be created.')} You can still use Print → “Save as PDF”, which supports every language.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const empty =
    !data.name.trim() &&
    !data.summary.trim() &&
    !data.experience.length &&
    !data.education.length;

  return (
    <div className="space-y-5">
      <PrintOnly id="resume-print" />
      <div className="no-print flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={download}
          disabled={busy || empty}
        >
          {busy ? 'Creating PDF…' : '⬇ Download PDF'}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => window.print()}
          disabled={empty}
        >
          🖨 Print / Save as PDF
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            if (
              empty ||
              window.confirm(
                'Replace your resume with the example? Export a backup first to keep it.',
              )
            )
              setData(exampleResume(newId, data.paper));
          }}
        >
          Load example
        </button>
        <div
          className="ml-auto flex gap-1 rounded-xl bg-gray-100 p-1 lg:hidden"
          role="tablist"
        >
          {(['form', 'preview'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${view === v ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            >
              {v === 'form' ? 'Edit' : 'Preview'}
            </button>
          ))}
        </div>
      </div>
      <ErrorMessage>{error}</ErrorMessage>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div
          className={`no-print space-y-6 ${view === 'preview' ? 'hidden lg:block' : ''}`}
        >
          <Group title="Design">
            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                label="Template"
                value={data.template}
                onChange={(v) => set('template', v as ResumeData['template'])}
                options={[
                  ['classic', 'Classic (one column)'],
                  ['modern', 'Modern (sidebar)'],
                ]}
              />
              <Select
                label="Paper"
                value={data.paper}
                onChange={(v) => set('paper', v as ResumeData['paper'])}
                options={[
                  ['a4', 'A4'],
                  ['letter', 'US Letter'],
                ]}
              />
              <fieldset>
                <legend className={labelBase}>Accent colour</legend>
                <div className="mt-2 flex gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.hex}
                      type="button"
                      aria-label={a.name}
                      aria-pressed={data.accent === a.hex}
                      onClick={() => set('accent', a.hex)}
                      className={`h-7 w-7 rounded-full ring-offset-2 ${data.accent === a.hex ? 'ring-2 ring-gray-900' : ''}`}
                      style={{ background: a.hex }}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </Group>

          <Group title="Personal details">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Full name"
                value={data.name}
                onChange={(v) => set('name', v)}
              />
              <Field
                label="Headline"
                placeholder="e.g. Product Designer"
                value={data.headline}
                onChange={(v) => set('headline', v)}
              />
              <Field
                label="Email"
                type="email"
                value={data.email}
                onChange={(v) => set('email', v)}
              />
              <Field
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(v) => set('phone', v)}
              />
              <Field
                label="Location"
                placeholder="City, country"
                value={data.location}
                onChange={(v) => set('location', v)}
              />
              {Array.from({ length: RESUME_LIMITS.links }, (_, i) => (
                <Field
                  key={i}
                  label={`Link ${i + 1}`}
                  placeholder={
                    i === 0 ? 'linkedin.com/in/you' : 'portfolio or GitHub'
                  }
                  value={data.links[i] ?? ''}
                  onChange={(v) => {
                    // Dense array (no holes), trailing empties trimmed.
                    const links = Array.from(
                      { length: Math.max(data.links.length, i + 1) },
                      (_, j) => (j === i ? v : (data.links[j] ?? '')),
                    );
                    while (links.length && !links[links.length - 1])
                      links.pop();
                    set('links', links);
                  }}
                />
              ))}
            </div>
          </Group>

          <Group title="Profile summary">
            <Area
              label="2–4 sentences: who you are, your strongest skills and what you want next"
              value={data.summary}
              rows={4}
              onChange={(v) => set('summary', v)}
            />
          </Group>

          {SECTIONS.map((s) => (
            <Group key={s.key} title={s.label}>
              <div className="space-y-4">
                {data[s.key].map((e, i, list) => (
                  <div
                    key={e.id}
                    className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label={s.title}
                        value={e.title}
                        onChange={(v) =>
                          setEntries(s.key, (l) =>
                            l.map((x) =>
                              x.id === e.id ? { ...x, title: v } : x,
                            ),
                          )
                        }
                      />
                      <Field
                        label={s.org}
                        value={e.org}
                        onChange={(v) =>
                          setEntries(s.key, (l) =>
                            l.map((x) =>
                              x.id === e.id ? { ...x, org: v } : x,
                            ),
                          )
                        }
                      />
                      <Field
                        label="Location"
                        value={e.location}
                        onChange={(v) =>
                          setEntries(s.key, (l) =>
                            l.map((x) =>
                              x.id === e.id ? { ...x, location: v } : x,
                            ),
                          )
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Field
                          label="Start"
                          placeholder="Mar 2021"
                          max={40}
                          value={e.start}
                          onChange={(v) =>
                            setEntries(s.key, (l) =>
                              l.map((x) =>
                                x.id === e.id ? { ...x, start: v } : x,
                              ),
                            )
                          }
                        />
                        <Field
                          label="End"
                          placeholder={e.current ? 'Present' : 'Jun 2024'}
                          max={40}
                          disabled={e.current}
                          value={e.current ? '' : e.end}
                          onChange={(v) =>
                            setEntries(s.key, (l) =>
                              l.map((x) =>
                                x.id === e.id ? { ...x, end: v } : x,
                              ),
                            )
                          }
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={e.current}
                        onChange={(ev) =>
                          setEntries(s.key, (l) =>
                            l.map((x) =>
                              x.id === e.id
                                ? { ...x, current: ev.target.checked }
                                : x,
                            ),
                          )
                        }
                      />
                      {s.key === 'education'
                        ? 'I study here now'
                        : 'Ongoing (shows “Present”)'}
                    </label>
                    <Area
                      label={s.details}
                      value={e.details}
                      rows={3}
                      onChange={(v) =>
                        setEntries(s.key, (l) =>
                          l.map((x) =>
                            x.id === e.id ? { ...x, details: v } : x,
                          ),
                        )
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={btnSecondary}
                        disabled={i === 0}
                        onClick={() =>
                          setEntries(s.key, (l) => {
                            const c = [...l];
                            [c[i - 1], c[i]] = [c[i], c[i - 1]];
                            return c;
                          })
                        }
                      >
                        ↑ Move up
                      </button>
                      <button
                        type="button"
                        className={btnSecondary}
                        disabled={i === list.length - 1}
                        onClick={() =>
                          setEntries(s.key, (l) => {
                            const c = [...l];
                            [c[i + 1], c[i]] = [c[i], c[i + 1]];
                            return c;
                          })
                        }
                      >
                        ↓ Move down
                      </button>
                      <button
                        type="button"
                        className={`${btnSecondary} text-red-700`}
                        onClick={() =>
                          setEntries(s.key, (l) =>
                            l.filter((x) => x.id !== e.id),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={data[s.key].length >= RESUME_LIMITS.entries}
                  onClick={() =>
                    setEntries(s.key, (l) => [...l, emptyEntry(newId())])
                  }
                >
                  ＋ {s.add}
                </button>
              </div>
            </Group>
          ))}

          <Group title="Skills & languages">
            <Area
              label="Skills, separated by commas"
              value={data.skills}
              rows={2}
              onChange={(v) => set('skills', v)}
            />
            <Field
              label="Languages, separated by commas"
              placeholder="English (native), German (B2)"
              value={data.languages}
              max={RESUME_LIMITS.short * 2}
              onChange={(v) => set('languages', v)}
            />
          </Group>
        </div>

        <div
          className={`${view === 'form' ? 'hidden lg:block' : ''} lg:sticky lg:top-20 lg:self-start`}
        >
          <p className="no-print mb-2 text-xs text-gray-500">
            Live preview — the PDF uses the same layout.
          </p>
          <div className="overflow-x-auto">
            <Preview data={data} />
          </div>
        </div>
      </div>

      <LocalDataBar
        tool={TOOL}
        state={data}
        guard={isResume}
        onImport={setData}
        onClear={() => setData(emptyResume(data.paper))}
        clearLabel="Clear resume"
        clearConfirm="Clear every field of your resume? Export a JSON backup first to keep it."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Preview({ data }: { data: ResumeData }) {
  const modern = data.template === 'modern';
  const contacts = contactItems(data);
  const skills = splitList(data.skills);
  const languages = splitList(data.languages);
  const accent = { color: data.accent };

  const Heading = ({ children }: { children: ReactNode }) => (
    <h4
      className="mb-2 mt-4 border-b border-gray-200 pb-1 text-[11px] font-bold uppercase tracking-wider"
      style={accent}
    >
      {children}
    </h4>
  );
  const Entries = ({ label, list }: { label: string; list: ResumeEntry[] }) => {
    const items = list.filter((e) => !isBlankEntry(e));
    if (!items.length) return null;
    return (
      <>
        <Heading>{label}</Heading>
        {items.map((e) => (
          <div key={e.id} className="mb-2.5">
            <div className="flex justify-between gap-3">
              <p className="font-bold text-gray-900">{e.title || e.org}</p>
              <p className="shrink-0 text-[11px] text-gray-500">
                {dateRange(e)}
              </p>
            </div>
            {(e.title ? [e.org, e.location] : [e.location]).filter(Boolean)
              .length > 0 && (
              <p className="text-[11.5px] italic text-gray-500">
                {(e.title ? [e.org, e.location] : [e.location])
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            <ul className="mt-1 space-y-0.5">
              {bullets(e.details).map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span style={accent}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };
  const Side = ({ label, items }: { label: string; items: string[] }) =>
    items.length ? (
      <div className="mb-4">
        <p
          className="mb-1 text-[11px] font-bold uppercase tracking-wider"
          style={accent}
        >
          {label}
        </p>
        {items.map((it) => (
          <p key={it} className="break-words text-[11px] leading-snug">
            {it}
          </p>
        ))}
      </div>
    ) : null;

  return (
    <article
      id="resume-print"
      aria-label="Resume preview"
      className="mx-auto flex min-h-[600px] w-full min-w-[520px] max-w-[720px] bg-white text-[12px] leading-relaxed text-gray-800 shadow-[0_4px_24px_-8px_rgba(30,30,60,0.25)] ring-1 ring-gray-200 print:min-w-0 print:max-w-none print:shadow-none print:ring-0"
      style={{ aspectRatio: data.paper === 'a4' ? '210 / 297' : '8.5 / 11' }}
    >
      {modern && (
        <aside
          className="w-[35%] shrink-0 px-4 py-8"
          style={{ background: `${data.accent}14` }}
        >
          <Side label="Contact" items={contacts} />
          <Side label="Skills" items={skills} />
          <Side label="Languages" items={languages} />
        </aside>
      )}
      <div className="min-w-0 flex-1 px-8 py-8">
        {data.name && (
          <h3 className="text-[26px] font-bold leading-tight text-gray-900">
            {data.name}
          </h3>
        )}
        {data.headline && (
          <p className="text-[14px]" style={accent}>
            {data.headline}
          </p>
        )}
        {!modern && contacts.length > 0 && (
          <p className="mt-1 text-[11px] text-gray-500">
            {contacts.join('  ·  ')}
          </p>
        )}
        <div className="mt-2 h-[1.5px]" style={{ background: data.accent }} />
        {data.summary.trim() && (
          <>
            <Heading>Profile</Heading>
            <p className="whitespace-pre-line">{data.summary}</p>
          </>
        )}
        <Entries label="Experience" list={data.experience} />
        <Entries label="Education" list={data.education} />
        <Entries label="Projects" list={data.projects} />
        {!modern && skills.length > 0 && (
          <>
            <Heading>Skills</Heading>
            <p>{skills.join('  ·  ')}</p>
          </>
        )}
        {!modern && languages.length > 0 && (
          <>
            <Heading>Languages</Heading>
            <p>{languages.join('  ·  ')}</p>
          </>
        )}
        {!data.name && !data.summary && !data.experience.length && (
          <p className="mt-10 text-center text-gray-400">
            Fill in the form or press “Load example” to see your resume here.
          </p>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  max = RESUME_LIMITS.short,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      <input
        type={type}
        value={value}
        maxLength={max}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} mt-1 disabled:bg-gray-100`}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        maxLength={RESUME_LIMITS.long}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} mt-1`}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} mt-1`}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
