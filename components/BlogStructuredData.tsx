'use client';

import { usePathname } from 'next/navigation';
import BLOG_POSTS_DATA from '@/data/blog-posts-data';

export default function BlogStructuredData() {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
  const post = BLOG_POSTS_DATA[slug];

  if (!post) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Emojar',
      url: 'https://emojar.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Emojar',
      url: 'https://emojar.com',
      logo: { '@type': 'ImageObject', url: 'https://emojar.com/logo-64.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://emojar.com/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
