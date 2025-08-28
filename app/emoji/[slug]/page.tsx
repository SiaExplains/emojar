import data from '@/data/emojis.json'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return data.map(e => ({ slug: e.slug }))
}

export default function EmojiPage({ params }: Props) {
  const emoji = data.find(e => e.slug === params.slug)
  if (!emoji) return <div>Not found</div>

  return (
    <section className="space-y-4">
      <div className="text-6xl">{emoji.char}</div>
      <h1 className="text-2xl font-semibold">{emoji.name}</h1>
      <div className="text-gray-600">Category: {emoji.category}</div>
      {emoji.keywords?.length ? (
        <div className="flex gap-2 flex-wrap">
          {emoji.keywords.map((k: string) => (
            <span key={k} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{k}</span>
          ))}
        </div>
      ) : null}
      <a
        className="inline-block mt-4 border rounded-lg px-4 py-2 hover:bg-gray-50"
        href="/"
      >
        ← Back
      </a>
    </section>
  )
}
