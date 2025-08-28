import Link from 'next/link'
import data from '@/data/emojis.json'

export const dynamic = 'force-static'

export default function CategoriesPage() {
  const categories = Array.from(new Set(data.map(e => e.category))).sort()
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map(c => (
          <li key={c}>
            <Link className="block border rounded-xl px-4 py-3 hover:bg-gray-50" href={`/category/${encodeURIComponent(c)}`}>{c}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
