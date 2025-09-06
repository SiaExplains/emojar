import data from '@/data/emojis.json'
import type { Metadata } from 'next'



export function generateStaticParams() {
  return data.map(e => ({ slug: e.slug }));
}




export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const emoji = data.find(e => e.slug === params.slug);
  if (!emoji) return { title: 'Not found' };

  const title = `${emoji.name} emoji | Copy & Paste`;
  const description = `${emoji.name} emoji. ${emoji.char} emoji. copy ${emoji.name}. Category: ${emoji.category}. Related: ${emoji.keywords?.slice(0, 6).join(', ') || ''}`;

  const path = `/emoji/${encodeURIComponent(emoji.slug)}`; // <-- change to `/emoji/${...}` if needed
  const canonical = new URL(path, 'https://emojar.com');


  return {
    title,
    description,
    alternates: { canonical },           // URL or string is fine
    openGraph: {
      title,
      description,
      url: canonical.toString(),         // absolute
      type: 'article',
      // If you later add a dynamic OG image endpoint, place it here:
      // images: [{ url: `/api/og?title=${encodeURIComponent(emoji.name)}&char=${encodeURIComponent(emoji.char)}` }],
    },
    twitter: {
      title,
      description,
      card: 'summary',
    },
    robots: { index: true, follow: true },
  };
}

export default function EmojiPage({ params }: { params: { slug: string } }) {
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
