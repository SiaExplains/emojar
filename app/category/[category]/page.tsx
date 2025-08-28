import data from '@/data/emojis.json'
import EmojiCard from '@/components/EmojiCard'

type Props = { params: { category: string } }

export function generateStaticParams() {
  const categories = Array.from(new Set(data.map(e => e.category)))
  return categories.map(c => ({ category: c }))
}

export default function CategoryPage({ params }: Props) {
  const decoded = decodeURIComponent(params.category)
  const items = data.filter(e => e.category === decoded)

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">{decoded}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map(e => <EmojiCard key={e.slug} emoji={e} />)}
      </div>
    </section>
  )
}
