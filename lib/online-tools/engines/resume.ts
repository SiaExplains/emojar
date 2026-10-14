// Resume / CV Builder: the resume data model, its validation guard, an empty
// and an example resume, and small helpers shared by the preview and the
// PDF. The resume is stored only in the browser.

import { isArrayOf, isId, isObj, isStr, uniqueIds } from './local-data';

export type ResumeEntry = {
  id: string;
  /** Job title, degree or project name. */
  title: string;
  /** Company, school or client. */
  org: string;
  location: string;
  /** Free text such as "Mar 2021" or "2019". */
  start: string;
  end: string;
  /** Show "Present" instead of the end date. */
  current: boolean;
  /** One bullet point per line. */
  details: string;
};

export type ResumeSectionKey = 'experience' | 'education' | 'projects';

export type ResumeData = {
  version: 1;
  template: 'classic' | 'modern';
  paper: 'a4' | 'letter';
  accent: string;
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  projects: ResumeEntry[];
  /** Comma-separated. */
  skills: string;
  /** Comma-separated, e.g. "English (native), German (B2)". */
  languages: string;
};

export const RESUME_LIMITS = {
  entries: 30,
  links: 3,
  short: 200,
  long: 4000,
};

export const ACCENTS = [
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Magenta', hex: '#b80d4f' },
  { name: 'Graphite', hex: '#374151' },
  { name: 'Purple', hex: '#6d28d9' },
];

const isHex = (v: unknown): v is string =>
  typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

const isEntry = (v: unknown): v is ResumeEntry =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.title, RESUME_LIMITS.short) &&
  isStr(v.org, RESUME_LIMITS.short) &&
  isStr(v.location, RESUME_LIMITS.short) &&
  isStr(v.start, 40) &&
  isStr(v.end, 40) &&
  typeof v.current === 'boolean' &&
  isStr(v.details, RESUME_LIMITS.long);

const isEntries = (v: unknown): v is ResumeEntry[] =>
  isArrayOf(v, isEntry, RESUME_LIMITS.entries) && uniqueIds(v);

export function isResume(v: unknown): v is ResumeData {
  return (
    isObj(v) &&
    v.version === 1 &&
    (v.template === 'classic' || v.template === 'modern') &&
    (v.paper === 'a4' || v.paper === 'letter') &&
    isHex(v.accent) &&
    isStr(v.name, RESUME_LIMITS.short) &&
    isStr(v.headline, RESUME_LIMITS.short) &&
    isStr(v.email, RESUME_LIMITS.short) &&
    isStr(v.phone, RESUME_LIMITS.short) &&
    isStr(v.location, RESUME_LIMITS.short) &&
    isArrayOf(
      v.links,
      (x): x is string => isStr(x, RESUME_LIMITS.short),
      RESUME_LIMITS.links,
    ) &&
    isStr(v.summary, RESUME_LIMITS.long) &&
    isEntries(v.experience) &&
    isEntries(v.education) &&
    isEntries(v.projects) &&
    isStr(v.skills, RESUME_LIMITS.long) &&
    isStr(v.languages, RESUME_LIMITS.short * 2)
  );
}

export function emptyEntry(id: string): ResumeEntry {
  return {
    id,
    title: '',
    org: '',
    location: '',
    start: '',
    end: '',
    current: false,
    details: '',
  };
}

export function emptyResume(paper: 'a4' | 'letter' = 'a4'): ResumeData {
  return {
    version: 1,
    template: 'classic',
    paper,
    accent: ACCENTS[0].hex,
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: '',
    languages: '',
  };
}

/** A fictional, realistic example to start from. */
export function exampleResume(
  makeId: () => string,
  paper: 'a4' | 'letter' = 'a4',
): ResumeData {
  return {
    ...emptyResume(paper),
    name: 'Alex Morgan',
    headline: 'Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 555 0142',
    location: 'Denver, CO',
    links: ['linkedin.com/in/alexmorgan', 'alexmorgan.design'],
    summary:
      'Product designer with 7 years of experience turning research into simple, accessible interfaces for web and mobile. I work closely with engineers, run usability tests every sprint and care about measurable outcomes.',
    experience: [
      {
        id: makeId(),
        title: 'Senior Product Designer',
        org: 'Northwind Health',
        location: 'Denver, CO',
        start: 'Mar 2021',
        end: '',
        current: true,
        details:
          'Led the redesign of the patient booking flow, cutting drop-off by 23%\nBuilt and documented a component library used by 4 product teams\nRan 40+ usability sessions and turned the findings into a quarterly roadmap',
      },
      {
        id: makeId(),
        title: 'Product Designer',
        org: 'Fable & Co.',
        location: 'Boulder, CO',
        start: 'Jun 2018',
        end: 'Feb 2021',
        current: false,
        details:
          'Designed the first mobile app, rated 4.7 stars in the App Store\nIntroduced accessibility reviews; every release now meets WCAG 2.1 AA',
      },
    ],
    education: [
      {
        id: makeId(),
        title: 'BA in Interaction Design',
        org: 'University of Colorado',
        location: 'Boulder, CO',
        start: '2014',
        end: '2018',
        current: false,
        details: '',
      },
    ],
    projects: [],
    skills:
      'Figma, User research, Prototyping, Design systems, Accessibility (WCAG), HTML & CSS',
    languages: 'English (native), Spanish (conversational)',
  };
}

/** "Mar 2021 – Present", "2014 – 2018", "2019", or "". */
export function dateRange(e: Pick<ResumeEntry, 'start' | 'end' | 'current'>) {
  const end = e.current ? 'Present' : e.end.trim();
  const start = e.start.trim();
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

/** Non-empty bullet lines, with any typed bullet character removed. */
export function bullets(details: string): string[] {
  return details
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•·]\s*/, '').trim())
    .filter(Boolean);
}

/** Comma- or newline-separated list → trimmed, non-empty items. */
export function splitList(s: string): string[] {
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Contact items in display order, empties dropped. */
export function contactItems(d: ResumeData): string[] {
  return [d.email, d.phone, d.location, ...d.links]
    .map((s) => s.trim())
    .filter(Boolean);
}

/** True when an entry has nothing typed in it (skipped in output). */
export function isBlankEntry(e: ResumeEntry): boolean {
  return ![e.title, e.org, e.location, e.start, e.end, e.details].some((s) =>
    s.trim(),
  );
}

/** Every string that ends up in the PDF, for the font check. */
export function resumeTexts(d: ResumeData): string[] {
  const entries = [...d.experience, ...d.education, ...d.projects];
  return [
    d.name,
    d.headline,
    ...contactItems(d),
    d.summary,
    d.skills,
    d.languages,
    ...entries.flatMap((e) => [
      e.title,
      e.org,
      e.location,
      dateRange(e),
      e.details,
    ]),
  ].filter(Boolean);
}

/** "Alex Morgan" → "Alex-Morgan-Resume.pdf". */
export function resumeFileName(name: string): string {
  const base = name
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-');
  return `${base || 'Resume'}${base ? '-Resume' : ''}.pdf`;
}
