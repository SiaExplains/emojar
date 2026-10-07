import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPage } from '@/components/online-tools/ToolPage';
import { TOOLS, getToolInCategory } from '@/lib/online-tools/registry';
import { toolMetadata } from '@/lib/online-tools/seo';

type Params = { category: string; tool: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return TOOLS.map((t) => ({ category: t.category, tool: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, tool } = await params;
  const def = getToolInCategory(category, tool);
  return def ? toolMetadata(def) : {};
}

export default async function OnlineToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, tool } = await params;
  const def = getToolInCategory(category, tool);
  if (!def) notFound();
  return <ToolPage tool={def} />;
}
