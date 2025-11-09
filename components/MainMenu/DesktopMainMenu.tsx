'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { MENU_ROUTES } from './Menu.routes';

type MenuItem = {
  href: string;
  label: string;
  target?: '_self' | '_blank';
  // some items came in as "chilren" by typo, support both
  children?: MenuItem[] | null;
  chilren?: MenuItem[] | null;
};

function getChildren(item: MenuItem): MenuItem[] | null {
  // prefer correct "children", fallback to the typo
  return (item.children ?? item.chilren) ?? null;
}

const DesktopMainMenu = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hoverTimer = useRef<number | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleEnter = (idx: number) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setOpenIndex(idx);
  };

  const handleLeave = () => {
    // small delay so users can move into the panel without flicker
    hoverTimer.current = window.setTimeout(() => setOpenIndex(null), 120);
  };

  return (
    <div className="relative">
      <ul className="flex items-center gap-2">
        {(MENU_ROUTES as MenuItem[]).map((item, idx) => {
          const kids = getChildren(item);
          const isOpen = openIndex === idx && kids && kids.length > 0;

          return (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
              onFocus={() => handleEnter(idx)}
              onBlur={handleLeave}
            >
              <Link
                href={item.href}
                target={item.target || '_self'}
                className="px-3 py-2 rounded-md hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none transition"
                aria-haspopup={kids ? 'true' : undefined}
                aria-expanded={isOpen ? 'true' : 'false'}
              >
                {item.label}
              </Link>

              {/* Mega dropdown */}
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 w-[640px] max-w-[90vw] rounded-2xl border border-neutral-200 bg-white shadow-xl p-4 z-40"
                  role="menu"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kids!.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        target={child.target || '_self'}
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
                        role="menuitem"
                      >
                        <span className="text-sm">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DesktopMainMenu;
