---
slug: markdown-cheat-sheet-with-live-preview
tool: markdown-previewer
title: 'Markdown Cheat Sheet: Syntax You Can Test Live'
description: The Markdown syntax you'll actually use, from headings and links to GitHub-style tables and task lists, with the line-break gotcha that trips up everyone.
tags: [Markdown, Writing, Developers]
---

Markdown is a plain-text way to format writing: `**bold**`, `# Heading`, `- list item`. It's turned into HTML when displayed, which is why README files, documentation, chat apps and note tools all use it. The fastest way to learn it is to type a line and immediately see how it renders, which is exactly what a live previewer is for.

This cheat sheet covers the syntax you'll use 95% of the time, plus the GitHub Flavored Markdown (GFM) extras.

## The core syntax

| You type                           | You get                       |
| ---------------------------------- | ----------------------------- |
| `# Heading 1` … `###### Heading 6` | Headings, largest to smallest |
| `**bold**` or `__bold__`           | **bold**                      |
| `*italic*` or `_italic_`           | _italic_                      |
| `` `code` ``                       | inline `code`                 |
| `[link text](https://example.com)` | a clickable link              |
| `![alt text](image.png)`           | an image                      |
| `- item` or `* item`               | a bullet list                 |
| `1. item`                          | a numbered list               |
| `> quote`                          | a blockquote                  |
| `---` on its own line              | a horizontal rule             |

Code blocks use three backticks, with an optional language name:

````
```js
console.log('Hello');
```
````

## GitHub Flavored Markdown extras

GFM adds features most platforms now support. The [Markdown Previewer](/online-tool/text-tools/markdown-previewer) renders all of these:

**Tables.** Separate columns with pipes and add a dashed row under the header:

```
| Plan  | Price |
| ----- | ----: |
| Basic |    $5 |
| Pro   |   $12 |
```

A colon on the right of the dashes (`----:`) right-aligns that column; on the left, left-aligns; on both sides, centers.

**Task lists.** `- [ ] To do` and `- [x] Done` render as checkboxes.

**Strikethrough.** `~~old price~~` crosses text out.

**Autolinks.** A bare URL like `https://example.com` becomes a link automatically.

## The line-break gotcha

This is the number one Markdown surprise. A single line break in your text does **not** create a new line in the output:

```
Roses are red
Violets are blue
```

renders as "Roses are red Violets are blue" on one line. Markdown treats consecutive lines as one paragraph. You have three options:

1. Leave a **blank line** between them to make two paragraphs.
2. End the first line with **two spaces** to force a line break.
3. End the first line with a **backslash** (`\`).

The preview makes this obvious immediately, which is half the value of writing with one open.

## Other common mistakes

- **No space after the hash.** `#Heading` is plain text in GFM; `# Heading` is a heading.
- **Lists right after a paragraph.** Some renderers need a blank line before a list. Adding one is always safe.
- **Underscores in words.** `snake_case_name` is usually fine, but wrap code-like text in backticks to be safe.
- **Nested lists.** Indent sub-items so they line up under the text of the parent item (usually two to four spaces).
- **Pipes inside tables.** A literal `|` in a cell breaks the table; escape it as `\|`.

## How to use the Markdown Previewer

1. Open the tool. It starts with a sample document showing headings, a task list, a table, a quote and a code block, so you can learn by editing it.
2. Type or paste into the **Markdown** box on the left (above, on smaller screens).
3. Watch the **Preview** update as you type.
4. Click **Copy HTML** to grab the rendered HTML, or **.md** to download your text as `document.md`.

Your text stays in the browser tab and isn't uploaded or saved, so copy or download before closing. The preview is also sanitized: you can include simple inline HTML, but scripts and similar code are stripped out, so a pasted file can't run anything on the page.

## Where to use what you've written

- **README files** on GitHub and GitLab use GFM, so what you see here is close to what you'll get.
- **Docs and static sites** usually render Markdown at build time. If you need the HTML directly, [Markdown to HTML](/online-tool/developer-tools/markdown-to-html) converts it.
- **Moving the other way?** [HTML to Markdown](/online-tool/developer-tools/html-to-markdown) turns an existing web page's HTML into Markdown you can edit.

## FAQ

### Is Markdown the same everywhere?

The core syntax is, but extras differ. Tables and task lists are GFM features; footnotes, diagrams and math are supported by some platforms but not others. Check your target platform for anything beyond the basics.

### Does the preview highlight code syntax?

Code blocks are rendered in a monospace block, but without color highlighting. The language name after the backticks is kept as a class on the code element, which your own site's highlighter can use.

### How do I add a line break inside a table cell?

Use an HTML `<br>` tag inside the cell. Markdown itself has no syntax for it.

Practice any of these right now in the [Markdown Previewer](/online-tool/text-tools/markdown-previewer).
