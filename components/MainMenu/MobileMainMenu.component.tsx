'use client';

// Mobile navigation drawer (disclosure pattern). Opening moves focus to the
// first link; Esc or a tap outside closes it and returns focus to the button.
// Sections expand with a named toggle; every row is a real link.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { isActive } from './DesktopMainMenu';
import { MENU_ROUTES } from './Menu.routes';

const row =
  'flex min-h-11 w-full items-center rounded-lg px-3 text-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export default function MobileMainMenu() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Record<number, boolean>>({});
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const panelId = `${id}-drawer`;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panel.current?.contains(t) || trigger.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#dedee8] bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={open ? 'M6 6l12 12M18 6L6 18' : 'M3 6h18M3 12h18M3 18h18'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Menu
      </button>

      <div
        ref={panel}
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-[88vw] max-w-sm overflow-hidden rounded-2xl border border-[#e8e8f0] bg-white shadow-[0_16px_40px_-12px_rgba(30,30,60,0.25)]"
      >
        <ul className="max-h-[70vh] divide-y divide-gray-100 overflow-auto p-2">
          {MENU_ROUTES.map((item, i) => {
            const kids = item.children ?? [];
            const sectionId = `${id}-section-${i}`;
            const expanded = !!sections[i];
            return (
              <li key={item.href} className="py-1">
                <div className="flex items-center gap-1">
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`${row} text-[13px] font-semibold uppercase tracking-wide ${
                      isActive(pathname, item.href)
                        ? 'text-brand-700'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {kids.length > 0 && (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={sectionId}
                      aria-label={`${expanded ? 'Hide' : 'Show'} ${item.label} links`}
                      onClick={() => setSections((s) => ({ ...s, [i]: !s[i] }))}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {kids.length > 0 && (
                  <ul id={sectionId} hidden={!expanded} className="pb-1 pl-3">
                    {kids.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={
                            pathname === child.href ? 'page' : undefined
                          }
                          className={`${row} ${
                            pathname === child.href
                              ? 'bg-brand-50 text-brand-800'
                              : 'text-gray-700'
                          }`}
                        >
                          {child.icon && (
                            <span aria-hidden className="mr-1.5">
                              {child.icon}
                            </span>
                          )}
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
