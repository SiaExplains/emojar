---
slug: find-and-replace-regex-recipes-and-checklist
tool: find-and-replace
title: 'Find and Replace With Regex: 8 Recipes and a Safety Checklist'
description: Copy-ready regex patterns for reformatting dates, phone numbers, spaces and line breaks, plus a checklist to avoid replacing more than you meant to.
tags: [Regex, Text Editing, Checklist]
---

Find and replace with regular expressions lets you change patterns, not just exact words: every date, every phone number, every run of extra spaces, in one pass. Turn on regex mode, describe the pattern in the Find box, and use `$1`, `$2` in the replacement to reuse the parts you captured. The recipes below cover the jobs people do most often, and the checklist at the end keeps you from replacing more than you intended.

## How the options work

The [Find and Replace](/online-tool/text-tools/find-and-replace) tool has a **Text** box, **Find** and **Replace with** fields, and three checkboxes:

- **Case sensitive**: off by default, so "cat" also matches "Cat" and "CAT".
- **Whole words only**: "cat" no longer matches inside "category".
- **Regular expression**: treats Find as a pattern and enables `$1`-style references in the replacement.

The **Result** updates as you type, with a count such as "3 replacements made". Leave **Replace with** empty to delete every match. If your pattern has a syntax error, you'll see a message asking you to check brackets and escape characters.

## Eight regex recipes

Turn on **Regular expression** for all of these.

| Task                    | Find                                  | Replace with     | Before → After                              |
| ----------------------- | ------------------------------------- | ---------------- | ------------------------------------------- |
| Collapse double spaces  | `  +` (two spaces, then +)            | a single space   | `one   two` → `one two`                     |
| Join lines with commas  | `\n`                                  | `, `             | three lines → `one, two, three`             |
| Reformat ISO dates (US) | `(\d{4})-(\d{2})-(\d{2})`             | `$2/$3/$1`       | `2024-03-15` → `03/15/2024`                 |
| Dates with named groups | `(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})` | `$<d>.$<m>.$<y>` | `2024-03-15` → `15.03.2024`                 |
| Format phone numbers    | `(\d{3})[-.](\d{3})[-.](\d{4})`       | `($1) $2-$3`     | `555.987.6543` → `(555) 987-6543`           |
| Flip "Last, First"      | `(\w+), (\w+)`                        | `$2 $1`          | `Smith, John` → `John Smith`                |
| Strip HTML tags         | `<[^>]+>`                             | (empty)          | `<p>Hello <b>world</b></p>` → `Hello world` |

To remove trailing spaces and tabs from every line, find `[ \t]+(\n|$)` and replace with `$1`. The captured line break is put back, so lines stay separate. Two more handy patterns: `colou?r` matches both "color" and "colour", and `\d+` matches any whole number.

A caution on the HTML recipe: it's fine for cleaning up a snippet, but don't rely on regex to sanitize HTML from untrusted sources.

## Gotchas that catch people out

**`^` and `$` mean the whole text, not each line.** In this tool, `^` matches only the very start of everything you pasted and `$` only the very end. A pattern like `^(\w+), (\w+)$` will find nothing in a multi-line list. Drop the anchors, as in the "Last, First" recipe, or match the line break explicitly with `\n`.

**The dot doesn't cross lines.** `.` matches any character except a line break, so `<p>.*</p>` won't match a paragraph that spans two lines.

**Special characters need escaping in regex mode.** A literal `.`, `$`, `(`, `?` or `+` must be written as `\.`, `\$`, `\(` and so on. Searching for `.` in regex mode matches every character: "a.b.c" becomes "-----" instead of "a-b-c". If you don't need patterns, leave regex off and everything is literal.

**`$` in the replacement.** With regex on, `$` starts a reference, so write `$$` to insert a literal dollar sign: `$$10` gives "$10". With regex off, the replacement is inserted exactly as typed.

**Whole words and accented letters.** Whole-word matching uses basic word boundaries that only recognize unaccented Latin letters, digits and underscores. A search for "résumé" with **Whole words only** checked finds nothing, because the final "é" isn't seen as part of a word. Uncheck the option for words that start or end with accented or non-Latin letters.

## A pre-flight checklist

1. **Check the count first.** Before copying the result, does "N replacements made" match what you expected? Twice as many usually means a partial match.
2. **Turn on Whole words only** for short words. Replacing "cat" without it turns "category" into "dogegory".
3. **Decide on case.** Case-insensitive is the default; turn on **Case sensitive** when "Will" the name and "will" the verb should be treated differently.
4. **Test on a sample.** Paste five representative lines before running a pattern across a whole document.
5. **Compare before and after.** Paste both into [Text Diff](/online-tool/text-tools/text-diff) to review every change.
6. **Keep the original.** The tool doesn't keep history, so copy your source somewhere safe first.

Your text is processed in your browser, so it's fine to use on internal documents and data exports.

## How to run a find and replace

1. Paste your text into **Text**.
2. Type the search into **Find** and the new text into **Replace with**.
3. Set **Case sensitive**, **Whole words only** and **Regular expression** as needed.
4. Check the replacement count, then **Copy** or **Download** the result.

To build and debug a tricky pattern with live match highlighting first, try the [Regex Tester](/online-tool/developer-tools/regex-tester).

## FAQ

### Can I replace with a line break?

Not by typing one. The Replace field is a single line, and `\n` in the replacement is inserted as literal text. You can reuse captured line breaks with `$1`, as in the trailing-spaces recipe.

### Can I do several replacements at once?

One pattern runs at a time. For several unrelated replacements, copy the result back into **Text** and run the next one, or combine alternatives in one regex like `colou?r|gr[ae]y` when they share the same replacement.

### Does it support lookaheads and named groups?

Yes. It uses JavaScript's regex engine, which supports lookaheads, lookbehinds, named groups (`(?<name>...)` with `$<name>`) and Unicode property escapes like `\p{L}`.

Try a recipe on your own text in [Find and Replace](/online-tool/text-tools/find-and-replace).
