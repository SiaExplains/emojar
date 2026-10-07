---
slug: why-duplicate-lines-wont-go-away
tool: remove-duplicate-lines
title: Why Your List Still Has Duplicates (and How to Fix It)
description: You removed duplicates but some still look identical. Here's what makes two lines different behind the scenes, from capital letters to invisible spaces.
tags: [Data Cleaning, Lists, Troubleshooting]
---

If duplicates survive after deduplicating a list, the lines aren't actually identical. They differ in capitalization, spacing, punctuation or invisible characters that you can't see on screen. A dedupe tool compares lines exactly, character by character, so "Paris" and "paris" or "New York" and "New York" count as two different items unless you normalize them first.

Here's how to track down each cause and fix it.

## How the tool decides two lines are the same

[Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines) reads your text one line at a time and keeps a line only if it hasn't seen an equal line before. The first occurrence wins, and the original order is preserved. Two checkboxes control what "equal" means:

- **Case sensitive** (on by default): "Apple" and "apple" are different. Turn it off to treat them as the same.
- **Ignore leading/trailing spaces** (on by default): " cherry" and "cherry" are the same. Turn it off to treat them as different.

The output keeps the exact text of the first occurrence. With case sensitivity off, if "Apple" comes before "apple", you'll get "Apple".

Try it with the built-in sample (click **Load sample**):

```
apple
banana
Apple
cherry
banana
  cherry
```

With the default settings you get `apple`, `banana`, `Apple`, `cherry`. Uncheck **Case sensitive** and "Apple" disappears too.

## Problem: capital letters

**Symptom:** "Marketing" and "marketing" both remain.
**Fix:** Uncheck **Case sensitive**. If you also want consistent capitalization in the output, run the list through the [Lowercase Converter](/online-tool/text-tools/lowercase-converter) first.

## Problem: spaces in the middle of a line

**Symptom:** `New York` and `New  York` (with two spaces) look the same at a glance, but both survive.
**Cause:** The trim option only removes spaces at the start and end of a line. A double space or a tab in the middle still makes the lines different.
**Fix:** Use Find and Replace in regex mode to collapse runs of spaces: find `[ \t]{2,}` and replace with a single space. Then dedupe again.

## Problem: invisible characters

**Symptom:** Two lines look exactly the same, even with highlighting, and still survive.
**Cause:** Text copied from websites, PDFs and chat apps sometimes carries zero-width spaces or other invisible formatting characters. Leading and trailing non-breaking spaces are trimmed along with normal spaces, but a zero-width space is not whitespace, so it isn't removed.
**Fix:** Paste both lines into the [Text Diff](/online-tool/text-tools/text-diff) tool in word mode to see where they differ, or retype the suspect line by hand.

## Problem: punctuation lookalikes

**Symptom:** "Don't" and "Don’t" both remain, or "2020-2024" and "2020–2024".
**Cause:** Straight and curly apostrophes, and hyphens and en dashes, are different characters. Word processors swap them automatically.
**Fix:** Find and replace the curly version with the straight one (or vice versa) before deduplicating.

## Problem: trailing punctuation and variants

**Symptom:** "Paris", "Paris." and "Paris, France" all remain.
**Cause:** These genuinely are different text. No exact-match tool will merge them.
**Fix:** Decide on a canonical form and clean the data first. For large spreadsheets, this is where you'd use a "fuzzy matching" feature in a dedicated data tool.

## A quick troubleshooting checklist

1. Duplicates differing only by capitals? Uncheck **Case sensitive**.
2. Extra spaces at the ends? Make sure **Ignore leading/trailing spaces** is checked.
3. Extra spaces in the middle? Collapse them with find and replace.
4. Lines look identical but aren't? Compare them in a diff tool.
5. Different punctuation? Normalize quotes and dashes.
6. Need it sorted afterwards? Run the result through [Sort Lines](/online-tool/text-tools/sort-lines).

## How to remove duplicate lines step by step

1. Paste your list, one item per line, into **Lines of text**.
2. Set **Case sensitive** and **Ignore leading/trailing spaces** for your data.
3. The **Unique lines** box updates automatically.
4. Click **Copy** or **Download** to take the clean list with you.

Your list is processed in your browser and never uploaded, which is useful for customer emails or internal IDs.

## FAQ

### Does it remove blank lines too?

Only extra ones. The first blank line counts as a unique line and is kept; later blank lines are treated as duplicates of it and removed. To strip all of them, use Remove Empty Lines.

### Can I see how many duplicates were removed?

The tool doesn't display a count. Paste the before and after versions into the Character Counter or Word Counter and compare the **Lines** figure under More details.

### Does it work on comma-separated values?

It compares whole lines, so a comma-separated list is treated as one long line. Put each item on its own line first, for example by pasting the values into a spreadsheet column and copying the column back out.

Clean up your next list with [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines).
