'use client'

import { useEffect, useState } from 'react'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const v = localStorage.getItem('emojar-consent')
    if (!v) setVisible(true)
  }, [])

  if (!visible) return null

  const grant = () => {
    localStorage.setItem('emojar-consent', 'granted')
    setVisible(false)
    location.reload()
  }
  const deny = () => {
    localStorage.setItem('emojar-consent', 'denied')
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm">
          Emojar uses cookies for ads/analytics. Manage your consent. (Replace with a GDPR-compliant CMP for production.)
        </p>
        <div className="flex gap-2">
          <button onClick={deny} className="border rounded px-3 py-1 text-sm">Decline</button>
          <button onClick={grant} className="bg-black text-white rounded px-3 py-1 text-sm">Allow</button>
        </div>
      </div>
    </div>
  )
}
