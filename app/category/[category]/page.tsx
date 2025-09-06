import data from '@/data/emojis.json'
import EmojiCard from '@/components/EmojiCard'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';



type Props =  PageProps<any> & { params: { category: string } };


export function generateStaticParams() {
  const categories = Array.from(new Set(data.map(e => e.category)));
  return categories.map(c => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decoded = decodeURIComponent(params.category);
  const items = data.filter(e => e.category === decoded);
  if (items.length === 0) return { title: 'Not found' };

  const title = `${decoded} Emojis | All the emojis in one jar`;
  const description = `${decoded.toLowerCase()} emoji on Emojar.com`;

  const url = `/category/${encodeURIComponent(decoded)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      // If you later add a dynamic OG image endpoint, place it here:
      // images: [{ url: `/api/og?title=${encodeURIComponent(emoji.name)}&char=${encodeURIComponent(emoji.char)}` }],
    },
    twitter: {
      title,
      description,
      card: 'summary',
    },
  };
}

export default function CategoryPage({ params }: Props) {
 const decoded = decodeURIComponent(params.category);
  const items = data.filter(e => e.category === decoded);
  if (items.length === 0) return notFound();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">{decoded}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map(e => <EmojiCard key={e.slug} emoji={e} />)}
      </div>
    </section>
  )
}
