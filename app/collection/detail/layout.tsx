import { pageMeta } from '@/lib/og';

export const metadata = pageMeta({
  title: 'All Emojis With Names and Details – Copy & Paste',
  description:
    'Browse every emoji in one long list with its name, category and Unicode details, then copy any emoji with one click. Searchable and free, no sign-up.',
  path: '/collection/detail',
  emoji: '📋',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
