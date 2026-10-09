import Link from 'next/link';

export type ToolCardData = {
  href: string;
  name: string;
  description: string;
  icon: string;
  /** Third-party site: opens in a new tab and is marked as external. */
  external?: boolean;
  /** Category label, shown on mixed lists so the kind of tool is clear. */
  category?: string;
};

const CARD =
  'group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition hover:border-gray-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export function ToolCard({ tool }: { tool: ToolCardData }) {
  if (tool.external)
    return (
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        className={CARD}
      >
        <span aria-hidden className="mt-0.5 shrink-0 text-2xl leading-none">
          {tool.icon}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-900 group-hover:text-brand-700">
            {tool.name}{' '}
            <span aria-hidden className="text-xs font-normal text-gray-400">
              ↗
            </span>
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-gray-500">
            {tool.description}
          </span>
          <span className="mt-1 block text-xs text-gray-400">
            External site · opens in a new tab
          </span>
        </span>
      </a>
    );
  return (
    <Link href={tool.href} className={CARD}>
      <span aria-hidden className="mt-0.5 shrink-0 text-2xl leading-none">
        {tool.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900 group-hover:text-brand-700">
          {tool.name}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-gray-500">
          {tool.description}
        </span>
        {tool.category && (
          <span className="mt-1.5 inline-block rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
            {tool.category}
          </span>
        )}
      </span>
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
      className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}
    >
      {tools.map((t) => (
        <li key={t.href}>
          <ToolCard tool={t} />
        </li>
      ))}
    </ul>
  );
}
