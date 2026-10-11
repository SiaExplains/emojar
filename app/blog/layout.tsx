import Breadcrumb from '@/components/Breadcrumb';
import BlogStructuredData from '@/components/BlogStructuredData';
import { BlogLayoutWrapper } from './BlogLayoutWrapper';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-5 py-12">
      <BlogStructuredData />
      <Breadcrumb crumbs={[{ label: 'Blog', href: '/blog' }]} />
      <BlogLayoutWrapper>{children}</BlogLayoutWrapper>
    </div>
  );
}
