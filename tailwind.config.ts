import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

// Design tokens. One accent — `brand`, the logo's magenta — for links, active
// states, focus rings and highlights; primary buttons stay near-black
// (gray-900). Neutrals are `gray`. Semantic colours use the stock palettes:
// success = emerald, warning = amber (also the logo's yellow), danger = red.
// Contrast on white: brand-600 5.3:1 and brand-700 7.2:1 (AA text);
// brand-500 3.9:1 (focus rings and other non-text indicators, ≥ 3:1).
const brand = {
  50: '#fdf2f7',
  100: '#fce7f1',
  200: '#fbcfe3',
  300: '#f8a8ca',
  400: '#f173a7',
  500: '#e63e85',
  600: '#d1105a',
  700: '#ad0c4b',
  800: '#8f0f41',
  900: '#780f3a',
  950: '#4a031f',
};

export default {
  content: [
    './app/**/*.{ts,tsx,md,mdx}',
    './app/games/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/online-tools/**/*.ts',
  ],
  theme: {
    extend: {
      colors: { brand },
    },
  },
  plugins: [typography],
} satisfies Config;
