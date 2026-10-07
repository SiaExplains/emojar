import Link from 'next/link';

export type ToolCardData = {
  href: string;
  name: string;
  description: string;
  icon: string;
};

export function ToolCard({ tool }: { tool: ToolCardData }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition hover:border-gray-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span aria-hidden className="mt-0.5 shrink-0 text-2xl leading-none">
        {tool.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900 group-hover:text-indigo-700">
          {tool.name}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-gray-500">
          {tool.description}
        </span>
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
