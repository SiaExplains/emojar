'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Full-bleed surfaces that opt out of the main-site chrome (header, footer,
// AdSense) and the centered content column. Emopet (the 3D pet game) is the
// first; add more prefixes here if other standalone experiences appear.
const BARE_PREFIXES = ['/games/emopet'];

function useIsBare(): boolean {
  const pathname = usePathname();
  return !!pathname && BARE_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Renders site chrome everywhere EXCEPT bare surfaces. Children are authored in
 * the (server) root layout and passed through, so on normal routes the markup
 * is server-rendered and byte-identical to rendering it inline — this gate only
 * decides whether to include it. usePathname resolves during SSR, so there is
 * no hydration flash.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return useIsBare() ? null : <>{children}</>;
}

/**
 * Wraps page content in the centered site column, except on bare surfaces where
 * the page owns the full viewport.
 */
export function PageMain({ children }: { children: ReactNode }) {
  if (useIsBare()) return <>{children}</>;
  return <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>;
}
