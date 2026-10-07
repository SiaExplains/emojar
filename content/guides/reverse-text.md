---
slug: how-to-reverse-text-without-breaking-emoji
tool: reverse-text
title: Why Reversing Text Breaks Emoji (and How to Do It Properly)
description: Reversing a string looks trivial until a flag or family emoji falls apart. How grapheme clusters work, what each reverse mode does, and where reversing helps.
tags: [Text, Unicode, How it works]
---

Reversing text means more than flipping the order of the bytes. Many things you see as one character, such as a family emoji, a flag or an accented letter, are actually built from several code points. Reverse those pieces one by one and they come apart. A proper reverse treats each visible character (a "grapheme cluster") as one unit, which is how the Reverse Text tool works.

Here's what goes wrong with the naive approach, how the tool's four modes behave, and a few practical uses.

## What exactly is a "character"?

Computers store text as a sequence of Unicode code points, and JavaScript strings go one level lower, into 16-bit code units. What a person calls one character can be any of these:

- **One code point**: "a", or a precomposed "é" (U+00E9).
- **A letter plus a combining mark**: "e" followed by U+0301 combining acute accent. It looks identical to the precomposed é.
- **A surrogate pair**: most emoji, such as 🍰, take two 16-bit code units.
- **A whole sequence**: 👨‍👩‍👧 is three emoji glued together with invisible zero-width joiners. A flag like 🇯🇵 is two regional indicator letters, J and P.

The rules for what counts as one user-perceived character are set out in [Unicode Standard Annex #29](https://www.unicode.org/reports/tr29/), which defines grapheme cluster boundaries. Browsers implement those rules through `Intl.Segmenter`, and the tool uses it to split your text before reversing.

## What happens if you reverse code units instead?

Take "café 👨‍👩‍👧" with the accent typed as a separate combining mark. A quick one-line reverse that splits the string into code units produces garbage: the emoji halves turn into � replacement symbols and the accent detaches from its e. Even reversing by code points (a slightly better approach) still goes wrong:

| Input         | Naive reverse (by code point) | Grapheme-aware reverse |
| ------------- | ----------------------------- | ---------------------- |
| 👩‍💻 café 🇯🇵 | 🇵🇯 éfac 💻‍👩                 | 🇯🇵 éfac 👩‍💻          |
| café 👨‍👩‍👧  | broken symbols, loose accent  | 👨‍👩‍👧 éfac            |

Two failures stand out in the naive column. The technologist emoji splits into a laptop and a woman, because the joiner now sits in the wrong place. The Japanese flag becomes the letters P and J, which isn't a valid flag at all, so most devices show two boxed letters. With grapheme clusters, both stay whole.

## What do the four reverse modes do?

The tool's **Reverse** menu has four options. Here's each one on the built-in sample, which has two lines: "Never odd or even." and "Stressed? Have some desserts 🍰".

**Every character (backwards text)** reverses the whole input, including the line order:

```
🍰 stressed emos evaH ?dessertS
.neve ro ddo reveN
```

**Word order in each line** keeps each word intact but reverses their order, line by line. Punctuation stays attached to its word, so "even." moves as one piece:

```
even. or odd Never
🍰 desserts some Have Stressed?
```

**Letters in each word** spells every word backwards but keeps the words where they are. Note that punctuation counts as part of a word, so "Hello, world!" becomes ",olleH !dlrow":

```
reveN ddo ro .neve
?dessertS evaH emos stressed 🍰
```

**Line order** leaves every line untouched and flips their order, last line first:

```
Stressed? Have some desserts 🍰
Never odd or even.
```

Word-order mode also preserves spacing. Leading and trailing spaces stay where they were, and the gaps between words stay in their original positions, so (with dots standing in for spaces) "··one···two·three··" becomes "··three···two·one··" rather than collapsing to single spaces.

## Where is reversing text actually useful?

- **Flipping a list or log.** Many exports put the newest entry first. **Line order** turns a chat history or changelog into oldest-first in one step. For alphabetical or numeric ordering, use [Sort Lines](/online-tool/text-tools/sort-lines) instead.
- **Checking palindromes.** Reverse a phrase with **Every character** and compare. "Never odd or even" reads the same once you ignore spaces, capitals and the period.
- **Word puzzles and kids' games.** **Letters in each word** makes a simple secret code that's easy to decode by hand.
- **Testing your own software.** Grapheme-aware reversing is a quick way to see whether another app handles emoji and combining marks properly: reverse a tricky string here, then compare it with your app's output.

## How do you reverse text step by step?

1. Open [Reverse Text](/online-tool/text-tools/reverse-text) and paste your text into **Your text**, or click **Load sample**.
2. Choose a mode from the **Reverse** menu. The **Reversed text** box updates as you type.
3. Click **Copy**, or download the result as a .txt file.

The text is processed in your browser and never uploaded, so it's fine to paste a private log or chat export.

## FAQ

### Why does my reversed Arabic or Hebrew text look wrong?

Right-to-left scripts are stored in reading order and displayed right to left by the browser. Reversing the stored order, and then letting the browser lay it out again, often gives an unreadable result. Reversing is mainly meaningful for left-to-right text.

### Is backwards text the same as mirror text?

No. Backwards text keeps normal letters and only changes the order. Mirror text also swaps each letter for a mirrored look-alike, such as ɘ for e. For that effect, use the [Mirror Text Generator](/online-tool/text-tools/upside-down-text/mirror-text).

### Do Windows line endings cause problems?

No. Windows-style line breaks (CR LF) are converted to plain line breaks before reversing, so line order mode doesn't leave stray characters at the ends of lines.

Paste in something with emoji and see it stay intact with [Reverse Text](/online-tool/text-tools/reverse-text).
