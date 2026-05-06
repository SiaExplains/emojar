'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={copy}
      className="mt-2 inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
    >
      {copied ? '✓ Copied!' : 'Copy to clipboard'}
    </button>
  );
}
