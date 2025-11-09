'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MENU_ROUTES } from './Menu.routes';

type MenuItem = {
  href: string;
  label: string;
  target?: '_self' | '_blank';
  children?: MenuItem[] | null;
  chilren?: MenuItem[] | null; // tolerate the typo
};

function getChildren(item: MenuItem): MenuItem[] | null {
  return item.children ?? item.chilren ?? null;
}

const MobileMainMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({});
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC or click outside
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!drawerOpen) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [drawerOpen]);

  const toggleSection = (idx: number) =>
    setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    // Important: relative so the absolute panel anchors to this box, not the page.
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        aria-label="Toggle menu"
        aria-expanded={drawerOpen ? 'true' : 'false'}
        onClick={() => setDrawerOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm">Menu</span>
      </button>

      {/* Backdrop (fixed, sits ABOVE your header z-40) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/10" aria-hidden="true"></div>
      )}

      {/* Floating panel (absolute, does NOT change header height) */}
      {drawerOpen && (
        <div
          ref={panelRef}
          className="
            absolute right-0 top-full mt-2 z-50
            w-[88vw] max-w-sm
            rounded-2xl border border-neutral-200 bg-white shadow-xl
            overflow-hidden
          "
          role="menu"
        >
          <ul className="max-h-[70vh] overflow-auto divide-y divide-neutral-100">
            {(MENU_ROUTES as MenuItem[]).map((item, idx) => {
              const kids = getChildren(item);
              const hasKids = !!(kids && kids.length > 0);
              const open = !!openIndices[idx];

              return (
                <li key={item.href} className="py-1">
                  <div className="flex items-center justify-between">
                    {hasKids ? (
                      <span className="px-3 py-3 text-sm">{item.label}</span>
                    ) : (
                      <Link
                        href={item.href}
                        target={item.target || '_self'}
                        className="px-3 py-3 text-sm rounded-md hover:bg-neutral-50 w-full block"
                        role="menuitem"
                        onClick={() => setDrawerOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}

                    {hasKids && (
                      <button
                        onClick={() => toggleSection(idx)}
                        aria-expanded={open ? 'true' : 'false'}
                        aria-controls={`mobile-section-${idx}`}
                        className="p-3 rounded-md hover:bg-neutral-50 focus:outline-none"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          className={`transition-transform ${open ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {hasKids && open && (
                    <div id={`mobile-section-${idx}`} className="mt-1">
                      <ul className="py-1">
                        {kids!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              target={child.target || '_self'}
                              className="block px-5 py-2 text-sm rounded-md hover:bg-neutral-50"
                              onClick={() => setDrawerOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileMainMenu;
