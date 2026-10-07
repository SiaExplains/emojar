---
slug: hard-vs-soft-line-breaks-how-to-join-broken-lines
tool: remove-line-breaks
title: 'Hard vs Soft Line Breaks: How Broken Lines Get Joined Back'
description: Why text copied from PDFs and emails arrives chopped into short lines, and how line-break removal rebuilds paragraphs, fixes split words and keeps gaps.
tags: [Text, PDF, How it works]
---

Text copied from a PDF or a plain-text email often has a real line break at the end of every visual line, so it pastes as a ragged column of half-sentences. The fix is to replace those breaks with spaces, keep the blank lines between paragraphs, and glue back words hyphenated at a line end. Knowing how a line-break remover makes those decisions helps you pick the right setting first time.

## What is the difference between a hard and a soft line break?

A **soft** line break is one your screen invents. A word processor or browser wraps a paragraph to fit the window, and if you make the window wider, the lines reflow. Nothing is stored in the text itself.

A **hard** line break is an actual character in the text: a line feed (LF, used by macOS, Linux and the web), a carriage return plus line feed (CRLF, the Windows convention), or, more rarely, the Unicode line and paragraph separators U+2028 and U+2029. Hard breaks stay put no matter how wide the window is.

The trouble starts when a document turns soft breaks into hard ones:

- **PDFs** store text as positioned lines on a page, not as flowing paragraphs. When you copy, the viewer has to guess, and most simply emit a hard break after every line.
- **Plain-text email** has a long tradition of wrapping at around 72–78 characters with real breaks, so quoted replies arrive pre-chopped.

## How does the tool decide which breaks to remove?

The [Remove Line Breaks tool](/online-tool/text-tools/remove-line-breaks) first normalizes every kind of break (CRLF, a lone CR, LF, U+2028, U+2029) to a single line feed, so Windows and Mac text behave the same. Then it applies the mode you choose in the **Line breaks** menu:

| Mode                     | What happens                                                                                                       | Best for                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Remove, keep paragraphs  | A blank line marks a paragraph boundary and is kept as one empty line; breaks inside each paragraph become a space | Articles, reports, anything with paragraphs                                    |
| Replace all with a space | Every break, including blank lines, becomes a single space                                                         | Squeezing text into one field, like a meta description                         |
| Remove all (no space)    | Breaks are deleted with nothing in their place                                                                     | Text that was split mid-string, such as a long code or ID wrapped across lines |

In "keep paragraphs" mode, several blank lines in a row (even ones containing only spaces) count as one boundary and collapse to a single empty line. Spaces or tabs around a removed break are absorbed.

## What do the two checkboxes do?

**Collapse repeated spaces** replaces any run of two or more spaces or tabs with a single space. PDFs justified to both margins often copy with extra spaces between words, and this cleans them up. It is on by default.

**Join words hyphenated across lines** handles the classic PDF artifact where "information" was set as "infor-" at the end of one line and "mation" at the start of the next. The tool removes the hyphen and the break only when the character before the hyphen is a letter and the next line starts with a **lowercase** letter. If the next line starts with a capital or a digit, the hyphen stays (a space is still added where the break was), so you can spot it and decide.

## A worked example

Here is a typical paste from a PDF report:

```text
The quarterly report shows that infor-
mation requests rose by 12%
in the third quarter.

Captain Jean-
Luc Picard signed off on
the budget.
```

With the defaults (keep paragraphs, collapse spaces, join hyphens) the result is:

```text
The quarterly report shows that information requests rose by 12% in the third quarter.

Captain Jean-Luc Picard signed off on the budget.
```

"infor-mation" lost its hyphen because "mation" starts lowercase, which is the typical sign of a word broken only for line wrapping. "Jean-Luc" kept its hyphen because "Luc" is capitalized, so the tool treats it as a real hyphenated name and joins the two halves without a space. The same happens before a digit, so "pre-" followed by "2020" becomes "pre-2020". **Remove all (no space)** would also glue "12%" to "in" and "on" to "the", so that mode is meant for a single token wrapped across lines.

## Where does automatic joining go wrong?

- **Real compound words.** A genuinely hyphenated word that happens to fall at a line end, such as "well-" + "known", becomes "wellknown" when the hyphen option is on. Scan the output for these, or turn the option off for text full of compounds.
- **Lists and addresses.** "Remove, keep paragraphs" treats a list without blank lines as one paragraph, so "- item one" and "- item two" merge into a single line. Addresses and poems behave the same way, so add a blank line between items you want kept apart.
- **Blank lines you actually wanted gone.** If your problem is too many empty lines rather than broken sentences, use [Remove Empty Lines](/online-tool/text-tools/remove-empty-lines) instead; it deletes blank lines but leaves every other break alone.

## Step by step

1. Copy the text from the PDF, email or page and paste it into **Text with line breaks** (or click **Load sample** to try it first).
2. Pick a mode under **Line breaks**. Start with **Remove, keep paragraphs** for anything longer than a sentence or two.
3. Leave **Collapse repeated spaces** and **Join words hyphenated across lines** on unless your text has many hyphenated compounds.
4. The cleaned version appears in **Text without line breaks** as you type. Read it once for stray hyphens, then use **Copy** or **Download**.

Everything runs in your browser, so a contract or an internal report you paste is never uploaded anywhere. If you are starting from a PDF file rather than copied text, extract it first with [PDF to Text](/online-tool/pdf-tools/pdf-to-text), then clean the line breaks here.

## FAQ

### Why does my text still have a hyphen and a space in the middle of a word?

The line after the hyphen started with a capital letter or a number, so the tool assumed it might be a name or a real hyphenated term and kept the hyphen. Delete the hyphen and space by hand, or check the original to see which spelling is correct.

### Can I turn a whole document into a single line?

Yes. Choose **Replace all with a space**. Paragraph gaps are removed too, and the result is trimmed of leading and trailing spaces, which suits single-line fields like titles, form inputs or spreadsheet cells.

Ready to fix a messy paste? Open the [Remove Line Breaks tool](/online-tool/text-tools/remove-line-breaks) and paste your text.
