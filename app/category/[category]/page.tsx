import data from '@/data/emojis.json';
import SmallEmojiCard from '@/components/SmallEmojiCard';
import Breadcrumb from '@/components/Breadcrumb';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = PageProps<any> & { params: { category: string } };

export function generateStaticParams() {
  const categories = Array.from(new Set(data.map((e) => e.category)));
  return categories.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decoded = decodeURIComponent(params.category);
  const items = data.filter((e) => e.category === decoded);
  if (items.length === 0) return { title: 'Not found' };

  const count = items.length;
  const title = `${decoded} Emojis | Emojar`;
  const description = `Browse all ${count} ${decoded} emojis — copy any emoji with one tap, view names, and discover related symbols on Emojar.`;

  const url = `https://emojar.com/category/${encodeURIComponent(decoded)}`;

  // Build keyword list: category name variants + top emoji names
  const topNames = items.slice(0, 5).map((e) => e.name.toLowerCase());
  const keywords = [
    `${decoded.toLowerCase()} emoji`,
    `${decoded.toLowerCase()} emojis`,
    'copy emoji',
    'emoji meaning',
    ...topNames,
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Emojar',
      type: 'website',
      images: [{ url: `/api/og?type=category&name=${encodeURIComponent(decoded)}`, width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [`/api/og?type=category&name=${encodeURIComponent(decoded)}`],
    },
    robots: { index: true, follow: true },
  };
}

export default function CategoryPage({ params }: Props) {
  const decoded = decodeURIComponent(params.category);
  const items = data.filter((e) => e.category === decoded);
  if (items.length === 0) return notFound();

  const url = `https://emojar.com/category/${encodeURIComponent(decoded)}`;
  const description = `Browse all ${items.length} ${decoded} emojis — copy any emoji with one tap, view names, and discover related symbols on Emojar.`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${decoded} Emojis`,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 10).map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: e.name,
        url: `https://emojar.com/emoji/${e.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="space-y-6">
        <Breadcrumb
          crumbs={[
            { label: 'Categories', href: '/categories' },
            { label: decoded },
          ]}
        />
        <h1 className="text-2xl font-semibold">{decoded}</h1>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
          {items.map((e) => (
            <SmallEmojiCard key={e.slug} emoji={e} />
          ))}
        </div>
      </section>
    </>
  );
}
