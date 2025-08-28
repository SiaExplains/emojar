import Link from 'next/link'

export default function CategoryPills({ categories }: { categories: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(c => (
        <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200">
          {c}
        </Link>
      ))}
    </div>
  )
}
