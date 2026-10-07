---
slug: convert-markdown-to-html-for-a-cms-or-newsletter
tool: markdown-to-html
title: Convert Markdown to HTML for a CMS, Newsletter or Static Page
description: 'Write in Markdown, publish as HTML. See what tables, task lists and code blocks turn into, when to switch off GFM, and why raw HTML needs sanitizing.'
tags: [Markdown, HTML, Content]
---

To convert Markdown to HTML, run it through a Markdown parser. Each `#` heading becomes an `<h1>`–`<h6>`, paragraphs become `<p>`, lists become `<ul>`/`<ol>`, and fenced code becomes `<pre><code>`. With GitHub Flavored Markdown (GFM) turned on, tables, task lists and `~~strikethrough~~` are converted as well. The result is plain, unstyled HTML you can paste into a CMS's HTML view, an email template or a static page.

Here's a common scenario: release notes written in Markdown in your repo, which need to go into a CMS or newsletter tool that only accepts HTML.

## Step 1: Paste the Markdown

Open the [Markdown to HTML converter](/online-tool/developer-tools/markdown-to-html) and paste your text into **Markdown input**. Click **Load sample** for a quick example. The **HTML output** updates as you type.

Say your release notes include this:

````markdown
## Release 2.4

| Name | Role  |
| ---- | ----- |
| Ada  | admin |

- [x] Faster exports
- [ ] Dark mode

~~Beta~~ Generally available.

```bash
npm install mylib@2.4
```
````

## Step 2: Check the output

With **GitHub Flavored Markdown** ticked (the default), you get:

```html
<h2>Release 2.4</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada</td>
      <td>admin</td>
    </tr>
  </tbody>
</table>
<ul>
  <li><input checked="" disabled="" type="checkbox" /> Faster exports</li>
  <li><input disabled="" type="checkbox" /> Dark mode</li>
</ul>
<p><del>Beta</del> Generally available.</p>
<pre><code class="language-bash">npm install mylib@2.4
</code></pre>
```

Things to notice:

- **Tables** become semantic `<table>`, `<thead>` and `<tbody>` markup with no styling. Your CMS or stylesheet decides how they look.
- **Task lists** become disabled checkboxes. Many email clients strip `<input>` elements, so for a newsletter, replace them with "✓" or plain text.
- **Code blocks** get a `language-bash` class. That's the hook that syntax highlighters such as Prism or highlight.js look for. Without a highlighter it's just monospaced text.
- **Strikethrough** becomes `<del>`.

## Step 3: Decide whether you need GFM

Untick **GitHub Flavored Markdown** and the converter follows plain Markdown rules. The same table now comes out as a paragraph of pipes:

```html
<p>| Name | Role | |---|---| | Ada | admin |</p>
```

and `~~Beta~~` stays as literal tildes. Turn GFM off when you need to match a platform that uses strict CommonMark without extensions, so your preview matches what readers will actually see. Otherwise leave it on. Most people write Markdown expecting GitHub's behavior.

## Step 4: Copy or download

Copy the HTML into your CMS's source/HTML view, or download it as `output.html`. If the destination is a full web page, the output is a _fragment_: there's no `<html>`, `<head>` or CSS. Wrap it in your own template.

Conversion runs locally in your browser with the `marked` library, so unreleased product notes and internal docs don't leave your machine.

## Watch out: raw HTML passes straight through

Markdown allows inline HTML, and the converter keeps it as-is:

```markdown
<div class="note">Heads up</div>
```

comes out unchanged as `<div class="note">Heads up</div>`. That's useful for things Markdown can't express, like a `<details>` block or a styled callout. It also means **the output is not sanitized**. If the Markdown came from users (comments, profiles, support tickets), a `<script>` tag or an `onerror=` attribute in the input ends up in your HTML. Before rendering untrusted Markdown on a page, run the HTML through a sanitizer such as DOMPurify on the client, or an equivalent library on the server.

## Tips for cleaner output

- **Use fenced code blocks with a language tag** (` ```js `). You get the `language-*` class, which indented code blocks can't carry.
- **Leave blank lines around block elements.** A list with no blank line before it can get merged into the preceding paragraph.
- **Avoid HTML-only layout in Markdown.** If a document needs a lot of inline HTML, write it in HTML and format it with the [HTML Formatter](/online-tool/developer-tools/html-formatter) instead.
- **Preview first.** To see the rendered result rather than the source, use the [Markdown Previewer](/online-tool/text-tools/markdown-previewer).

## FAQ

### Does the converter add IDs to headings for anchor links?

No. Headings come out as plain `<h2>` and so on, without `id` attributes. If your page needs a table of contents or deep links, add IDs in your template or with a slug plugin in your build.

### Why are my single line breaks ignored?

In Markdown, a single newline inside a paragraph is treated as a space. That's true for both CommonMark and GFM. To force a `<br>`, end the line with two spaces or a backslash, or leave a blank line to start a new paragraph.

### Can I convert the HTML back to Markdown later?

Yes, with [HTML to Markdown](/online-tool/developer-tools/html-to-markdown). Standard elements make the round trip cleanly, but tables and task lists may need touching up afterwards.

Turn your next Markdown draft into publish-ready HTML with the [Markdown to HTML converter](/online-tool/developer-tools/markdown-to-html).
