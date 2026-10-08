---
slug: how-braille-works-letters-numbers-and-capital-signs
tool: braille-translator
title: How Braille Works, From Dot Numbers to Capital and Number Signs
description: How the six-dot braille cell encodes letters, numbers and punctuation, what the capital and number signs do, and why most real braille is contracted.
tags: [Braille, Accessibility, Writing Systems, Unicode]
---

Braille writes each character as a pattern of raised dots in a cell of six positions, arranged as two columns of three. Letters, digits and punctuation all share those 63 possible patterns, so a few special cells, such as the capital sign and the number sign, change how the cells after them are read. Uncontracted braille, often called Grade 1, spells out every letter. Most braille that blind readers use day to day is contracted, so a letter-by-letter translation is a learning tool, not a finished transcription.

## How is a braille cell numbered?

The dot positions are always numbered the same way. The left column, top to bottom, is dots 1, 2 and 3. The right column, top to bottom, is dots 4, 5 and 6. A letter is described by listing its raised dots, so "h" is dots 1-2-5 and "w" is dots 2-4-5-6. With six positions there are 2^6 = 64 combinations, and one of them is the blank cell used as a space.

Louis Braille, a French student who was blind from childhood, published his system in 1829. It was built around a neat pattern that is still visible in the [braille translator](/online-tool/text-tools/braille-translator) chart:

- **a to j** use only the top four dots (1, 2, 4 and 5).
- **k to t** are the same ten shapes with dot 3 added.
- **u, v, x, y and z** add dots 3 and 6 to the first five shapes.
- **w** breaks the pattern because French did not use it, so it was added later with dots 2-4-5-6.

Unicode includes every pattern in the Braille Patterns block, U+2800 to U+28FF. That block has 256 characters because it also covers eight-dot braille, which adds dots 7 and 8 at the bottom. The tool uses only the six-dot cells.

## What do the capital, number and letter signs do?

Braille has no separate shapes for capital letters or digits. Instead, an indicator cell comes first:

- **Capital sign, dot 6 (⠠).** The next letter is uppercase.
- **Number sign, dots 3-4-5-6 (⠼).** The following a to j cells mean the digits 1 to 9 and 0. So ⠼⠁ is "1" and ⠼⠚ is "0". Number mode continues until a space or another symbol ends it.
- **Letter sign, dots 5-6 (⠰).** Placed after a number, it says the next a to j cell is a letter again, not a digit.

Inside a number, the translator writes a period as ⠲ and a comma as ⠂ without leaving number mode, so "3.5" becomes ⠼⠉⠲⠑. Its punctuation cells, including ⠦ and ⠴ for opening and closing double quotes and two-cell symbols for parentheses and the slash, follow the forms used in Unified English Braille (UEB).

## A worked example: "Hello, World! 2026"

The translator opens with the sample text `Hello, World! 2026`. Its braille output is:

⠠⠓⠑⠇⠇⠕⠂⠀⠠⠺⠕⠗⠇⠙⠖⠀⠼⠃⠚⠃⠋

Reading it cell by cell:

1. ⠠ (dot 6) is the capital sign, then ⠓⠑⠇⠇⠕ spells h-e-l-l-o.
2. ⠂ (dot 2) is the comma, and ⠀ is a blank cell for the space.
3. ⠠⠺⠕⠗⠇⠙ is a capital sign followed by w-o-r-l-d, and ⠖ (dots 2-3-5) is the exclamation mark.
4. After another space, ⠼ starts a number, and ⠃⠚⠃⠋ are b-j-b-f, which read as 2-0-2-6.

That is 21 cells for 18 characters. The extra cells are the two capital signs and the number sign. Now try `Room 4b`. The output is ⠠⠗⠕⠕⠍⠀⠼⠙⠰⠃. Without the letter sign ⠰, a reader would take ⠃ as the digit 2 and see "Room 42".

## How do I use the translator?

Type or paste into the input box. The **Direction** menu is set to **Detect automatically**, which switches to braille-to-text as soon as the input contains any braille cell. You can force **Text → Braille** or **Braille → Text** instead. **⇄ Swap** moves the output into the input and flips the direction, which is a quick way to check a round trip. **Copy output** copies the result and **Clear** empties the box.

Below the converter, the **Braille alphabet** chart draws every cell as six dots, so you can read the pattern even if your font renders Unicode braille poorly. It also covers numbers (shown with the number sign in front), punctuation and the three signs. Clicking a letter in the chart adds it to your text, or, in braille mode, replaces the input with that cell.

## What are the limits of a Grade 1 translator?

These limits matter if anyone will actually read the result by touch.

- **No contractions.** English braille in the United States, the United Kingdom and most other English-speaking countries now uses Unified English Braille, which the Braille Authority of North America adopted for the US in 2016. Its contracted form (Grade 2) uses about 180 contractions, such as single cells for "and", "the" and "ing". Experienced readers expect them, and uncontracted text is longer and slower to read.
- **Capitals one letter at a time.** When translating text to braille, each capital gets its own sign, so "NASA" becomes ⠠⠝⠠⠁⠠⠎⠠⠁. UEB writes a whole capitalized word with a double capital sign, ⠠⠠⠝⠁⠎⠁. When reading braille back into text, the tool does understand the double sign.
- **Limited character set.** Only a to z, digits, spaces, line breaks and the listed punctuation are converted. Anything else, such as accented letters like "é", is kept as it is, and a line under the buttons lists those characters as "Kept as-is (not in the Grade 1 table)".
- **Some cells have two meanings.** In UEB the opening double quote and the question mark are the same cell, ⠦. When decoding, the tool always reads ⠦ as "?", so check quotes by context.
- **No formatting rules.** Real transcription also handles line length, page numbers, headings, typeforms such as bold and italics, and, in the US, Nemeth Code for math. None of that is done here.
- **Print is flat.** Unicode braille on screen or on paper cannot be felt. Tactile braille needs an embosser, and refreshable braille displays normally get their braille from a screen reader translating ordinary text.

For anything a blind reader will rely on, such as signs, menus or documents, use a certified transcriber or a braille transcription service.

## FAQ

### Is braille a language?

No. Braille is a writing system, a way of encoding written text. Many languages have their own braille codes, and English braille alone has the contracted and uncontracted forms described above.

### Why does a screen reader read my braille text strangely?

Screen readers often announce Unicode braille characters by their dot numbers rather than as words. For accessible content, publish normal text and let the reader's own software produce braille.

### Is my text sent anywhere?

No. The translation runs entirely in your browser.

If you like encoding systems, the [Morse code converter](/online-tool/text-tools/morse-code-converter) and the [Unicode character explorer](/online-tool/reference-tools/unicode-character-explorer) make good next stops. Otherwise, open the [braille translator](/online-tool/text-tools/braille-translator) and spell your name in dots.
