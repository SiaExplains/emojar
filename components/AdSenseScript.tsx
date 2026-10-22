'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Surfaces that must never load ads: full-bleed game screens (kept in sync
// with ChromeGate's BARE_PREFIXES) and the cross-origin-isolated ARW
// Converter, whose COEP header would block the ad iframes anyway.
const NO_ADS_PREFIXES = [
  '/games/emopet',
  '/online-tool/image-tools/arw-converter',
];

/**
 * Loads the AdSense loader script, except on ad-free surfaces. Because this
 * component renders the <Script> itself (rather than receiving it as children),
 * returning null on those routes keeps the script URL out of the serialized
 * payload entirely — not just out of the executed DOM.
 *
 * AdSense + Google Funding Choices: the loader is added unconditionally on
 * ad-serving routes. Funding Choices intercepts it for EEA/UK/Swiss visitors
 * and handles TCF v2.2 consent automatically — no localStorage gating needed.
 */
export function AdSenseScript({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const adsFree =
    !!pathname && NO_ADS_PREFIXES.some((p) => pathname.startsWith(p));

  if (!clientId || adsFree) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
