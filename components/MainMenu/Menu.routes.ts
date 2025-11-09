export const MENU_ROUTES = [
  {
    href: '/table/emoji-alphabet-shaped',
    label: 'Alphabet Shaped',
    target: '_self',
    children: null,
  },
  { href: '/sorted/alphabet', label: 'Alphabet', target: '_self' },
  {
    href: '/categories',
    label: 'Categories',
    target: '_self',
    children: [
      { href: '/category/Activities', label: 'Activities', target: '_self' },
      {
        href: '/category/Animals & Nature',
        label: 'Animals and Nature',
        target: '_self',
      },
      { href: '/category/Component', label: 'Component', target: '_self' },
      {
        href: '/category/Food & Drink',
        label: 'Food and Drink',
        target: '_self',
      },
      { href: '/category/Flags', label: 'Flags', target: '_self' },
      { href: '/category/Objects', label: 'Objects', target: '_self' },
      {
        href: '/category/People & Body',
        label: 'People and Body',
        target: '_self',
      },
      { href: '/category/Symbols', label: 'Symbols', target: '_self' },
      {
        href: '/category/Travel & Places',
        label: 'Travel and Places',
        target: '_self',
      },
      {
        href: '/category/Smileys & Emotion',
        label: 'Smileys and Emotion',
        target: '_self',
      },
    ],
  },
  {
    href: '/games',
    label: 'Games',
    target: '_self',
    chilren: [
      { href: '/games/xo', label: 'XO', target: '_self' },
      { href: '/games/hangman', label: 'Hangman', target: '_self' },
      { href: '/games/snake', label: 'Snake', target: '_self' },
      {
        href: '/games/bubble-shooter',
        label: 'Bubble Shooter',
        target: '_self',
      },
      { href: '/games/minesweeper', label: 'Minesweeper', target: '_self' },
    ],
  },
  {
    href: 'https://github.com/SiaExplains/emojar',
    label: 'GitHub',
    target: '_blank',
  },
];
