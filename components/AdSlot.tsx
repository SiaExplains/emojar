'use client';

// One display ad, used below the tool on tool pages. Placement rules (see the
// privacy policy, About and Terms): ads are never placed inside a tool, never
// styled like a button, download link or result, and always sit at least
// 2rem away from tool controls with an "Advertisement" label.
//
// The slot only renders when its slot id is configured — until AdSense
// approves real ad units (NEXT_PUBLIC_ADSENSE_SLOT_TOOL is unset) it outputs
// nothing and reserves no space. When it renders it reserves its height up
// front so the page doesn't shift when the ad arrives. An unfilled slot keeps
// its (labelled, empty) space on purpose: collapsing it would shift the page.

import { useEffect, useRef } from 'react';

type AdsQueue = { push: (params: object) => void };

declare global {
  interface Window {
    adsbygoogle?: AdsQueue | object[];
  }
}

const CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4461604896559377';

const SLOTS = {
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL,
} as const;

export default function AdSlot({
  placement,
}: {
  placement: keyof typeof SLOTS;
}) {
  const slot = SLOTS[placement];
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    pushed.current = true;
    try {
      const queue = (window.adsbygoogle ??= []) as AdsQueue;
      queue.push({});
    } catch {
      // Blocked by an ad blocker or not loaded yet — leave the box empty.
    }
  }, [slot]);

  if (!slot) return null;
  return (
    <aside aria-label="Advertisement" className="ad-box mx-auto w-full">
      <p className="mb-1 text-center text-xs uppercase tracking-wide text-gray-400">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block min-h-[280px] w-full sm:min-h-[250px]"
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
