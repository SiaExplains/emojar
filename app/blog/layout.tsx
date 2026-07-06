import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import BlogStructuredData from '@/components/BlogStructuredData';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <BlogStructuredData />
      <Breadcrumb crumbs={[{ label: 'Blog', href: '/blog' }]} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10"
      >
        ← All posts
      </Link>

      <article
        className="
          prose prose-gray max-w-none
          prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-3
          prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-gray-700 prose-p:leading-7 prose-p:my-4
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-li:text-gray-700 prose-li:leading-7
        "
      >
        {children}
      </article>
    </main>
  );
}
