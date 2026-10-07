---
slug: how-morse-code-works-dots-dashes-and-timing
tool: morse-code-converter
title: 'How Morse Code Works: Dots, Dashes, Spacing and Timing'
description: Why E is one dot and Q is four symbols, how the 1-3-7 timing rule works, and how to write and decode Morse correctly as text, with worked examples.
tags: [Morse Code, Explainer, Communication]
---

Morse code represents each letter, digit and punctuation mark as a short sequence of two signals: a short "dot" (dit) and a long "dash" (dah). What makes it readable is timing: a dash lasts three times as long as a dot, letters are separated by a gap of three dot-lengths, and words by seven. In written form, those gaps become a space between letters and a slash between words.

Here's how the system fits together, and how to read and write it as text.

## Why are some letters shorter than others?

Morse code was designed for speed. The most common letters in English got the shortest codes, so operators could send messages faster:

| Letter | Code    | Length    |
| ------ | ------- | --------- |
| E      | `.`     | 1 symbol  |
| T      | `-`     | 1 symbol  |
| A      | `.-`    | 2 symbols |
| S      | `...`   | 3 symbols |
| Q      | `--.-`  | 4 symbols |
| 0      | `-----` | 5 symbols |

E and T, the two most frequent letters, are a single signal each. Rare letters like Q, Y and Z get four. Digits are all five symbols long and follow a neat pattern: 1 is `.----`, 2 is `..---`, and so on up to 5 (`.....`), after which dashes take over again.

## The 1-3-7 timing rule

Everything in Morse is measured in "units", where one unit is the length of a dot:

- **Dot:** 1 unit
- **Dash:** 3 units
- **Gap between the dots and dashes inside one letter:** 1 unit
- **Gap between letters:** 3 units
- **Gap between words:** 7 units

These ratios are set out in the international standard for Morse ([ITU-R M.1677](https://www.itu.int/rec/R-REC-M.1677)). Get the spacing wrong and the message becomes ambiguous: `.. -` with a letter gap is "IT", but run together as `..-` it's "U".

## A worked timing example

How long does "SOS" take to send at 20 words per minute?

1. S = `...` → 3 dots + 2 inner gaps = **5 units**.
2. O = `---` → 3 dashes (9 units) + 2 inner gaps = **11 units**.
3. S again = **5 units**.
4. Two letter gaps between them = 2 × 3 = **6 units**.

Total: 5 + 11 + 5 + 6 = **27 units**. Operators use the formula _unit length in milliseconds = 1200 ÷ words per minute_, so at 20 WPM one unit is 60 ms, and "SOS" takes 27 × 60 = 1.62 seconds.

In real distress calls, SOS is actually sent as one continuous sequence, `...---...`, without letter gaps. It was chosen because the pattern is unmistakable, not because the letters stand for anything.

## How Morse is written as text

On paper and on screen, the timing becomes punctuation. The [Morse Code Converter](/online-tool/text-tools/morse-code-converter) uses the most common convention:

- **Dots and dashes:** `.` and `-`
- **Between letters:** one space
- **Between words:** `/` (a slash)

So "Hello World" becomes:

```
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

When decoding, the tool is flexible about what you paste. It accepts `•` and `·` for dots and `−`, `–`, `—` or `_` for dashes, and it treats a slash, a vertical bar (`|`) or three or more spaces as a word break. That helps when you copy Morse from a puzzle, a book or a website that uses typographic symbols.

## What can and can't be translated

Supported: the letters A–Z, digits 0–9 and common punctuation: `. , ? ' ! / ( ) & : ; = + - _ " $ @`.

Not supported: accented letters (é, ñ, ü) and other symbols. These are **dropped silently** rather than causing an error. For example, "café" encodes as `-.-. .- ..-.`, which decodes as "CAF". If your message contains accents, replace them with plain letters first.

Morse also has no lowercase. Decoded text always comes out in capitals.

## How to translate Morse code

1. Type text or paste Morse into **Text or Morse code**, or click **Load sample** (it loads "SOS Hello World").
2. Leave **Direction** on **Detect automatically**: input made only of dots, dashes, spaces and slashes is decoded; anything else is encoded. Pick **Text → Morse** or **Morse → Text** to force it.
3. Read the translation in **Result**. It updates as you type.
4. Click **Copy** or **Download**.

Translation runs in your browser, so your messages aren't sent anywhere.

## FAQ

### Why did my decoded message come out with letters missing?

A sequence that doesn't match any character, often from a typo like `.-.-.-.` or a missing space between letters, is skipped. Check the spacing first: two letters run together usually form a different letter or no letter at all.

### Is American Morse the same as this?

No. The converter uses International Morse code, the version used in amateur radio and aviation today. The original American Morse used for 19th-century telegraphs had different codes for several letters and internal spaces within some characters.

### How can I practice reading Morse?

Encode short words you know, cover the text, and try to decode them back. Start with E, T, A, N, I and M, the shortest codes, then add letters gradually.

Try encoding your name in the [Morse Code Converter](/online-tool/text-tools/morse-code-converter).
