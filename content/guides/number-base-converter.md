---
slug: why-your-hex-or-binary-conversion-looks-wrong
tool: number-base-converter
title: Why Your Hex or Binary Conversion Looks Wrong, and How to Fix It
description: "Got 4112 when you expected 10, or an error about an invalid digit? The seven most common base-conversion mistakes, with worked examples and fixes."
tags: [Binary, Hexadecimal, Troubleshooting]
---

When a hex or binary conversion looks wrong, the cause is almost always the input base, not the arithmetic. A string like `1010` is ten in binary, a thousand and ten in decimal and 4,112 in hex, so the converter has to be told, or has to infer, which one you mean. The rest of the usual problems come from prefixes, fractions, negative numbers and precision limits in other tools. Here's how to recognize each one and fix it.

## Problem 1: "1010" became 4,112

This happens when the **From** base is set to Hexadecimal while the input is really binary. In hex, `1010` means 1 × 16³ + 0 × 16² + 1 × 16 + 0 = 4,112.

The fix is to choose the base explicitly, or to use a prefix. With **From** set to "Auto (0x / 0b / 0o, else decimal)":

| Input | Read as | Decimal result |
| --- | --- | --- |
| `1010` | decimal | 1010 |
| `0b1010` | binary | 10 |
| `0x1010` | hex | 4112 |
| `0o755` | octal | 493 |

Auto only detects prefixes. A bare string of ones and zeros is treated as decimal, because it's a perfectly valid decimal number.

## Problem 2: "“x” is not a valid digit in base 10"

You pasted `0x1F` but **From** is set to Decimal. The tool strips a prefix only when it matches the selected base (or when From is Auto), so here the `x` is treated as a digit and rejected. The same thing happens if you paste `1F` while From is Decimal: the error reads "“f” is not a valid digit in base 10 (use 0–9)."

Set From to Hexadecimal or Auto. Note that one bad line stops the whole batch, and the error names the exact character, which makes the culprit easy to find in a long list.

## Problem 3: "0b1012" is rejected

Binary only has the digits 0 and 1, so the `2` triggers "“2” is not a valid digit in base 2 (use 0–1)." This usually means a typo, or a value copied from somewhere that wasn't binary at all. For bases above 10 the message lists the allowed letters too; in base 36 that's 0–9 and a–z.

## Problem 4: "12.5" won't convert

The converter works on whole numbers only, so a decimal point is reported as an invalid digit. Fractions in other bases are a different problem: 0.1 in decimal has no exact binary representation and repeats forever, which is why floating-point math produces results like 0.30000000000000004. If you need a fraction's bit pattern, you're really asking for IEEE 754 encoding, which is a separate format.

## Problem 5: big numbers come out slightly wrong elsewhere

Many calculators and JavaScript's normal `Number` type store integers exactly only up to 2⁵³ − 1. Beyond that, values silently round. Try `9007199254740993` (2⁵³ + 1):

- JavaScript's `(9007199254740993).toString(16)` gives `20000000000000`, which is off by one.
- The [number base converter](/online-tool/developer-tools/number-base-converter) gives `20000000000001`, which is exact.

The tool uses arbitrary-precision integers, so 64-bit IDs, hashes and the maximum unsigned 64-bit value convert correctly: `18446744073709551615` to Hexadecimal with **Uppercase letters** on is `FFFFFFFFFFFFFFFF`.

## Problem 6: negative numbers don't match my debugger

Debuggers and hex editors usually show negative integers in two's complement, and the bits depend on the width. In 8 bits, −42 is stored as `11010110`, the same pattern as unsigned 214. The converter instead writes the sign explicitly: −42 to Binary is `-101010`.

To get a two's complement pattern by hand, add 2ⁿ to the negative value for an n-bit type. For 8 bits that's 256 − 42 = 214, and converting `214` to binary gives `11010110`.

## Problem 7: "Base 32" isn't what my API returned

The Base 32 option here is a positional numeral system using the digits 0–9 and a–v, so 255 becomes `7v`. That isn't the same as the RFC 4648 Base32 used for TOTP secrets and some file encodings, which uses the letters A–Z plus digits 2–7 and encodes bytes, not a single number. Base 36 (0–9 and a–z) is the one you'll meet in short IDs: 255 is `73`.

## Reading the output comfortably

With **To** left at "Binary, octal, decimal & hex", each input gets four labeled lines with `0b`, `0o` and `0x` prefixes. Here's `0xDEADBEEF` with **Group digits** turned on:

```
Binary       0b1101 1110 1010 1101 1011 1110 1110 1111
Octal        0o33 653 337 357
Decimal      3,735,928,559
Hexadecimal  0xdead beef
```

Grouping uses blocks of four for binary and hex (one hex digit is exactly four bits), three for octal, and thousands separators for decimal. The input side is forgiving too. Spaces, underscores, commas and apostrophes are ignored, so `1,000,000` and `1_000_000` both work. Conversion is live and runs in your browser as you type.

## Quick checklist

1. Check the **From** setting before you trust any result.
2. Prefer prefixed input (`0x`, `0b`, `0o`) with From on Auto when you're mixing bases.
3. Remove decimal points; only integers are supported.
4. Expect a minus sign, not two's complement, for negative values.
5. For Unix permission digits like `755`, the [chmod calculator](/online-tool/developer-tools/chmod-calculator) explains what each octal digit means.

## FAQ

### Why does hex use letters?

Base 16 needs sixteen single-character digits, and 0–9 only provides ten, so a–f stand for 10–15. Case doesn't matter on input; the **Uppercase letters** option controls the output.

### Can I convert a whole column of values at once?

Yes. Paste one number per line. When there's more than one, each block of output starts with the original input so you can match the rows up.

### Is octal still used anywhere?

Mostly for Unix file permissions and some older formats. In modern code, a leading `0o` is the clear way to write octal literals.

Fix your next conversion in the [Number Base Converter](/online-tool/developer-tools/number-base-converter).
