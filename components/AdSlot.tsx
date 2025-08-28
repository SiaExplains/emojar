'use client'
import { useEffect } from 'react'

declare global {
  interface Window { adsbygoogle: any[] }
}

export default function AdSlot() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  // Replace data-ad-slot with your real slot id after AdSense approval
  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-0000000000000000'}
      data-ad-slot="0000000000"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
