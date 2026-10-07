---
slug: migrate-html-pages-to-markdown-docs
tool: html-to-markdown
title: Migrating HTML Pages to Markdown Docs Without the Mess
description: 'Moving CMS or wiki pages into a Markdown docs site or README? What converts cleanly, what gets lost (tables, scripts, styling), and how to prep the HTML first.'
tags: [Markdown, HTML, Documentation, Migration]
---

To turn HTML into Markdown, a converter walks the HTML element tree and writes the Markdown equivalent of each element: `<h2>` becomes `## `, `<strong>` becomes `**…**`, `<a href>` becomes `[text](url)`, and `<pre><code>` becomes a fenced code block. Headings, paragraphs, links, emphasis, lists, quotes, images and code come through cleanly. Elements with no Markdown equivalent keep only their text. So if you clean the HTML a little first, you'll get much better results.

This guide walks through a typical migration: moving pages out of an old CMS or wiki into Markdown files for a docs site, a GitHub wiki or a README.

## Step 1: Grab the content HTML, not the whole page

Copy only the article body. In the browser, right-click the content area, choose **Inspect**, find the element that wraps the article (often `<article>`, `<main>` or a `div.post-content`), and use **Copy → Copy outerHTML**. Leave out navigation, footers and sidebars. They'd be converted into stray lists and links at the top and bottom of your Markdown.

## Step 2: Strip scripts and styles

This catches people out. The converter keeps the text content of elements it doesn't recognize, and that includes `<script>` and `<style>`:

```html
<p>Intro</p>
<script>
  track();
</script>
<style>
  .x {
  }
</style>
```

becomes

```markdown
Intro

track().x{}
```

Delete `<script>`, `<style>`, `<noscript>` and embedded widgets before converting, or search the output afterwards for leftover code.

## Step 3: Convert

Paste the HTML into the [HTML to Markdown converter](/online-tool/developer-tools/html-to-markdown). The **Markdown output** appears as you type. Here's a realistic chunk of CMS content:

```html
<h1>Getting started</h1>
<p>
  Install the <strong>CLI</strong>, then read
  <a href="https://example.com/docs" title="Docs">the guide</a>.<br />New line.
</p>
<blockquote><p>Tip: use npm.</p></blockquote>
<ul>
  <li>
    One
    <ul>
      <li>Nested</li>
    </ul>
  </li>
  <li>Two</li>
</ul>
<pre><code class="language-bash">npm run build</code></pre>
```

Output:

````markdown
# Getting started

Install the **CLI**, then read [the guide](https://example.com/docs 'Docs').  
New line.

> Tip: use npm.

- One
  - Nested
- Two

```bash
npm run build
```
````

Link titles are kept, `<br>` becomes a hard line break (two trailing spaces), nested lists are indented, and the `language-bash` class becomes the code fence's language tag, so syntax highlighting carries over to GitHub and most docs generators.

## What converts, and what doesn't

| HTML                                    | Markdown result                                               |
| --------------------------------------- | ------------------------------------------------------------- |
| `<h1>`–`<h6>`                           | `#`–`######` (or underlined Setext style for h1/h2)           |
| `<strong>`, `<b>`                       | `**bold**`                                                    |
| `<em>`, `<i>`                           | `_italic_`                                                    |
| `<a href title>`                        | `[text](url "title")`                                         |
| `<img src alt>`                         | `![alt](src)`                                                 |
| `<ul>`, `<ol>`                          | `-   item`, `1.  item`                                        |
| `<blockquote>`                          | `> quote`                                                     |
| `<pre><code>`                           | Fenced block with language from `language-*` class            |
| `<hr>`                                  | `* * *`                                                       |
| `<table>`                               | **Cell text only, one cell per paragraph. Structure is lost** |
| `<s>`, `<del>`                          | Text only, no strikethrough                                   |
| `<span style>`, `<div class>`, `<font>` | Text only; styling and classes dropped                        |
| `<iframe>`, `<video>`, forms            | Usually lost. Re-add manually as links or raw HTML            |

**Tables need the most attention.** A table becomes a run of short paragraphs, one per cell. For anything more than a couple of cells, rebuild it by hand as a GFM pipe table, or paste the original `<table>` HTML into your Markdown file. Most Markdown renderers, including GitHub's, accept raw HTML tables.

## Step 4: Choose a heading style

Under **Headings**, **# ATX** (the default) writes `## Heading`. **Setext (underlined)** writes level-1 and level-2 headings underlined with `===` or `---`:

```markdown
# Title

## Sub

### Third
```

Setext only exists for the first two levels, so deeper headings fall back to `###`. ATX is the more common convention and what most linters expect.

## Step 5: Clean up the escaped characters

The converter escapes characters that would otherwise _become_ Markdown formatting:

```
Price: 5 \* 3 = 15 and \_id\_ #1
```

That's correct. It renders as `5 * 3` and `_id_`, not as italics. But it looks noisy in the source. Wrap technical terms in backticks (`` `_id_` ``) and the escapes become unnecessary.

## Step 6: Review and save

Copy the output or download it as `output.md`. Before committing it, render it once: check it in your docs site's preview or the [Markdown Previewer](/online-tool/text-tools/markdown-previewer). Check that internal links point to their new locations (relative links from the old CMS will be broken), and that images still resolve.

The conversion happens in your browser using the Turndown library, so internal wiki pages don't get uploaded anywhere during the migration.

## FAQ

### Why do list items have extra spaces after the dash?

The converter pads list markers so continuation lines and nested lists line up (`-   item`). It's valid Markdown and renders the same. If your linter prefers `- item`, a find-and-replace or `prettier --write` on the files will normalize it.

### Can I convert a whole site at once?

This tool handles one page at a time. For hundreds of pages, script the migration with Turndown in Node.js using the same options (fenced code blocks, `-` bullets), and use this tool to test on tricky pages first.

### How do I go back from Markdown to HTML?

Use [Markdown to HTML](/online-tool/developer-tools/markdown-to-html), which supports GFM tables and task lists in that direction.

Start your migration with the [HTML to Markdown converter](/online-tool/developer-tools/html-to-markdown).
