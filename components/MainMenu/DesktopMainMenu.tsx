'use client';

// Desktop navigation, using the disclosure pattern: each parent is a real link
// plus a separate toggle button for its panel. Panels open on hover (mouse)
// or with the toggle (keyboard, touch); Esc closes and returns focus.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { MENU_ROUTES } from './Menu.routes';
import { tintFor } from '@/lib/online-tools/category-style';

const itemBase =
  'rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wide transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export const isActive = (pathname: string, href: string) =>
  href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`);

export default function DesktopMainMenu() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  // A panel opened by hovering stays open when its toggle is then clicked;
  // only a second click (or Esc, or leaving) closes it.
  const openedByHover = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const toggles = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  // Close when navigating, clicking elsewhere or pressing Esc.
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || open === null) return;
      toggles.current[open]?.focus();
      setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const enter = (i: number) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (open !== i) openedByHover.current = true;
    setOpen(i);
  };
  const toggle = (i: number) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    const close = open === i && !openedByHover.current;
    openedByHover.current = false;
    setOpen(close ? null : i);
  };
  // A short delay so the pointer can travel into the panel.
  const leave = () => {
    hoverTimer.current = window.setTimeout(() => setOpen(null), 150);
  };

  return (
    <div ref={root} className="relative">
      <ul className="flex items-center gap-1">
        {MENU_ROUTES.map((item, i) => {
          const kids = item.children ?? [];
          const panelId = `${id}-panel-${i}`;
          const active = isActive(pathname, item.href);
          return (
            <li
              key={item.href}
              className="flex items-center"
              onMouseEnter={kids.length ? () => enter(i) : undefined}
              onMouseLeave={kids.length ? leave : undefined}
              onBlur={(e) => {
                if (
                  open === i &&
                  !e.currentTarget.contains(e.relatedTarget as Node | null)
                )
                  setOpen(null);
              }}
            >
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`${itemBase} ${active ? 'text-brand-700' : 'text-gray-800'}`}
              >
                {item.label}
              </Link>
              {kids.length > 0 && (
                <>
                  <button
                    ref={(el) => {
                      toggles.current[i] = el;
                    }}
                    type="button"
                    aria-expanded={open === i}
                    aria-controls={panelId}
                    aria-label={`${open === i ? 'Hide' : 'Show'} ${item.label} links`}
                    onClick={() => toggle(i)}
                    className="-ml-1 rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`transition-transform ${open === i ? 'rotate-180' : ''}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    id={panelId}
                    hidden={open !== i}
                    className={`absolute right-0 top-full z-40 mt-2 rounded-2xl border border-[#e8e8f0] bg-white p-3 shadow-[0_16px_40px_-12px_rgba(30,30,60,0.25)] ${
                      kids.length > 8
                        ? 'w-[760px] max-w-[90vw]'
                        : kids.length > 4
                          ? 'w-[440px]'
                          : 'w-56'
                    }`}
                  >
                    <ul
                      className={`grid gap-1 ${
                        kids.length > 8
                          ? 'grid-cols-3'
                          : kids.length > 4
                            ? 'grid-cols-2'
                            : 'grid-cols-1'
                      }`}
                    >
                      {kids.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={
                              pathname === child.href ? 'page' : undefined
                            }
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-[#f5f5fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                              pathname === child.href
                                ? 'bg-brand-50 text-brand-800'
                                : 'text-gray-800'
                            }`}
                          >
                            {child.icon && (
                              <span
                                aria-hidden
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ring-1 ring-inset ${tintFor(child.tint)}`}
                              >
                                {child.icon}
                              </span>
                            )}
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
