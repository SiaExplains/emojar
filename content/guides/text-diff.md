---
slug: practical-ways-to-compare-two-texts-with-a-diff
tool: text-diff
title: 7 Practical Ways to Use a Text Diff Checker
description: A diff checker isn't just for programmers. Seven everyday uses, from contract redlines to config files, plus when to compare by line or by word.
tags: [Writing, Productivity, Use Cases]
---

A text diff checker compares two versions of a text and highlights exactly what was added and removed, so you don't have to reread both side by side. Programmers use it for code, but it's just as useful for contracts, articles, spreadsheets exported as text and anything else that changes over time. The trick is choosing the right comparison mode for the job.

## Line mode or word mode?

The [Text Diff](/online-tool/text-tools/text-diff) tool has a **Compare by** setting with two choices:

- **Lines** treats each line as a unit. If one character in a line changes, the whole old line is shown as removed (red, struck through, with a −) and the new line as added (green, with a +). Best for code, lists, CSV data and config files.
- **Words** compares word by word within the text and highlights only the changed words inline. Best for prose: paragraphs, emails, contracts and articles, where a "line" might be a whole paragraph.

A quick example in word mode: comparing "The quick fox" with "The slow fox" highlights only "quick" (removed) and "slow" (added).

Above the result you'll see a summary like **+3 added · −2 removed**, or a note that the texts are identical.

## 1. Reviewing contract and policy revisions

When a counterparty sends back "a few small edits" without tracked changes, paste your version as **Original text** and theirs as **Changed text**, then compare by **Words**. A changed "30 days" to "15 days" or an inserted "not" stands out immediately. Because the comparison runs in your browser and nothing is uploaded, it's a reasonable option for confidential drafts.

## 2. Checking an editor's changes to your article

Editors don't always use tracked changes. Paste your submitted draft and the published version and compare by words to see every tweak to wording, including the ones you might want to push back on.

## 3. Comparing two versions of a config file

Something broke after a deploy and you have the old and new `.env` or YAML files. Compare by **Lines**: changed values show as a removed line and an added line, so `TIMEOUT=30` → `TIMEOUT=3` jumps out.

## 4. Spotting what changed in a list

Two exports of a mailing list, product SKUs or a guest list? Sort both lists first with [Sort Lines](/online-tool/text-tools/sort-lines) so the order matches, then compare by lines. Removed lines are people or items that dropped off; added lines are new.

## 5. Proofreading a translation or template update

When a source text gets updated, translators need to know which sentences changed. A word-level diff of the old and new source shows exactly which parts need retranslating.

## 6. Checking terms of service updates

Many sites announce "we've updated our terms" without saying what changed. If you saved the old version, paste both and compare by words. It's a quick way to find the changed clause in a long document.

## 7. Verifying that a "cleanup" didn't change content

After reformatting a document or running a find-and-replace across it, compare before and after to confirm only the intended changes happened. If you expected 12 changes and see 30, something matched more than you meant to. That's a good habit after any bulk edit with [Find and Replace](/online-tool/text-tools/find-and-replace).

## How does the comparison work?

The diff uses a longest common subsequence algorithm, the same idea behind `git diff`. It finds the largest set of lines (or words) the two texts share in order, then marks everything else as added or removed. That produces the smallest set of changes that turns the original into the new version.

A few consequences worth knowing:

- **It's exact.** Capitalization, punctuation and spaces all count. A line with a trailing space differs from one without.
- **Moved text shows as removed and added.** Diff tools don't detect moves, so a paragraph moved from the top to the bottom appears twice: deleted in one place, inserted in another.
- **Very large word comparisons have a limit.** If two long documents are too big to compare by words, the tool asks you to switch to line mode or compare smaller sections.

## How to compare two texts step by step

1. Paste the older version into **Original text** and the newer one into **Changed text**.
2. Choose **Lines** or **Words** under **Compare by**.
3. Read the added/removed summary, then scan the highlighted result.
4. Pasted them the wrong way round? Click **⇄ Swap**.

## FAQ

### Can I ignore whitespace or capitalization differences?

There's no option for that; the comparison is exact. Normalize both texts first, for example by lowercasing both or removing extra spaces, then compare.

### Why does a single typo fix show as a whole changed line?

In line mode, the line is the smallest unit. Switch to **Words** to see just the corrected word.

### Can I compare Word or PDF files?

Not directly. Copy the text out of each file and paste it in. Formatting changes such as bold or font size won't be detected, only the text itself.

Next time you get "a few small changes," check them yourself in the [Text Diff](/online-tool/text-tools/text-diff) tool.
