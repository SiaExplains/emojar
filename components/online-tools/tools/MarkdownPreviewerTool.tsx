'use client';

import { useEffect, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, DownloadButton, ToolInput } from '../ui';

const SAMPLE = `# Markdown Previewer

Write **bold**, *italic* and \`inline code\`.

## Lists
- [x] Task lists
- [ ] Tables
- Links like [Emojar](https://emojar.com)

| Format | Shortcut |
| ------ | -------- |
| Bold   | **text** |
| Italic | *text*   |

> Quotes work too.

\`\`\`js
console.log('Hello from Markdown');
\`\`\`
`;

export default function MarkdownPreviewerTool(_: ToolProps) {
  const [md, setMd] = useState(SAMPLE);
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ marked }, { default: DOMPurify }] = await Promise.all([
        import('marked'),
        import('dompurify'),
      ]);
      const raw = marked.parse(md, { gfm: true, async: false }) as string;
      // Sanitise so pasted Markdown can never run scripts on this page.
      const clean = DOMPurify.sanitize(raw, { ADD_ATTR: ['target'] });
      if (!cancelled) setHtml(clean);
    })();
    return () => {
      cancelled = true;
    };
  }, [md]);

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput label="Markdown" value={md} onChange={setMd} rows={20} />
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-700">Preview</span>
            <div className="flex gap-2">
              <CopyButton text={html} label="Copy HTML" />
              <DownloadButton
                data={md}
                filename="document.md"
                type="text/markdown"
                label=".md"
              />
            </div>
          </div>
          <div
            className="prose prose-sm max-h-[520px] max-w-none overflow-auto rounded-xl border border-gray-200 bg-white p-4"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
