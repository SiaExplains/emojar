'use client'

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="max-w-xl mx-auto">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search emojis… e.g. heart, smiley, cat"
        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
        autoFocus
      />
    </div>
  )
}
