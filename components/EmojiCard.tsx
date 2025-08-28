'use client'

import { useState } from 'react'
import Link from 'next/link'

type Emoji = {
  slug: string
  char: string
  name: string
  category: string
  keywords: string[]
}

export default function EmojiCard({ emoji, onCopied }: { emoji: Emoji; onCopied?: (s: string) => void }) {
  const [isCopying, setIsCopying] = useState(false)

  const copy = async () => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(emoji.char)
      onCopied?.(emoji.char)
      setTimeout(() => setIsCopying(false), 500)
      // session trending (MVP-only): count copies locally
      const key = 'emojar-copied-counts'
      const raw = localStorage.getItem(key)
      const map: Record<string, number> = raw ? JSON.parse(raw) : {}
      map[emoji.slug] = (map[emoji.slug] ?? 0) + 1
      localStorage.setItem(key, JSON.stringify(map))
    } catch {}
  }

  return (
    <div className="border rounded-xl p-3 hover:shadow-sm transition">
      <button onClick={copy} className="w-full text-center" title="Click to copy">
        <div className="text-3xl">{emoji.char}</div>
        <div className="mt-2 text-sm">{emoji.name}</div>
      </button>
      <Link className="block mt-2 text-xs text-gray-500 hover:underline" href={`/emoji/${emoji.slug}`}>Details</Link>
      {isCopying && <div className="text-xs mt-1 text-green-600">Copied!</div>}
    </div>
  )
}
