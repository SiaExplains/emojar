import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolPage } from '@/components/online-tools/ToolPage';
import {
  TOOLS,
  getToolInCategory,
  getVariant,
} from '@/lib/online-tools/registry';
import { variantMetadata } from '@/lib/online-tools/seo';

type Params = { category: string; tool: string; variant: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return TOOLS.flatMap((t) =>
    (t.variants ?? []).map((v) => ({
      category: t.category,
      tool: t.slug,
      variant: v.slug,
    })),
  );
}

function resolve({ category, tool, variant }: Params) {
  const def = getToolInCategory(category, tool);
  const v = def && getVariant(def, variant);
  return def && v ? { def, v } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const r = resolve(await params);
  return r ? variantMetadata(r.def, r.v) : {};
}

export default async function OnlineToolVariantPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const r = resolve(await params);
  if (!r) notFound();
  return <ToolPage tool={r.def} variant={r.v} />;
}
