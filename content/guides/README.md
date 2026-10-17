# Tool guides

One Markdown file per online tool, named after the tool slug
(`content/guides/<tool-slug>.md`). Files are rendered at `/blog/<slug>` by
`app/blog/[slug]/page.tsx` and published on the schedule in
`lib/blog/schedule.ts` (a guide is hidden until its publish date).

Topic posts that cover several tools or an emoji feature use any file name
(e.g. `topic-pdf-workflows.md`, `topic-emoji-categories.md`) and leave out the
`tool:` line; they still need a schedule entry. Hand-written MDX posts in
`app/blog/<slug>/page.mdx` must also be added to `data/blog-posts-data.ts`,
which feeds the sitemap and llms.txt (a test checks this).

## Format

```markdown
---
slug: how-to-convert-heic-to-jpg # URL slug, unique across the whole blog
tool: heic-to-jpg # tool slug in lib/online-tools/tools/*.ts
title: How to Convert HEIC Photos to JPG Without Uploading Them # ≤ 65 chars
description: iPhone photos saved as HEIC won't open everywhere. ... # 120–160 chars
tags: [Images, iPhone, How-to] # 2–4 tags
---

Opening paragraph that answers the reader's question directly.

## Question-shaped heading

...
```

Rules:

- No `#` H1 in the body (the page renders the title as H1).
- Internal links only to pages listed in `KNOWN_URLS` in
  `lib/blog/guides.test.ts`: tool and category pages (`/online-tool/...`), the
  hub, `/faq`, `/blog`, `/games`, and the emoji hubs and tools (`/emoji`,
  `/categories`, `/collection/alphabet`, `/emoji-to-png` …).
- Facts about a tool must match its registry entry and component.
