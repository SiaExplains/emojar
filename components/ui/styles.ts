// Shared class names for buttons, inputs and cards, used across the site.
// A plain module (no 'use client'), so server components can use the strings
// too. Colours follow the tokens in tailwind.config.ts: near-black primary
// buttons, gray neutrals, `brand` for focus and active states.

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
export const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50';
export const inputBase =
  'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';
export const labelBase = 'block text-sm font-medium text-gray-700';
/** Surface for grouped content: tool panels, info boxes, list items. */
export const card = 'rounded-2xl border border-gray-100 bg-white';
/** Inline text link in body copy. */
export const textLink =
  'font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-600';
