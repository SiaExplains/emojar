---
slug: how-base64-encoding-works-byte-by-byte
tool: base64-encoder
title: How Base64 Encoding Works, Byte by Byte (With UTF-8)
description: 'See exactly how text becomes Base64: bytes to 6-bit groups, why padding exists, why output is a third bigger, and how emoji and URL-safe Base64URL fit in.'
tags: [Base64, Encoding, Explainer]
---

Base64 turns any sequence of bytes into text built from 64 safe characters: `A–Z`, `a–z`, `0–9`, `+` and `/`. It works by taking the input 3 bytes (24 bits) at a time and splitting those bits into four 6-bit groups. Each group is a number from 0 to 63, which picks one character. So every 3 bytes become 4 characters, and the output is always about 33% larger than the input. It's a way to carry binary data through text-only channels. It isn't encryption.

## Why does Base64 exist?

Many systems were built to carry text, not arbitrary bytes. Email bodies (MIME), JSON and XML documents, HTTP headers, `data:` URLs and environment variables can all mangle or reject raw binary, control characters or line breaks. Base64 squeezes any data into a character set that survives all of them. The standard alphabet is defined in [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648).

## Walking through "Man"

The classic example is the three-letter word `Man`.

1. **Text to bytes.** In ASCII/UTF-8: `M` = 77, `a` = 97, `n` = 110.
2. **Bytes to bits.** `01001101 01100001 01101110`, 24 bits in total.
3. **Regroup into 6 bits.** `010011 010110 000101 101110`
4. **Bits to numbers.** 19, 22, 5, 46
5. **Numbers to characters.** In the Base64 alphabet, 19 = `T`, 22 = `W`, 5 = `F`, 46 = `u`.

Result: `TWFu`. Three bytes in, four characters out.

## What is the `=` padding for?

Input doesn't always divide evenly into 3-byte groups. When the last group is short, the encoder fills the missing bits with zeros and marks the gap with `=`:

| Input | Bytes | Base64 |
| ----- | ----- | ------ |
| `Man` | 3     | `TWFu` |
| `Ma`  | 2     | `TWE=` |
| `M`   | 1     | `TQ==` |

One `=` means the last group held 2 real bytes, and `==` means it held 1. Padding keeps the output length a multiple of 4. Many decoders don't strictly need it, which is why Base64URL drops it.

## Where do emoji and accents come in?

Base64 encodes **bytes**, not characters, so text first has to become bytes. This encoder always uses UTF-8, where non-ASCII characters take 2 to 4 bytes each:

| Text   | UTF-8 bytes          | Base64     |
| ------ | -------------------- | ---------- |
| `cafe` | 4                    | `Y2FmZQ==` |
| `café` | 5 (`é` = `C3 A9`)    | `Y2Fmw6k=` |
| `✓ ok` | 6 (`✓` = `E2 9C 93`) | `4pyTIG9r` |

That's also why the browser's built-in `btoa("café")` misbehaves: `btoa` only accepts characters in the Latin-1 range (code points 0–255), so it encodes `é` as one byte instead of UTF-8's two, and for an emoji or `✓` it throws an error. The usual fix in code is:

```js
const bytes = new TextEncoder().encode(text); // UTF-8 bytes
const b64 = btoa(String.fromCharCode(...bytes)); // fine for short strings
```

That's essentially what the tool does, processing large inputs in chunks so long text doesn't overflow the call stack.

## Base64 vs Base64URL

Two standard characters cause trouble in URLs: `+` can be read as a space in query strings, and `/` is a path separator. **Base64URL** swaps them and drops the padding:

|                      | Standard           | Base64URL          |
| -------------------- | ------------------ | ------------------ |
| Characters 62 and 63 | `+` `/`            | `-` `_`            |
| Padding              | `=`                | removed            |
| `subjects?_d>`       | `c3ViamVjdHM/X2Q+` | `c3ViamVjdHM_X2Q-` |

Use Base64URL for anything that goes in a URL, a filename or a cookie, and for JWTs, whose three parts are always Base64URL.

## How to encode text

1. Open the [Base64 Encoder](/online-tool/developer-tools/base64-encoder) and type or paste into **Text to encode**. **Load sample** shows a string with an emoji and accents.
2. Tick **URL-safe (Base64URL)** if the result is going into a URL, filename or token.
3. The **Base64 output** updates as you type. Copy it or download it as a `.txt` file.

Encoding happens in your browser. That matters more than it seems, because people often Base64-encode credentials for HTTP Basic auth headers or config files. To encode an image or other file rather than text, use [Image to Base64](/online-tool/image-tools/image-to-base64).

## Common mistakes

- **Treating it as security.** `YWRtaW46czNjcmV0` decodes to `admin:s3cret` in one step. If something needs to stay secret, encrypt it. Base64 only changes the format.
- **Forgetting the 33% size cost.** A 300 KB image embedded as a `data:` URL adds about 400 KB of text to your HTML or CSS. That's worth it for tiny icons and wasteful for photos.
- **Encoding twice.** If your output starts with something like `WVdSdGFX…`, you may have encoded text that was already Base64. Decode once and check.
- **Mixing variants.** A decoder that strictly expects standard Base64 will reject `-` and `_`. Match the variant to what the receiver expects.

## FAQ

### How do I calculate the encoded length in advance?

For padded Base64 it's `4 × ceil(n / 3)` characters for `n` bytes. 100 bytes become 136 characters. Remember that `n` is the UTF-8 byte count, which is larger than the character count whenever the text includes non-ASCII characters.

### Why does my output differ from another tool's?

Usually it's one of three things: a trailing newline in the input (common when copying from a terminal), a different text encoding (UTF-16 or Latin-1 instead of UTF-8), or a different variant (URL-safe or unpadded). Same bytes in, same Base64 out.

### Can Base64 output contain line breaks?

Some encoders, like MIME email encoders, wrap lines at 76 characters. This encoder outputs a single line, which is what JSON, HTTP headers and environment variables usually need.

Try it yourself with the [Base64 Encoder](/online-tool/developer-tools/base64-encoder).
