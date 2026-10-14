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
export const card = 'rounded-2xl border border-[#e8e8f0] bg-white';
/** Clickable tile (tool, game, guide): a white card that lifts on hover.
 *  The utilities are in app/globals.css (`.tile`), see the note there. */
export const tile = 'group tile';
/** Rounded icon square at the top of a tile; add a tint from category-style. */
export const tileIcon = 'tile-icon';
/** Tile name, description and corner label. */
export const tileTitle = 'tile-title';
export const tileDesc = 'tile-desc';
export const tileBadge = 'tile-badge';
/** Filter or link pill; `pillActive` marks the selected one. */
export const pill =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#dedee8] bg-white px-3.5 py-1.5 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';
export const pillActive =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-900 bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';
/** Section heading on hub pages. */
export const sectionTitle =
  'text-xl font-bold tracking-tight text-gray-900 sm:text-2xl';
/** Inline text link in body copy. */
export const textLink =
  'font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-600';
