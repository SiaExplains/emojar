---
slug: how-to-delete-blank-lines-from-pasted-text
tool: remove-empty-lines
title: How to Delete Blank Lines From Text Copied Out of PDFs
description: Text pasted from PDFs, emails and web pages often arrives full of gaps. A walkthrough of removing blank lines, including the ones that only look empty.
tags: [Text Cleanup, PDF, How-to]
---

To delete blank lines from pasted text, paste it into a tool that drops every line with nothing on it, and make sure it also drops lines that contain only spaces or tabs, because those look empty but aren't. That second part is why a quick manual cleanup often misses a few gaps. The whole job takes seconds once you know which kind of "empty" you're dealing with.

Here's a real-world example, from messy paste to clean list.

## Why does pasted text have so many blank lines?

Each source adds gaps for its own reasons:

- **PDFs** store text as positioned fragments, not paragraphs. When you copy, the reader guesses where lines end and often inserts extra breaks between table rows and headings.
- **Emails** may separate every paragraph with an empty paragraph, which becomes a blank line when pasted as plain text.
- **Web pages** turn block elements (divs, list items, table cells) into line breaks, and spacing elements turn into lines with nothing but spaces on them.
- **Spreadsheets** paste empty rows as blank lines.

## The scenario: an invoice copied from a PDF

You need the line items from a PDF invoice in a plain list. You copy and paste, and get this (spaces and tabs shown as described):

```
Invoice summary


Item: Desk lamp
(a line with three spaces)
Qty: 2
(a line with a tab)
Total: $84.00

```

Two of those "blank" lines aren't empty at all: one contains spaces and one contains a tab. If you only removed truly empty lines, you'd still have gaps.

## Step-by-step: remove the blank lines

1. Open [Remove Empty Lines](/online-tool/text-tools/remove-empty-lines) and paste the text into the **Text** box. Click **Load sample** if you want to see a demo first.
2. Leave **Also remove lines with only spaces** checked (it's on by default). This treats spaces and tabs as empty.
3. Read the result in **Text without empty lines**. It updates automatically:

```
Invoice summary
Item: Desk lamp
Qty: 2
Total: $84.00
```

4. Click **Copy**, or **Download** to save it as a text file.

If you uncheck **Also remove lines with only spaces**, only the truly empty lines go, and the space-only and tab-only lines stay. That's occasionally what you want, for example in some code or fixed-width formats where an indented blank line is meaningful.

Everything happens in your browser, so the invoice, contract or email you're cleaning isn't uploaded anywhere.

## What the tool does not change

- **Spaces inside lines.** "Qty: 2" keeps its extra spaces. Collapse them with [Find and Replace](/online-tool/text-tools/find-and-replace) if needed.
- **Line breaks within paragraphs.** If a PDF broke one sentence across three lines, you'll still have three lines; only the empty ones between them disappear.
- **Leading and trailing spaces** on lines that have content.

## When you shouldn't remove every blank line

Blank lines are sometimes structure, not clutter:

- **Markdown.** A blank line is what separates two paragraphs. Remove it and the paragraphs merge into one when rendered.
- **Poems, lyrics and scripts.** Stanza and scene breaks disappear.
- **Code.** Blank lines between functions don't change how code runs in most languages, but they make it much harder to read.
- **Email drafts.** Your greeting, body and sign-off run together.

In those cases you probably want to collapse multiple blank lines into one instead of removing all of them. Remove Empty Lines doesn't have that option, but Find and Replace can do it: turn on **Regular expression**, find `(\n)\n{2,}` and replace with `$1$1`. Three or more line breaks in a row become exactly two, leaving one blank line between paragraphs.

## Tips for a cleaner result

- Remove blank lines **before** you sort or deduplicate a list. Otherwise [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines) keeps one blank line, and sorting groups your blank lines at the top.
- If a PDF table pasted with each cell on its own line, removing the blanks is step one; you may still need to rejoin cells into rows.
- Keep the original paste somewhere until you've checked the result.

## FAQ

### Does it remove a blank line at the very end?

Yes. A trailing empty line counts like any other empty line, so the result ends right after your last line of text.

### Can I remove blank lines in a Word document directly?

Not with this tool; it works with plain text. Copy the text out of Word, clean it here and paste it back. Formatting such as bold and headings won't survive the round trip.

### What counts as "only spaces"?

Any line made entirely of whitespace characters: regular spaces, tabs and non-breaking spaces all count.

Paste your next messy copy into [Remove Empty Lines](/online-tool/text-tools/remove-empty-lines) and get a clean version in one step.
