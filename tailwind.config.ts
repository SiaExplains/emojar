import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: [
    './app/**/*.{ts,tsx,md,mdx}',
    './app/games/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/online-tools/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [typography],
} satisfies Config;
