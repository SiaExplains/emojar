import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  tile,
  tileBadge,
  tileDesc,
  tileIcon,
  tileTitle,
} from '@/components/ui/styles';
import { tintFor } from '@/lib/online-tools/category-style';

export type ToolCardData = {
  href: string;
  name: string;
  description: string;
  icon: string;
  /** Third-party site: opens in a new tab and is marked as external. */
  external?: boolean;
  /** Category label, shown on mixed lists so the kind of tool is clear. */
  category?: string;
  /** Category slug, which picks the icon square's tint. */
  tint?: string;
};

function TileBody({
  tool,
  badge,
  note,
}: {
  tool: ToolCardData;
  badge?: ReactNode;
  note?: string;
}) {
  return (
    <>
      <span className="flex items-start justify-between gap-2">
        <span aria-hidden className={`${tileIcon} ${tintFor(tool.tint)}`}>
          {tool.icon}
        </span>
        {badge}
      </span>
      <span className={tileTitle}>
        {tool.name}
        {tool.external && (
          <span aria-hidden className="ml-1 text-xs font-normal text-gray-400">
            ↗
          </span>
        )}
      </span>
      <span className={tileDesc}>{tool.description}</span>
      {note && (
        <span className="mt-auto block pt-2 text-xs text-gray-400">{note}</span>
      )}
    </>
  );
}

export function ToolCard({ tool }: { tool: ToolCardData }) {
  if (tool.external)
    return (
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        className={tile}
      >
        <TileBody tool={tool} note="External site · opens in a new tab" />
      </a>
    );
  return (
    <Link href={tool.href} className={tile}>
      <TileBody
        tool={tool}
        badge={
          tool.category && <span className={tileBadge}>{tool.category}</span>
        }
      />
    </Link>
  );
}

export function ToolGrid({
  tools,
  columns = 3,
}: {
  tools: ToolCardData[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-3 sm:gap-4 ${columns === 3 ? 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'md:grid-cols-3 xl:grid-cols-4'}`}
    >
      {tools.map((t) => (
        <li key={t.href}>
          <ToolCard tool={t} />
        </li>
      ))}
    </ul>
  );
}
