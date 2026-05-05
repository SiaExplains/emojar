import Link from 'next/link';
import data from '@/data/emojis.json';

export const dynamic = 'force-static';

export default function CategoriesPage() {
  const categoryMap = data.reduce<Record<string, string[]>>((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    if (acc[e.category].length < 10) acc[e.category].push(e.char);
    return acc;
  }, {});

  const categories = Object.keys(categoryMap).sort();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((c) => (
          <li key={c}>
            <Link
              className="block border rounded-xl px-4 py-3 hover:bg-gray-50 space-y-2"
              href={`/category/${encodeURIComponent(c)}`}
            >
              <div className="flex flex-wrap gap-1 text-2xl leading-tight">
                {categoryMap[c].map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-800">{c}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
