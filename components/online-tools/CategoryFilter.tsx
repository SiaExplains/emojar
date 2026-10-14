'use client';

// Filter pills above a server-rendered tool directory. Every section stays in
// the HTML (crawlers and no-JS visitors get plain #anchor links); with
// JavaScript a pill hides the other sections through one generated CSS rule,
// so filtering costs no re-render of the tiles.

import { useEffect, useState, type ReactNode } from 'react';
import { pill, pillActive } from '@/components/ui/styles';

export type FilterOption = { slug: string; label: string };

const ALL = 'all';

export function CategoryFilter({
  options,
  children,
}: {
  options: FilterOption[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(ALL);

  // Honour a shared link such as /#pdf-tools.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (options.some((o) => o.slug === hash)) setActive(hash);
  }, [options]);

  const choose = (slug: string) => {
    setActive(slug);
    const url = slug === ALL ? window.location.pathname : `#${slug}`;
    window.history.replaceState(null, '', url + window.location.search);
  };

  const pills = [{ slug: ALL, label: 'All' }, ...options];

  return (
    <div data-filter={active}>
      {active !== ALL && (
        <style>{`[data-filter="${active}"] [data-cat]:not([data-cat="${active}"]){display:none}`}</style>
      )}
      <nav aria-label="Filter tools by category" className="-mx-4 sm:mx-0">
        <ul className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {pills.map((o) => (
            <li key={o.slug} className="shrink-0">
              <a
                href={o.slug === ALL ? '#tools' : `#${o.slug}`}
                aria-current={active === o.slug ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  choose(o.slug);
                }}
                className={active === o.slug ? pillActive : pill}
              >
                {o.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div id="tools" className="mt-6 space-y-12">
        {children}
      </div>
    </div>
  );
}
