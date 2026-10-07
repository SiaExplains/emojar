---
slug: how-text-becomes-binary-utf-8-explained
tool: text-to-binary
title: How Text Becomes Binary, Letter by Letter (UTF-8 Explained)
description: Why is "Hi" 01001000 01101001, and why does an emoji take 32 bits? A plain walkthrough of how characters turn into bytes and back again.
tags: [Binary, Developer, Encoding]
---

Text becomes binary in two steps. First, each character is encoded as one or more bytes using UTF-8. Then each byte, a number from 0 to 255, is written as eight binary digits. "Hi" becomes the bytes 72 and 105, which are `01001000 01101001` in binary. Plain English letters take one byte each, accented letters take two, and most emoji take four.

That's the short version. Here's what actually happens at each step, so you can read binary by hand and spot problems when decoding.

## How does one letter become eight bits?

Every character has a number. In ASCII, the original 128-character table that UTF-8 builds on, capital H is 72 and lowercase i is 105. To write 72 in binary, break it into powers of two:

| Bit value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H = 72 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| i = 105 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 |

72 is 64 + 8, so those two columns get a 1. 105 is 64 + 32 + 8 + 1. Each row is padded to eight digits, because a byte always has eight bits, even when the leading ones are zero. That's why "A" (65) is `01000001`, not `1000001`.

A few patterns make ASCII binary readable once you know them:

- Capital letters start with `010`, lowercase letters with `011`. Flipping that one bit (worth 32) switches case: A is 65, a is 97.
- Digits start with `0011`, and the last four bits are the digit itself: "5" is `00110101`.
- A space is `00100000`, which is 32.

## What happens to characters outside ASCII?

ASCII only covers 128 characters, so modern text uses UTF-8, which keeps those 128 as single bytes and uses longer sequences for everything else. The first bits of each byte tell a decoder how long the sequence is:

| First byte starts with | Sequence length | Example |
| --- | --- | --- |
| `0` | 1 byte | H → `01001000` |
| `110` | 2 bytes | é → `11000011 10101001` |
| `1110` | 3 bytes | most Asian scripts, symbols like € |
| `11110` | 4 bytes | 👋 → `11110000 10011111 10010001 10001011` |

Every byte after the first starts with `10`, marking it as a continuation. So "café" is five bytes, not four: `01100011 01100001 01100110 11000011 10101001`. And the waving hand emoji is 32 bits on its own. The full rules are defined in [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629), the UTF-8 standard.

This is also why "how many bits is my message?" doesn't have a fixed answer per character. Count bytes, not letters.

## Why show bytes as hex, decimal or octal?

Binary is just one way to write a byte. The same "Hi" looks like this in the other formats the converter supports:

| Format | "Hi" |
| --- | --- |
| Binary | 01001000 01101001 |
| Hexadecimal | 48 69 |
| Decimal | 72 105 |
| Octal | 110 151 |

Hex is the most compact (two digits per byte) and is what you'll see in debuggers, network tools and color codes. Decimal is easiest for humans to sanity-check. Binary is what people usually mean when they say "binary code", and it's the one used for puzzles, classroom exercises and messages on bracelets or cards. To convert single numbers between bases, the [number base converter](/online-tool/developer-tools/number-base-converter) is a better fit.

## How does decoding work, and why does it fail?

Going back from binary to text reverses the steps: split the input into bytes, turn each into a number, then decode the bytes as UTF-8. The converter splits groups on spaces, commas or semicolons. If you paste one long unbroken string of 0s and 1s, it cuts it into 8-bit chunks, so `0100100001101001` also decodes to "Hi".

When something's off, the tool stops with a message rather than printing garbage:

- **"Binary text needs groups of 8 bits"** means an unspaced string's length isn't a multiple of 8, so a digit was lost or added somewhere.
- **"Group 2 (…) is not a valid binary byte"** means a group contains something other than 0 and 1, like a stray letter or a 2.
- **"Group 1 (…) is larger than one byte (255)"** appears when a group has more than eight significant bits, or a decimal value above 255.
- **"These bytes are not valid UTF-8 text"** means the bytes don't form complete characters. A lone `11000011` is the start of a two-byte character with nothing after it.

One subtlety: when groups are separated by spaces, each group is read as a number, so a short group still decodes. `0100100 01101001` (seven digits in the first group) becomes "$i", because 0100100 is 36, the dollar sign. If you typed binary by hand and got an unexpected symbol, count the digits in each group.

## How to use the converter

1. Open the [text to binary converter](/online-tool/developer-tools/text-to-binary) and type or paste into the **Text or binary** box. **Load sample** fills in an example for the current settings.
2. Set **Mode** to **Text → binary** or **Binary → text**.
3. Choose a **Number format**: Binary (8 bits per byte), Hexadecimal, Decimal (0–255) or Octal.
4. Untick **Space between bytes** if you want one continuous string (decimal output always keeps spaces, since the numbers have different lengths).
5. The **Result** updates as you type. Copy it from there.

Conversion happens in your browser, so the text you paste isn't sent anywhere. If you want a binary-to-text page that opens in decode mode, there's also the [binary to text converter](/online-tool/developer-tools/text-to-binary/binary-to-text).

## FAQ

### Is binary a form of encryption?

No. Binary is just another way of writing the same bytes, and anyone can convert it back. It hides a message only from people who don't bother to decode it. For a different kind of text encoding, compare the [Base64 encoder](/online-tool/developer-tools/base64-encoder).

### Can I decode 7-bit binary from an old textbook?

Yes, as long as the groups are separated by spaces. Each group is read as a number, so `1001000 1101001` decodes to "Hi" just like the 8-bit version.

### Why does my binary differ from another converter's?

Some older tools use a different encoding, such as UTF-16 or Latin-1, for characters outside ASCII. Plain English letters match everywhere, but an é or emoji will produce different bytes. This converter always uses UTF-8.

Try it with your own message in the [text to binary converter](/online-tool/developer-tools/text-to-binary).
