import { CATEGORIES } from '@/lib/online-tools/categories';

export type MenuLink = { href: string; label: string };
export type MenuEntry = MenuLink & {
  /** Links shown in the entry's panel; the entry itself is always a link too. */
  children?: MenuLink[];
};

// Top-level navigation. Every item is a plain link so crawlers and
// no-JavaScript visitors reach the same pages as the dropdowns.
export const MENU_ROUTES: MenuEntry[] = [
  {
    href: '/online-tool',
    label: 'Tools',
    children: [
      { href: '/online-tool', label: '🧰 All tools' },
      ...CATEGORIES.map((c) => ({
        href: `/online-tool/${c.slug}`,
        label: `${c.icon} ${c.name}`,
      })),
    ],
  },
  {
    href: '/emoji',
    label: 'Emoji',
    children: [
      { href: '/emoji', label: '😀 Emoji search & copy' },
      { href: '/categories', label: '📂 Emoji categories' },
      { href: '/emoji-collections/events', label: '🎉 Events & holidays' },
      { href: '/collection/alphabet', label: '🔤 Emojis A–Z' },
      { href: '/collection/detail', label: '📋 Emojis with details' },
      {
        href: '/table/emoji-alphabet-shaped',
        label: '🅰️ Letter-shaped emojis',
      },
      { href: '/emoji-tools', label: '🛠️ Emoji tools' },
    ],
  },
  { href: '/games', label: 'Games' },
  { href: '/blog', label: 'Guides' },
  {
    href: '/faq',
    label: 'Help',
    children: [
      { href: '/faq', label: 'FAQ' },
      { href: '/about', label: 'About Emojar' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];
