import { CATEGORIES } from '@/lib/online-tools/categories';

// Online Tools lead the navigation; the emoji features live under one entry.
export const MENU_ROUTES = [
  {
    href: '/online-tool',
    label: 'Online Tools',
    target: '_self',
    children: [
      { href: '/online-tool', label: '🧰 All tools', target: '_self' },
      ...CATEGORIES.map((c) => ({
        href: `/online-tool/${c.slug}`,
        label: `${c.icon} ${c.name}`,
        target: '_self',
      })),
    ],
  },
  {
    href: '/emoji',
    label: 'Emoji',
    target: '_self',
    children: [
      { href: '/emoji', label: '😀 Emoji search & copy', target: '_self' },
      { href: '/categories', label: '📂 Emoji categories', target: '_self' },
      {
        href: '/emoji-collections/events',
        label: '🎉 Events & holidays',
        target: '_self',
      },
      {
        href: '/collection/alphabet',
        label: '🔤 Emojis A–Z',
        target: '_self',
      },
      {
        href: '/collection/detail',
        label: '📋 Emojis with details',
        target: '_self',
      },
      {
        href: '/table/emoji-alphabet-shaped',
        label: '🅰️ Letter-shaped emojis',
        target: '_self',
      },
      { href: '/emoji-tools', label: '🛠️ Emoji tools', target: '_self' },
      { href: '/games', label: '🎮 Emoji games', target: '_self' },
    ],
  },
];
