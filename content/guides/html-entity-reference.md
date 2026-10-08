---
slug: how-to-find-the-right-html-entity-for-any-symbol
tool: html-entity-reference
title: How to Find the Right HTML Entity for a Symbol (and When It Exists)
description: The HTML standard names about 1,500 characters, often several times over. Learn how to search the list, read aliases and case, and what to do when no name exists.
tags: [HTML, Web Development, Reference]
---

To find the HTML entity for a symbol, search a full entity list by the symbol itself, by a guess at its name or by its Unicode code point, then copy the named form, such as `&rarr;` for →. Not every character has a name. The HTML standard names roughly 1,500 characters, so for anything else, like the Indian rupee sign ₹, you write a numeric reference instead. Entity names are case-sensitive, and a lot of characters have more than one.

## Where do HTML entity names come from?

The list of named character references is fixed by the WHATWG HTML Living Standard. It holds 2,231 entries. That count includes about a hundred legacy spellings without the closing semicolon, such as `&copy` for `&copy;`, kept so old pages still render. Without those, 2,125 distinct names remain. They point to 1,511 different characters or character pairs, which is why so many characters have aliases.

The names have a mixed history. The short, lowercase ones like `&eacute;`, `&nbsp;` and `&deg;` date from HTML 2 through HTML 4, which borrowed them from older SGML entity sets. The long CamelCase names like `&RightArrow;` and `&NotEqual;` came from MathML and were folded into HTML5. Both groups work the same way in every modern browser.

The [HTML Entity Reference](/online-tool/developer-tools/html-entity-reference) groups the full set by character. Each tile shows one character with one name, and the details list the rest.

## How do you search the list?

The search box accepts four kinds of input:

- **A name or part of one.** "copy" finds © and ℗ (`&copysr;`). The search ignores case, and a leading `&` or trailing `;` is fine.
- **The character itself.** Paste "€" and you get `&euro;`.
- **A code point.** Type U+00A9 or 0xA9 to find ©.
- **A numeric reference.** Type `&#169;` and the tool shows which name, if any, belongs to it.

Below the search box, category chips filter the list: All, Symbols, Currency, Arrows, Mathematical, Punctuation, Latin, Greek and Cyrillic. Mathematical is by far the largest group, with 747 characters, since MathML brought so many names. Currency is the smallest, with only six: $, ¢, £, ¤, ¥ and €.

The grid shows up to 600 entities at once. If more match, a note asks you to search or pick a category.

## Worked example: why "rarr" returns 34 results

Type rarr. The counter shows 34 entities, because the search matches any name containing those letters: `&nrarr;`, `&rarrhk;`, `&rarrtl;` and so on. Exact name matches move to the top, and there are three of them:

| Entity   | Character | Meaning                     |
| -------- | --------- | --------------------------- |
| `&rarr;` | →         | Rightwards arrow            |
| `&Rarr;` | ↠         | Rightwards two-headed arrow |
| `&rArr;` | ⇒         | Rightwards double arrow     |

This is the most important rule in the whole list: **entity names are case-sensitive**. The search treats rarr and Rarr as the same, but the browser does not. Writing `&Rarr;` when you meant an ordinary arrow gives you a two-headed one. The same goes for `&dagger;` (†) and `&Dagger;` (‡), or `&phi;` (φ) and `&Phi;` (Φ).

Click → to open its details. You get copy buttons for the character, the named entity `&rarr;`, decimal `&#8594;`, hexadecimal `&#x2192;`, Unicode U+2192 and the CSS escape `\2192`. Under them, an "Also written as" line lists four aliases: `&srarr;`, `&RightArrow;`, `&rightarrow;` and `&ShortRightArrow;`. All five names produce the same character, so pick the short one.

## Why do some characters have uppercase names too?

Some characters have an all-caps alias, such as `&COPY;`, `&AMP;`, `&LT;` and `&QUOT;`, kept for compatibility with older documents. Entity names are case-sensitive, so `&Copy;` would not work, but both the all-lowercase and the all-caps spellings in the list are valid. The tool shows the familiar lowercase form on each tile and lists the capitalized aliases under "Also written as".

## Which entities do you actually need?

In a page saved as UTF-8, you can type almost any character directly. A short list of entities still earns its place:

- **Markup characters.** `&lt;` and `&amp;` in text, and `&quot;` inside attribute values. These stop the browser from reading your text as code.
- **Invisible characters.** A non-breaking space (`&nbsp;`), a thin space (`&thinsp;`), a soft hyphen (`&shy;`) or the zero-width joiner (`&zwj;`) all look like nothing in your editor. A named entity makes them visible to the next person who reads the source. The tool shows a ⎵ placeholder for these on the tiles.
- **Characters that are hard to type.** An em dash (`&mdash;`), curly quotes (`&ldquo;` and `&rdquo;`) or a check mark (`&check;`) are easier to remember than their code points.

If you are escaping a whole snippet rather than looking up one symbol, the [HTML Entity Encoder](/online-tool/developer-tools/html-entity-encoder) converts all of it at once.

## What if a symbol has no named entity?

Search for ₹ and the grid comes up empty, with a note that the character can still be written as a numeric reference. Numeric references work for every Unicode character, named or not. Look the character up in the [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer) to get its decimal and hex forms, in this case `&#8377;` and `&#x20B9;`.

A few named entities map to two code points instead of one. Examples are `&nvlt;`, which is < plus a combining long vertical line overlay, and `&fjlig;`, which is just the letters "fj". The tool shows both code points in the Unicode, decimal and hex fields.

## FAQ

### Are HTML entity names case-sensitive?

Yes. `&rarr;`, `&Rarr;` and `&rArr;` are three different arrows. Copy the name exactly as the tool shows it.

### Why does one character have five names?

HTML5 merged the older HTML names with the MathML names, and nothing was removed. Any of them works, so pick the shortest.

### Do I need an entity for the euro sign?

Not in a UTF-8 page, where you can type € directly. `&euro;` is handy when your keyboard or editor makes the symbol awkward.

Need a symbol for your markup? Search the [HTML Entity Reference](/online-tool/developer-tools/html-entity-reference) and copy the exact name.
