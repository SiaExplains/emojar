---
slug: practical-ways-to-add-text-to-the-start-or-end-of-every-line
tool: add-prefix-suffix-to-lines
title: 9 Practical Ways to Add Text to the Start or End of Every Line
description: Recipes for adding a prefix or suffix to every line of a list, from SQL IN lists and JSON arrays to Markdown checklists, HTML tags and numbered steps.
tags: [Text, Lists, Productivity]
---

To add the same text to the start or end of every line, paste your list into a prefix/suffix tool, type what goes before and after each line, and copy the result. The real value is in knowing the recipes, so here are nine with exact inputs and outputs.

All examples use the [Add Prefix / Suffix to Lines tool](/online-tool/text-tools/add-prefix-suffix-to-lines), which has four controls: **Prefix (before each line)**, **Suffix (after each line)**, **Skip empty lines** (on by default) and **Trim spaces from each line** (off by default). The prefix starts out as `{n}. ` so a pasted list is numbered immediately; clear it if you don't want numbers.

## 1. How do I turn a column of values into a SQL IN list?

You copied a column of email addresses out of a spreadsheet and need them in a query. Set the prefix to `'` and the suffix to `',`.

```text
alice@example.com
bob@example.com
carol@example.com
```

becomes

```text
'alice@example.com',
'bob@example.com',
'carol@example.com',
```

Wrap it in `WHERE email IN ( ... )` and delete the comma after the last item, because the tool adds the suffix to every line, including the final one. If any value contains an apostrophe (O'Brien), escape it first, for example with [Find and Replace](/online-tool/text-tools/find-and-replace), changing `'` to `''`.

## 2. A JavaScript or JSON array

Same idea, double quotes: prefix `"`, suffix `",`. Paste the output between `[` and `]` and remove the last comma. JSON is strict about trailing commas, so that final edit matters.

## 3. Numbered steps that skip the gaps

The `{n}` token is replaced by a running line number starting at 1. With **Skip empty lines** on, blank lines get no prefix and don't use up a number, so numbering stays continuous:

```text
apples
bananas

cherries
```

with prefix `{n}. ` gives

```text
1. apples
2. bananas

3. cherries
```

Turn **Skip empty lines** off and the blank line becomes `3. ` with cherries pushed to `4.`. You can write any format around the token: `Step {n}: `, `{n}) `, `Q{n}. `. The token works in the suffix too, so a suffix of ` (row {n})` labels the end of each line.

## 4. A Markdown bullet list or checklist

Prefix `- ` gives a bullet list. Prefix `- [ ] ` gives a task list that GitHub, Obsidian and many note apps render as checkboxes.

## 5. HTML list items or table cells

Prefix `<li>` and suffix `</li>` turn plain lines into list items; wrap the result in `<ul>` or `<ol>`. For a single table column use `<td>` and `</td>`. Here **Trim spaces from each line** helps: without it, a line like `  red ` (with stray spaces) becomes `<li>  red </li>`, while with it on you get `<li>red</li>`.

## 6. Quoting text in an email reply

Prefix `> ` marks every line as quoted, the plain-text email and Markdown convention. If the passage has paragraph breaks, decide whether you want the blank lines quoted too: leave **Skip empty lines** on to keep them bare, or turn it off so every line, including empty ones, starts with `>`.

## 7. Full URLs from a list of paths

Exported a list of page paths from analytics and need clickable links? Put your domain in the prefix:

```text
/pricing
/blog/launch
```

with prefix `https://example.com` becomes

```text
https://example.com/pricing
https://example.com/blog/launch
```

A suffix such as `?utm_source=newsletter` appends a tracking tag the same way, as long as the URLs don't already contain a `?`.

## 8. Hashtags, mentions and tags

Prefix `#` turns `travel`, `lisbon`, `foodie` into `#travel`, `#lisbon`, `#foodie`. If you need them on one line for a caption, run the output through [Remove Line Breaks](/online-tool/text-tools/remove-line-breaks) with **Replace all with a space**.

## 9. Indenting a code block or commenting it out

The tool preserves leading whitespace in what you type, so a prefix of four spaces indents every line, which is how classic Markdown marks a code block. A prefix of `// ` or `# ` comments out a block of JavaScript or Python and shell lines respectively. Keep **Trim spaces from each line** off here, or you'll flatten the existing indentation of the code.

## Which settings trip people up?

- **The trailing comma.** Every line gets the suffix, so the last item in a SQL or JSON list always needs a manual fix.
- **Lines that only look empty.** A line containing just spaces counts as empty for skipping, but its spaces stay in the output unless you also turn on trimming.
- **A final newline.** If your paste ends with a line break and **Skip empty lines** is off, the empty last line gets a prefix too, leaving a stray `- ` or number at the bottom.
- **Numbering doesn't restart.** `{n}` counts across the whole input, so run separate lists separately.

## Step by step

1. Paste your list into **Lines of text**, one item per line.
2. Type into **Prefix (before each line)** and/or **Suffix (after each line)**. Use `{n}` wherever you want the line number.
3. Choose whether to **Skip empty lines** and **Trim spaces from each line**.
4. The **Result** updates as you type. Copy it or download it as a text file.

Your list is processed in the browser and never sent to a server, which matters when it's customer emails or internal IDs. For tidier input, sort or de-duplicate the list first with [Sort Lines](/online-tool/text-tools/sort-lines).

## FAQ

### Can I add different text to different lines?

No. The same prefix and suffix go on every line, with `{n}` as the only part that changes. For per-line variations, use the tool for the shared part and edit the exceptions by hand, or use a spreadsheet formula.

### How do I remove a prefix that's already there?

This tool only adds text. To strip an existing prefix, such as a bullet or a number, use Find and Replace with a regular expression like `^\d+\.\s` replaced by nothing.

Have a list to transform? Open the [Add Prefix / Suffix to Lines tool](/online-tool/text-tools/add-prefix-suffix-to-lines) and try one of these recipes.
