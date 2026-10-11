import { pageMeta } from '@/lib/og';

export const metadata = pageMeta({
  title: 'Holiday & Event Emoji Collections to Copy',
  description:
    'Ready-made emoji sets for 15 holidays and events — New Year, Valentine’s Day, Pride, Halloween, Christmas, Diwali and more. Copy a whole set in one click.',
  path: '/emoji-collections/events',
  emoji: '🎉',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
