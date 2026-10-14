import type { CategorySlug } from './types';

// One soft tint per category for the icon squares on tool tiles, in the style
// of ilovepdf.com's colour-coded tools. Class names are written out in full so
// Tailwind keeps them; a Record keyed by CategorySlug makes a new category a
// type error until it gets a tint.
export const CATEGORY_TINT: Record<CategorySlug, string> = {
  'image-tools': 'bg-amber-50 ring-amber-100',
  'pdf-tools': 'bg-rose-50 ring-rose-100',
  'developer-tools': 'bg-indigo-50 ring-indigo-100',
  'text-tools': 'bg-sky-50 ring-sky-100',
  'color-tools': 'bg-fuchsia-50 ring-fuchsia-100',
  calculators: 'bg-emerald-50 ring-emerald-100',
  'unit-converters': 'bg-teal-50 ring-teal-100',
  'security-generators': 'bg-slate-100 ring-slate-200',
  'date-time-tools': 'bg-orange-50 ring-orange-100',
  'audio-video-tools': 'bg-violet-50 ring-violet-100',
  'device-tests': 'bg-cyan-50 ring-cyan-100',
  'reference-tools': 'bg-lime-50 ring-lime-100',
  'productivity-tools': 'bg-blue-50 ring-blue-100',
};

/** Neutral tint for tiles that aren't a tool (emoji hubs, games, guides). */
export const DEFAULT_TINT = 'bg-gray-50 ring-gray-100';

export const tintFor = (category?: string): string =>
  (category && CATEGORY_TINT[category as CategorySlug]) || DEFAULT_TINT;
