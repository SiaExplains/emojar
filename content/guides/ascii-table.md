---
slug: how-to-read-an-ascii-table-codes-and-control-characters
tool: ascii-table
title: How to Read an ASCII Table, From A = 65 to the Control Codes
description: Why ASCII stops at 127, how decimal, hex, octal and binary columns line up, and what control codes like LF, CR and ESC still do in files and terminals today.
tags: [ASCII, Encoding, Developers, Reference]
---

An ASCII table maps the numbers 0 to 127 to characters. 65 is the capital letter A, 97 is lowercase a, 48 is the digit 0 and 32 is the space. The first 32 codes and code 127 are control characters, not symbols, which is why they show up as abbreviations such as LF or ESC. Each row shows the same number in decimal, hex, octal and binary, so you can read a value in whatever base your tool or language uses.

## Why does ASCII have exactly 128 characters?

ASCII, the American Standard Code for Information Interchange, was first published in 1963 and is maintained today as ANSI X3.4 (the 1986 edition is the one most people mean). The same code was adopted internationally as ISO/IEC 646. It is a 7-bit code, and seven bits give 2⁷ = 128 values, numbered 0 to 127. The eighth bit of a byte was left for parity checks on old links, or for later extensions.

Those extensions are what people call "extended ASCII": Windows-1252, ISO 8859-1 and dozens of other code pages that used 128 to 255 in different ways. None of them is ASCII. Unicode settled the question. Its first 128 code points are exactly ASCII, and UTF-8 stores them as the same single bytes. That is why a plain ASCII file is also a valid UTF-8 file, byte for byte.

## How do the columns relate to each other?

The [ASCII table](/online-tool/developer-tools/ascii-table) has eight columns: Dec, Hex, Oct, Binary, Char, HTML dec, HTML hex and Name. The first four are the same number written in four bases. Binary is always padded to seven digits, octal to three and hex to two.

The layout hides some neat patterns that are easy to see in binary:

- **Digits.** 0 to 9 are codes 48 to 57, hex 30 to 39. The digit's value is the low four bits, so subtracting 48 turns "7" into the number 7.
- **Letters.** A to Z are 65 to 90, and a to z are 97 to 122. Each lowercase letter is exactly 32 higher than its capital, and 32 is a single bit (0100000). Flipping that one bit switches case, which is how many old case-conversion routines worked.
- **Control keys.** Holding Ctrl clears bits so that a letter becomes a control code. Ctrl+M is 77 − 64 = 13, carriage return. That is where caret notation like ^M comes from.

## Worked example: looking up A, then a trap

Type A in the search box. The table shows two rows. Row 65 comes first because it matches the character exactly, and row 97 follows because searching ignores case for the short labels. Row 65 reads:

| Dec | Hex | Oct | Binary  | Char | HTML dec | HTML hex | Name             |
| --- | --- | --- | ------- | ---- | -------- | -------- | ---------------- |
| 65  | 41  | 101 | 1000001 | A    | `&#65;`  | `&#x41;` | Capital letter A |

Click any cell to copy that value. Click the name to open the details, where you also get the hex value as 0x41 and the Unicode code point U+0041.

Now the trap. Type 41 and you get ")", the right parenthesis, not A. A bare number is read as decimal. To search in hex, add a prefix or suffix: 0x41, \x41 or 41h all find A. The same applies to escape: "1b" on its own finds nothing, while 0x1B finds ESC.

## What do the control characters do?

The **Control characters (0–31, 127)** chip shows the 33 non-printing codes. They come from teleprinters, where they moved the paper, rang a bell or managed the line. They are highlighted in the table and show an abbreviation instead of a glyph. In the details, many also have an escape sequence and a caret notation. These are the ones you still meet:

| Code | Abbr | Escape | Caret | Where you see it today                      |
| ---- | ---- | ------ | ----- | ------------------------------------------- |
| 0    | NUL  | `\0`   | `^@`  | Ends strings in C                           |
| 9    | TAB  | `\t`   | `^I`  | Indentation, tab-separated files            |
| 10   | LF   | `\n`   | `^J`  | Line ending on Linux and macOS              |
| 13   | CR   | `\r`   | `^M`  | Windows line endings are CR then LF         |
| 27   | ESC  | `\e`   | `^[`  | Starts terminal color and cursor codes      |
| 127  | DEL  | none   | `^?`  | Sent by the Backspace key in many terminals |

Two practical cases come up often. A script that fails with "bad interpreter" on Linux often has Windows CR LF line endings, so a stray ^M sits at the end of the first line. And if you have ever seen text like `[31m` in a log, that is a terminal color code whose ESC byte was dropped or not shown.

The **Printable (32–126)** chip shows the other 95 codes: the space, digits, letters and punctuation. Code 32, the space, is labeled SP so you can see it in the table.

## How does searching work?

The search box accepts a single character, a decimal number up to three digits, a hex value with a prefix or an "h" suffix, an abbreviation like LF or ESC, or part of a name. Name search finds partial matches, so "tab" returns both TAB and VT (vertical tab), and "escape" returns ESC and DLE (data link escape). If nothing matches, the tool reminds you that ASCII only covers 128 characters. For é, € or emoji, use the [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer). To convert longer numbers between bases, the [number base converter](/online-tool/developer-tools/number-base-converter) is the better fit.

## FAQ

### What is the ASCII code for a space?

32 in decimal, 20 in hex and 0100000 in binary. In a URL, that is why a space can appear as %20.

### Why does the table show DEL at 127 and not with the other controls?

On punched paper tape, 127 is all seven holes punched. Punching every hole erased any character, so 127 became "delete" and sits at the very end of the table.

### Is ASCII still used?

Yes, as the first 128 characters of Unicode and UTF-8. Every UTF-8 file starts from the same codes in this table.

Need a value fast? Open the [ASCII table](/online-tool/developer-tools/ascii-table) and type a character, a number or a name.
