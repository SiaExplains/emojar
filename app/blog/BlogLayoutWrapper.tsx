'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function BlogLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIndex = pathname === '/blog' || pathname === '/blog/';

  if (isIndex) {
    return <>{children}</>;
  }

  return (
    <>
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-brand-700"
      >
        ← All posts
      </Link>

      <article
        className="
          rounded-2xl border border-[#e8e8f0] bg-white px-5 py-8 sm:px-10 sm:py-12
          prose prose-gray max-w-none
          prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:mb-3
          prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-gray-700 prose-p:leading-7 prose-p:my-4
          prose-a:font-medium prose-a:text-brand-700 prose-a:underline prose-a:decoration-brand-200 prose-a:underline-offset-2 hover:prose-a:decoration-brand-600
          prose-strong:text-gray-900
          prose-li:text-gray-700 prose-li:leading-7
          prose-table:w-full prose-table:text-sm prose-table:border-collapse
          prose-thead:bg-gray-50
          prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-200
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200
          prose-tr:even:bg-gray-50
        "
      >
        {children}
      </article>

      <footer className="mt-8 rounded-2xl border border-[#e8e8f0] bg-white px-5 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
            SG
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Siavash Ghanbari
            </p>
            <p className="text-xs text-gray-400">Founder of Emojar</p>
          </div>
        </div>
      </footer>
    </>
  );
}
