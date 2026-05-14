import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection | Emojar',
  description:
    'Browse all 3,700+ emojis sorted alphabetically, by detail, by shape, and by holiday or event. Every way to explore the emoji library in one place.',
  alternates: { canonical: 'https://emojar.com/collection' },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    href: '/collection/alphabet',
    icon: '🔤',
    title: 'Sorted by Alphabet',
    description:
      "Every emoji listed in strict A–Z order by its official Unicode name. Handy when you remember part of a name but can't find it in search — just scan the list and copy with one click.",
    badge: '3,700+ emojis',
  },
  {
    href: '/collection/detail',
    icon: '📖',
    title: 'Emoji with Detail',
    description:
      'Browse the full emoji library with name, category, Unicode version, and keywords shown for each entry. Great for research, copy-paste workflows, or just satisfying your emoji curiosity.',
    badge: 'Full details',
  },
  {
    href: '/table/emoji-alphabet-shaped',
    icon: '🔡',
    title: 'Alphabet-Shaped Emojis',
    description:
      'A curated table of emojis that look like letters of the alphabet — flags, signs, and symbols arranged A to Z. Useful for building emoji text or decorative headers.',
    badge: 'A–Z shapes',
  },
  {
    href: '/emoji-collections/events',
    icon: '🎉',
    title: 'Emoji Collections: Events & Holidays',
    description:
      "Themed emoji packs for every major holiday and seasonal event — New Year, Valentine's Day, Halloween, Christmas, Diwali, and 10 more. The page auto-highlights what's coming up next. Click any emoji to copy it, or grab the whole pack at once.",
    badge: '15 events',
  },
];

const CollectionPage = () => {
  return (
    <div className="py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Collections
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Four ways to explore the full emoji library — alphabetical order,
          detailed view, letter-shaped emojis, and curated holiday collections.
          Pick the view that fits what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all no-underline"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{section.icon}</span>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                {section.badge}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                {section.description}
              </p>
            </div>
            <span className="text-sm font-medium text-blue-600 mt-auto">
              Browse →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
