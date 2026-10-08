---
slug: how-to-find-any-unicode-character-code-point-and-bytes
tool: unicode-character-explorer
title: How to Find Any Unicode Character, Its Code Point and Its Bytes
description: Look up a character by name, number or paste, then read its code point, block, category, UTF-8 bytes and escapes. Here is what each value means and when you need it.
tags: [Unicode, Encoding, Text, Reference]
---

To identify a Unicode character, paste it into a lookup tool or search for a word from its official name, then read its code point, the number Unicode assigns to it, such as U+00E9 for "é". That number never changes. The bytes you see in a file, a URL or a hex dump are just one way of storing it, and UTF-8 is the most common. Once you know the code point, every escape you need in HTML, CSS or JavaScript follows from it.

## What is a code point, and why does it matter?

The Unicode Standard gives each character a number in the range 0 to 10FFFF in hexadecimal. It is written as "U+" followed by at least four hex digits. The capital letter A is U+0041, the euro sign is U+20AC, and the grinning face emoji is U+1F600. The number is the stable identity of the character. Fonts can draw it in different ways, and encodings can store it as different bytes, but the code point stays the same.

The standard also gives every assigned character an official name in capital letters, such as LATIN SMALL LETTER E WITH ACUTE or SNOWMAN. Names are frozen once published, so they work well as search terms. The [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer) uses the Unicode 18.0 character database. It lists 353 blocks and shows the count of named characters in a status line once the names finish loading.

## How do you search for a character?

The search box takes several kinds of input:

- **A pasted character or short string.** Paste "é" or "☃" and you get those exact characters. A short run of symbols is treated as a paste, so you can drop in up to eight characters and see each one.
- **A code point.** U+2603, 0x2603 and plain 2603 all find the snowman. HTML references like `&#x2603;` and `&#9731;` work too.
- **Words from the name.** Typing "snowman" returns three characters: SNOWMAN, SNOWMAN WITHOUT SNOW and BLACK SNOWMAN. Every word must appear somewhere in the name, so more words narrow the list. Results stop at 400, and the page tells you when it has cut the list short.
- **A block name.** Type an exact block name such as "Arrows" and the grid shows that block, with a "Browse this block" link.

When the search box is empty, a "Unicode block" dropdown lets you browse any of the 353 blocks. Large blocks are split into pages of 256 characters with Prev and Next buttons.

One tip for name searches: words are matched as fragments, not whole words. "latin small e acute" matches every Latin small letter with an acute accent, from á to ź, because a lone "e" appears in almost every name. Single letters do not narrow a search. When you already know the character, paste it or type its code point instead.

## What do the details mean?

Click any character to open its details. The top half has copy buttons, and the bottom half lists facts.

| Field            | What it tells you                                                                       |
| ---------------- | --------------------------------------------------------------------------------------- |
| Code point       | The U+ number, plus the same value in decimal                                           |
| General category | Letter, mark, number, punctuation, symbol, separator or other, with its two-letter code |
| Block            | The named range it belongs to, such as Latin-1 Supplement                               |
| Plane            | Plane 0 is the Basic Multilingual Plane; emoji mostly live in plane 1                   |
| UTF-8 bytes      | How the character is stored in UTF-8 files and on the web                               |
| UTF-16           | The 16-bit units JavaScript, Java and Windows use internally                            |
| HTML, CSS, JS    | Ready-made escapes you can paste into source code                                       |

The general category is more useful than it looks. A character marked "Nonspacing mark (Mn)", like U+0301 COMBINING ACUTE ACCENT, has no width of its own and attaches to the letter before it. The explorer shows these with a dotted circle (◌) so you can see them. Spaces get a ␣ placeholder, control characters get symbols like ␀, and invisible format characters show as an empty box.

## Worked example: é and 😀 side by side

Search for U+00E9 and open the result. The explorer reports:

- Name: LATIN SMALL LETTER E WITH ACUTE
- Code point: U+00E9 (decimal 233)
- General category: Lowercase letter (Ll)
- Block: Latin-1 Supplement, Basic Multilingual Plane (0)
- UTF-8 bytes: C3 A9 (2 bytes)
- UTF-16: 00E9 (1 code unit)
- HTML decimal `&#233;`, HTML hex `&#xE9;`, JavaScript `é`, CSS `\E9`

Now paste 😀. It is U+1F600 GRINNING FACE in the Emoticons block, in plane 1. Its UTF-8 bytes are F0 9F 98 80, four bytes. Its UTF-16 value is D83D DE00, two code units marked as a surrogate pair. The JavaScript escape changes form to `\u{1F600}`, because the four-digit `\uXXXX` form cannot reach past U+FFFF.

This pair explains a classic bug. In JavaScript, `"😀".length` is 2, not 1, because the length counts UTF-16 units. If a string looks one character long but your code says two, the explorer's UTF-16 line shows why.

## How do UTF-8 and UTF-16 store the same number?

UTF-8, defined in RFC 3629, uses one byte for U+0000 to U+007F, which is exactly ASCII. It uses two bytes up to U+07FF, three bytes up to U+FFFF and four bytes for everything above. That is why "é" takes two bytes and most emoji take four. If you see "Ã©" where "é" should be, the bytes C3 A9 were read as two separate Latin-1 characters. Seeing the UTF-8 line makes that kind of mojibake easy to spot.

UTF-16 uses one 16-bit unit for anything in the Basic Multilingual Plane. Characters above U+FFFF are split into a high surrogate (D800 to DBFF) and a low surrogate (DC00 to DFFF). Surrogate code points are reserved for this job and are never characters on their own. The explorer shows "n/a (surrogate)" for their UTF-8 bytes because UTF-8 cannot encode them.

## Where do the names come from?

Character names come from the official Unicode Character Database. When you open the page, the explorer downloads a compact names file from emojar.com, about 170 KB compressed. Searching then runs in your browser, so the words you type are not sent anywhere. While the file loads you can already browse blocks and paste characters. If it fails to load, a message says so, and code points, blocks and encodings still work. Names for large algorithmic ranges, such as CJK UNIFIED IDEOGRAPH-4E2D or HANGUL SYLLABLE GA, are calculated on the fly rather than stored.

If you need a quick symbol rather than a full lookup, the [special characters](/online-tool/text-tools/special-characters) picker is faster, and the [ASCII table](/online-tool/developer-tools/ascii-table) covers the first 128 code points in more detail.

## FAQ

### Why does a character show as an empty box?

Your device has no font with a glyph for it. This is common for brand-new emoji and rare scripts. The code point, name and bytes shown are still correct.

### Why is a character listed as "Unassigned"?

That code point has no character yet in Unicode 18.0. Unassigned cells in a block grid appear with a dashed border.

### What is the difference between "Name" and "Block"?

The name identifies one character. The block is a range of code points grouped by script or purpose, so many characters share the same block.

Have a mystery character? Paste it into the [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer) to see its name and bytes.
