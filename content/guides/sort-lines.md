---
slug: alphabetical-vs-natural-sort-order-explained
tool: sort-lines
title: Why "Item 10" Sorts Before "Item 2" (Natural Sort Explained)
description: Alphabetical, ASCII and natural sort order give different results for the same list. Here's how each works and which one to choose for your data.
tags: [Lists, Sorting, Explainer]
---

"Item 10" lands before "Item 2" because an alphabetical sort compares text one character at a time, and the character "1" comes before "2", regardless of what follows. Natural sort fixes this by reading runs of digits as whole numbers, so 2 comes before 10. Which order is "right" depends on your data, and knowing how each method works saves a lot of manual reshuffling.

## How does alphabetical sorting actually work?

An alphabetical sort walks along two lines side by side and stops at the first character that differs. For "item 10" and "item 2", the first five characters match ("item "), then it compares "1" with "2". Since "1" is smaller, "item 10" wins, and the rest of the line is never looked at.

That's why numbered files so often come out scrambled:

| Alphabetical (A → Z) | Natural    |
| -------------------- | ---------- |
| Chapter 1            | Chapter 1  |
| Chapter 10           | Chapter 9  |
| Chapter 9            | Chapter 10 |

## What is natural sort order?

Natural sort compares digit sequences by their numeric value. "9" is less than "10", so "Chapter 9" comes first, the way a person would order it. It also works for several numbers in one line, which makes it ideal for version numbers:

- v1.2.0
- v1.9.3
- v1.10.0

An alphabetical sort would put v1.10.0 first, because after "v1." it compares "1" with "2" and "9" and stops there.

Natural sort doesn't understand decimals or negative numbers as math, though. It treats "1.5" as the number 1, a dot, and the number 5. For a column of real numbers, use a spreadsheet.

## Alphabetical isn't the same as ASCII order

Many programming languages sort by character code by default. In that system, every uppercase letter comes before every lowercase one, so `["Zebra", "apple", "banana"]` sorts as Zebra, apple, banana.

The [Sort Lines](/online-tool/text-tools/sort-lines) tool uses locale-aware sorting instead, the kind a dictionary uses:

- Capitals and lowercase letters are interleaved: apple, banana, Zebra.
- Accented letters sort next to their base letter: Anna, Émile, Eva.
- The exact rules follow your browser's language, so a Swedish or German setup can order letters like Å and Ä differently than an English one.

## What does the "Case sensitive" option change?

Less than you might think. It doesn't reintroduce ASCII order. It only decides what happens when two lines differ by nothing but capitalization:

- **Off** (default): "Apple", "apple" and "APPLE" are treated as equal and keep their original order relative to each other.
- **On**: they're ordered consistently by case, usually lowercase first (apple, Apple, APPLE).

## Every sort order, compared

Here's what each **Order** option does with the tool's sample list (`item 10`, `banana`, `item 2`, `Apple`, `cherry`, `item 1`):

| Order                           | Result                                         |
| ------------------------------- | ---------------------------------------------- |
| A → Z                           | Apple, banana, cherry, item 1, item 10, item 2 |
| Z → A                           | item 2, item 10, item 1, cherry, banana, Apple |
| Natural (item 2 before item 10) | Apple, banana, cherry, item 1, item 2, item 10 |
| Shortest first                  | Apple, banana, item 2, cherry, item 1, item 10 |
| Longest first                   | item 10, banana, item 2, cherry, item 1, Apple |
| Reverse current order           | item 1, cherry, Apple, item 2, banana, item 10 |
| Shuffle randomly                | A different random order every time            |

Two things worth noticing: **Reverse current order** flips your list as it is, which is not the same as Z → A. And lines of equal length keep their original relative order when sorting by length.

**Shuffle randomly** uses the Fisher–Yates algorithm, which gives every possible order an equal chance. It's handy for randomizing a presentation order, a seating chart or quiz questions.

## How to sort lines step by step

1. Paste your list into **Lines to sort**, one item per line.
2. Pick an **Order** from the dropdown.
3. Tick **Case sensitive** only if you need capitalization variants grouped consistently.
4. Copy or download the **Sorted lines**. The result updates instantly when you change any option.

The sorting runs in your browser; your list isn't sent anywhere.

## Clean before you sort

Sorting exposes messy data. Blank lines all collect at the top, and near-duplicates end up side by side. Run the list through [Remove Empty Lines](/online-tool/text-tools/remove-empty-lines) and [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines) first for a tidy result.

## FAQ

### Why do lines starting with a space or symbol come first?

Spaces, punctuation and digits sort before letters. A line like " banana" with a leading space or "#tag" will appear above the "A" lines. Trim leading spaces before sorting.

### Can I sort by the second word or a column?

No. Lines are compared from the first character. To sort by surname in "First Last" format, swap the names first, for example with a regex in Find and Replace, then sort.

### Is natural sort the same as Windows File Explorer's order?

It's very close for typical names like "Photo 2" and "Photo 10". Edge cases involving symbols and leading zeros can differ slightly.

Put your next list in order with [Sort Lines](/online-tool/text-tools/sort-lines).
