import Link from 'next/link';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/blog" className="hover:underline">
          ← All posts
        </Link>
      </div>
      <article className="prose prose-gray max-w-none leading-7 text-gray-800">
        {children}
      </article>
    </main>
  );
}
