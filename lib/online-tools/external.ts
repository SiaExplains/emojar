// Third-party tools we link to from a category. They are not Emojar tools:
// no tool page, no sitemap entry, not counted in tool totals, and they open
// in a new tab.

import type { CategorySlug } from './types';

export type ExternalTool = {
  name: string;
  url: string;
  icon: string;
  description: string;
  category: CategorySlug;
  /** Extra categories that list this link too. */
  alsoIn?: CategorySlug[];
};

export const EXTERNAL_TOOLS: ExternalTool[] = [
  {
    name: 'FocusCrew',
    url: 'https://focus-crew.com',
    icon: '👥',
    description:
      'A free Pomodoro timer you run with a small crew, focusing at the same time — no video calls.',
    category: 'date-time-tools',
    alsoIn: ['productivity-tools'],
  },
];

export const externalToolsIn = (slug: CategorySlug) =>
  EXTERNAL_TOOLS.filter((t) => t.category === slug || t.alsoIn?.includes(slug));
